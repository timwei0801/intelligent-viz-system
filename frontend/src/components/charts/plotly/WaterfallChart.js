import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Typography, Alert } from '@mui/material';

const WaterfallChart = ({ data, options = {} }) => {
  const processWaterfallData = () => {
    // 檢查是否有標準格式的資料
    if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
      return null;
    }

    const values = data.datasets[0].data;
    const labels = data.labels;

    // 驗證資料
    if (!Array.isArray(values) || !Array.isArray(labels) || values.length === 0 || labels.length === 0) {
      return null;
    }

    // 確保所有值都是數字
    const numericValues = values.map(val => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    });

    return [{
      x: labels,
      y: numericValues,
      type: 'waterfall',
      measure: numericValues.map((val, index) => {
        if (index === 0) return 'absolute';
        if (index === numericValues.length - 1) return 'total';
        return 'relative';
      }),
      text: numericValues.map(val => val > 0 ? `+${val}` : `${val}`),
      textposition: 'auto',
      connector: {
        line: {
          color: 'rgba(63, 81, 181, 0.5)',
          width: 2
        }
      },
      increasing: { marker: { color: 'green' } },
      decreasing: { marker: { color: 'red' } },
      totals: { marker: { color: 'blue' } }
    }];
  };

  const processedData = processWaterfallData();

  // 如果沒有有效數據，顯示提示訊息
  if (!processedData) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '400px',
          p: 3 
        }}
      >
        <Alert severity="info" sx={{ mb: 2, maxWidth: '500px' }}>
          <Typography variant="h6" gutterBottom>
            💧 瀑布圖需要帶標籤的數值資料
          </Typography>
          <Typography variant="body2">
            瀑布圖需要：
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            <li>類別標籤（如：起始、增加、減少、總計）</li>
            <li>對應的數值（正數代表增加，負數代表減少）</li>
            <li>用於顯示累積變化過程</li>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            適合用於顯示財務報表、人口變化、庫存變動等累積性資料。
          </Typography>
        </Alert>
      </Box>
    );
  }

  const layout = {
    title: {
      text: options.title || '瀑布圖',
      font: { size: 16 }
    },
    yaxis: {
      title: options.yAxisTitle || '數值',
      gridcolor: 'rgba(0,0,0,0.1)'
    },
    xaxis: {
      title: options.xAxisTitle || '項目'
    },
    showlegend: false,
    margin: { l: 60, r: 50, t: 50, b: 50 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)'
  };

  const config = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d']
  };

  return (
    <Plot
      data={processedData}
      layout={layout}
      config={config}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default WaterfallChart;
