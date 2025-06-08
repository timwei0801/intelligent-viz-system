class ChartService {
  constructor() {
    this.supportedChartTypes = {
      'bar': '長條圖',
      'line': '線圖',
      'scatter': '散佈圖',
      'pie': '圓餅圖',
      'area': '面積圖',
      'histogram': '直方圖'
    };
  }

  // 根據資料和圖表類型生成圖表配置
  generateChartConfig(data, chartType, options = {}) {
    try {
      switch (chartType.toLowerCase()) {
        case 'bar':
          return this.generateBarChart(data, options);
        case 'line':
          return this.generateLineChart(data, options);
        case 'scatter':
          return this.generateScatterChart(data, options);
        case 'pie':
          return this.generatePieChart(data, options);
        default:
          return this.generateBarChart(data, options);
      }
    } catch (error) {
      console.error('圖表配置生成錯誤:', error);
      throw new Error(`生成 ${chartType} 圖表配置失敗`);
    }
  }

  // 生成長條圖配置
  generateBarChart(data, options) {
    const { xColumn, yColumn, groupBy } = options;
    
    // 如果有分組，按分組聚合資料
    if (groupBy) {
      const groupedData = this.groupData(data, groupBy, yColumn);
      return {
        type: 'bar',
        data: {
          labels: Object.keys(groupedData),
          datasets: [{
            label: yColumn || '數值',
            data: Object.values(groupedData),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `${groupBy} vs ${yColumn || '數值'}`
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };
    }

    // 簡單長條圖
    return {
      type: 'bar',
      data: {
        labels: data.map((item, index) => item[xColumn] || `項目 ${index + 1}`),
        datasets: [{
          label: yColumn || '數值',
          data: data.map(item => parseFloat(item[yColumn]) || 0),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${xColumn || 'X軸'} vs ${yColumn || 'Y軸'}`
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  }

  // 生成線圖配置
  generateLineChart(data, options) {
    const { xColumn, yColumn, groupBy } = options;
    
    return {
      type: 'line',
      data: {
        labels: data.map(item => item[xColumn]),
        datasets: [{
          label: yColumn || '數值',
          data: data.map(item => parseFloat(item[yColumn]) || 0),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${xColumn || 'X軸'} 趨勢變化`
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  }

  // 生成散佈圖配置
  generateScatterChart(data, options) {
    const { xColumn, yColumn } = options;
    
    return {
      type: 'scatter',
      data: {
        datasets: [{
          label: '資料點',
          data: data.map(item => ({
            x: parseFloat(item[xColumn]) || 0,
            y: parseFloat(item[yColumn]) || 0
          })),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${xColumn} vs ${yColumn} 關係圖`
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: xColumn
            }
          },
          y: {
            title: {
              display: true,
              text: yColumn
            }
          }
        }
      }
    };
  }

  // 生成圓餅圖配置
  generatePieChart(data, options) {
    const { labelColumn, valueColumn } = options;
    
    const groupedData = this.groupData(data, labelColumn, valueColumn);
    
    return {
      type: 'pie',
      data: {
        labels: Object.keys(groupedData),
        datasets: [{
          data: Object.values(groupedData),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${labelColumn} 分布`
          }
        }
      }
    };
  }

  // 輔助函數：按欄位分組聚合資料
  groupData(data, groupColumn, valueColumn) {
    return data.reduce((acc, item) => {
      const key = item[groupColumn];
      const value = parseFloat(item[valueColumn]) || 0;
      
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += value;
      
      return acc;
    }, {});
  }

  // 智能推薦圖表參數
  recommendChartParameters(data, chartType, dataAnalysis) {
    const { columns, types } = dataAnalysis;
    const numericalColumns = columns.filter(col => types[col] === 'numerical');
    const categoricalColumns = columns.filter(col => types[col] === 'categorical');
    const temporalColumns = columns.filter(col => types[col] === 'temporal');

    switch (chartType.toLowerCase()) {
      case 'bar':
        return {
          xColumn: categoricalColumns[0] || columns[0],
          yColumn: numericalColumns[0] || columns[1],
          groupBy: categoricalColumns[0]
        };
      
      case 'line':
        return {
          xColumn: temporalColumns[0] || columns[0],
          yColumn: numericalColumns[0] || columns[1]
        };
      
      case 'scatter':
        return {
          xColumn: numericalColumns[0] || columns[0],
          yColumn: numericalColumns[1] || columns[1]
        };
      
      case 'pie':
        return {
          labelColumn: categoricalColumns[0] || columns[0],
          valueColumn: numericalColumns[0] || columns[1]
        };
      
      default:
        return {
          xColumn: columns[0],
          yColumn: columns[1]
        };
    }
  }
}

module.exports = new ChartService();