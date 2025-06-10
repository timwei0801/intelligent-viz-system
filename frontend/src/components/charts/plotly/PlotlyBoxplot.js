import React from 'react';
import Plot from 'react-plotly.js';

const PlotlyBoxplot = ({ data, options = {} }) => {
  // 處理資料格式
  const processBoxplotData = () => {
    // 如果有 datasets
    if (data.datasets) {
      return data.datasets.map((dataset, index) => ({
        y: dataset.data,
        type: 'box',
        name: dataset.label || `數據${index + 1}`,
        boxpoints: 'outliers',
        marker: {
          color: dataset.backgroundColor || `hsl(${index * 60}, 70%, 50%)`
        }
      }));
    }
    
    // 如果是簡單陣列
    if (Array.isArray(data.data)) {
      return [{
        y: data.data,
        type: 'box',
        name: options.label || '箱型圖',
        boxpoints: 'outliers',
        marker: {
          color: 'rgba(54, 162, 235, 0.7)'
        }
      }];
    }
    
    // 預設資料
    return [{
      y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      type: 'box',
      name: '範例資料',
      boxpoints: 'outliers'
    }];
  };

  const layout = {
    title: {
      text: options.title || '箱型圖',
      font: { size: 16 }
    },
    showlegend: data.datasets && data.datasets.length > 1,
    yaxis: {
      title: options.yAxisTitle || '數值',
      gridcolor: 'rgba(0,0,0,0.1)'
    },
    xaxis: {
      title: options.xAxisTitle || '類別'
    },
    margin: { l: 60, r: 50, t: 50, b: 50 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)'
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    displaylogo: false
  };

  return (
    <Plot
      data={processBoxplotData()}
      layout={layout}
      config={config}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default PlotlyBoxplot;