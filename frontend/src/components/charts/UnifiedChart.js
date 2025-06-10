import React, { useMemo, useRef, useEffect, useState, Suspense } from 'react';
import Plot from 'react-plotly.js';

// 導入基礎圖表組件
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  ScatterChart
} from './basic';

// 導入資料處理器
import { getProcessor, validateData, detectDataFormat } from './processors/chartDataProcessors';

// 導入配置
import { CHART_CONFIGS } from './chartConfigs';
import { pluginManager } from './chartPlugins';
import { CHARTJS_DEFAULTS, DEFAULT_COLORS, PLOTLY_CONFIG } from '../../utils/chartConfig';

// 動態導入的進階圖表
const NetworkChart = React.lazy(() => import('./d3/NetworkChart'));
const WaterfallChart = React.lazy(() => import('./basic/WaterfallChart'));

// Chart.js 組件映射（更新）
const CHARTJS_COMPONENTS = {
  line: LineChart,
  spline: LineChart,
  area: AreaChart,
  stackedArea: AreaChart,
  stepped: LineChart,
  multiAxis: LineChart,
  sparkline: LineChart,
  timeSeries: LineChart,
  
  bar: BarChart,
  horizontalBar: BarChart,
  stackedBar: BarChart,
  groupedBar: BarChart,
  
  pie: PieChart,
  doughnut: PieChart,
  
  scatter: ScatterChart,
  bubble: ScatterChart,
  
  // 待實作的組件
  radar: React.lazy(() => import('./basic/RadarChart')),
  polarArea: React.lazy(() => import('./basic/PolarAreaChart'))
};

const UnifiedChart = ({ 
  type, 
  data, 
  options = {}, 
  plugins = [], 
  onError,
  onDataChange,
  interactive = true,
  theme = 'default'
}) => {
  const chartRef = useRef();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedData, setProcessedData] = useState(null);

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
  const { finalData, finalOptions } = useMemo(() => {
    try {
      setError(null);
      
      // 自動偵測資料格式
      const detectedFormat = detectDataFormat(data);
      console.log(`檢測到資料格式: ${detectedFormat}`);
      
      // 獲取並應用資料處理器
      const processorName = chartConfig.processor;
      if (processorName) {
        const processor = getProcessor(processorName);
        const processed = processor(data, { ...chartConfig.options, ...options });
        
        // 觸發資料變更事件
        if (onDataChange) {
          onDataChange(processed);
        }
        
        return {
          finalData: processed,
          finalOptions: { 
            ...chartConfig.options, 
            ...options,
            theme: theme
          }
        };
      }
      
      // 如果沒有指定處理器，直接使用原始資料
      return {
        finalData: data,
        finalOptions: { 
          ...chartConfig.options, 
          ...options,
          theme: theme
        }
      };
      
    } catch (err) {
      console.error('資料處理錯誤:', err);
      setError(err.message);
      if (onError) onError(err);
      
      return {
        finalData: null,
        finalOptions: options
      };
    }
  }, [type, data, options, chartConfig, theme, onDataChange, onError]);

  // 設置載入狀態
  useEffect(() => {
    if (chartConfig.loadOnDemand) {
      setIsLoading(true);
      // 模擬載入延遲
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [chartConfig.loadOnDemand]);

  // Plotly 配置生成
  const getPlotlyConfig = useMemo(() => {
    if (chartConfig.library !== 'plotly' || !finalData) return null;

    const baseLayout = {
      title: finalOptions.title || chartConfig.name,
      font: { family: 'Arial, sans-serif' },
      showlegend: finalOptions.showLegend !== false,
      margin: { l: 50, r: 50, t: 50, b: 50 },
      ...finalOptions.layout
    };

    // 基本 Plotly 圖表配置
    const plotlyConfigs = {
      scatter: {
        data: [{
          x: finalData.x || [],
          y: finalData.y || [],
          mode: 'markers',
          type: 'scatter',
          marker: {
            size: finalOptions.pointSize || 8,
            color: finalOptions.color || DEFAULT_COLORS[0]
          }
        }],
        layout: {
          ...baseLayout,
          xaxis: { title: finalOptions.xAxisTitle || 'X軸' },
          yaxis: { title: finalOptions.yAxisTitle || 'Y軸' }
        }
      },

      heatmap: {
        data: [{
          z: finalData.z || [],
          x: finalData.x || [],
          y: finalData.y || [],
          type: 'heatmap',
          colorscale: finalOptions.colorscale || 'Viridis'
        }],
        layout: {
          ...baseLayout,
          xaxis: { title: finalOptions.xAxisTitle || 'X軸' },
          yaxis: { title: finalOptions.yAxisTitle || 'Y軸' }
        }
      },

      box: {
        data: [{
          y: finalData.y || finalData,
          type: 'box',
          name: finalOptions.label || '箱型圖'
        }],
        layout: {
          ...baseLayout,
          yaxis: { title: finalOptions.yAxisTitle || 'Y軸' }
        }
      },

      violin: {
        data: [{
          y: finalData.y || finalData,
          type: 'violin',
          name: finalOptions.label || '小提琴圖'
        }],
        layout: {
          ...baseLayout,
          yaxis: { title: finalOptions.yAxisTitle || 'Y軸' }
        }
      },

      histogram: {
        data: [{
          x: finalData.x || finalData,
          type: 'histogram',
          nbinsx: finalOptions.bins || 20
        }],
        layout: {
          ...baseLayout,
          xaxis: { title: finalOptions.xAxisTitle || 'X軸' },
          yaxis: { title: finalOptions.yAxisTitle || '頻率' }
        }
      }
    };

    return plotlyConfigs[type] || { data: [], layout: baseLayout };
  }, [type, finalData, finalOptions, chartConfig.library]);

  // 錯誤處理
  if (error) {
    return (
      <div className="chart-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <div className="error-message">圖表載入失敗</div>
          <div className="error-detail">{error}</div>
          <button 
            onClick={() => {
              setError(null);
              // 重試邏輯
            }}
            className="retry-button"
          >
            重新嘗試
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

    // Chart.js 圖表
    if (library === 'chartjs') {
      const ChartComponent = CHARTJS_COMPONENTS[type];
      if (!ChartComponent) {
        return <div className="chart-error">不支援的 Chart.js 圖表類型: {type}</div>;
      }

      // 如果是動態載入的組件，使用 Suspense
      if (chartConfig.loadOnDemand) {
        return (
          <Suspense fallback={<div className="chart-loading">載入圖表組件中...</div>}>
            <ChartComponent 
              ref={chartRef}
              data={finalData} 
              options={finalOptions}
            />
          </Suspense>
        );
      }

      return (
        <ChartComponent 
          ref={chartRef}
          data={finalData} 
          options={finalOptions}
        />
      );
    }

    // Plotly 圖表
    if (library === 'plotly') {
      const { data: plotlyData, layout } = getPlotlyConfig || { data: [], layout: {} };
      
      return (
        <Plot
          data={plotlyData}
          layout={layout}
          config={{
            ...PLOTLY_CONFIG,
            ...finalOptions.plotlyConfig,
            responsive: true,
            displayModeBar: interactive
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      );
    }

    // D3 客製化圖表
    if (library === 'd3' || library === 'custom') {
      return (
        <Suspense fallback={<div className="chart-loading">載入客製圖表中...</div>}>
          {type === 'network' && (
            <NetworkChart data={finalData} options={finalOptions} />
          )}
          {type === 'waterfall' && (
            <WaterfallChart data={finalData} options={finalOptions} />
          )}
          {/* 這裡可以添加更多 D3 圖表 */}
        </Suspense>
      );
    }

    return <div className="chart-error">不支援的圖表庫: {library}</div>;
  };

  // 應用插件的渲染後處理
  useEffect(() => {
    if (chartRef.current && plugins.length > 0) {
      pluginManager.afterRender(chartRef.current, plugins);
    }
  }, [plugins]);

  // 設置處理過的資料狀態
  useEffect(() => {
    setProcessedData(finalData);
  }, [finalData]);

  return (
    <div 
      className={`unified-chart ${type}-chart ${chartConfig.library}-chart theme-${theme}`}
      data-chart-type={type}
      data-chart-library={chartConfig.library}
      data-chart-category={chartConfig.category}
    >
      {renderChart()}
      
      {/* 開發模式下顯示圖表資訊 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="chart-debug-info">
          <small>
            類型: {type} | 庫: {chartConfig.library} | 難度: {chartConfig.difficulty}/5
          </small>
        </div>
      )}
    </div>
  );
};

export default UnifiedChart;