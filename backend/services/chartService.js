class ChartService {
  constructor() {
    this.supportedChartTypes = {
      // 基礎圖表
      'bar': '長條圖',
      'line': '線圖',
      'scatter': '散佈圖',
      'pie': '圓餅圖',
      
      // 新增圖表
      'doughnut': '甜甜圈圖',
      'area': '面積圖',
      'radar': '雷達圖',
      'polarArea': '極坐標圖',
      'bubble': '氣泡圖',
      
      // 統計圖表
      'histogram': '直方圖',
      'boxplot': '箱型圖',
      'violin': '小提琴圖',
      
      // 進階圖表
      'heatmap': '熱力圖',
      'waterfall': '瀑布圖',
      'funnel': '漏斗圖'
    };

    // 顏色調色盤
    this.colorPalettes = {
      primary: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
        'rgba(83, 102, 255, 0.8)',
        'rgba(255, 99, 255, 0.8)',
        'rgba(99, 255, 132, 0.8)'
      ],
      border: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
        'rgba(255, 99, 255, 1)',
        'rgba(99, 255, 132, 1)'
      ]
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
        case 'doughnut':
          return this.generateDoughnutChart(data, options);
        case 'area':
          return this.generateAreaChart(data, options);
        case 'radar':
          return this.generateRadarChart(data, options);
        case 'polararea':
          return this.generatePolarAreaChart(data, options);
        case 'bubble':
          return this.generateBubbleChart(data, options);
        case 'histogram':
          return this.generateHistogram(data, options);
        case 'boxplot':
          return this.generateBoxPlot(data, options);
        case 'heatmap':
          return this.generateHeatmap(data, options);
        case 'waterfall':
          return this.generateWaterfallChart(data, options);
        case 'funnel':
          return this.generateFunnelChart(data, options);
        default:
          return this.generateBarChart(data, options);
      }
    } catch (error) {
      console.error('圖表配置生成錯誤:', error);
      throw new Error(`生成 ${chartType} 圖表配置失敗: ${error.message}`);
    }
  }

  // === 新增的圖表類型 ===

  // 甜甜圈圖
  generateDoughnutChart(data, options) {
    const { labelColumn, valueColumn } = options;
    const groupedData = this.groupData(data, labelColumn, valueColumn);
    
    return {
      type: 'doughnut',
      data: {
        labels: Object.keys(groupedData),
        datasets: [{
          data: Object.values(groupedData),
          backgroundColor: this.colorPalettes.primary,
          borderColor: this.colorPalettes.border,
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${labelColumn} 分布 (甜甜圈圖)`,
            font: { size: 16 }
          },
          legend: {
            position: 'bottom'
          }
        },
        cutout: '60%' // 內部挖空比例
      }
    };
  }

  // 面積圖
  generateAreaChart(data, options) {
    const { xColumn, yColumn, groupBy } = options;
    
    return {
      type: 'line',
      data: {
        labels: data.map(item => item[xColumn]),
        datasets: [{
          label: yColumn || '數值',
          data: data.map(item => parseFloat(item[yColumn]) || 0),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.3)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${xColumn} vs ${yColumn} 面積圖`,
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      }
    };
  }

  // 雷達圖
  generateRadarChart(data, options) {
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    ).slice(0, 6); // 限制最多6個維度
    
    // 取前3筆資料做比較
    const datasets = data.slice(0, 3).map((item, index) => ({
      label: `項目 ${index + 1}`,
      data: numericColumns.map(col => parseFloat(item[col]) || 0),
      borderColor: this.colorPalettes.border[index],
      backgroundColor: this.colorPalettes.primary[index],
      pointBackgroundColor: this.colorPalettes.border[index],
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: this.colorPalettes.border[index]
    }));

    return {
      type: 'radar',
      data: {
        labels: numericColumns,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '多維度比較雷達圖',
            font: { size: 16 }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      }
    };
  }

  // 極坐標圖
  generatePolarAreaChart(data, options) {
    const { labelColumn, valueColumn } = options;
    const groupedData = this.groupData(data, labelColumn, valueColumn);
    
    return {
      type: 'polarArea',
      data: {
        labels: Object.keys(groupedData),
        datasets: [{
          data: Object.values(groupedData),
          backgroundColor: this.colorPalettes.primary,
          borderColor: this.colorPalettes.border,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${labelColumn} 極坐標分布圖`,
            font: { size: 16 }
          },
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          r: {
            beginAtZero: true
          }
        }
      }
    };
  }

  // 氣泡圖
  generateBubbleChart(data, options) {
    const { xColumn, yColumn, sizeColumn } = options;
    
    const bubbleData = data.map((item, index) => ({
      x: parseFloat(item[xColumn]) || 0,
      y: parseFloat(item[yColumn]) || 0,
      r: Math.sqrt((parseFloat(item[sizeColumn]) || 1) / Math.PI) * 5 // 調整氣泡大小
    }));

    return {
      type: 'bubble',
      data: {
        datasets: [{
          label: '資料點',
          data: bubbleData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${xColumn} vs ${yColumn} 氣泡圖 (大小: ${sizeColumn})`,
            font: { size: 16 }
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

  // 直方圖
  generateHistogram(data, options) {
    const { column, bins = 10 } = options;
    const values = data.map(item => parseFloat(item[column])).filter(val => !isNaN(val));
    
    if (values.length === 0) {
      throw new Error('沒有有效的數值資料');
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    // 創建區間
    const binRanges = [];
    const binCounts = new Array(bins).fill(0);
    
    for (let i = 0; i < bins; i++) {
      const start = min + i * binWidth;
      const end = start + binWidth;
      binRanges.push(`${start.toFixed(1)}-${end.toFixed(1)}`);
    }
    
    // 計算每個區間的數量
    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      binCounts[binIndex]++;
    });

    return {
      type: 'bar',
      data: {
        labels: binRanges,
        datasets: [{
          label: '頻率',
          data: binCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${column} 分布直方圖`,
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '頻率'
            }
          },
          x: {
            title: {
              display: true,
              text: column
            }
          }
        }
      }
    };
  }

  // 箱型圖 (使用 Chart.js 模擬)
  generateBoxPlot(data, options) {
    const { column } = options;
    const values = data.map(item => parseFloat(item[column])).filter(val => !isNaN(val)).sort((a, b) => a - b);
    
    if (values.length === 0) {
      throw new Error('沒有有效的數值資料');
    }

    // 計算四分位數
    const q1 = this.percentile(values, 25);
    const median = this.percentile(values, 50);
    const q3 = this.percentile(values, 75);
    const min = values[0];
    const max = values[values.length - 1];
    const iqr = q3 - q1;

    return {
      type: 'bar',
      data: {
        labels: ['最小值', 'Q1', '中位數', 'Q3', '最大值'],
        datasets: [{
          label: column,
          data: [min, q1, median, q3, max],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${column} 箱型圖統計`,
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: '數值'
            }
          }
        }
      }
    };
  }

  // 熱力圖 (使用 Chart.js 模擬 - 實際應該用 D3.js)
  generateHeatmap(data, options) {
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    
    // 計算相關係數矩陣
    const correlationMatrix = this.calculateCorrelationMatrix(data, numericColumns);
    
    // 將矩陣轉換為散佈圖資料
    const heatmapData = [];
    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = 0; j < numericColumns.length; j++) {
        heatmapData.push({
          x: i,
          y: j,
          v: correlationMatrix[i][j]
        });
      }
    }

    return {
      type: 'scatter',
      data: {
        datasets: [{
          label: '相關係數',
          data: heatmapData.map(point => ({
            x: point.x,
            y: point.y,
            r: Math.abs(point.v) * 20 // 用點的大小表示相關性強度
          })),
          backgroundColor: heatmapData.map(point => 
            point.v > 0 ? `rgba(255, 99, 132, ${Math.abs(point.v)})` : `rgba(54, 162, 235, ${Math.abs(point.v)})`
          )
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '相關係數熱力圖',
            font: { size: 16 }
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: -0.5,
            max: numericColumns.length - 0.5,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return numericColumns[value] || '';
              }
            }
          },
          y: {
            type: 'linear',
            min: -0.5,
            max: numericColumns.length - 0.5,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return numericColumns[value] || '';
              }
            }
          }
        }
      }
    };
  }

  // 瀑布圖
  generateWaterfallChart(data, options) {
    const { labelColumn, valueColumn } = options;
    
    let cumulative = 0;
    const waterfallData = data.map((item, index) => {
      const value = parseFloat(item[valueColumn]) || 0;
      const start = cumulative;
      cumulative += value;
      
      return {
        label: item[labelColumn],
        value: value,
        cumulative: cumulative,
        start: start
      };
    });

    return {
      type: 'bar',
      data: {
        labels: waterfallData.map(item => item.label),
        datasets: [
          {
            label: '正值',
            data: waterfallData.map(item => item.value > 0 ? item.value : 0),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: '負值',
            data: waterfallData.map(item => item.value < 0 ? Math.abs(item.value) : 0),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${labelColumn} 瀑布圖`,
            font: { size: 16 }
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        }
      }
    };
  }

  // 漏斗圖
  generateFunnelChart(data, options) {
    const { labelColumn, valueColumn } = options;
    const sortedData = data
      .map(item => ({ label: item[labelColumn], value: parseFloat(item[valueColumn]) || 0 }))
      .sort((a, b) => b.value - a.value);

    return {
      type: 'bar',
      data: {
        labels: sortedData.map(item => item.label),
        datasets: [{
          label: '漏斗數據',
          data: sortedData.map(item => item.value),
          backgroundColor: this.colorPalettes.primary,
          borderColor: this.colorPalettes.border,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // 水平柱狀圖
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${labelColumn} 漏斗圖`,
            font: { size: 16 }
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    };
  }

  // === 原有的圖表方法保持不變 ===
  generateBarChart(data, options) {
    const { xColumn, yColumn, groupBy } = options;
    
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
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `${groupBy} vs ${yColumn || '數值'}`,
              font: { size: 16 }
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
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${xColumn || 'X軸'} vs ${yColumn || 'Y軸'}`,
            font: { size: 16 }
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

  generateLineChart(data, options) {
    const { xColumn, yColumn } = options;
    
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
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${xColumn || 'X軸'} 趨勢變化`,
            font: { size: 16 }
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
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${xColumn} vs ${yColumn} 關係圖`,
            font: { size: 16 }
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

  generatePieChart(data, options) {
    const { labelColumn, valueColumn } = options;
    const groupedData = this.groupData(data, labelColumn, valueColumn);
    
    return {
      type: 'pie',
      data: {
        labels: Object.keys(groupedData),
        datasets: [{
          data: Object.values(groupedData),
          backgroundColor: this.colorPalettes.primary,
          borderColor: this.colorPalettes.border,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${labelColumn} 分布`,
            font: { size: 16 }
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    };
  }

  // === 輔助方法 ===
  
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

  // 計算百分位數
  percentile(arr, p) {
    const index = (p / 100) * (arr.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (upper >= arr.length) return arr[lower];
    return arr[lower] * (1 - weight) + arr[upper] * weight;
  }

  // 計算相關係數矩陣
  calculateCorrelationMatrix(data, columns) {
    const matrix = [];
    
    for (let i = 0; i < columns.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < columns.length; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          const col1Values = data.map(item => parseFloat(item[columns[i]]) || 0);
          const col2Values = data.map(item => parseFloat(item[columns[j]]) || 0);
          matrix[i][j] = this.calculateCorrelation(col1Values, col2Values);
        }
      }
    }
    
    return matrix;
  }

  // 計算皮爾遜相關係數
  calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
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
      case 'area':
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
      case 'doughnut':
      case 'polararea':
        return {
          labelColumn: categoricalColumns[0] || columns[0],
          valueColumn: numericalColumns[0] || columns[1]
        };

      case 'bubble':
        return {
          xColumn: numericalColumns[0] || columns[0],
          yColumn: numericalColumns[1] || columns[1],
          sizeColumn: numericalColumns[2] || numericalColumns[0]
        };

      case 'histogram':
      case 'boxplot':
        return {
          column: numericalColumns[0] || columns[0],
          bins: 10
        };

      case 'waterfall':
      case 'funnel':
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