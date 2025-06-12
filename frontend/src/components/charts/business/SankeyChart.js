import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Typography, Alert } from '@mui/material';

const SankeyChart = ({ data, options = {} }) => {
  const processSankeyData = () => {
    // 檢查是否有有效的數據
    if (!data || !Array.isArray(data.data) || data.data.length === 0) {
      return null;
    }

    // 檢查是否有必要的欄位
    const { sourceColumn, targetColumn, valueColumn } = options;
    const firstRow = data.data[0];
    const columns = Object.keys(firstRow);

    // 自動識別欄位
    const source = sourceColumn || columns[0];
    const target = targetColumn || columns[1];
    const value = valueColumn || columns.find(col => 
      !isNaN(parseFloat(firstRow[col]))
    ) || columns[2];

    if (!source || !target || !value) {
      return null;
    }

    // 提取所有唯一的節點
    const allNodes = new Set();
    data.data.forEach(row => {
      if (row[source]) allNodes.add(String(row[source]));
      if (row[target]) allNodes.add(String(row[target]));
    });

    const nodeList = Array.from(allNodes);
    const nodeMap = {};
    nodeList.forEach((node, index) => {
      nodeMap[node] = index;
    });

    // 建立連結數據
    const links = {
      source: [],
      target: [],
      value: [],
      label: []
    };

    // 聚合相同來源和目標的數值
    const linkMap = {};
    data.data.forEach(row => {
      const sourceNode = String(row[source]);
      const targetNode = String(row[target]);
      const linkValue = parseFloat(row[value]) || 0;
      
      if (sourceNode && targetNode && linkValue > 0) {
        const linkKey = `${sourceNode}_${targetNode}`;
        linkMap[linkKey] = (linkMap[linkKey] || 0) + linkValue;
      }
    });

    // 轉換為 Plotly 格式
    Object.entries(linkMap).forEach(([linkKey, linkValue]) => {
      const [sourceNode, targetNode] = linkKey.split('_');
      
      if (nodeMap.hasOwnProperty(sourceNode) && nodeMap.hasOwnProperty(targetNode)) {
        links.source.push(nodeMap[sourceNode]);
        links.target.push(nodeMap[targetNode]);
        links.value.push(linkValue);
        links.label.push(`${sourceNode} → ${targetNode}: ${linkValue.toLocaleString()}`);
      }
    });

    if (links.source.length === 0) {
      return null;
    }

    // 生成節點顏色
    const nodeColors = nodeList.map((node, index) => {
      const colors = [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
        '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5'
      ];
      return colors[index % colors.length];
    });

    // 計算節點大小（基於流入流出量）
    const nodeSizes = nodeList.map((node, index) => {
      let totalFlow = 0;
      links.source.forEach((sourceIndex, i) => {
        if (sourceIndex === index) totalFlow += links.value[i];
      });
      links.target.forEach((targetIndex, i) => {
        if (targetIndex === index) totalFlow += links.value[i];
      });
      return Math.max(20, Math.min(50, totalFlow / Math.max(...links.value) * 40));
    });

    return {
      nodes: nodeList,
      links: links,
      nodeColors: nodeColors,
      nodeSizes: nodeSizes,
      sourceColumn: source,
      targetColumn: target,
      valueColumn: value
    };
  };

  const processedData = processSankeyData();

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
            🌊 桑基圖需要流向資料
          </Typography>
          <Typography variant="body2">
            桑基圖需要：
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            <li>來源節點（如：產品類別、銷售管道）</li>
            <li>目標節點（如：客戶群體、銷售結果）</li>
            <li>流量數值（如：銷售額、用戶數量）</li>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            適合用於分析資金流向、用戶流向、能源消耗等流程數據。
          </Typography>
        </Alert>
      </Box>
    );
  }

  const plotlyData = [{
    type: 'sankey',
    node: {
      pad: 15,
      thickness: 20,
      line: {
        color: 'black',
        width: 0.5
      },
      label: processedData.nodes,
      color: processedData.nodeColors,
      hovertemplate: '<b>%{label}</b><br>總流量: %{value}<extra></extra>'
    },
    link: {
      source: processedData.links.source,
      target: processedData.links.target,
      value: processedData.links.value,
      label: processedData.links.label,
      color: processedData.links.source.map(sourceIndex => {
        const alpha = 0.4;
        const baseColor = processedData.nodeColors[sourceIndex];
        return baseColor.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
      }),
      hovertemplate: '%{label}<extra></extra>'
    }
  }];

  const layout = {
    title: {
      text: options.title || `${processedData.sourceColumn} → ${processedData.targetColumn} 流向圖`,
      font: { size: 16 }
    },
    font: { 
      family: 'Arial, sans-serif',
      size: 12
    },
    margin: { l: 50, r: 50, t: 60, b: 50 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
  };

  const config = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
  };

  // 計算統計資訊
  const totalFlow = processedData.links.value.reduce((sum, val) => sum + val, 0);
  const nodeCount = processedData.nodes.length;
  const linkCount = processedData.links.value.length;

  return (
    <Box sx={{ position: 'relative' }}>
      <Plot
        data={plotlyData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '600px' }}
      />
      
      {/* 顯示流向統計 */}
      <Box sx={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        backgroundColor: 'rgba(255,255,255,0.95)',
        p: 2,
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        minWidth: 140,
        boxShadow: 1
      }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
          📊 流向統計
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          節點數: {nodeCount}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          連接數: {linkCount}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
          總流量: {totalFlow.toLocaleString()}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 1 }}>
          💡 點擊節點或連線查看詳情
        </Typography>
      </Box>

      {/* 圖例說明 */}
      <Box sx={{ 
        mt: 2, 
        p: 2, 
        backgroundColor: 'rgba(245,245,245,0.8)',
        borderRadius: 1,
        border: '1px solid #e0e0e0'
      }}>
        <Typography variant="subtitle2" gutterBottom>
          📋 圖表說明
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          • <strong>節點厚度</strong>：代表該節點的總流量大小
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          • <strong>連線粗細</strong>：代表兩節點間的流量大小
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          • <strong>連線顏色</strong>：繼承來源節點的顏色
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          • <strong>來源</strong>：{processedData.sourceColumn} → <strong>目標</strong>：{processedData.targetColumn}
        </Typography>
      </Box>
    </Box>
  );
};

export default SankeyChart;