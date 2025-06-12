import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BulletChart = ({ data, options = {} }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.metrics || !Array.isArray(data.metrics)) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 設置尺寸和邊距
    const margin = { top: 20, right: 30, bottom: 40, left: 80 };
    const width = (options.width || 600) - margin.left - margin.right;
    const height = (options.height || 400) - margin.top - margin.bottom;

    // 創建主容器
    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 處理數據
    const metrics = data.metrics.map((metric, index) => ({
      title: metric.title || `指標 ${index + 1}`,
      subtitle: metric.subtitle || '',
      ranges: metric.ranges || [60, 80, 100], // [差, 一般, 好]
      measures: metric.measures || [metric.actual || 70], // 實際值
      markers: metric.markers || [metric.target || 85] // 目標值
    }));

    const chartHeight = height / metrics.length;
    const bulletHeight = Math.min(chartHeight * 0.6, 40);

    // 為每個指標創建子彈圖
    metrics.forEach((metric, index) => {
      const y = index * chartHeight + (chartHeight - bulletHeight) / 2;
      
      // 計算比例尺
      const maxValue = Math.max(...metric.ranges, ...metric.measures, ...metric.markers);
      const xScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, width - 200]); // 留出空間給標籤

      // 創建分組
      const bulletGroup = g.append("g")
        .attr("transform", `translate(0, ${y})`);

      // 繪製背景範圍 (好、一般、差)
      const rangeColors = ['#d0d0d0', '#a0a0a0', '#707070']; // 從淺到深
      metric.ranges.forEach((range, i) => {
        bulletGroup.append("rect")
          .attr("class", `range range-${i}`)
          .attr("width", xScale(range))
          .attr("height", bulletHeight)
          .attr("fill", rangeColors[i])
          .attr("opacity", 0.7);
      });

      // 繪製實際值條
      metric.measures.forEach((measure, i) => {
        bulletGroup.append("rect")
          .attr("class", `measure measure-${i}`)
          .attr("width", xScale(measure))
          .attr("height", bulletHeight * 0.6)
          .attr("y", bulletHeight * 0.2)
          .attr("fill", measure >= metric.markers[0] ? "#4CAF50" : measure >= metric.ranges[1] ? "#FF9800" : "#F44336")
          .attr("opacity", 0.9);
      });

      // 繪製目標線
      metric.markers.forEach((marker, i) => {
        bulletGroup.append("line")
          .attr("class", `marker marker-${i}`)
          .attr("x1", xScale(marker))
          .attr("x2", xScale(marker))
          .attr("y1", 0)
          .attr("y2", bulletHeight)
          .attr("stroke", "#333")
          .attr("stroke-width", 3);
      });

      // 添加標籤
      const labelGroup = bulletGroup.append("g")
        .attr("transform", `translate(${width - 180}, 0)`);

      // 主標題
      labelGroup.append("text")
        .attr("class", "title")
        .attr("y", bulletHeight / 3)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(metric.title);

      // 副標題
      if (metric.subtitle) {
        labelGroup.append("text")
          .attr("class", "subtitle")
          .attr("y", bulletHeight * 2 / 3)
          .style("font-size", "11px")
          .style("fill", "#666")
          .text(metric.subtitle);
      }

      // 數值標籤
      const valueGroup = bulletGroup.append("g")
        .attr("transform", `translate(${width - 80}, 0)`);

      valueGroup.append("text")
        .attr("y", bulletHeight / 3)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(`實際: ${metric.measures[0]}`);

      valueGroup.append("text")
        .attr("y", bulletHeight * 2 / 3)
        .style("font-size", "11px")
        .style("fill", "#666")
        .text(`目標: ${metric.markers[0]}`);

      // 添加懸停效果
      bulletGroup
        .on("mouseover", function() {
          d3.select(this).selectAll("rect.measure")
            .attr("opacity", 1);
        })
        .on("mouseout", function() {
          d3.select(this).selectAll("rect.measure")
            .attr("opacity", 0.9);
        });
    });

    // 添加標題
    if (options.title) {
      svg.append("text")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(options.title);
    }

    // 添加圖例
    const legend = g.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(0, ${height - 20})`);

    const legendData = [
      { label: "差", color: "#d0d0d0" },
      { label: "一般", color: "#a0a0a0" },
      { label: "好", color: "#707070" },
      { label: "實際值", color: "#4CAF50" },
      { label: "目標", color: "#333" }
    ];

    const legendItem = legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(${i * 80}, 0)`);

    legendItem.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", d => d.color);

    legendItem.append("text")
      .attr("x", 16)
      .attr("y", 6)
      .attr("dy", "0.35em")
      .style("font-size", "10px")
      .style("fill", "#333")
      .text(d => d.label);

  }, [data, options]);

  // 錯誤處理
  if (!data || !data.metrics || !Array.isArray(data.metrics) || data.metrics.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        color: '#666',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>子彈圖需要指標資料</div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#999' }}>
            請提供包含實際值和目標值的 KPI 資料
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <svg 
        ref={svgRef} 
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
      />
    </div>
  );
};

export default BulletChart;