const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 加入 fs 模組

// 載入環境變數
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 確保 uploads 目錄存在
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ 已創建 uploads 目錄');
}

// 中間件設置
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 添加詳細的請求日誌
app.use((req, res, next) => {
  console.log(`\n📨 === 收到請求 ===`);
  console.log(`方法: ${req.method}`);
  console.log(`路徑: ${req.path}`);
  console.log(`查詢參數:`, req.query);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`請求體大小: ${JSON.stringify(req.body).length} 字符`);
    console.log(`請求體鍵值: ${Object.keys(req.body)}`);
  }
  console.log(`===================\n`);
  next();
});

// 修復後的文件上傳設置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 使用絕對路徑確保目錄正確
    const uploadPath = path.join(__dirname, 'uploads');
    
    // 再次確保目錄存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    console.log('📁 檔案將保存到:', uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname;
    console.log('📄 檔案名稱:', filename);
    cb(null, filename);
  }
});

// 加入更詳細的錯誤處理
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB 限制
  },
  fileFilter: function (req, file, cb) {
    console.log('📋 檢查檔案類型:', file.mimetype);
    
    // 允許的檔案類型
    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/json'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`不支援的檔案類型: ${file.mimetype}`), false);
    }
  }
});

// 基本路由
app.get('/', (req, res) => {
  res.json({ message: 'Intelligent Visualization System API Server' });
});

const claudeService = require('./services/claudeService');

// Claude API 測試路由
app.post('/api/analyze-intent', async (req, res) => {
  try {
    const { userInput, dataInfo } = req.body;
    
    if (!userInput) {
      return res.status(400).json({ error: '請提供使用者輸入' });
    }

    const result = await claudeService.analyzeVisualizationIntent(userInput, dataInfo);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 圖表解釋路由
app.post('/api/explain-chart', async (req, res) => {
  try {
    const { chartType, dataContext } = req.body;
    
    const explanation = await claudeService.explainChartChoice(chartType, dataContext);
    res.json({ success: true, explanation });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const dataService = require('./services/dataService');
const chartService = require('./services/chartService');
const modernVizMLService = require('./services/modernVizMLService');

// 修復後的檔案上傳和資料分析路由
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('🔍 === 檔案上傳處理開始 ===');
    
    if (!req.file) {
      console.log('❌ 沒有收到檔案');
      return res.status(400).json({ error: '請上傳檔案' });
    }

    console.log('📁 收到檔案:', req.file.originalname);
    console.log('📂 檔案大小:', req.file.size, 'bytes');
    console.log('📄 檔案類型:', req.file.mimetype);
    console.log('💾 儲存路徑:', req.file.path);

    // 檢查檔案是否真的存在
    if (!fs.existsSync(req.file.path)) {
      console.log('❌ 檔案儲存失敗，路徑不存在:', req.file.path);
      return res.status(500).json({ error: '檔案儲存失敗' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).slice(1);
    
    console.log('🔄 開始解析檔案...');
    console.log('📋 檔案副檔名:', fileExtension);
    
    // 解析檔案
    const result = await dataService.parseFile(filePath, fileExtension);
    
    console.log('✅ 檔案解析成功');
    console.log('📊 資料行數:', result.rowCount);
    console.log('📋 欄位數:', result.columnCount);
    
    // 清理暫存檔案
    try {
      dataService.cleanupFile(filePath);
      console.log('🗑️ 暫存檔案已清理');
    } catch (cleanupError) {
      console.log('⚠️ 清理暫存檔案時發生錯誤:', cleanupError.message);
    }
    
    res.json({
      success: true,
      fileName: req.file.originalname,
      data: result
    });

    console.log('🎉 === 檔案上傳處理完成 ===\n');

  } catch (error) {
    console.error('💥 === 檔案處理錯誤 ===');
    console.error('錯誤類型:', error.constructor.name);
    console.error('錯誤訊息:', error.message);
    console.error('錯誤堆疊:', error.stack);
    console.error('========================\n');
    
    // 清理暫存檔案（如果存在）
    if (req.file && req.file.path) {
      try {
        dataService.cleanupFile(req.file.path);
      } catch (cleanupError) {
        console.error('清理暫存檔案失敗:', cleanupError.message);
      }
    }
    
    res.status(500).json({ 
      error: error.message,
      success: false 
    });
  }
});

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'intelligent-viz-system',
    uploadsDir: fs.existsSync(uploadsDir) ? 'exists' : 'missing'
  });
});

// 生成圖表配置
app.post('/api/generate-chart', async (req, res) => {
  console.log('🎨 收到的顏色主題:', req.body.options?.colorScheme);
  try {
    const { data, chartType, options, dataAnalysis } = req.body;
    
    if (!data || !chartType) {
      return res.status(400).json({ error: '請提供資料和圖表類型' });
    }

    // 如果沒有提供 options，使用智能推薦
    const chartOptions = options || chartService.recommendChartParameters(
      data, 
      chartType, 
      dataAnalysis
    );

    const chartConfig = chartService.generateChartConfig(data, chartType, chartOptions);
    
    res.json({
      success: true,
      chartConfig,
      recommendedOptions: chartOptions
    });

  } catch (error) {
    console.error('圖表生成錯誤:', error);
    res.status(500).json({ error: error.message });
  }
});

// VizML 推薦 API
app.post('/api/vizml-recommend', async (req, res) => {
  console.log('\n🔥 === VizML API 端點被調用 ===');
  
  try {
    console.log('請求體:', req.body);
    const { data } = req.body;
    
    console.log('提取的 data:', data ? `${data.length} 行` : 'undefined');
    
    if (!data || !Array.isArray(data)) {
      console.log('❌ 資料驗證失敗');
      console.log('data 類型:', typeof data);
      console.log('data 內容:', data);
      return res.status(400).json({ 
        error: '請提供有效的資料陣列',
        received: typeof data,
        isArray: Array.isArray(data)
      });
    }

    console.log('✅ 開始調用 VizML 服務...');
    const recommendation = await modernVizMLService.recommendVisualization(data);
    
    console.log('✅ VizML 服務調用成功');
    
    res.json({
      success: true,
      vizml_recommendation: recommendation,
      method: 'modern-vizml'
    });

  } catch (error) {
    console.error('\n❌ === VizML API 錯誤 ===');
    console.error('錯誤類型:', error.constructor.name);
    console.error('錯誤訊息:', error.message);
    console.error('錯誤堆疊:', error.stack);
    console.error('========================\n');
    
    res.status(500).json({ 
      error: error.message,
      success: false,
      errorType: error.constructor.name
    });
  }
});

// 混合推薦 API（結合 Claude + VizML）
app.post('/api/hybrid-recommend', async (req, res) => {
  try {
    const { userInput, data, dataInfo } = req.body;
    
    // 並行執行 Claude 和 VizML 分析
    const [claudeResult, vizmlResult] = await Promise.allSettled([
      claudeService.analyzeVisualizationIntent(userInput, dataInfo),
      modernVizMLService.recommendVisualization(data)
    ]);

    const response = {
      success: true,
      claude_recommendation: claudeResult.status === 'fulfilled' ? claudeResult.value : null,
      vizml_recommendation: vizmlResult.status === 'fulfilled' ? vizmlResult.value : null,
      hybrid_analysis: {}
    };

    // 混合分析結果
    if (claudeResult.status === 'fulfilled' && vizmlResult.status === 'fulfilled') {
      const claudeCharts = claudeResult.value.chartTypes || [];
      const vizmlCharts = vizmlResult.value.prediction?.recommended_charts || [];
      
      // 找出共同推薦的圖表類型
      const commonCharts = claudeCharts.filter(chart => 
        vizmlCharts.some(vizChart => 
          vizChart.toLowerCase().includes(chart.toLowerCase()) || 
          chart.toLowerCase().includes(vizChart.toLowerCase())
        )
      );

      response.hybrid_analysis = {
        claude_charts: claudeCharts,
        vizml_charts: vizmlCharts,
        common_recommendations: commonCharts,
        confidence_boost: commonCharts.length > 0 ? 0.2 : 0,
        recommendation: commonCharts.length > 0 ? commonCharts : claudeCharts.concat(vizmlCharts.slice(0, 2))
      };
    }

    res.json(response);

  } catch (error) {
    console.error('混合推薦錯誤:', error);
    res.status(500).json({ error: error.message });
  }
});

// 全域錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('💥 全域錯誤處理:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '檔案大小超過限制 (50MB)' });
    }
    return res.status(400).json({ error: `檔案上傳錯誤: ${err.message}` });
  }
  
  res.status(500).json({ error: '伺服器內部錯誤' });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Intelligent Visualization System Backend`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`📋 Uploads directory exists: ${fs.existsSync(uploadsDir) ? 'YES' : 'NO'}`);
});