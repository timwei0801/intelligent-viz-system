import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Typography, Alert } from '@mui/material';

const TreemapChart = ({ data, options = {} }) => {
  const processTreemapData = () => {
    // 檢查是否有有效的數據
    if (!data || !Array.isArray(data.data) || data.data.length === 0) {
      return null;
    }

    const { labelColumn, valueColumn, parentColumn } = options;
    const firstRow = data.data[0];
    const columns = Object.keys(firstRow);

    // 自動識別欄位
    const label = labelColumn || columns.find(col => 
      isNaN(parseFloat(firstRow[col]))
    ) || columns[0];

    const value = valueColumn || columns.find(col => 
      !isNaN(parseFloat(firstRow[col]))
    ) || columns[1];

    const parent = parentColumn || columns.find(col => 
      col !== label && col !== value && isNaN(parseFloat(firstRow[col]))
    );

    if (!label || !value) {
      return null;
    }

    // 聚合數據
    const aggregatedData = {};
    data.data.forEach(row => {
      const labelValue = String(row[label] || '未分類');
      const numericValue = parseFloat(row[value]) || 0;
      const parentValue = parent ? String(row[parent] || '') : '';

      const key = parent ? `${parentValue}/${labelValue}` : labelValue;
      
      if (!aggregatedData[key]) {
        aggregatedData[key] = {
          label: labelValue,
          value: 0,
          parent: parentValue,
          fullPath: key
        };
      }
      aggregatedData[key].value += numericValue;
    });

    const processedItems = Object.values(aggregatedData);
    
    // 如果有父級分類，需要計算父級總和
    if (parent) {
      const parentTotals = {};
      processedItems.forEach(item => {
        if (item.parent) {
          if (!parentTotals[item.parent]) {
            parentTotals[item.parent] = 0;
          }
          parentTotals[item.parent] += item.value;
        }
      });

      // 添加父級節點
      Object.entries(parentTotals).forEach(([parentName, parentValue]) => {
        processedItems.push({
          label: parentName,
          value: parentValue,
          parent: '',
          fullPath: parentName,
          isParent: true
        });
      });
    }

    // 排序（值大的在前）
    processedItems.sort((a, b) => b.value - a.value);

    if (processedItems.length === 0) {
      return null;
    }

    return {
      items: processedItems,
      labelColumn: label,
      valueColumn: value,
      parentColumn: parent,
      hasHierarchy: !!parent
    };
  };

  const processedData = processTreemapData();

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
            🌳 樹狀圖需要分類和數值資料
          </Typography>
          <Typography variant="body2">
            樹狀圖需要：
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            <li>分類標籤（如：產品名稱、部門）</li>
            <li>對應數值（如：銷售額、數量）</li>
            <li>可選：父級分類（如：產品類別、事業群）</li>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            適合用於展示組成比例、市場份額、預算分配等層次化數據。
          </Typography>
        </Alert>
      </Box>
    );
  }

  // 生成顏色
  const generateColors = (items) => {
    const colors = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
      '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
      '#dbdb8d', '#9edae5', '#ad494a', '#8c6d31', '#393b79'
    ];

    if (processedData.hasHierarchy) {
      // 為有層次的數據生成顏色
      const parentColors = {};
      let colorIndex = 0;

      return items.map(item => {
        if (item.isParent) {
          const color = colors[colorIndex % colors.length];
          parentColors[item.label] = color;
          colorIndex++;
          return color;
        } else if (item.parent && parentColors[item.parent]) {
          // 子項目使用父項目的顏色但透明度較高
          const parentColor = parentColors[item.parent];
          return parentColor.replace(')', ', 0.7)').replace('rgb', 'rgba');
        } else {
          return colors[colorIndex++ % colors.length];
        }
      });
    } else {
      // 扁平結構使用漸層色
      return items.map((item, index) => colors[index % colors.length]);
    }
  };

  const itemColors = generateColors(processedData.items);

  // 準備 Plotly 數據
  const plotlyData = [{
    type: 'treemap',
    labels: processedData.items.map(item => item.label),
    values: processedData.items.map(item => item.value),
    parents: processedData.hasHierarchy ? 
      processedData.items.map(item => item.isParent ? '' : item.parent) : 
      [],
    text: processedData.items.map(item => 
      `${item.label}<br>數值: ${item.value.toLocaleString()}<br>占比: ${((item.value / processedData.items.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}%`
    ),
    textinfo: 'label+value+percent parent',
    textposition: 'middle center',
    textfont: { 
      size: 12,
      color: 'white'
    },
    marker: {
      colors: itemColors,
      line: {
        color: 'white',
        width: 2
      },
      colorscale: options.colorScale || 'Viridis',
      showscale: false
    },
    hovertemplate: '<b>%{label}</b><br>數值: %{value:,.0f}<br>占比: %{percentParent}<br><extra></extra>',
    maxdepth: processedData.hasHierarchy ? (options.maxDepth || 3) : 1,
    branchvalues: 'total'
  }];

  const layout = {
    title: {
      text: options.title || `${processedData.labelColumn} 樹狀圖`,
      font: { size: 16 }
    },
    font: { 
      family: 'Arial, sans-serif',
      size: 11
    },
    margin: { l: 10, r: 10, t: 60, b: 10 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
  };

  const config = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'zoom2d']
  };

  // 計算統計資訊
  const totalValue = processedData.items.reduce((sum, item) => sum + item.value, 0);
  const itemCount = processedData.items.filter(item => !item.isParent).length;
  const maxValue = Math.max(...processedData.items.map(item => item.value));
  const maxItem = processedData.items.find(item => item.value === maxValue);

  return (
    <Box sx={{ position: 'relative' }}>
      <Plot
        data={plotlyData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '600px' }}
      />
      
      {/* 顯示統計資訊 */}
      <Box sx={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        backgroundColor: 'rgba(255,255,255,0.95)',
        p: 2,
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        minWidth: 160,
        boxShadow: 1
      }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
          📊 組成分析
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          項目數: {itemCount}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          總計: {totalValue.toLocaleString()}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
          最大項: {maxItem?.label}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
          ({((maxValue / totalValue) * 100).toFixed(1)}%)
        </Typography>
        {processedData.hasHierarchy && (
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 1 }}>
            🏗️ 層次結構
          </Typography>
        )}
      </Box>

      {/* 操作提示 */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 10, 
        left: 10, 
        backgroundColor: 'rgba(255,255,255,0.9)',
        p: 1.5,
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        maxWidth: 200
      }}>
        <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>
          💡 操作提示
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          • 點擊方塊可深入查看
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          • 懸停查看詳細數據
        </Typography>
        {processedData.hasHierarchy && (
          <Typography variant="caption" sx={{ display: 'block' }}>
            • 雙擊返回上層
          </Typography>
        )}
      </Box>

      {/* 數據摘要 */}
      <Box sx={{ 
        mt: 2, 
        p: 2, 
        backgroundColor: 'rgba(245,245,245,0.8)',
        borderRadius: 1,
        border: '1px solid #e0e0e0'
      }}>
        <Typography variant="subtitle2" gutterBottom>
          📈 數據摘要
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption">
            <strong>分類欄位</strong>: {processedData.labelColumn}
          </Typography>
          <Typography variant="caption">
            <strong>數值欄位</strong>: {processedData.valueColumn}
          </Typography>
          {processedData.hasHierarchy && (
            <Typography variant="caption">
              <strong>層次欄位</strong>: {processedData.parentColumn}
            </Typography>
          )}
          <Typography variant="caption">
            <strong>平均值</strong>: {(totalValue / itemCount).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TreemapChart;