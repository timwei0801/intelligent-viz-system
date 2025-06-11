import React from 'react';
import Plot from 'react-plotly.js';

const PlotlyChart = ({ data, layout = {}, options = {} }) => {
  // 預設配置
  const defaultConfig = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: [
      'pan2d', 
      'lasso2d', 
      'select2d', 
      'autoScale2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian'
    ],
    displaylogo: false,
    toImageButtonOptions: {
      format: 'png',
      filename: 'chart',
      height: 500,
      width: 700,
      scale: 1
    }
  };

  // 預設佈局
  const defaultLayout = {
    autosize: true,
    margin: { l: 60, r: 50, t: 80, b: 60 },
    font: { 
      family: 'Arial, sans-serif',
      size: 12 
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0,
      y: -0.2
    },
    ...layout
  };

  // 合併配置
  const finalConfig = { ...defaultConfig, ...options.plotlyConfig };

  // 錯誤處理
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        color: '#666'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <div>無資料可顯示</div>
        </div>
      </div>
    );
  }

  return (
    <Plot
      data={data}
      layout={defaultLayout}
      config={finalConfig}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
    />
  );
};

export default PlotlyChart;