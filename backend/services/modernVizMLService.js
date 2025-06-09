const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class ModernVizMLService {
  constructor() {
    // 使用直接的 Python 路徑
    this.pythonPath = '/Users/weiqihong/miniconda3/envs/vizml/bin/python';
    this.scriptsPath = path.join(__dirname, '../python-scripts');
    console.log('VizML Service 初始化');
    console.log('Python 路徑:', this.pythonPath);
    console.log('腳本路徑:', this.scriptsPath);
  }

  async executePythonScript(scriptName, args = []) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.scriptsPath, scriptName);
      
      console.log('=== Python 執行開始 ===');
      console.log('腳本:', scriptPath);
      console.log('參數:', args);
      
      // 檢查檔案是否存在
      if (!fs.existsSync(scriptPath)) {
        reject(new Error(`Python 腳本不存在: ${scriptPath}`));
        return;
      }
      
      if (!fs.existsSync(this.pythonPath)) {
        reject(new Error(`Python 可執行檔不存在: ${this.pythonPath}`));
        return;
      }

      const pythonProcess = spawn(this.pythonPath, [scriptPath, ...args], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: this.scriptsPath  // 設置工作目錄
      });

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        console.log('Python stdout:', output.trim());
      });

      pythonProcess.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        console.log('Python stderr:', output.trim());
      });

      pythonProcess.on('close', (code) => {
        console.log('=== Python 執行結束 ===');
        console.log('退出碼:', code);
        console.log('完整輸出:', stdout);
        
        if (code === 0 && stdout.trim()) {
          try {
            const result = JSON.parse(stdout.trim());
            console.log('JSON 解析成功:', result.status);
            resolve(result);
          } catch (error) {
            console.error('JSON 解析失敗:', error);
            console.error('原始輸出:', stdout);
            reject(new Error(`JSON 解析失敗: ${error.message}`));
          }
        } else {
          const errorMsg = `Python 腳本失敗 (code: ${code})${stderr ? ', stderr: ' + stderr : ''}`;
          console.error(errorMsg);
          reject(new Error(errorMsg));
        }
      });

      pythonProcess.on('error', (error) => {
        console.error('進程啟動錯誤:', error);
        reject(new Error(`進程啟動錯誤: ${error.message}`));
      });

      // 30秒超時
      setTimeout(() => {
        pythonProcess.kill('SIGTERM');
        reject(new Error('Python 腳本執行超時'));
      }, 30000);
    });
  }

    async extractFeatures(data) {
    try {
        console.log('=== 特徵提取開始 ===');
        
        // 使用不會觸發 nodemon 的目錄
        const tempDir = '/tmp';
        const tempDataPath = path.join(tempDir, `vizml_temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.json`);
        
        // 如果 /tmp 不可用，回退到當前目錄但使用隱藏文件
        const finalTempPath = fs.existsSync(tempDir) ? tempDataPath : path.join(this.scriptsPath, `.temp_data_${Date.now()}.json`);
        
        fs.writeFileSync(finalTempPath, JSON.stringify(data, null, 2));
        
        console.log('臨時檔案:', finalTempPath);
        console.log('資料行數:', data.length);
        
        const features = await this.executePythonScript('test_features.py', [finalTempPath]);
        
        // 清理臨時檔案
        if (fs.existsSync(finalTempPath)) {
        fs.unlinkSync(finalTempPath);
        console.log('臨時檔案已清理');
        }
        
        console.log('=== 特徵提取完成 ===');
        return features;
    } catch (error) {
        console.error('=== 特徵提取錯誤 ===', error);
        throw error;
    }
    }

  async predictVisualization(features) {
    try {
      console.log('=== 視覺化預測開始 ===');
      
      const featureArray = features.features || [];
      const numRows = featureArray[0] || 0;
      const numCols = featureArray[1] || 0;
      const numericCols = featureArray[2] || 0;
      const categoricalCols = featureArray[3] || 0;

      console.log(`資料特徵: 行=${numRows}, 欄=${numCols}, 數值欄=${numericCols}, 類別欄=${categoricalCols}`);

      let recommendations = [];
      let confidence = 0.8;
      
      // 增強的預測邏輯 - 支援更多圖表類型
      
      // 基礎統計圖表
      if (categoricalCols >= 1 && numericCols >= 1) {
        recommendations.push('bar', 'doughnut', 'pie');
        if (categoricalCols >= 2) {
          recommendations.push('funnel');
        }
        console.log('推薦: bar, doughnut, pie (類別+數值)');
      }
      
      // 數值關係圖表
      if (numericCols >= 2) {
        recommendations.push('scatter', 'line', 'area');
        if (numericCols >= 3) {
          recommendations.push('bubble', 'heatmap');
        }
        console.log('推薦: scatter, line, area (多數值欄)');
      }
      
      // 多維度比較
      if (numericCols >= 3 && numericCols <= 8) {
        recommendations.push('radar', 'polarArea');
        console.log('推薦: radar, polarArea (多維度)');
      }
      
      // 統計分析圖表
      if (numRows >= 20 && numericCols >= 1) {
        recommendations.push('histogram', 'boxplot');
        console.log('推薦: histogram, boxplot (大量數值資料)');
      }
      
      // 時間序列檢測
      if (this.hasTimeColumn(features)) {
        recommendations.push('line', 'area', 'waterfall');
        console.log('推薦: line, area, waterfall (時間序列)');
      }
      
      // 比例關係
      if (categoricalCols >= 1) {
        if (!recommendations.includes('pie')) recommendations.push('pie');
        if (!recommendations.includes('doughnut')) recommendations.push('doughnut');
        console.log('推薦: pie, doughnut (比例關係)');
      }
      
      // 確保至少有基本推薦
      if (recommendations.length === 0) {
        recommendations = ['bar', 'line', 'pie'];
        confidence = 0.6;
        console.log('使用預設推薦: bar, line, pie');
      }
      
      // 去重並限制數量
      recommendations = [...new Set(recommendations)].slice(0, 8);

      const result = {
        recommended_charts: recommendations,
        confidence: confidence,
        reasoning: this.generateReasoning(numericCols, categoricalCols, numRows, recommendations),
        feature_analysis: {
          numeric_columns: numericCols,
          categorical_columns: categoricalCols,
          total_rows: numRows,
          total_columns: numCols
        },
        status: "success"
      };

      console.log('=== 視覺化預測完成 ===');
      console.log('推薦圖表:', result.recommended_charts);
      return result;
    } catch (error) {
      console.error('=== 視覺化預測錯誤 ===', error);
      throw error;
    }
  }

  // 生成推薦理由
  generateReasoning(numericCols, categoricalCols, numRows, recommendations) {
    let reasoning = `基於資料分析：`;
    
    if (numericCols > 0) {
      reasoning += `${numericCols}個數值欄位`;
    }
    
    if (categoricalCols > 0) {
      reasoning += `${numericCols > 0 ? '和' : ''}${categoricalCols}個類別欄位`;
    }
    
    reasoning += `，共${numRows}筆資料。`;
    
    // 針對推薦的圖表類型給出具體理由
    const chartReasons = [];
    
    if (recommendations.includes('bar') || recommendations.includes('doughnut')) {
      chartReasons.push('適合比較不同類別的數值');
    }
    
    if (recommendations.includes('scatter') || recommendations.includes('bubble')) {
      chartReasons.push('適合探索變數間的關係');
    }
    
    if (recommendations.includes('histogram') || recommendations.includes('boxplot')) {
      chartReasons.push('適合分析數值分布特徵');
    }
    
    if (recommendations.includes('radar')) {
      chartReasons.push('適合多維度績效比較');
    }
    
    if (recommendations.includes('heatmap')) {
      chartReasons.push('適合顯示變數相關性');
    }
    
    if (chartReasons.length > 0) {
      reasoning += ` 推薦的圖表${chartReasons.join('，')}。`;
    }
    
    return reasoning;
  }

  // 檢測是否有時間欄位
  hasTimeColumn(features) {
    // 這裡可以加入更複雜的時間欄位檢測邏輯
    // 目前簡化為檢查是否有可能的時間模式
    return false; // 暫時返回 false，後續可以改進
  }

  async recommendVisualization(data) {
    try {
      console.log('🔍 === VizML 完整推薦流程開始 ===');
      console.log('輸入資料:', data.length, '行');
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('無效的輸入資料');
      }
      
      const features = await this.extractFeatures(data);
      
      if (features.status !== 'success') {
        throw new Error(`特徵提取失敗: ${features.error}`);
      }
      
      const prediction = await this.predictVisualization(features);
      
      const result = {
        features: features,
        prediction: prediction,
        confidence: prediction.confidence || 0.8,
        method: 'modern-vizml'
      };

      console.log('✅ === VizML 完整推薦流程成功 ===');
      console.log('最終推薦:', result.prediction.recommended_charts);
      return result;
    } catch (error) {
      console.error('❌ === VizML 完整推薦流程失敗 ===');
      console.error('錯誤詳情:', error.message);
      throw error;
    }
  }
}

module.exports = new ModernVizMLService();