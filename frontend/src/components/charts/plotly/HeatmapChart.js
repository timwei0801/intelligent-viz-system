import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Typography, Alert } from '@mui/material';

const HeatmapChart = ({ data, options = {} }) => {
  const processHeatmapData = () => {
    // 檢查是否有專門的熱力圖資料格式
    if (data && data.z && Array.isArray(data.z)) {
      return [{
        z: data.z,
        x: data.x || [],
        y: data.y || [],
        type: 'heatmap',
        colorscale: options.colorscale || 'Viridis',
        showscale: true
      }];
    }

    // 從表格資料生成相關性矩陣
    if (Array.isArray(data.data) && data.data.length > 0) {
      const numericColumns = [];
      const sampleRow = data.data[0] || {};
      
      // 找出數值欄位
      Object.keys(sampleRow).forEach(key => {
        if (typeof sampleRow[key] === 'number') {
          numericColumns.push(key);
        }
      });

      // 需要至少 2 個數值欄位才能計算相關性
      if (numericColumns.length >= 2) {
        // 計算實際的相關性矩陣
        const matrix = [];
        const labels = numericColumns;
        
        for (let i = 0; i < numericColumns.length; i++) {
          const row = [];
          for (let j = 0; j < numericColumns.length; j++) {
            if (i === j) {
              row.push(1); // 對角線為1
            } else {
              // 計算皮爾森相關係數
              const col1Data = data.data.map(row => row[numericColumns[i]]).filter(val => !isNaN(val));
              const col2Data = data.data.map(row => row[numericColumns[j]]).filter(val => !isNaN(val));
              
              if (col1Data.length > 1 && col2Data.length > 1) {
                const correlation = calculateCorrelation(col1Data, col2Data);
                row.push(correlation);
              } else {
                row.push(0);
              }
            }
          }
          matrix.push(row);
        }

        return [{
          z: matrix,
          x: labels,
          y: labels,
          type: 'heatmap',
          colorscale: 'RdBu',
          showscale: true,
          text: matrix.map(row => row.map(val => val.toFixed(2))),
          texttemplate: '%{text}',
          textfont: { size: 12 },
          zmid: 0, // 設定中點為 0
          zmin: -1,
          zmax: 1
        }];
      }
    }

    return null;
  };

  // 計算皮爾森相關係數
  const calculateCorrelation = (x, y) => {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;

    const xSlice = x.slice(0, n);
    const ySlice = y.slice(0, n);

    const sumX = xSlice.reduce((sum, val) => sum + val, 0);
    const sumY = ySlice.reduce((sum, val) => sum + val, 0);
    const sumXY = xSlice.reduce((sum, val, i) => sum + val * ySlice[i], 0);
    const sumXX = xSlice.reduce((sum, val) => sum + val * val, 0);
    const sumYY = ySlice.reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const processedData = processHeatmapData();

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
            🔥 熱力圖需要數值型資料
          </Typography>
          <Typography variant="body2">
            熱力圖需要：
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            <li>至少 2 個數值型欄位</li>
            <li>足夠的資料點來計算相關性</li>
            <li>或者預先計算好的矩陣資料</li>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            系統會自動計算數值欄位之間的相關性矩陣。
          </Typography>
        </Alert>
      </Box>
    );
  }

  const layout = {
    title: {
      text: options.title || '相關性熱力圖',
      font: { size: 16 }
    },
    xaxis: {
      title: options.xAxisTitle || '',
      side: 'bottom'
    },
    yaxis: {
      title: options.yAxisTitle || '',
      autorange: 'reversed'
    },
    margin: { l: 80, r: 50, t: 50, b: 80 },
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

export default HeatmapChart;
