import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Typography, Alert } from '@mui/material';

const FunnelChart = ({ data, options = {} }) => {
  const processFunnelData = () => {
    // 檢查是否有有效的數據
    if (!data || (!data.labels && !data.datasets && !Array.isArray(data.data))) {
      return null;
    }

    let processedData = [];

    // 如果有 labels 和 datasets 格式
    if (data.labels && data.datasets && data.datasets.length > 0) {
      const values = data.datasets[0].data;
      processedData = data.labels.map((label, index) => ({
        label: label,
        value: values[index] || 0
      }));
    }
    // 如果是簡單的 labels 和 data 格式
    else if (data.labels && data.data) {
      processedData = data.labels.map((label, index) => ({
        label: label,
        value: data.data[index] || 0
      }));
    }
    // 如果是表格數據
    else if (Array.isArray(data.data) && data.data.length > 0) {
      const firstRow = data.data[0];
      const columns = Object.keys(firstRow);
      
      // 找出標籤欄位和數值欄位
      const labelColumn = options.labelColumn || columns.find(col => 
        isNaN(parseFloat(firstRow[col]))
      ) || columns[0];
      
      const valueColumn = options.valueColumn || columns.find(col => 
        !isNaN(parseFloat(firstRow[col]))
      ) || columns[1];

      if (labelColumn && valueColumn) {
        // 聚合相同標籤的數值
        const aggregated = data.data.reduce((acc, row) => {
          const label = String(row[labelColumn] || '未分類');
          const value = parseFloat(row[valueColumn]) || 0;
          acc[label] = (acc[label] || 0) + value;
          return acc;
        }, {});

        processedData = Object.entries(aggregated).map(([label, value]) => ({
          label, value
        }));
      }
    }

    // 按值降序排列（漏斗圖特性）
    processedData.sort((a, b) => b.value - a.value);
    
    return processedData.length > 0 ? processedData : null;
  };

  const processedData = processFunnelData();

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
            🏺 漏斗圖需要標籤和數值資料
          </Typography>
          <Typography variant="body2">
            漏斗圖需要：
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            <li>類別標籤（如：銷售階段、轉換步驟）</li>
            <li>對應的數值（如：人數、金額、轉換率）</li>
            <li>用於顯示轉換流程</li>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            適合用於銷售漏斗、轉換分析、流程分析等場景。
          </Typography>
        </Alert>
      </Box>
    );
  }

  // 計算轉換率
  const maxValue = Math.max(...processedData.map(d => d.value));
  const dataWithConversion = processedData.map((item, index) => ({
    ...item,
    conversionRate: index === 0 ? 100 : ((item.value / processedData[0].value) * 100).toFixed(1)
  }));

  const plotlyData = [{
    type: 'funnel',
    y: dataWithConversion.map(d => d.label),
    x: dataWithConversion.map(d => d.value),
    text: dataWithConversion.map(d => 
      `${d.label}<br>數量: ${d.value.toLocaleString()}<br>轉換率: ${d.conversionRate}%`
    ),
    textinfo: 'text',
    textposition: 'inside',
    hovertemplate: '<b>%{y}</b><br>數量: %{x:,.0f}<br>轉換率: %{text}<extra></extra>',
    marker: {
      color: dataWithConversion.map((d, index) => {
        const colors = [
          '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
          '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
        ];
        return colors[index % colors.length];
      }),
      line: {
        color: 'white',
        width: 2
      }
    },
    connector: {
      fillcolor: 'rgba(0,0,0,0.05)',
      line: {
        color: 'rgba(0,0,0,0.2)',
        width: 1
      }
    }
  }];

  const layout = {
    title: {
      text: options.title || '銷售漏斗圖',
      font: { size: 16 }
    },
    font: { family: 'Arial, sans-serif' },
    margin: { l: 100, r: 50, t: 60, b: 50 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    funnelmode: 'stack',
    showlegend: false
  };

  const config = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Plot
        data={plotlyData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '500px' }}
      />
      
      {/* 顯示轉換統計 */}
      <Box sx={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        backgroundColor: 'rgba(255,255,255,0.9)',
        p: 2,
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        minWidth: 120
      }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
          轉換統計
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          總數: {processedData[0]?.value.toLocaleString()}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          最終: {processedData[processedData.length - 1]?.value.toLocaleString()}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
          總轉換率: {dataWithConversion[dataWithConversion.length - 1]?.conversionRate}%
        </Typography>
      </Box>
    </Box>
  );
};

export default FunnelChart;