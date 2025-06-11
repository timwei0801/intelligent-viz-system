import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Typography, Alert } from '@mui/material';

const ViolinChart = ({ data, options = {} }) => {
  const processViolinData = () => {
    // 檢查是否有有效的數據集
    if (!data) {
      return null;
    }

    const validData = [];

    // 如果有 datasets，處理每個數據集
    if (data.datasets && data.datasets.length > 0) {
      data.datasets.forEach((dataset, index) => {
        if (!dataset.data || !Array.isArray(dataset.data) || dataset.data.length === 0) {
          return; // 跳過空的數據集
        }

        // 過濾出有效的數值
        const numericData = dataset.data.filter(val => 
          typeof val === 'number' && !isNaN(val)
        );

        // 需要至少 5 個數據點才能形成有意義的小提琴圖
        if (numericData.length >= 5) {
          validData.push({
            y: numericData,
            type: 'violin',
            name: dataset.label || `數據 ${index + 1}`,
            box: {
              visible: true,
              width: 0.3
            },
            line: {
              color: dataset.borderColor || `hsl(${index * 60}, 70%, 50%)`,
              width: 2
            },
            fillcolor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.5)`,
            opacity: 0.8,
            points: 'outliers',
            side: 'both',
            width: 0.8
          });
        }
      });
    }
    
    // 從表格資料提取數值欄位
    else if (Array.isArray(data.data) && data.data.length > 0) {
      const numericColumns = [];
      const sampleRow = data.data[0] || {};
      
      Object.keys(sampleRow).forEach(key => {
        if (typeof sampleRow[key] === 'number') {
          numericColumns.push(key);
        }
      });

      if (numericColumns.length > 0) {
        numericColumns.slice(0, 3).forEach((column, index) => {
          const columnData = data.data
            .map(row => row[column])
            .filter(val => typeof val === 'number' && !isNaN(val));
          
          // 需要至少 5 個數據點
          if (columnData.length >= 5) {
            validData.push({
              y: columnData,
              type: 'violin',
              name: column,
              box: { visible: true, width: 0.3 },
              line: { color: `hsl(${index * 120}, 70%, 50%)`, width: 2 },
              fillcolor: `hsla(${index * 120}, 70%, 50%, 0.5)`,
              opacity: 0.8,
              points: 'outliers',
              side: 'both',
              width: 0.8
            });
          }
        });
      }
    }

    return validData.length > 0 ? validData : null;
  };

  const processedData = processViolinData();

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
            🎻 小提琴圖需要數值型資料
          </Typography>
          <Typography variant="body2">
            小提琴圖需要：
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            <li>至少 5 個數值型資料點</li>
            <li>資料應為連續數值（非類別型）</li>
            <li>用於顯示數據的分布密度</li>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            建議使用包含足夠數值資料的檔案，例如測量數據、分數、價格等。
          </Typography>
        </Alert>
      </Box>
    );
  }

  const layout = {
    title: {
      text: options.title || '小提琴圖',
      font: { size: 16 }
    },
    yaxis: {
      title: options.yAxisTitle || '數值',
      gridcolor: 'rgba(0,0,0,0.1)',
      showgrid: true
    },
    xaxis: {
      title: options.xAxisTitle || '群組',
      showgrid: false
    },
    showlegend: processedData.length > 1,
    margin: { l: 60, r: 50, t: 50, b: 50 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    violinmode: 'group',
    violingap: 0.3
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

export default ViolinChart;