const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

// 載入環境變數
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// 文件上傳設置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

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

// 檔案上傳和資料分析路由
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '請上傳檔案' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).slice(1);
    
    // 解析檔案
    const result = await dataService.parseFile(filePath, fileExtension);
    
    // 清理暫存檔案
    dataService.cleanupFile(filePath);
    
    res.json({
      success: true,
      fileName: req.file.originalname,
      data: result
    });

  } catch (error) {
    console.error('檔案處理錯誤:', error);
    
    // 清理暫存檔案
    if (req.file) {
      dataService.cleanupFile(req.file.path);
    }
    
    res.status(500).json({ error: error.message });
  }
});

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'intelligent-viz-system'
  });
});

// 生成圖表配置
app.post('/api/generate-chart', async (req, res) => {
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

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Intelligent Visualization System Backend`);
});