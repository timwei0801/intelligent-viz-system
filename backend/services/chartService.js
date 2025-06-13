class ChartService {
  constructor() {
    this.supportedChartTypes = {
      // 基礎圖表
      'bar': '長條圖',
      'line': '線圖',
      'scatter': '散佈圖',
      'pie': '圓餅圖',
      'doughnut': '甜甜圈圖',
      'area': '面積圖',
      'radar': '雷達圖',
      'polarArea': '極坐標圖',
      'bubble': '氣泡圖',
      
      // 進階圖表
      'stackedbar': '堆疊長條圖',
      'groupedbar': '分組長條圖',
      'horizontalbar': '水平長條圖',
      'stackedarea': '堆疊面積圖',
      'stepline': '階梯線圖',
      
      // 統計圖表 (使用 Plotly)
      'histogram': '直方圖',
      'boxplot': '箱型圖',
      'violin': '小提琴圖',
      'heatmap': '熱力圖',
      
      // 商業智慧圖表 - 完整套件
      'gauge': '儀表板圖',
      'bullet': '子彈圖',
      'kpicard': 'KPI卡片',
      'funnel': '漏斗圖',
      'sankey': '桑基圖',
      'treemap': '樹狀圖',
      
      // 其他圖表
      'waterfall': '瀑布圖'
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
        // 基礎圖表（保持原有邏輯）
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
        
        // 進階圖表（保持原有邏輯）
        case 'stackedbar':
          return this.generateStackedBarChart(data, options);
        case 'groupedbar':
          return this.generateGroupedBarChart(data, options);
        case 'horizontalbar':
          return this.generateHorizontalBarChart(data, options);
        case 'stackedarea':
          return this.generateStackedAreaChart(data, options);
        case 'stepline':
          return this.generateStepLineChart(data, options);
        
        // 統計圖表（保持原有邏輯）
        case 'histogram':
          return this.generateHistogram(data, options);
        case 'boxplot':
          return this.generateBoxPlot(data, options);
        case 'violin':
          return this.generateViolinPlot(data, options);
        case 'heatmap':
          return this.generateHeatmap(data, options);
        
        // 新增：商業智慧圖表
        case 'gauge':
          return this.generateGaugeChart(data, options);
        case 'bullet':
          return this.generateBulletChart(data, options);
        case 'kpicard':
          return this.generateKPICard(data, options);
        case 'funnel':
          return this.generateFunnelChart(data, options);
        case 'sankey':
          return this.generateSankeyChart(data, options);
        case 'treemap':
          return this.generateTreemapChart(data, options);
        
        // 其他圖表
        case 'waterfall':
          return this.generateWaterfallChart(data, options);
        
        default:
          return this.generateBarChart(data, options);
      }
    } catch (error) {
      console.error('圖表配置生成錯誤:', error);
      throw new Error(`生成 ${chartType} 圖表配置失敗: ${error.message}`);
    }
  }

  // === 新增：商業智慧圖表生成器 ===

  // 1. 儀表板圖
  generateGaugeChart(data, options) {
    const { valueColumn } = options;
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    
    const targetColumn = valueColumn || numericColumns[0];
    if (!targetColumn) {
      throw new Error('儀表板圖需要至少一個數值欄位');
    }
    
    const currentValue = data.length > 0 ? (parseFloat(data[0][targetColumn]) || 0) : 0;
    const allValues = data.map(item => parseFloat(item[targetColumn]) || 0);
    const maxValue = Math.max(...allValues);
    const targetValue = options.target || maxValue * 1.2;
    
    return {
      type: 'gauge',
      data: {
        currentValue,
        targetValue,
        valueColumn: targetColumn
      },
      options: {
        title: options.title || `${targetColumn} 指標監控`,
        valueColumn: targetColumn,
        minValue: options.minValue || 0,
        maxValue: targetValue,
        thresholds: options.thresholds || [targetValue * 0.3, targetValue * 0.7],
        unit: options.unit || ''
      }
    };
  }

  // 2. 子彈圖
  generateBulletChart(data, options) {
    const { labelColumn, valueColumn, targetColumn } = options;
    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    const categoricalColumns = columns.filter(col => 
      isNaN(parseFloat(data[0][col]))
    );
    
    const finalLabelColumn = labelColumn || categoricalColumns[0] || columns[0];
    const finalValueColumn = valueColumn || numericColumns[0];
    const finalTargetColumn = targetColumn || numericColumns[1] || finalValueColumn;
    
    if (!finalValueColumn) {
      throw new Error('子彈圖需要至少一個數值欄位');
    }
    
    return {
      type: 'bullet',
      data: { 
        data: data,
        labelColumn: finalLabelColumn,
        valueColumn: finalValueColumn,
        targetColumn: finalTargetColumn
      },
      options: {
        title: options.title || `${finalLabelColumn} 目標達成分析`,
        labelColumn: finalLabelColumn,
        valueColumn: finalValueColumn,
        targetColumn: finalTargetColumn,
        showQualitativeRanges: options.showQualitativeRanges !== false,
        colorScheme: options.colorScheme || 'default'
      }
    };
  }

  // 3. KPI卡片
  generateKPICard(data, options) {
    const { kpiColumn } = options;
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    
    const targetKPIColumn = kpiColumn || numericColumns[0];
    if (!targetKPIColumn) {
      throw new Error('KPI卡片需要至少一個數值欄位');
    }
    
    const currentValue = data.length > 0 ? (parseFloat(data[0][targetKPIColumn]) || 0) : 0;
    const previousValue = data.length > 1 ? (parseFloat(data[1][targetKPIColumn]) || 0) : currentValue * 0.9;
    const changePercent = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;
    
    return {
      type: 'kpicard',
      data: { 
        data: data,
        currentValue,
        previousValue,
        changePercent,
        kpiColumn: targetKPIColumn
      },
      options: {
        title: options.title || `${targetKPIColumn} KPI`,
        kpiColumn: targetKPIColumn,
        format: options.format || 'number',
        showTrend: options.showTrend !== false,
        comparisonPeriod: options.comparisonPeriod || '上期',
        unit: options.unit || '',
        precision: options.precision || 0
      }
    };
  }

  // 4. 漏斗圖
  generateFunnelChart(data, options) {
    const { labelColumn, valueColumn } = options;
    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    const categoricalColumns = columns.filter(col => 
      isNaN(parseFloat(data[0][col]))
    );
    
    const finalLabelColumn = labelColumn || categoricalColumns[0] || columns[0];
    const finalValueColumn = valueColumn || numericColumns[0];
    
    if (!finalLabelColumn || !finalValueColumn) {
      throw new Error('漏斗圖需要標籤欄位和數值欄位');
    }
    
    // 聚合數據
    const aggregated = data.reduce((acc, item) => {
      const label = String(item[finalLabelColumn] || '未分類');
      const value = parseFloat(item[finalValueColumn]) || 0;
      acc[label] = (acc[label] || 0) + value;
      return acc;
    }, {});
    
    const processedData = Object.entries(aggregated).map(([label, value]) => ({
      [finalLabelColumn]: label,
      [finalValueColumn]: value
    }));
    
    return {
      type: 'funnel',
      data: { data: processedData },
      options: {
        title: options.title || `${finalLabelColumn} 轉換漏斗`,
        labelColumn: finalLabelColumn,
        valueColumn: finalValueColumn,
        showConversionRates: options.showConversionRates !== false,
        sortOrder: options.sortOrder || 'desc'
      }
    };
  }

  // 5. 桑基圖
  generateSankeyChart(data, options) {
    const { sourceColumn, targetColumn, valueColumn } = options;
    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    const categoricalColumns = columns.filter(col => 
      isNaN(parseFloat(data[0][col]))
    );
    
    const finalSourceColumn = sourceColumn || categoricalColumns[0];
    const finalTargetColumn = targetColumn || categoricalColumns[1];
    const finalValueColumn = valueColumn || numericColumns[0];
    
    if (!finalSourceColumn || !finalTargetColumn || !finalValueColumn) {
      throw new Error('桑基圖需要來源欄位、目標欄位和數值欄位');
    }
    
    return {
      type: 'sankey',
      data: { data },
      options: {
        title: options.title || `${finalSourceColumn} → ${finalTargetColumn} 流向分析`,
        sourceColumn: finalSourceColumn,
        targetColumn: finalTargetColumn,
        valueColumn: finalValueColumn,
        nodeAlignment: options.nodeAlignment || 'justify',
        linkOpacity: options.linkOpacity || 0.6
      }
    };
  }

  // 6. 樹狀圖
  generateTreemapChart(data, options) {
    const { labelColumn, valueColumn, parentColumn } = options;
    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    const categoricalColumns = columns.filter(col => 
      isNaN(parseFloat(data[0][col]))
    );
    
    const finalLabelColumn = labelColumn || categoricalColumns[0];
    const finalValueColumn = valueColumn || numericColumns[0];
    const finalParentColumn = parentColumn || categoricalColumns[1];
    
    if (!finalLabelColumn || !finalValueColumn) {
      throw new Error('樹狀圖需要標籤欄位和數值欄位');
    }
    
    return {
      type: 'treemap',
      data: { data },
      options: {
        title: options.title || `${finalLabelColumn} 組成分析`,
        labelColumn: finalLabelColumn,
        valueColumn: finalValueColumn,
        parentColumn: finalParentColumn,
        maxDepth: options.maxDepth || 3,
        colorScale: options.colorScale || 'Viridis',
        showLabels: options.showLabels !== false,
        showValues: options.showValues !== false
      }
    };
  }


  // 修正後的氣泡圖處理器
  generateBubbleChart(data, options) {
    const { xColumn, yColumn, sizeColumn } = options;
    
    // 確保有三個數值型欄位
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    
    if (numericColumns.length < 3) {
      // 如果數值欄位不足，使用預設值
      const fallbackX = xColumn || numericColumns[0] || Object.keys(data[0])[0];
      const fallbackY = yColumn || numericColumns[1] || Object.keys(data[0])[1];
      const fallbackSize = sizeColumn || numericColumns[0] || Object.keys(data[0])[0];
      
      const bubbleData = data.map((item, index) => {
        const xVal = parseFloat(item[fallbackX]) || index;
        const yVal = parseFloat(item[fallbackY]) || Math.random() * 100;
        const sizeVal = parseFloat(item[fallbackSize]) || 20;
        
        return {
          x: xVal,
          y: yVal,
          r: Math.max(5, Math.min(50, sizeVal / Math.max(...data.map(d => parseFloat(d[fallbackSize]) || 1)) * 30))
        };
      });

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
              text: `${fallbackX} vs ${fallbackY} 氣泡圖 (大小: ${fallbackSize})`,
              font: { size: 16 }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const point = context.parsed;
                  return `(${point.x}, ${point.y}) 大小: ${point._custom}`;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: fallbackX
              }
            },
            y: {
              title: {
                display: true,
                text: fallbackY
              }
            }
          }
        }
      };
    }

    const bubbleData = data.map((item, index) => {
      const xVal = parseFloat(item[xColumn]) || 0;
      const yVal = parseFloat(item[yColumn]) || 0;
      const sizeVal = parseFloat(item[sizeColumn]) || 1;
      
      // 計算相對大小
      const maxSize = Math.max(...data.map(d => parseFloat(d[sizeColumn]) || 1));
      const minSize = Math.min(...data.map(d => parseFloat(d[sizeColumn]) || 1));
      const normalizedSize = maxSize === minSize ? 15 : 
        5 + ((sizeVal - minSize) / (maxSize - minSize)) * 30;
      
      return {
        x: xVal,
        y: yVal,
        r: normalizedSize
      };
    });

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

  // 修正後的雷達圖處理器
  generateRadarChart(data, options) {
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    
    if (numericColumns.length < 3) {
      return {
        type: 'radar',
        data: {
          labels: ['維度1', '維度2', '維度3'],
          datasets: [{
            label: '資料不足',
            data: [50, 50, 50],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: '雷達圖 (需要更多數值欄位)',
              font: { size: 16 }
            }
          }
        }
      };
    }
    
    // 限制維度數量到合理範圍
    const dimensions = numericColumns.slice(0, Math.min(8, numericColumns.length));
    
    // 取前5筆資料做比較，或者如果資料不足就全部使用
    const sampleSize = Math.min(5, data.length);
    const datasets = data.slice(0, sampleSize).map((item, index) => {
      const values = dimensions.map(col => {
        const val = parseFloat(item[col]) || 0;
        // 正規化數值到 0-100 範圍
        const allValues = data.map(d => parseFloat(d[col]) || 0);
        const max = Math.max(...allValues);
        const min = Math.min(...allValues);
        return max === min ? 50 : ((val - min) / (max - min)) * 100;
      });
      
      return {
        label: `項目 ${index + 1}`,
        data: values,
        borderColor: this.colorPalettes.border[index % this.colorPalettes.border.length],
        backgroundColor: this.colorPalettes.primary[index % this.colorPalettes.primary.length],
        pointBackgroundColor: this.colorPalettes.border[index % this.colorPalettes.border.length],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: this.colorPalettes.border[index % this.colorPalettes.border.length],
        borderWidth: 2,
        pointRadius: 3
      };
    });

    return {
      type: 'radar',
      data: {
        labels: dimensions,
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
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            },
            angleLines: {
              color: 'rgba(0,0,0,0.1)'
            },
            pointLabels: {
              font: {
                size: 10
              }
            }
          }
        }
      }
    };
  }

  // 新增小提琴圖處理器 (Plotly格式)
  generateViolinPlot(data, options) {
    const { column } = options;
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    
    const targetColumn = column || numericColumns[0];
    
    if (!targetColumn) {
      throw new Error('小提琴圖需要至少一個數值型欄位');
    }
    
    const values = data.map(item => parseFloat(item[targetColumn])).filter(val => !isNaN(val));
    
    return {
      type: 'plotly',
      data: [{
        y: values,
        type: 'violin',
        name: targetColumn,
        box: {
          visible: true
        },
        line: {
          color: 'rgba(75, 192, 192, 1)'
        },
        fillcolor: 'rgba(75, 192, 192, 0.3)',
        meanline: {
          visible: true
        }
      }],
      layout: {
        title: `${targetColumn} 小提琴圖`,
        yaxis: {
          title: targetColumn,
          zeroline: false
        },
        xaxis: {
          title: '密度分布'
        },
        showlegend: false
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  }

  // 修正後的熱力圖處理器 (Plotly格式)
  generateHeatmap(data, options) {
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    
    if (numericColumns.length < 2) {
      throw new Error('熱力圖需要至少兩個數值型欄位');
    }
    
    // 計算相關係數矩陣
    const correlationMatrix = this.calculateCorrelationMatrix(data, numericColumns);
    
    return {
      type: 'plotly',
      data: [{
        z: correlationMatrix,
        x: numericColumns,
        y: numericColumns,
        type: 'heatmap',
        colorscale: [
          [0, 'rgba(0,0,255,0.8)'],
          [0.5, 'rgba(255,255,255,1)'],
          [1, 'rgba(255,0,0,0.8)']
        ],
        zmin: -1,
        zmax: 1,
        hoverongaps: false,
        showscale: true,
        colorbar: {
          title: '相關係數',
          titleside: 'right'
        }
      }],
      layout: {
        title: '變數相關係數熱力圖',
        xaxis: {
          title: '變數',
          side: 'bottom'
        },
        yaxis: {
          title: '變數'
        },
        width: 500,
        height: 500
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  }

  // 修正後的箱型圖處理器 (Plotly格式)
  generateBoxPlot(data, options) {
    const { column } = options;
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    
    if (numericColumns.length === 0) {
      throw new Error('箱型圖需要至少一個數值型欄位');
    }
    
    // 如果沒有指定欄位，使用所有數值欄位
    const columnsToPlot = column ? [column] : numericColumns.slice(0, 5);
    
    const plotlyData = columnsToPlot.map((col, index) => {
      const values = data.map(item => parseFloat(item[col])).filter(val => !isNaN(val));
      
      return {
        y: values,
        type: 'box',
        name: col,
        boxpoints: 'outliers',
        marker: {
          color: this.colorPalettes.primary[index % this.colorPalettes.primary.length]
        },
        line: {
          color: this.colorPalettes.border[index % this.colorPalettes.border.length]
        }
      };
    });
    
    return {
      type: 'plotly',
      data: plotlyData,
      layout: {
        title: column ? `${column} 箱型圖` : '多變數箱型圖',
        yaxis: {
          title: '數值',
          zeroline: false
        },
        xaxis: {
          title: '變數'
        },
        showlegend: columnsToPlot.length > 1
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  }

  // 修正後的直方圖處理器 (Plotly格式)
  generateHistogram(data, options) {
    const { column, bins = 20 } = options;
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    
    const targetColumn = column || numericColumns[0];
    
    if (!targetColumn) {
      throw new Error('直方圖需要至少一個數值型欄位');
    }
    
    const values = data.map(item => parseFloat(item[targetColumn])).filter(val => !isNaN(val));
    
    return {
      type: 'plotly',
      data: [{
        x: values,
        type: 'histogram',
        nbinsx: bins,
        marker: {
          color: 'rgba(54, 162, 235, 0.7)',
          line: {
            color: 'rgba(54, 162, 235, 1)',
            width: 1
          }
        }
      }],
      layout: {
        title: `${targetColumn} 分布直方圖`,
        xaxis: {
          title: targetColumn
        },
        yaxis: {
          title: '頻率'
        },
        bargap: 0.05
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  }

  // === 保持原有的其他方法不變 ===
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
        cutout: '60%'
      }
    };
  }

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

  generateWaterfallChart(data, options) {
  const { labelColumn, valueColumn } = options;
  
  // 驗證資料
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('瀑布圖需要有效的資料陣列');
  }

  // 檢查必要的欄位
  const hasLabelColumn = data.some(item => item.hasOwnProperty(labelColumn));
  const hasValueColumn = data.some(item => item.hasOwnProperty(valueColumn));
  
  if (!hasLabelColumn) {
    throw new Error(`找不到標籤欄位: ${labelColumn}`);
  }
  
  if (!hasValueColumn) {
    throw new Error(`找不到數值欄位: ${valueColumn}`);
  }

  // 過濾和清理資料
  const cleanData = data
    .filter(item => 
      item[labelColumn] !== null && 
      item[labelColumn] !== undefined && 
      item[labelColumn] !== ''
    )
    .map(item => ({
      [labelColumn]: String(item[labelColumn]).trim(),
      [valueColumn]: parseFloat(item[valueColumn]) || 0
    }))
    .slice(0, 15); // 限制最多 15 個項目，避免圖表過於擁擠

  if (cleanData.length === 0) {
    throw new Error('處理後沒有有效的資料項目');
  }

  // 為 D3.js 瀑布圖組件準備資料
  return {
    type: 'waterfall', // 特殊標識符，讓前端知道使用 D3.js 組件
    data: {
      data: cleanData,
      labelColumn: labelColumn,
      valueColumn: valueColumn
    },
    options: {
      title: `${labelColumn} 瀑布圖`,
      width: 700,
      height: 450,
      responsive: true,
      maintainAspectRatio: false,
      // 傳遞額外配置給 D3.js 組件
      showValues: true,
      showCumulative: true,
      showGrid: true,
      animation: true
    }
  };
}

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
        indexAxis: 'y',
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

  // 1. 堆疊長條圖
  generateStackedBarChart(data, options) {
    const { xColumn, groupByColumn, valueColumn } = options;
    
    // 按分組欄位組織資料
    const groupedData = {};
    const categories = [...new Set(data.map(item => item[xColumn]))];
    const series = [...new Set(data.map(item => item[groupByColumn]))];
    
    // 初始化資料結構
    series.forEach(seriesName => {
      groupedData[seriesName] = categories.map(category => {
        const item = data.find(d => d[xColumn] === category && d[groupByColumn] === seriesName);
        return parseFloat(item?.[valueColumn]) || 0;
      });
    });
  
    const datasets = series.map((seriesName, index) => ({
      label: seriesName,
      data: groupedData[seriesName],
      backgroundColor: this.colorPalettes.primary[index % this.colorPalettes.primary.length],
      borderColor: this.colorPalettes.border[index % this.colorPalettes.border.length],
      borderWidth: 1
    }));
  
    return {
      type: 'bar',
      data: {
        labels: categories,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${xColumn} 堆疊分析 (按 ${groupByColumn} 分組)`,
            font: { size: 16 }
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: xColumn
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: valueColumn
            }
          }
        }
      }
    };
  }
  
  // 2. 分組長條圖
  generateGroupedBarChart(data, options) {
    const { xColumn, groupByColumn, valueColumn } = options;
    
    // 組織資料（與堆疊圖類似，但不堆疊）
    const groupedData = {};
    const categories = [...new Set(data.map(item => item[xColumn]))];
    const series = [...new Set(data.map(item => item[groupByColumn]))];
    
    series.forEach(seriesName => {
      groupedData[seriesName] = categories.map(category => {
        const item = data.find(d => d[xColumn] === category && d[groupByColumn] === seriesName);
        return parseFloat(item?.[valueColumn]) || 0;
      });
    });
  
    const datasets = series.map((seriesName, index) => ({
      label: seriesName,
      data: groupedData[seriesName],
      backgroundColor: this.colorPalettes.primary[index % this.colorPalettes.primary.length],
      borderColor: this.colorPalettes.border[index % this.colorPalettes.border.length],
      borderWidth: 1
    }));
  
    return {
      type: 'bar',
      data: {
        labels: categories,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${xColumn} 分組比較 (按 ${groupByColumn} 分組)`,
            font: { size: 16 }
          },
          legend: {
            position: 'top'
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
            beginAtZero: true,
            title: {
              display: true,
              text: valueColumn
            }
          }
        }
      }
    };
  }
  
  // 3. 混合圖表 (線 + 柱)
  generateMixedChart(data, options) {
    const { xColumn, barColumn, lineColumn } = options;
    
    return {
      type: 'bar',
      data: {
        labels: data.map(item => item[xColumn]),
        datasets: [
          {
            type: 'bar',
            label: barColumn,
            data: data.map(item => parseFloat(item[barColumn]) || 0),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            type: 'line',
            label: lineColumn,
            data: data.map(item => parseFloat(item[lineColumn]) || 0),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${barColumn} vs ${lineColumn} 混合分析`,
            font: { size: 16 }
          },
          legend: {
            position: 'top'
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
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: barColumn
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: lineColumn
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        }
      }
    };
  }
  
  // 4. 水平長條圖
  generateHorizontalBarChart(data, options) {
    console.log('🚨 調用了 generateHorizontalBarChart 方法'); // 添加這行
    console.log('🚨 收到的資料:', data.slice(0, 3));
    console.log('🚨 收到的選項:', options);
    console.log('🔧 處理水平長條圖，資料長度:', data.length);
    console.log('🔧 選項:', options);
    console.log('🔧 前3筆資料範例:', data.slice(0, 3));

    // ⭐ 修復：正確的自動欄位選擇邏輯
    const columns = Object.keys(data[0] || {});
    const numericalColumns = columns.filter(col => 
      !isNaN(parseFloat(data[0][col])) && col !== '日期'
    );
    const categoricalColumns = columns.filter(col => 
      isNaN(parseFloat(data[0][col])) && col !== '日期'
    );

    console.log('🔧 數值欄位:', numericalColumns);
    console.log('🔧 分類欄位:', categoricalColumns);

    // ⭐ 修復：選擇正確的欄位進行聚合
    // 對於你的資料，應該使用產品類別作為 X 軸，銷售額作為 Y 軸
    const xColumn = categoricalColumns.find(col => col.includes('類別')) || categoricalColumns[0] || '產品類別';
    const yColumn = numericalColumns.find(col => col.includes('銷售額')) || numericalColumns[0] || '銷售額';

    console.log('🔧 選擇的欄位 - X軸 (分類):', xColumn, 'Y軸 (數值):', yColumn);

    // ⭐ 修復：正確的資料聚合邏輯
    const aggregatedData = data.reduce((acc, item) => {
      const category = item[xColumn];
      const value = parseFloat(item[yColumn]) || 0;
      
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += value;
      return acc;
    }, {});

    console.log('🔧 聚合後的資料:', aggregatedData);

    const labels = Object.keys(aggregatedData);
    const values = Object.values(aggregatedData);

    console.log('🔧 最終標籤:', labels);
    console.log('🔧 最終數值:', values);

    // ⭐ 確保有有效資料
    if (values.length === 0 || values.every(v => v === 0)) {
      console.log('❌ 沒有有效的數值資料');
      // 提供範例資料以避免全是 0
      return {
        type: 'bar',
        data: {
          labels: ['電子產品', '服飾', '食品'],
          datasets: [{
            label: '銷售額',
            data: [100, 200, 150], // 範例資料
            backgroundColor: [
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 99, 132, 0.8)',
              'rgba(255, 205, 86, 0.8)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)', 
              'rgba(255, 205, 86, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `${xColumn} 水平分析 (範例資料)`,
              font: { size: 16 }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: yColumn
              }
            },
            y: {
              title: {
                display: true,
                text: xColumn
              }
            }
          }
        }
      };
    }

    // ⭐ 修復：返回正確格式的資料
    return {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: yColumn,
          data: values,
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ].slice(0, labels.length),
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ].slice(0, labels.length),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',  // 🔑 關鍵設定
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${xColumn} 水平分析`,
            font: { size: 16 }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: yColumn
            },
            grid: {
              display: true,
              color: 'rgba(0,0,0,0.1)'
            }
          },
          y: {
            title: {
              display: true,
              text: xColumn
            },
            grid: {
              display: true,
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      }
    };
  }
  
  // 5. 堆疊面積圖
  generateStackedAreaChart(data, options) {
    const { xColumn, groupByColumn, valueColumn } = options;
    
    // 按時間序列組織資料
    const timePoints = [...new Set(data.map(item => item[xColumn]))].sort();
    const series = [...new Set(data.map(item => item[groupByColumn]))];
    
    const datasets = series.map((seriesName, index) => {
      const seriesData = timePoints.map(timePoint => {
        const item = data.find(d => d[xColumn] === timePoint && d[groupByColumn] === seriesName);
        return parseFloat(item?.[valueColumn]) || 0;
      });
      
      return {
        label: seriesName,
        data: seriesData,
        borderColor: this.colorPalettes.border[index % this.colorPalettes.border.length],
        backgroundColor: this.colorPalettes.primary[index % this.colorPalettes.primary.length],
        fill: true,
        tension: 0.3
      };
    });
  
    return {
      type: 'line',
      data: {
        labels: timePoints,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${xColumn} 堆疊面積圖 (按 ${groupByColumn} 分組)`,
            font: { size: 16 }
          },
          legend: {
            position: 'top'
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
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: valueColumn
            }
          }
        }
      }
    };
  }
  
  // 6. 簡單面積圖
  generateSimpleAreaChart(data, options) {
    const { xColumn, yColumn } = options;
    return {
      type: 'line',
      data: {
        labels: data.map(item => item[xColumn]),
        datasets: [{
          label: yColumn,
          data: data.map(item => parseFloat(item[yColumn]) || 0),
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.3)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${xColumn} 面積圖`,
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
            beginAtZero: true,
            title: {
              display: true,
              text: yColumn
            }
          }
        }
      }
    };
  }
  
  // 7. 階梯線圖 generateStepLineChart
  generateStepLineChart(data, options) {
    const { xColumn, yColumn } = options;
    return {
      type: 'line',
      data: {
        labels: data.map(item => item[xColumn]),
        datasets: [{
          label: yColumn,
          data: data.map(item => parseFloat(item[yColumn]) || 0),
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: false,
          stepped: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${xColumn} 階梯線圖`,
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
            beginAtZero: true,
            title: {
              display: true,
              text: yColumn
            }
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

  recommendChartParameters(data, chartType, dataAnalysis) {
    const { columns, types } = dataAnalysis;
    const numericalColumns = columns.filter(col => types[col] === 'numerical');
    const categoricalColumns = columns.filter(col => types[col] === 'categorical');
    const temporalColumns = columns.filter(col => types[col] === 'temporal');

    // 商業圖表的參數推薦
    const businessChartConfigs = {
      gauge: {
        valueColumn: numericalColumns[0],
        title: `${numericalColumns[0]} 指標監控`,
        thresholds: [30, 70],
        unit: '',
        target: Math.max(...data.map(item => parseFloat(item[numericalColumns[0]]) || 0)) * 1.2
      },

      bullet: {
        labelColumn: categoricalColumns[0] || columns[0],
        valueColumn: numericalColumns[0],
        targetColumn: numericalColumns[1] || numericalColumns[0],
        title: `${categoricalColumns[0] || '項目'} 目標達成分析`
      },

      kpicard: {
        kpiColumn: numericalColumns[0],
        title: `${numericalColumns[0]} KPI`,
        format: 'number',
        showTrend: true,
        unit: ''
      },

      funnel: {
        labelColumn: categoricalColumns[0] || columns[0],
        valueColumn: numericalColumns[0] || columns[1],
        title: `${categoricalColumns[0] || '階段'} 轉換漏斗`,
        showConversionRates: true
      },

      sankey: {
        sourceColumn: categoricalColumns[0] || columns[0],
        targetColumn: categoricalColumns[1] || columns[1],
        valueColumn: numericalColumns[0] || columns[2],
        title: `${categoricalColumns[0] || '來源'} → ${categoricalColumns[1] || '目標'} 流向分析`
      },

      treemap: {
        labelColumn: categoricalColumns[0] || columns[0],
        valueColumn: numericalColumns[0] || columns[1],
        parentColumn: categoricalColumns[1] || null,
        title: `${categoricalColumns[0] || '項目'} 組成分析`
      }
    };

    // 如果是商業圖表，返回商業圖表配置
    if (businessChartConfigs[chartType]) {
      return businessChartConfigs[chartType];
    }

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
      case 'violin':
        return {
          column: numericalColumns[0] || columns[0],
          bins: 20
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
  // === 商業圖表數據驗證 ===
  validateBusinessChartData(data, chartType) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { valid: false, reason: '數據為空或格式不正確' };
    }

    const firstRow = data[0];
    const columns = Object.keys(firstRow);
    const numericalColumns = columns.filter(col => 
      !isNaN(parseFloat(firstRow[col]))
    );
    const categoricalColumns = columns.filter(col => 
      isNaN(parseFloat(firstRow[col]))
    );

    switch (chartType.toLowerCase()) {
      case 'gauge':
        if (numericalColumns.length < 1) {
          return { valid: false, reason: '儀表板圖需要至少一個數值欄位' };
        }
        break;

      case 'bullet':
        if (numericalColumns.length < 1) {
          return { valid: false, reason: '子彈圖需要至少一個數值欄位' };
        }
        break;

      case 'kpicard':
        if (numericalColumns.length < 1) {
          return { valid: false, reason: 'KPI卡片需要至少一個數值欄位' };
        }
        break;

      case 'funnel':
        if (numericalColumns.length < 1 || categoricalColumns.length < 1) {
          return { valid: false, reason: '漏斗圖需要分類標籤和對應數值' };
        }
        break;

      case 'sankey':
        if (categoricalColumns.length < 2 || numericalColumns.length < 1) {
          return { valid: false, reason: '桑基圖需要來源、目標欄位和流量數值' };
        }
        break;

      case 'treemap':
        if (numericalColumns.length < 1 || categoricalColumns.length < 1) {
          return { valid: false, reason: '樹狀圖需要分類標籤和對應數值' };
        }
        break;

      default:
        return { valid: true };
    }

    return { valid: true };
  }
}

module.exports = new ChartService();