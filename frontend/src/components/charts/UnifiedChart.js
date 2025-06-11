import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  Line,
  Bar,
  Pie,
  Doughnut,
  Scatter,
  Bubble,
  Radar,
  PolarArea
} from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import { CHART_CONFIGS } from './chartConfigs';
import { getProcessor, validateData, detectDataFormat } from './chartProcessors';
import { pluginManager } from './chartPlugins';
import { CHARTJS_DEFAULTS, DEFAULT_COLORS, PLOTLY_CONFIG } from '../../utils/chartConfig';

// 動態導入的特殊圖表
const NetworkChart = React.lazy(() => import('./d3/NetworkChart'));
const WaterfallChart = React.lazy(() => import('./basic/WaterfallChart'));

// 註冊所有 Chart.js 組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart.js 組件映射
const CHARTJS_COMPONENTS = {
  line: Line,
  bar: Bar,
  pie: Pie,
  doughnut: Doughnut,
  scatter: Scatter,
  bubble: Bubble,
  radar: Radar,
  polarArea: PolarArea
};

const UnifiedChart = ({ type, data, options = {}, plugins = [], onError }) => {
  const chartRef = useRef();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 獲取圖表配置
  const chartConfig = useMemo(() => {
    const allConfigs = {
      ...CHART_CONFIGS.basic,
      ...CHART_CONFIGS.plotly,
      ...CHART_CONFIGS.d3
    };
    return allConfigs[type];
  }, [type]);

  // 驗證圖表類型
  if (!chartConfig) {
    const availableTypes = Object.keys({
      ...CHART_CONFIGS.basic,
      ...CHART_CONFIGS.plotly,
      ...CHART_CONFIGS.d3
    }).join(', ');
    
    const errorMsg = `不支援的圖表類型: ${type}。可用類型: ${availableTypes}`;
    if (onError) onError(new Error(errorMsg));
    return <div className="chart-error">{errorMsg}</div>;
  }

  // 處理數據和選項
  const { processedData, processedOptions } = useMemo(() => {
    try {
      // 驗證數據
      validateData(data, chartConfig.dataFormat);

      // 獲取處理器
      const processor = getProcessor(chartConfig.processor);
      
      // 合併選項
      const mergedOptions = {
        ...chartConfig.options,
        ...options
      };

      // 應用插件處理數據
      const pluginProcessedData = pluginManager.processData(data, mergedOptions, plugins);
      
      // 處理數據
      const processed = processor(pluginProcessedData, mergedOptions);
      
      // 應用插件處理選項
      const finalOptions = pluginManager.processOptions(mergedOptions, plugins);

      return {
        processedData: processed,
        processedOptions: finalOptions
      };
    } catch (err) {
      setError(err.message);
      if (onError) onError(err);
      return { processedData: null, processedOptions: null };
    }
  }, [data, options, chartConfig, plugins, onError]);

  // 獲取 Chart.js 選項
  const getChartJSOptions = useMemo(() => {
    if (chartConfig.library !== 'chartjs') return {};

    const baseOptions = {
      ...CHARTJS_DEFAULTS,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: !!processedOptions.title,
          text: processedOptions.title,
          font: { size: 18, weight: 'bold' }
        },
        legend: {
          display: processedOptions.showLegend !== false,
          position: processedOptions.legendPosition || 'top'
        },
        tooltip: {
          enabled: processedOptions.showTooltip !== false
        }
      }
    };

    // 特定圖表類型的配置
    const typeSpecificOptions = getTypeSpecificOptions(type, processedOptions);

    return {
      ...baseOptions,
      ...typeSpecificOptions,
      ...processedOptions.chartOptions
    };
  }, [type, processedOptions, chartConfig.library]);

  // 獲取特定類型的配置選項
  const getTypeSpecificOptions = (chartType, options) => {
    const configs = {
      // 甜甜圈圖
      doughnut: {
        cutout: options.cutout || '50%',
        radius: options.radius || '90%'
      },

      // 半圓餅圖
      halfPie: {
        cutout: options.cutout || 0,
        circumference: Math.PI,
        rotation: Math.PI
      },

      // 水平長條圖
      horizontalBar: {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: !!options.xAxisTitle,
              text: options.xAxisTitle || 'X軸'
            }
          },
          y: {
            title: {
              display: !!options.yAxisTitle,
              text: options.yAxisTitle || 'Y軸'
            }
          }
        }
      },

      // 堆疊圖表
      stackedBar: {
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        }
      },

      stackedArea: {
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        },
        elements: {
          line: { fill: true }
        }
      },

      // 散佈圖和氣泡圖
      scatter: {
        scales: {
          x: { 
            type: 'linear', 
            position: 'bottom',
            title: {
              display: !!options.xAxisTitle,
              text: options.xAxisTitle || 'X軸'
            }
          },
          y: { 
            type: 'linear',
            title: {
              display: !!options.yAxisTitle,
              text: options.yAxisTitle || 'Y軸'
            }
          }
        }
      },

      bubble: {
        scales: {
          x: { 
            type: 'linear', 
            position: 'bottom',
            title: {
              display: !!options.xAxisTitle,
              text: options.xAxisTitle || 'X軸'
            }
          },
          y: { 
            type: 'linear',
            title: {
              display: !!options.yAxisTitle,
              text: options.yAxisTitle || 'Y軸'
            }
          }
        }
      },

      // 雷達圖 - 修正版
      radar: {
        scales: {
          r: {
            beginAtZero: true,
            max: options.maxValue || undefined,
            min: options.minValue || 0,
            ticks: {
              stepSize: options.stepSize || undefined,
              display: true
            },
            pointLabels: {
              display: true,
              font: { size: 12 }
            },
            grid: {
              display: true
            },
            angleLines: {
              display: true
            }
          }
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6
          },
          line: {
            borderWidth: 2
          }
        }
      },

      // 階梯線圖
      stepped: {
        elements: {
          line: {
            stepped: true,
            tension: 0
          }
        }
      },

      // 面積圖
      area: {
        elements: {
          line: {
            fill: true
          }
        }
      }
    };

    return configs[chartType] || {};
  };

  // 獲取 Plotly 數據和佈局 - 修正版
  const getPlotlyConfig = useMemo(() => {
    if (chartConfig.library !== 'plotly') return { data: [], layout: {} };

    const baseLayout = {
      title: {
        text: processedOptions.title,
        font: { size: 18 }
      },
      showlegend: processedOptions.showLegend !== false,
      margin: { l: 60, r: 30, t: 60, b: 60 },
      paper_bgcolor: 'white',
      plot_bgcolor: 'white'
    };

    // 特定圖表類型的 Plotly 配置 - 修正版
    const plotlyConfigs = {
      // 熱力圖 - 修正版
      heatmap: {
        data: (() => {
          // 如果已經是正確格式
          if (processedData && Array.isArray(processedData) && processedData[0] && processedData[0].type === 'heatmap') {
            return processedData;
          }
          
          // 如果是原始數據，需要轉換
          if (Array.isArray(processedData) && processedData.length > 0) {
            // 假設是表格形式的數據
            const firstRow = processedData[0];
            const numericColumns = Object.keys(firstRow).filter(key => 
              typeof firstRow[key] === 'number' || !isNaN(parseFloat(firstRow[key]))
            );
            
            if (numericColumns.length >= 2) {
              // 創建相關性矩陣
              const matrix = [];
              const labels = numericColumns;
              
              for (let i = 0; i < numericColumns.length; i++) {
                const row = [];
                for (let j = 0; j < numericColumns.length; j++) {
                  if (i === j) {
                    row.push(1); // 對角線為1
                  } else {
                    // 計算相關性
                    const xValues = processedData.map(d => parseFloat(d[numericColumns[i]]));
                    const yValues = processedData.map(d => parseFloat(d[numericColumns[j]]));
                    const correlation = calculateCorrelation(xValues, yValues);
                    row.push(correlation);
                  }
                }
                matrix.push(row);
              }
              
              return [{
                z: matrix,
                x: labels,
                y: labels,
                type: 'heatmap',
                colorscale: processedOptions.colorscale || 'RdBu',
                showscale: processedOptions.showColorScale !== false,
                hoverongaps: false
              }];
            }
          }
          
          // 預設空數據
          return [{
            z: [[1, 0.5], [0.5, 1]],
            x: ['項目1', '項目2'],
            y: ['項目1', '項目2'],
            type: 'heatmap',
            colorscale: 'RdBu'
          }];
        })(),
        layout: {
          ...baseLayout,
          xaxis: { title: processedOptions.xAxisTitle || 'X軸' },
          yaxis: { title: processedOptions.yAxisTitle || 'Y軸' }
        }
      },

      // 3D散佈圖
      scatter3d: {
        data: [{
          x: Array.isArray(processedData) ? processedData.map(item => item.x || Math.random() * 10) : [1, 2, 3],
          y: Array.isArray(processedData) ? processedData.map(item => item.y || Math.random() * 10) : [1, 2, 3],
          z: Array.isArray(processedData) ? processedData.map(item => item.z || Math.random() * 10) : [1, 2, 3],
          mode: 'markers',
          type: 'scatter3d',
          marker: {
            size: 5,
            color: DEFAULT_COLORS[0],
            opacity: 0.8
          }
        }],
        layout: {
          ...baseLayout,
          scene: {
            xaxis: { title: processedOptions.xAxisTitle || 'X軸' },
            yaxis: { title: processedOptions.yAxisTitle || 'Y軸' },
            zaxis: { title: processedOptions.zAxisTitle || 'Z軸' }
          }
        }
      },

      // 3D表面圖
      surface3d: {
        data: [{
          z: processedData.z || [[1, 2], [3, 4]],
          type: 'surface',
          colorscale: processedOptions.colorscale || 'Viridis'
        }],
        layout: {
          ...baseLayout,
          scene: {
            xaxis: { title: processedOptions.xAxisTitle || 'X軸' },
            yaxis: { title: processedOptions.yAxisTitle || 'Y軸' },
            zaxis: { title: processedOptions.zAxisTitle || 'Z軸' }
          }
        }
      },

      // 等高線圖
      contour: {
        data: [{
          z: processedData.z || [[1, 2], [3, 4]],
          x: processedData.x || [0, 1],
          y: processedData.y || [0, 1],
          type: 'contour',
          colorscale: processedOptions.colorscale || 'Viridis'
        }],
        layout: {
          ...baseLayout,
          xaxis: { title: processedOptions.xAxisTitle || 'X軸' },
          yaxis: { title: processedOptions.yAxisTitle || 'Y軸' }
        }
      },

      // 箱型圖 - 修正版
      boxplot: {
        data: [{
          y: Array.isArray(processedData) ? 
             processedData.map(item => typeof item === 'number' ? item : item.value || Math.random() * 100) :
             [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          type: 'box',
          name: processedOptions.label || '箱型圖',
          boxpoints: 'outliers',
          jitter: 0.3,
          pointpos: -1.8
        }],
        layout: {
          ...baseLayout,
          yaxis: { title: processedOptions.yAxisTitle || 'Y軸' }
        }
      },

      // 小提琴圖 - 修正版
      violin: {
        data: [{
          y: Array.isArray(processedData) ? 
             processedData.map(item => typeof item === 'number' ? item : item.value || Math.random() * 100) :
             Array.from({length: 50}, () => Math.random() * 100),
          type: 'violin',
          name: processedOptions.label || '小提琴圖',
          box: { visible: true },
          meanline: { visible: true },
          points: 'outliers'
        }],
        layout: {
          ...baseLayout,
          yaxis: { title: processedOptions.yAxisTitle || 'Y軸' }
        }
      },

      // 直方圖
      histogram: {
        data: [{
          x: Array.isArray(processedData) ? 
             processedData.map(item => typeof item === 'number' ? item : item.value || Math.random() * 100) :
             Array.from({length: 100}, () => Math.random() * 100),
          type: 'histogram',
          nbinsx: processedOptions.bins || 20,
          opacity: 0.7
        }],
        layout: {
          ...baseLayout,
          xaxis: { title: processedOptions.xAxisTitle || 'X軸' },
          yaxis: { title: processedOptions.yAxisTitle || '頻率' }
        }
      }
    };

    return plotlyConfigs[type] || { data: [], layout: baseLayout };
  }, [type, processedData, processedOptions, chartConfig.library]);

  // 計算相關係數的輔助函數
  const calculateCorrelation = (x, y) => {
    const n = x.length;
    if (n !== y.length || n === 0) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  // 錯誤處理
  if (error) {
    return (
      <div className="chart-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <div className="error-message">圖表載入失敗</div>
          <div className="error-details">{error}</div>
          <button 
            className="retry-btn" 
            onClick={() => setError(null)}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重試
          </button>
        </div>
      </div>
    );
  }

  // 載入狀態
  if (isLoading) {
    return (
      <div className="chart-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">載入 {chartConfig.name} 中...</div>
      </div>
    );
  }

  // 渲染不同類型的圖表
  const renderChart = () => {
    const { library } = chartConfig;

    try {
      // Chart.js 圖表
      if (library === 'chartjs') {
        const ChartComponent = CHARTJS_COMPONENTS[chartConfig.type];
        if (!ChartComponent) {
          return <div className="chart-error">不支援的 Chart.js 圖表類型: {chartConfig.type}</div>;
        }

        // 確保數據存在
        if (!processedData) {
          return <div className="chart-error">無法處理圖表數據</div>;
        }

        return (
          <ChartComponent 
            ref={chartRef}
            data={processedData} 
            options={getChartJSOptions} 
          />
        );
      }

      // Plotly 圖表
      if (library === 'plotly') {
        const { data: plotlyData, layout } = getPlotlyConfig;
        
        return (
          <Plot
            data={plotlyData}
            layout={layout}
            config={{
              ...PLOTLY_CONFIG,
              ...processedOptions.plotlyConfig
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        );
      }

      // D3 客製化圖表
      if (library === 'd3' || library === 'custom') {
        if (chartConfig.loadOnDemand) {
          // 動態載入的圖表
          return (
            <React.Suspense fallback={<div className="chart-loading">載入客製圖表中...</div>}>
              {type === 'network' && (
                <NetworkChart data={processedData} options={processedOptions} />
              )}
              {/* 這裡可以添加更多動態載入的圖表 */}
            </React.Suspense>
          );
        }

        // 內建的客製圖表
        if (type === 'waterfall') {
          return (
            <React.Suspense fallback={<div className="chart-loading">載入瀑布圖中...</div>}>
              <WaterfallChart data={processedData} options={processedOptions} />
            </React.Suspense>
          );
        }
      }

      return <div className="chart-error">不支援的圖表庫: {library}</div>;
    } catch (renderError) {
      console.error('圖表渲染錯誤:', renderError);
      return (
        <div className="chart-error">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <div className="error-message">圖表渲染失敗</div>
            <div className="error-details">{renderError.message}</div>
          </div>
        </div>
      );
    }
  };

  // 應用插件的渲染後處理
  useEffect(() => {
    if (chartRef.current) {
      pluginManager.afterRender(chartRef.current, plugins);
    }
  }, [plugins]);

  return (
    <div className={`unified-chart ${type}-chart ${chartConfig.library}-chart`}>
      {renderChart()}
    </div>
  );
};

export default UnifiedChart;