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
      
      // 預測邏輯
      if (categoricalCols >= 1 && numericCols >= 1) {
        recommendations.push('bar', 'grouped_bar');
        console.log('推薦: bar, grouped_bar (類別+數值)');
      }
      
      if (numericCols >= 2) {
        recommendations.push('scatter', 'line');
        console.log('推薦: scatter, line (多數值欄)');
      }
      
      if (categoricalCols >= 1) {
        recommendations.push('pie');
        console.log('推薦: pie (有類別欄)');
      }
      
      if (recommendations.length === 0) {
        recommendations = ['bar', 'line'];
        confidence = 0.6;
        console.log('使用預設推薦: bar, line');
      }

      const result = {
        recommended_charts: recommendations.slice(0, 5),
        confidence: confidence,
        reasoning: `基於 ${numericCols} 個數值欄位和 ${categoricalCols} 個類別欄位的分析`,
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