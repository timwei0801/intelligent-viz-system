import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Typography, Alert } from '@mui/material';

const BubbleChart = ({ data, options = {} }) => {
  const processBubbleData = () => {
    // 檢查是否有有效的數據集
    if (!data || !data.datasets || data.datasets.length === 0) {
      return null;
    }

    const validData = [];

    data.datasets.forEach((dataset, index) => {
      // 檢查資料格式
      if (!dataset.data || !Array.isArray(dataset.data) || dataset.data.length === 0) {
        return; // 跳過空的數據集
      }

      // 如果資料已經是氣泡格式 {x, y, r}
      if (typeof dataset.data[0] === 'object' && dataset.data[0].x !== undefined && dataset.data[0].y !== undefined) {
        const bubbleData = dataset.data.filter(point => 
          point.x !== undefined && point.y !== undefined && 
          !isNaN(point.x) && !isNaN(point.y)
        );

        if (bubbleData.length > 0) {
          validData.push({
            x: bubbleData.map(point => point.x),
            y: bubbleData.map(point => point.y),
            mode: 'markers',
            marker: {
              size: bubbleData.map(point => Math.max((point.r || 10) * 3, 5)),
              color: dataset.backgroundColor || `hsl(${index * 60}, 70%, 50%)`,
              opacity: 0.7,
              line: {
                color: dataset.borderColor || 'white',
                width: 2
              }
            },
            text: bubbleData.map((point, i) => 
              `${dataset.label || '氣泡'} ${i + 1}<br>大小: ${point.r || 10}`
            ),
            hovertemplate: '%{text}<br>X: %{x}<br>Y: %{y}<extra></extra>',
            name: dataset.label || `氣泡群 ${index + 1}`,
            type: 'scatter'
          });
        }
      } else if (typeof dataset.data[0] === 'number') {
        // 如果是數值陣列，但沒有座標資訊，無法製作氣泡圖
        return null;
      }
    });

    return validData.length > 0 ? validData : null;
  };

  const processedData = processBubbleData();

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
            🫧 氣泡圖需要特定的資料格式
          </Typography>
          <Typography variant="body2">
            氣泡圖需要包含 X、Y 座標和氣泡大小的資料，格式如下：
          </Typography>
          <Box component="pre" sx={{ 
            bgcolor: 'grey.100', 
            p: 2, 
            mt: 2, 
            borderRadius: 1,
            fontSize: '12px',
            overflow: 'auto'
          }}>
{`[
  { x: 10, y: 20, r: 15 },
  { x: 30, y: 40, r: 25 },
  { x: 50, y: 60, r: 10 }
]`}
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            其中 x、y 為座標，r 為氣泡大小
          </Typography>
        </Alert>
      </Box>
    );
  }

  const layout = {
    title: {
      text: options.title || '氣泡圖',
      font: { size: 16 }
    },
    xaxis: {
      title: options.xAxisTitle || 'X軸',
      gridcolor: 'rgba(0,0,0,0.1)',
      showgrid: true
    },
    yaxis: {
      title: options.yAxisTitle || 'Y軸',
      gridcolor: 'rgba(0,0,0,0.1)',
      showgrid: true
    },
    showlegend: processedData.length > 1,
    margin: { l: 60, r: 50, t: 50, b: 50 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'closest'
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

export default BubbleChart;