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
      'mixedchart': '混合圖表',
      
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

    // ⭐ 擴展顏色調色盤系統
    this.colorSchemes = {
      default: {
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
      },
      viridis: {
        primary: [
          'rgba(68, 1, 84, 0.8)',
          'rgba(59, 82, 139, 0.8)',
          'rgba(33, 145, 140, 0.8)',
          'rgba(94, 201, 98, 0.8)',
          'rgba(253, 231, 37, 0.8)',
          'rgba(158, 1, 66, 0.8)',
          'rgba(213, 62, 79, 0.8)',
          'rgba(244, 109, 67, 0.8)',
          'rgba(253, 174, 97, 0.8)',
          'rgba(254, 224, 139, 0.8)'
        ],
        border: [
          'rgba(68, 1, 84, 1)',
          'rgba(59, 82, 139, 1)',
          'rgba(33, 145, 140, 1)',
          'rgba(94, 201, 98, 1)',
          'rgba(253, 231, 37, 1)',
          'rgba(158, 1, 66, 1)',
          'rgba(213, 62, 79, 1)',
          'rgba(244, 109, 67, 1)',
          'rgba(253, 174, 97, 1)',
          'rgba(254, 224, 139, 1)'
        ]
      },
      plasma: {
        primary: [
          'rgba(13, 8, 135, 0.8)',
          'rgba(75, 3, 161, 0.8)',
          'rgba(125, 3, 168, 0.8)',
          'rgba(168, 34, 150, 0.8)',
          'rgba(202, 70, 120, 0.8)',
          'rgba(229, 107, 93, 0.8)',
          'rgba(248, 148, 65, 0.8)',
          'rgba(253, 195, 40, 0.8)',
          'rgba(240, 249, 33, 0.8)',
          'rgba(190, 229, 160, 0.8)'
        ],
        border: [
          'rgba(13, 8, 135, 1)',
          'rgba(75, 3, 161, 1)',
          'rgba(125, 3, 168, 1)',
          'rgba(168, 34, 150, 1)',
          'rgba(202, 70, 120, 1)',
          'rgba(229, 107, 93, 1)',
          'rgba(248, 148, 65, 1)',
          'rgba(253, 195, 40, 1)',
          'rgba(240, 249, 33, 1)',
          'rgba(190, 229, 160, 1)'
        ]
      },
      warm: {
        primary: [
          'rgba(255, 87, 51, 0.8)',
          'rgba(255, 117, 56, 0.8)',
          'rgba(255, 147, 61, 0.8)',
          'rgba(255, 177, 66, 0.8)',
          'rgba(255, 207, 71, 0.8)',
          'rgba(255, 195, 0, 0.8)',
          'rgba(255, 167, 38, 0.8)',
          'rgba(255, 139, 76, 0.8)',
          'rgba(255, 111, 114, 0.8)',
          'rgba(255, 83, 152, 0.8)'
        ],
        border: [
          'rgba(255, 87, 51, 1)',
          'rgba(255, 117, 56, 1)',
          'rgba(255, 147, 61, 1)',
          'rgba(255, 177, 66, 1)',
          'rgba(255, 207, 71, 1)',
          'rgba(255, 195, 0, 1)',
          'rgba(255, 167, 38, 1)',
          'rgba(255, 139, 76, 1)',
          'rgba(255, 111, 114, 1)',
          'rgba(255, 83, 152, 1)'
        ]
      },
      cool: {
        primary: [
          'rgba(0, 123, 255, 0.8)',
          'rgba(46, 134, 193, 0.8)',
          'rgba(93, 145, 131, 0.8)',
          'rgba(140, 156, 69, 0.8)',
          'rgba(187, 167, 7, 0.8)',
          'rgba(52, 152, 219, 0.8)',
          'rgba(26, 188, 156, 0.8)',
          'rgba(22, 160, 133, 0.8)',
          'rgba(155, 89, 182, 0.8)',
          'rgba(142, 68, 173, 0.8)'
        ],
        border: [
          'rgba(0, 123, 255, 1)',
          'rgba(46, 134, 193, 1)',
          'rgba(93, 145, 131, 1)',
          'rgba(140, 156, 69, 1)',
          'rgba(187, 167, 7, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(26, 188, 156, 1)',
          'rgba(22, 160, 133, 1)',
          'rgba(155, 89, 182, 1)',
          'rgba(142, 68, 173, 1)'
        ]
      },
      business: {
        primary: [
          'rgba(41, 128, 185, 0.8)',
          'rgba(52, 152, 219, 0.8)',
          'rgba(142, 68, 173, 0.8)',
          'rgba(155, 89, 182, 0.8)',
          'rgba(39, 174, 96, 0.8)',
          'rgba(46, 204, 113, 0.8)',
          'rgba(241, 196, 15, 0.8)',
          'rgba(243, 156, 18, 0.8)',
          'rgba(211, 84, 0, 0.8)',
          'rgba(230, 126, 34, 0.8)'
        ],
        border: [
          'rgba(41, 128, 185, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(142, 68, 173, 1)',
          'rgba(155, 89, 182, 1)',
          'rgba(39, 174, 96, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(241, 196, 15, 1)',
          'rgba(243, 156, 18, 1)',
          'rgba(211, 84, 0, 1)',
          'rgba(230, 126, 34, 1)'
        ]
      }
    };

    // 向後兼容
    this.colorPalettes = this.colorSchemes.default;
  }

  // ⭐ 新增：根據顏色主題獲取顏色調色盤
  getColorPalette(colorScheme = 'default') {
    return this.colorSchemes[colorScheme] || this.colorSchemes.default;
  }

  // 根據資料和圖表類型生成圖表配置
  generateChartConfig(data, chartType, options = {}) {
    try {
      console.log(`🔧 生成圖表配置 - 類型: ${chartType}, 資料長度: ${data.length}`);
      console.log('🔧 選項:', options);

      switch (chartType.toLowerCase()) {
        // 基礎圖表
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
        
        // 進階圖表 - 修正版本
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
        case 'mixedchart':
          return this.generateMixedChart(data, options);

        // 統計圖表
        case 'histogram':
          return this.generateHistogram(data, options);
        case 'boxplot':
          return this.generateBoxPlot(data, options);
        case 'violin':
          return this.generateViolinPlot(data, options);
        case 'heatmap':
          return this.generateHeatmap(data, options);

        // 商業智慧圖表
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
        case 'funnel':
          return this.generateFunnelChart(data, options);
          
        default:
          throw new Error(`不支援的圖表類型: ${chartType}`);
      }
    } catch (error) {
      console.error('圖表生成錯誤:', error);
      throw error;
    }
  }

  // 修正版本：堆疊長條圖
  generateStackedBarChart(data, options) {
    console.log('🔧 生成堆疊長條圖');
    // ⭐ 獲取顏色調色盤
    const colorPalette = this.getColorPalette(options.colorScheme);

    // 自動推斷必要欄位
    if (!options.xColumn || !options.groupByColumn || !options.valueColumn) {
      const columns = Object.keys(data[0] || {});
      const numericalColumns = columns.filter(col =>
        !isNaN(parseFloat(data[0][col])) && isFinite(data[0][col])
      );
      const categoricalColumns = columns.filter(col =>
        isNaN(parseFloat(data[0][col])) || !isFinite(data[0][col])
      );
      options.xColumn = options.xColumn || categoricalColumns[0];
      options.groupByColumn = options.groupByColumn || categoricalColumns[1] || categoricalColumns[0];
      options.valueColumn = options.valueColumn || numericalColumns[0];
    }
    const { xColumn, groupByColumn, valueColumn } = options;

    // 過濾有效資料
    const validData = data.filter(item =>
      item[xColumn] != null &&
      item[groupByColumn] != null &&
      !isNaN(parseFloat(item[valueColumn]))
    );
    if (validData.length === 0) throw new Error('沒有有效的資料可以繪製堆疊長條圖');

    // 類別與系列
    const categories = [...new Set(validData.map(item => String(item[xColumn])))].sort();
    const series = [...new Set(validData.map(item => String(item[groupByColumn])))].sort();

    // 組裝 datasets
    const datasets = series.map((seriesName, i) => ({
      label: seriesName,
      data: categories.map(cat => {
        return validData
          .filter(d => String(d[xColumn]) === cat && String(d[groupByColumn]) === seriesName)
          .reduce((sum, d) => sum + parseFloat(d[valueColumn] || 0), 0);
      }),
      backgroundColor: colorPalette.primary[i % colorPalette.primary.length],
      borderColor: colorPalette.border[i % colorPalette.border.length],
      borderWidth: 1
    }));

    return {
      type: 'bar',
      data: { labels: categories, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: options.title || `${xColumn} 堆疊分析 (按 ${groupByColumn} 分組)`,
            font: { size: 16 }
          },
          legend: { position: 'top' }
        },
        scales: {
          x: { stacked: true, title: { display: true, text: options.xAxisTitle || xColumn } },
          y: { stacked: true, beginAtZero: true, title: { display: true, text: options.yAxisTitle || valueColumn } }
        }
      }
    };
  }

  // 修正版本：分組長條圖
  generateGroupedBarChart(data, options) {
    console.log('🔧 生成分組長條圖');
    const colorPalette = this.getColorPalette(options.colorScheme);

    // 自動推斷必要欄位
    if (!options.xColumn || !options.groupByColumn || !options.valueColumn) {
      const columns = Object.keys(data[0] || {});
      const numericalColumns = columns.filter(col =>
        !isNaN(parseFloat(data[0][col])) && isFinite(data[0][col])
      );
      const categoricalColumns = columns.filter(col =>
        isNaN(parseFloat(data[0][col])) || !isFinite(data[0][col])
      );
      options.xColumn = options.xColumn || categoricalColumns[0];
      options.groupByColumn = options.groupByColumn || categoricalColumns[1] || categoricalColumns[0];
      options.valueColumn = options.valueColumn || numericalColumns[0];
    }
    const { xColumn, groupByColumn, valueColumn } = options;

    // 過濾有效資料
    const validData = data.filter(item =>
      item[xColumn] != null &&
      item[groupByColumn] != null &&
      !isNaN(parseFloat(item[valueColumn]))
    );
    if (validData.length === 0) throw new Error('沒有有效的資料可以繪製分組長條圖');

    // 類別與系列
    const categories = [...new Set(validData.map(item => String(item[xColumn])))].sort();
    const series = [...new Set(validData.map(item => String(item[groupByColumn])))].sort();

    // 組裝 datasets
    const datasets = series.map((seriesName, i) => ({
      label: seriesName,
      data: categories.map(cat => {
        return validData
          .filter(d => String(d[xColumn]) === cat && String(d[groupByColumn]) === seriesName)
          .reduce((sum, d) => sum + parseFloat(d[valueColumn] || 0), 0);
      }),
      backgroundColor: colorPalette.primary[i % colorPalette.primary.length],
      borderColor: colorPalette.border[i % colorPalette.border.length],
      borderWidth: 1
    }));

    return {
      type: 'bar',
      data: { labels: categories, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: options.title || `${xColumn} 分組比較 (按 ${groupByColumn} 分組)`,
            font: { size: 16 }
          },
          legend: { position: 'top' }
        },
        scales: {
          x: {
            // 不設定 stacked: true
            title: { display: true, text: options.xAxisTitle || xColumn }
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: options.yAxisTitle || valueColumn }
          }
        }
      }
    };
  }

  // 修正版本：混合圖表
  generateMixedChart(data, options) {
    console.log('🔧 生成混合圖表');
    const colorPalette = this.getColorPalette(options.colorScheme);

    // 自動推斷欄位
    if (!options.xColumn || !options.barColumn || !options.lineColumn) {
      const columns = Object.keys(data[0] || {});
      const numericalColumns = columns.filter(col =>
        !isNaN(parseFloat(data[0][col])) && isFinite(data[0][col])
      );
      const categoricalColumns = columns.filter(col =>
        isNaN(parseFloat(data[0][col])) || !isFinite(data[0][col])
      );
      options.xColumn = options.xColumn || categoricalColumns[0] || columns[0];
      options.barColumn = options.barColumn || numericalColumns[0];
      options.lineColumn = options.lineColumn || numericalColumns[1] || numericalColumns[0];
    }
    const { xColumn, barColumn, lineColumn } = options;

    // 過濾有效資料
    const validData = data.filter(item =>
      item[xColumn] != null &&
      !isNaN(parseFloat(item[barColumn])) &&
      !isNaN(parseFloat(item[lineColumn]))
    );
    if (validData.length === 0) throw new Error('沒有有效的資料可以繪製混合圖表');

    // 如果資料超過20個點，取前20個
    const processedData = validData.slice(0, 20);

    return {
      type: 'bar',
      data: {
        labels: processedData.map(item => String(item[xColumn])),
        datasets: [
          {
            type: 'bar',
            label: barColumn,
            data: processedData.map(item => parseFloat(item[barColumn]) || 0),
            backgroundColor: colorPalette.primary[0 % colorPalette.primary.length],
            borderColor: colorPalette.border[0 % colorPalette.border.length],
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            type: 'line',
            label: lineColumn,
            data: processedData.map(item => parseFloat(item[lineColumn]) || 0),
            borderColor: colorPalette.border[1 % colorPalette.border.length],
            backgroundColor: colorPalette.primary[1 % colorPalette.primary.length],
            borderWidth: 2,
            fill: false,
            tension: 0.1,
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
            text: options.title || `${barColumn} vs ${lineColumn} 混合分析`,
            font: { size: 16 }
          },
          legend: { position: 'top' }
        },
        scales: {
          x: {
            title: { display: true, text: options.xAxisTitle || xColumn }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            title: { display: true, text: options.yAxisTitle || barColumn }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            title: { display: true, text: options.yAxisTitle || lineColumn },
            grid: { drawOnChartArea: false }
          }
        }
      }
    };
  }

  // 修正版本：水平長條圖
  generateHorizontalBarChart(data, options) {
    console.log('🔧 生成水平長條圖');
    console.log('接收的選項:', options);

    // ⭐ 獲取顏色調色盤
    const colorPalette = this.getColorPalette(options.colorScheme);

    // 從選項中取得欄位，或自動推斷
    let { xColumn, yColumn } = options;

    // 如果沒有提供選項，自動推斷
    if (!xColumn || !yColumn) {
      const columns = Object.keys(data[0] || {});
      const numericalColumns = columns.filter(col => 
        !isNaN(parseFloat(data[0][col])) && isFinite(data[0][col])
      );
      const categoricalColumns = columns.filter(col => 
        isNaN(parseFloat(data[0][col])) || !isFinite(data[0][col])
      );

      // 對於水平長條圖：X軸是數值，Y軸是類別
      xColumn = xColumn || numericalColumns[0] || columns[1];
      yColumn = yColumn || categoricalColumns[0] || columns[0];
    }

    console.log(`水平長條圖軸設定 - X軸(數值): ${xColumn}, Y軸(類別): ${yColumn}`);

    // 過濾有效資料
    const validData = data.filter(item => 
      item[xColumn] !== null && 
      item[xColumn] !== undefined && 
      item[yColumn] !== null && 
      item[yColumn] !== undefined &&
      !isNaN(parseFloat(item[xColumn]))
    );

    if (validData.length === 0) {
      throw new Error('沒有有效的資料可以繪製水平長條圖');
    }

    // 聚合資料（相同類別的數值加總）
    const aggregatedData = validData.reduce((acc, item) => {
      const category = String(item[yColumn]);
      const value = parseFloat(item[xColumn]) || 0;
      
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += value;
      return acc;
    }, {});

    console.log('水平長條圖聚合後資料:', aggregatedData);

    const labels = Object.keys(aggregatedData);
    const values = Object.values(aggregatedData);

    return {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: xColumn,
          data: values,
          backgroundColor: colorPalette.primary[0], // ⭐ 使用選定的顏色主題
          borderColor: colorPalette.border[0],
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // 這是關鍵設定，讓長條圖變成水平
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: options.title || `${yColumn} 水平長條圖`,
            font: { size: 16 }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: options.xAxisTitle || xColumn
            }
          },
          y: {
            title: {
              display: true,
              text: options.yAxisTitle || yColumn
            }
          }
        }
      }
    };
  }

  // 修正版本：基礎長條圖
  generateBarChart(data, options) {
    const colorPalette = this.getColorPalette(options.colorScheme);
    const { xColumn, yColumn } = options;
    // 檢查是否需要聚合
    const uniqueX = [...new Set(data.map(item => item[xColumn]))];
    if (uniqueX.length < data.length) {
      // 需要聚合
      const aggregated = uniqueX.map(x => {
        const items = data.filter(item => item[xColumn] === x);
        const sum = items.reduce((total, item) => total + (parseFloat(item[yColumn]) || 0), 0);
        return { [xColumn]: x, [yColumn]: sum };
      });
      return {
        type: 'bar',
        data: {
          labels: aggregated.map(item => item[xColumn]),
          datasets: [{
            label: yColumn || '數值',
            data: aggregated.map(item => item[yColumn]),
            backgroundColor: colorPalette.primary[0 % colorPalette.primary.length],
            borderColor: colorPalette.border[0 % colorPalette.border.length],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: options.title || `${xColumn} vs ${yColumn}`,
              font: { size: 16 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: options.yAxisTitle || yColumn }
            },
            x: {
              title: { display: true, text: options.xAxisTitle || xColumn }
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
          backgroundColor: colorPalette.primary[0 % colorPalette.primary.length],
          borderColor: colorPalette.border[0 % colorPalette.border.length],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: options.title || `${xColumn || 'X軸'} vs ${yColumn || 'Y軸'}`,
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: options.yAxisTitle || yColumn }
          },
          x: {
            title: { display: true, text: options.xAxisTitle || xColumn }
          }
        }
      }
    };
  }

  generateLineChart(data, options) {
    const colorPalette = this.getColorPalette(options.colorScheme);
    const { xColumn, yColumn } = options;
    return {
      type: 'line',
      data: {
        labels: data.map(item => item[xColumn]),
        datasets: [{
          label: yColumn || '數值',
          data: data.map(item => parseFloat(item[yColumn]) || 0),
          borderColor: colorPalette.border[0 % colorPalette.border.length],
          backgroundColor: colorPalette.primary[0 % colorPalette.primary.length],
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: options.title || `${xColumn || 'X軸'} 趨勢變化`,
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: options.yAxisTitle || yColumn }
          },
          x: {
            title: { display: true, text: options.xAxisTitle || xColumn }
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
            text: `${xColumn} vs ${yColumn} 散佈圖`,
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
    const colorPalette = this.getColorPalette(options.colorScheme);
    const { labelColumn, valueColumn } = options;
    const groupedData = this.groupData(data, labelColumn, valueColumn);
    return {
      type: 'pie',
      data: {
        labels: Object.keys(groupedData),
        datasets: [{
          data: Object.values(groupedData),
          backgroundColor: colorPalette.primary,
          borderColor: colorPalette.border,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: options.title || `${labelColumn} 分布圓餅圖`,
            font: { size: 16 }
          },
          legend: { position: 'bottom' }
        }
      }
    };
  }

  generateDoughnutChart(data, options) {
    const colorPalette = this.getColorPalette(options.colorScheme);
    const { labelColumn, valueColumn } = options;
    const groupedData = this.groupData(data, labelColumn, valueColumn);
    return {
      type: 'doughnut',
      data: {
        labels: Object.keys(groupedData),
        datasets: [{
          data: Object.values(groupedData),
          backgroundColor: colorPalette.primary,
          borderColor: colorPalette.border,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: options.title || `${labelColumn} 甜甜圈圖`,
            font: { size: 16 }
          },
          legend: { position: 'bottom' }
        }
      }
    };
  }

  generateAreaChart(data, options) {
    const { xColumn, yColumn } = options;
    
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
            beginAtZero: true
          }
        }
      }
    };
  }

  generateRadarChart(data, options) {
    const { labelColumn, valueColumn } = options;
    const groupedData = this.groupData(data, labelColumn, valueColumn);
    
    return {
      type: 'radar',
      data: {
        labels: Object.keys(groupedData),
        datasets: [{
          label: '數值',
          data: Object.values(groupedData),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${labelColumn} 雷達圖`,
            font: { size: 16 }
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

  generateBubbleChart(data, options) {
    const { xColumn, yColumn, sizeColumn } = options;
    
    return {
      type: 'bubble',
      data: {
        datasets: [{
          label: '氣泡資料',
          data: data.map(item => ({
            x: parseFloat(item[xColumn]) || 0,
            y: parseFloat(item[yColumn]) || 0,
            r: Math.sqrt(parseFloat(item[sizeColumn]) || 1) * 5
          })),
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
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

  // 修正版本：堆疊面積圖
  generateStackedAreaChart(data, options) {
    console.log('🔧 生成堆疊面積圖');

    // 自動推斷欄位
    if (!options.xColumn || !options.groupByColumn || !options.valueColumn) {
      const columns = Object.keys(data[0] || {});
      const numericalColumns = columns.filter(col => 
        !isNaN(parseFloat(data[0][col])) && isFinite(data[0][col])
      );
      const categoricalColumns = columns.filter(col => 
        isNaN(parseFloat(data[0][col])) || !isFinite(data[0][col])
      );

      options.xColumn = options.xColumn || categoricalColumns[0] || columns[0];
      options.groupByColumn = options.groupByColumn || categoricalColumns[1] || categoricalColumns[0];
      options.valueColumn = options.valueColumn || numericalColumns[0];
    }

    const { xColumn, groupByColumn, valueColumn } = options;

    // 過濾有效資料
    const validData = data.filter(item => 
      item[xColumn] !== null && 
      item[xColumn] !== undefined && 
      item[groupByColumn] !== null && 
      item[groupByColumn] !== undefined &&
      !isNaN(parseFloat(item[valueColumn]))
    );

    if (validData.length === 0) {
      throw new Error('沒有有效的資料可以繪製堆疊面積圖');
    }

    // 按時間序列組織資料
    const timePoints = [...new Set(validData.map(item => String(item[xColumn])))].sort();
    const series = [...new Set(validData.map(item => String(item[groupByColumn])))].sort();

    const datasets = series.map((seriesName, index) => {
      const seriesData = timePoints.map(timePoint => {
        const items = validData.filter(d => 
          String(d[xColumn]) === timePoint && String(d[groupByColumn]) === seriesName
        );
        const sum = items.reduce((total, item) => total + (parseFloat(item[valueColumn]) || 0), 0);
        return sum;
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

  // 修正版本：階梯線圖
  generateStepLineChart(data, options) {
    const { xColumn, yColumn } = options;
    
    return {
      type: 'line',
      data: {
        labels: data.map(item => item[xColumn]),
        datasets: [{
          label: yColumn || '數值',
          data: data.map(item => parseFloat(item[yColumn]) || 0),
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          stepped: true,  // 這是關鍵設定
          tension: 0,
          fill: false
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

  // 瀑布圖（使用 D3.js 組件）
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
      .slice(0, 15); // 限制最多 15 個項目

    if (cleanData.length === 0) {
      throw new Error('處理後沒有有效的資料項目');
    }

    // 為 D3.js 瀑布圖組件準備資料
    return {
      type: 'waterfall', // 特殊標識符
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
        showValues: true,
        showCumulative: true,
        showGrid: true,
        animation: true
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

  generateBoxPlot(data, options) {
    const { column } = options;
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    
    const columnsToPlot = column ? [column] : numericColumns.slice(0, 5);
    
    if (columnsToPlot.length === 0) {
      throw new Error('箱型圖需要至少一個數值型欄位');
    }
    
    const plotData = columnsToPlot.map(col => {
      const values = data.map(item => parseFloat(item[col])).filter(val => !isNaN(val));
      return {
        y: values,
        type: 'box',
        name: col,
        boxpoints: 'outliers',
        jitter: 0.3,
        pointpos: -1.8
      };
    });
    
    return {
      type: 'plotly',
      data: plotData,
      layout: {
        title: columnsToPlot.length === 1 ? `${columnsToPlot[0]} 箱型圖` : '多變數箱型圖',
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

  // 如果缺少 generateViolinPlot 函數，添加這個：
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
    
    if (values.length < 5) {
      throw new Error('小提琴圖需要至少5個有效數據點');
    }
    
    return {
      type: 'plotly',
      data: [{
        y: values,
        type: 'violin',
        name: targetColumn,
        box: { visible: true },
        meanline: { visible: true },
        points: 'outliers'
      }],
      layout: {
        title: `${targetColumn} 密度分布圖`,
        yaxis: {
          title: targetColumn,
          zeroline: false
        },
        showlegend: false
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  }

  // 如果缺少 generateHeatmap 函數，添加這個：
  generateHeatmap(data, options) {
    const numericColumns = Object.keys(data[0]).filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );
    
    if (numericColumns.length < 2) {
      throw new Error('熱力圖需要至少兩個數值型欄位');
    }
    
    // 計算相關矩陣
    const correlationMatrix = [];
    const labels = numericColumns;
    
    for (let i = 0; i < numericColumns.length; i++) {
      correlationMatrix[i] = [];
      for (let j = 0; j < numericColumns.length; j++) {
        const col1Values = data.map(item => parseFloat(item[numericColumns[i]])).filter(val => !isNaN(val));
        const col2Values = data.map(item => parseFloat(item[numericColumns[j]])).filter(val => !isNaN(val));
        correlationMatrix[i][j] = this.calculateCorrelation(col1Values, col2Values);
      }
    }
    
    return {
      type: 'plotly',
      data: [{
        z: correlationMatrix,
        x: labels,
        y: labels,
        type: 'heatmap',
        colorscale: 'RdBu',
        showscale: true
      }],
      layout: {
        title: '相關性熱力圖',
        xaxis: { title: '變數' },
        yaxis: { title: '變數' }
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  }

  // 計算相關係數的輔助函數
  calculateCorrelation(x, y) {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;
    
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  generateGaugeChart(data, options) {
    const { valueColumn, target, thresholds, unit, title } = options;
    
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
    const targetValue = target || maxValue * 1.2;
    
    return {
      type: 'gauge',
      data: {
        currentValue: currentValue,
        targetValue: targetValue,
        valueColumn: targetColumn,
        // 確保包含前端需要的所有字段
        minValue: 0,
        maxValue: targetValue,
        value: currentValue,  // 有些組件可能期望 'value' 而不是 'currentValue'
        target: targetValue   // 有些組件可能期望 'target' 而不是 'targetValue'
      },
      options: {
        title: title || `${targetColumn} 指標監控`,
        valueColumn: targetColumn,
        minValue: 0,
        maxValue: targetValue,
        thresholds: thresholds || [targetValue * 0.3, targetValue * 0.7],
        unit: unit || ''
      }
    };
  }

  // 如果 generateBulletChart 不存在或有問題，請添加/替換為：
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
    
    // 先聚合數據，避免重複的類別
    const aggregatedData = {};
    
    data.forEach(item => {
      const label = String(item[finalLabelColumn] || '未分類');
      const actualValue = parseFloat(item[finalValueColumn]) || 0;
      const targetValue = parseFloat(item[finalTargetColumn]) || 0;
      
      if (!aggregatedData[label]) {
        aggregatedData[label] = {
          label: label,
          actualSum: 0,
          targetSum: 0,
          count: 0
        };
      }
      
      aggregatedData[label].actualSum += actualValue;
      aggregatedData[label].targetSum += targetValue;
      aggregatedData[label].count += 1;
    });
    
    // 轉換為 metrics 格式，取前5個類別
    const metrics = Object.values(aggregatedData)
      .slice(0, 5)
      .map((item, index) => {
        const actualValue = item.actualSum;
        const targetValue = item.targetSum || actualValue * 1.2; // 如果沒有目標值，設為實際值的120%
        
        // 生成範圍值（差、一般、好）
        const maxValue = Math.max(actualValue, targetValue);
        const ranges = [
          maxValue * 0.6,  // 差
          maxValue * 0.8,  // 一般  
          maxValue * 1.2   // 好
        ];
        
        return {
          title: item.label,
          subtitle: `目標: ${Math.round(targetValue)}`,
          ranges: ranges,
          measures: [actualValue],
          markers: [targetValue],
          actual: actualValue,
          target: targetValue
        };
      });
    
    return {
      type: 'bullet',
      data: { 
        metrics: metrics
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

  // 如果 generateKPICard 不存在或有問題，請添加/替換為：
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
    
    // 生成多個 KPI 指標（如果有多個數值欄位）
    const kpis = numericColumns.slice(0, 4).map((column, index) => {
      const currentVal = data.length > 0 ? (parseFloat(data[0][column]) || 0) : 0;
      const previousVal = data.length > 1 ? (parseFloat(data[1][column]) || 0) : currentVal * 0.9;
      const change = previousVal !== 0 ? ((currentVal - previousVal) / previousVal) * 100 : 0;
      
      return {
        title: column,
        value: currentVal,
        unit: options.unit || '',
        trend: change,
        previousValue: previousVal,
        icon: index === 0 ? 'revenue' : index === 1 ? 'users' : index === 2 ? 'sales' : 'analytics',
        format: options.format || 'number'
      };
    });
    
    return {
      type: 'kpicard',
      data: { 
        kpis: kpis  // 前端期望的格式！
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


  // 如果 generateFunnelChart 不存在或有問題，請添加/替換為：
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

  // 如果 generateSankeyChart 不存在或有問題，請添加/替換為：
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

  // 如果 generateTreemapChart 不存在或有問題，請添加/替換為：
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
    
    // 構建層次結構數據
    let treeData;
    
    if (finalParentColumn && finalParentColumn !== finalLabelColumn) {
      // 有父級欄位：建立兩層結構
      const hierarchy = {};
      
      data.forEach(item => {
        const parent = String(item[finalParentColumn] || '其他');
        const child = String(item[finalLabelColumn] || '未分類');
        const value = parseFloat(item[finalValueColumn]) || 0;
        
        if (!hierarchy[parent]) {
          hierarchy[parent] = {
            name: parent,
            children: {},
            value: 0
          };
        }
        
        if (!hierarchy[parent].children[child]) {
          hierarchy[parent].children[child] = {
            name: child,
            value: 0
          };
        }
        
        hierarchy[parent].children[child].value += value;
        hierarchy[parent].value += value;
      });
      
      // 轉換為樹狀圖需要的格式
      treeData = {
        name: "root",
        children: Object.values(hierarchy).map(parent => ({
          name: parent.name,
          value: parent.value,
          children: Object.values(parent.children)
        }))
      };
    } else {
      // 沒有父級欄位：建立單層結構
      const aggregated = {};
      
      data.forEach(item => {
        const label = String(item[finalLabelColumn] || '未分類');
        const value = parseFloat(item[finalValueColumn]) || 0;
        
        if (!aggregated[label]) {
          aggregated[label] = 0;
        }
        aggregated[label] += value;
      });
      
      treeData = {
        name: "root",
        children: Object.entries(aggregated).map(([name, value]) => ({
          name: name,
          value: value
        }))
      };
    }
    
    return {
      type: 'treemap',
      data: { 
        data: treeData  // 傳遞處理好的層次結構
      },
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


  // 工具方法：聚合資料
  groupData(data, labelColumn, valueColumn) {
    const grouped = {};
    
    data.forEach(item => {
      const label = item[labelColumn];
      const value = parseFloat(item[valueColumn]) || 0;
      
      if (grouped[label]) {
        grouped[label] += value;
      } else {
        grouped[label] = value;
      }
    });
    
    return grouped;
  }

  // 工具方法：驗證圖表選項
  validateChartOptions(chartType, options, data) {
    const requiredFields = {
      'stackedbar': ['xColumn', 'groupByColumn', 'valueColumn'],
      'groupedbar': ['xColumn', 'groupByColumn', 'valueColumn'],
      'mixedchart': ['xColumn', 'barColumn', 'lineColumn'],
      'stackedarea': ['xColumn', 'groupByColumn', 'valueColumn'],
      'bubble': ['xColumn', 'yColumn', 'sizeColumn']
    };

    const required = requiredFields[chartType.toLowerCase()];
    if (!required) return true;

    const missing = required.filter(field => !options[field]);
    if (missing.length > 0) {
      console.warn(`圖表 ${chartType} 缺少必要欄位: ${missing.join(', ')}`);
      // 不拋出錯誤，而是嘗試自動推斷
      return false;
    }

    return true;
  }

  // 工具方法：自動推斷最佳欄位組合
  inferBestColumns(data, chartType) {
    if (!data || data.length === 0) return {};

    const columns = Object.keys(data[0]);
    const sampleRow = data[0];

    // 分類數值型和分類型欄位
    const numericalColumns = columns.filter(col => {
      const value = sampleRow[col];
      return !isNaN(parseFloat(value)) && isFinite(value);
    });

    const categoricalColumns = columns.filter(col => {
      const value = sampleRow[col];
      return isNaN(parseFloat(value)) || !isFinite(value);
    });

    // 根據圖表類型推斷最佳組合
    switch (chartType.toLowerCase()) {
      case 'stackedbar':
      case 'groupedbar':
        return {
          xColumn: categoricalColumns[0],
          groupByColumn: categoricalColumns[1] || categoricalColumns[0],
          valueColumn: numericalColumns[0]
        };

      case 'mixedchart':
        return {
          xColumn: categoricalColumns[0] || columns[0],
          barColumn: numericalColumns[0],
          lineColumn: numericalColumns[1] || numericalColumns[0]
        };

      case 'bubble':
        return {
          xColumn: numericalColumns[0],
          yColumn: numericalColumns[1] || numericalColumns[0],
          sizeColumn: numericalColumns[2] || numericalColumns[0]
        };

      default:
        return {
          xColumn: categoricalColumns[0] || columns[0],
          yColumn: numericalColumns[0] || columns[1]
        };
    }
  }

  // ⭐ 重新設計：根據統計學原理的圖表參數推薦
  recommendChartParameters(data, chartType, dataAnalysis) {
    console.log('🔧 推薦圖表參數:', { chartType, dataAnalysis });

    if (!dataAnalysis || !dataAnalysis.columns) {
      // 如果沒有 dataAnalysis，從資料中分析
      return this.inferBestColumns(data, chartType);
    }

    const { columns, types } = dataAnalysis;
    const numericalColumns = columns.filter(col => types[col] === 'numerical');
    const categoricalColumns = columns.filter(col => types[col] === 'categorical');
    const temporalColumns = columns.filter(col => types[col] === 'temporal');

    console.log('🔧 欄位分析:', { numericalColumns, categoricalColumns, temporalColumns });

    // 根據統計學原理為每種圖表類型設計不同的邏輯
    switch (chartType.toLowerCase()) {
      
      // === 基礎長條圖：分類變數 vs 數值變數 ===
      case 'bar':
        return {
          xColumn: categoricalColumns[0] || columns[0], // X軸：分類變數
          yColumn: numericalColumns[0] || columns[1],   // Y軸：數值變數
          title: `${categoricalColumns[0] || '類別'} 的 ${numericalColumns[0] || '數值'} 比較`
        };

      // === 水平長條圖：數值變數 vs 分類變數 (軸對調) ===
      case 'horizontalbar':
        return {
          xColumn: numericalColumns[0] || columns[1],   // X軸：數值變數 (水平方向)
          yColumn: categoricalColumns[0] || columns[0], // Y軸：分類變數 (垂直方向)
          title: `${categoricalColumns[0] || '類別'} 的 ${numericalColumns[0] || '數值'} 水平比較`
        };

      // === 線圖：時間序列或順序變數 vs 數值變數 ===
      case 'line':
        return {
          xColumn: temporalColumns[0] || categoricalColumns[0] || columns[0], // X軸：時間或順序變數
          yColumn: numericalColumns[0] || columns[1],                         // Y軸：數值變數
          title: `${numericalColumns[0] || '數值'} 隨時間變化趨勢`
        };

      // === 面積圖：同線圖，但強調累積效果 ===
      case 'area':
        return {
          xColumn: temporalColumns[0] || categoricalColumns[0] || columns[0],
          yColumn: numericalColumns[0] || columns[1],
          title: `${numericalColumns[0] || '數值'} 面積趨勢圖`
        };

      // === 散佈圖：兩個數值變數的相關性 ===
      case 'scatter':
        return {
          xColumn: numericalColumns[0] || columns[0],  // X軸：第一個數值變數
          yColumn: numericalColumns[1] || numericalColumns[0] || columns[1], // Y軸：第二個數值變數
          title: `${numericalColumns[0] || 'X變數'} vs ${numericalColumns[1] || 'Y變數'} 關係圖`
        };

      // === 氣泡圖：三個數值變數 (X, Y, 大小) ===
      case 'bubble':
        return {
          xColumn: numericalColumns[0] || columns[0],      // X軸：第一個數值變數
          yColumn: numericalColumns[1] || numericalColumns[0] || columns[1], // Y軸：第二個數值變數
          sizeColumn: numericalColumns[2] || numericalColumns[0] || columns[2], // 氣泡大小：第三個數值變數
          title: `三維關係圖：${numericalColumns[0] || 'X'} vs ${numericalColumns[1] || 'Y'} (大小: ${numericalColumns[2] || '數值'})`
        };

      // === 圓餅圖：分類變數的組成比例 ===
      case 'pie':
      case 'doughnut':
        return {
          labelColumn: categoricalColumns[0] || columns[0], // 標籤：分類變數
          valueColumn: numericalColumns[0] || columns[1],   // 數值：要比較的數量
          title: `${categoricalColumns[0] || '類別'} 組成比例圖`
        };

      // === 極坐標圖：適合循環數據或角度數據 ===
      case 'polararea':
        return {
          labelColumn: categoricalColumns[0] || columns[0],
          valueColumn: numericalColumns[0] || columns[1],
          title: `${categoricalColumns[0] || '類別'} 極坐標分布圖`
        };

      // === 雷達圖：多維度比較 ===
      case 'radar':
        return {
          labelColumn: categoricalColumns[0] || columns[0], // 各個維度
          valueColumn: numericalColumns[0] || columns[1],   // 各維度的數值
          title: `${categoricalColumns[0] || '指標'} 雷達分析圖`
        };

      // === 堆疊長條圖：分類變數 + 子分類 vs 數值變數 ===
      case 'stackedbar':
        return {
          xColumn: categoricalColumns[0] || temporalColumns[0] || columns[0],     // X軸：主分類
          groupByColumn: categoricalColumns[1] || categoricalColumns[0] || columns[1], // 子分類：堆疊依據
          valueColumn: numericalColumns[0] || columns[2],                         // Y軸：數值
          title: `${categoricalColumns[0] || '主類別'} 的 ${numericalColumns[0] || '數值'} 堆疊分析 (按 ${categoricalColumns[1] || '子類別'} 分組)`
        };

      // === 分組長條圖：同堆疊圖，但並排比較 ===
      case 'groupedbar':
        return {
          xColumn: categoricalColumns[0] || temporalColumns[0] || columns[0],
          groupByColumn: categoricalColumns[1] || categoricalColumns[0] || columns[1],
          valueColumn: numericalColumns[0] || columns[2],
          title: `${categoricalColumns[0] || '主類別'} 的 ${numericalColumns[0] || '數值'} 分組比較 (按 ${categoricalColumns[1] || '子類別'} 分組)`
        };

      // === 堆疊面積圖：時間序列 + 分類組成 ===
      case 'stackedarea':
        return {
          xColumn: temporalColumns[0] || categoricalColumns[0] || columns[0],     // X軸：時間軸
          groupByColumn: categoricalColumns[0] || categoricalColumns[1] || columns[1], // 分組：不同系列
          valueColumn: numericalColumns[0] || columns[2],                         // Y軸：數值
          title: `${numericalColumns[0] || '數值'} 隨時間的堆疊變化 (按 ${categoricalColumns[0] || '類別'} 分組)`
        };

      // === 階梯線圖：適合離散變化的時間序列 ===
      case 'stepline':
        return {
          xColumn: temporalColumns[0] || categoricalColumns[0] || columns[0],
          yColumn: numericalColumns[0] || columns[1],
          title: `${numericalColumns[0] || '數值'} 階梯變化圖`
        };

      // === 混合圖表：雙軸比較不同量級的數值 ===
      case 'mixedchart':
        return {
          xColumn: temporalColumns[0] || categoricalColumns[0] || columns[0],     // X軸：時間或分類
          barColumn: numericalColumns[0] || columns[1],                           // 左軸(柱狀)：第一數值
          lineColumn: numericalColumns[1] || numericalColumns[0] || columns[2],   // 右軸(線條)：第二數值
          title: `${numericalColumns[0] || '數值1'} 與 ${numericalColumns[1] || '數值2'} 混合分析`
        };

      // === 直方圖：單一數值變數的分布 ===
      case 'histogram':
        return {
          column: numericalColumns[0] || columns[0], // 要分析分布的數值變數
          bins: 20,
          title: `${numericalColumns[0] || '數值'} 分布直方圖`
        };

      // === 箱型圖：數值變數的統計摘要 ===
      case 'boxplot':
        return {
          column: numericalColumns[0] || columns[0],           // 要分析的數值變數
          groupBy: categoricalColumns[0] || null,              // 可選：按分類分組
          title: `${numericalColumns[0] || '數值'} 箱型圖${categoricalColumns[0] ? ` (按 ${categoricalColumns[0]} 分組)` : ''}`
        };

      // === 小提琴圖：同箱型圖，但顯示分布形狀 ===
      case 'violin':
        return {
          column: numericalColumns[0] || columns[0],
          groupBy: categoricalColumns[0] || null,
          title: `${numericalColumns[0] || '數值'} 小提琴圖${categoricalColumns[0] ? ` (按 ${categoricalColumns[0]} 分組)` : ''}`
        };

      // === 熱力圖：兩個分類變數 vs 一個數值變數 ===
      case 'heatmap':
        return {
          xColumn: categoricalColumns[0] || columns[0],        // X軸：第一分類變數
          yColumn: categoricalColumns[1] || categoricalColumns[0] || columns[1], // Y軸：第二分類變數
          valueColumn: numericalColumns[0] || columns[2],      // 顏色：數值變數
          title: `${categoricalColumns[0] || 'X類別'} vs ${categoricalColumns[1] || 'Y類別'} 熱力圖`
        };

      // === 瀑布圖：累積變化過程 ===
      case 'waterfall':
        return {
          labelColumn: categoricalColumns[0] || columns[0],    // 各個階段
          valueColumn: numericalColumns[0] || columns[1],      // 各階段的變化量
          title: `${categoricalColumns[0] || '階段'} 瀑布變化圖`
        };

      // === 漏斗圖：轉換流程分析 ===
      case 'funnel':
        return {
          labelColumn: categoricalColumns[0] || columns[0],    // 各個階段
          valueColumn: numericalColumns[0] || columns[1],      // 各階段的數量
          title: `${categoricalColumns[0] || '階段'} 轉換漏斗圖`
        };

      // === 商業智慧圖表 ===
      
      // 儀表板圖：單一KPI監控
      case 'gauge':
        return {
          valueColumn: numericalColumns[0] || columns[0],
          title: `${numericalColumns[0] || '指標'} 儀表板監控`,
          thresholds: [30, 70],
          unit: '',
          target: data && data.length > 0 ? 
            Math.max(...data.map(item => parseFloat(item[numericalColumns[0]]) || 0)) * 1.2 : 100
        };

      // 子彈圖：實際值 vs 目標值
      case 'bullet':
        return {
          labelColumn: categoricalColumns[0] || columns[0],
          valueColumn: numericalColumns[0] || columns[1],      // 實際值
          targetColumn: numericalColumns[1] || numericalColumns[0] || columns[2], // 目標值
          title: `${categoricalColumns[0] || '項目'} 目標達成分析`
        };

      // KPI卡片：關鍵指標展示
      case 'kpicard':
        return {
          kpiColumn: numericalColumns[0] || columns[0],
          title: `${numericalColumns[0] || '指標'} KPI`,
          format: 'number',
          showTrend: true,
          unit: ''
        };

      // 桑基圖：流向分析
      case 'sankey':
        return {
          sourceColumn: categoricalColumns[0] || columns[0],   // 來源
          targetColumn: categoricalColumns[1] || columns[1],   // 目標
          valueColumn: numericalColumns[0] || columns[2],      // 流量
          title: `${categoricalColumns[0] || '來源'} → ${categoricalColumns[1] || '目標'} 流向分析`
        };

      // 樹狀圖：層級結構
      case 'treemap':
        return {
          labelColumn: categoricalColumns[0] || columns[0],
          valueColumn: numericalColumns[0] || columns[1],
          groupByColumn: categoricalColumns[1] || categoricalColumns[0],
          title: `${categoricalColumns[0] || '類別'} 樹狀圖分析`
        };

      // === 預設情況 ===
      default:
        return {
          xColumn: categoricalColumns[0] || temporalColumns[0] || columns[0],
          yColumn: numericalColumns[0] || columns[1],
          title: `${columns[0] || 'X軸'} vs ${columns[1] || 'Y軸'} 圖表`
        };
    }
  }
}

module.exports = new ChartService();