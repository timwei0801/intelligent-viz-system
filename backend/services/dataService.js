const fs = require('fs');
const csv = require('csv-parser');
const XLSX = require('xlsx');

class DataService {
  // 解析上傳的檔案
  async parseFile(filePath, fileType) {
    try {
      switch (fileType.toLowerCase()) {
        case 'csv':
          return await this.parseCSV(filePath);
        case 'xlsx':
        case 'xls':
          return await this.parseExcel(filePath);
        case 'json':
          return await this.parseJSON(filePath);
        default:
          throw new Error('不支援的檔案格式');
      }
    } catch (error) {
      console.error('檔案解析錯誤:', error);
      throw new Error(`檔案解析失敗: ${error.message}`);
    }
  }

  // 解析 CSV 檔案
  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          const analysis = this.analyzeData(results);
          resolve({
            data: results,
            analysis: analysis,
            rowCount: results.length,
            columnCount: Object.keys(results[0] || {}).length
          });
        })
        .on('error', reject);
    });
  }

  // 解析 Excel 檔案
  async parseExcel(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      const analysis = this.analyzeData(data);
      
      return {
        data: data,
        analysis: analysis,
        rowCount: data.length,
        columnCount: Object.keys(data[0] || {}).length,
        sheetNames: workbook.SheetNames
      };
    } catch (error) {
      throw new Error(`Excel 檔案解析失敗: ${error.message}`);
    }
  }

  // 解析 JSON 檔案
  async parseJSON(filePath) {
    try {
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      
      // 確保資料是陣列格式
      const arrayData = Array.isArray(data) ? data : [data];
      const analysis = this.analyzeData(arrayData);
      
      return {
        data: arrayData,
        analysis: analysis,
        rowCount: arrayData.length,
        columnCount: Object.keys(arrayData[0] || {}).length
      };
    } catch (error) {
      throw new Error(`JSON 檔案解析失敗: ${error.message}`);
    }
  }

  // 分析資料結構和特徵
  analyzeData(data) {
    if (!data || data.length === 0) {
      return { columns: [], types: {}, stats: {} };
    }

    const columns = Object.keys(data[0]);
    const types = {};
    const stats = {};

    columns.forEach(column => {
      const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
      
      // 判斷資料類型
      const sampleValue = values[0];
      if (!isNaN(sampleValue) && !isNaN(parseFloat(sampleValue))) {
        types[column] = 'numerical';
        
        // 計算數值統計
        const numericValues = values.map(v => parseFloat(v));
        stats[column] = {
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
          count: numericValues.length
        };
      } else if (this.isDate(sampleValue)) {
        types[column] = 'temporal';
        stats[column] = {
          count: values.length,
          uniqueCount: new Set(values).size
        };
      } else {
        types[column] = 'categorical';
        stats[column] = {
          count: values.length,
          uniqueCount: new Set(values).size,
          categories: [...new Set(values)].slice(0, 10) // 前10個類別
        };
      }
    });

    return {
      columns: columns,
      types: types,
      stats: stats,
      summary: {
        totalRows: data.length,
        totalColumns: columns.length,
        numericalColumns: Object.values(types).filter(t => t === 'numerical').length,
        categoricalColumns: Object.values(types).filter(t => t === 'categorical').length,
        temporalColumns: Object.values(types).filter(t => t === 'temporal').length
      }
    };
  }

  // 簡單的日期判斷
  isDate(value) {
    if (!value) return false;
    const date = new Date(value);
    return date instanceof Date && !isNaN(date);
  }

  // 清理暫存檔案
  cleanupFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('清理檔案失敗:', error);
    }
  }
}

module.exports = new DataService();