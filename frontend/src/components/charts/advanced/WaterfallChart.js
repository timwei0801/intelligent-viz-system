import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const WaterfallChart = ({ data, options = {} }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // 清除舊內容

    // 設置尺寸和邊距 - 增加更多空間給標籤
    const margin = { top: 80, right: 100, bottom: 120, left: 100 };
    const width = (options.width || 800) - margin.left - margin.right;
    const height = (options.height || 500) - margin.top - margin.bottom;

    // 創建主容器
    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 處理瀑布圖資料
    let cumulative = 0;
    const waterfallData = data.data.map((d, i) => {
      const value = parseFloat(d[data.valueColumn]) || 0;
      const start = cumulative;
      cumulative += value;
      
      return {
        label: d[data.labelColumn] || `項目${i + 1}`,
        value: value,
        start: start,
        end: cumulative,
        isPositive: value >= 0,
        index: i
      };
    });

    // 計算 Y 軸範圍 - 增加更多空間
    const allValues = [
      0,
      ...waterfallData.map(d => d.start),
      ...waterfallData.map(d => d.end)
    ];
    const yExtent = d3.extent(allValues);
    const yPadding = (yExtent[1] - yExtent[0]) * 0.15; // 增加 padding

    // 設置比例尺
    const xScale = d3.scaleBand()
      .domain(waterfallData.map(d => d.label))
      .range([0, width])
      .padding(0.3); // 增加柱子間距

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .nice()
      .range([height, 0]);

    // 顏色定義
    const positiveColor = "#4CAF50"; // 綠色 - 增加
    const negativeColor = "#F44336"; // 紅色 - 減少
    const neutralColor = "#2196F3";  // 藍色 - 總計

    // 創建柱子
    const bars = g.selectAll(".waterfall-bar")
      .data(waterfallData)
      .enter()
      .append("rect")
      .attr("class", "waterfall-bar")
      .attr("x", d => xScale(d.label))
      .attr("y", d => yScale(Math.max(d.start, d.end)))
      .attr("width", xScale.bandwidth())
      .attr("height", d => Math.abs(yScale(d.start) - yScale(d.end)))
      .attr("fill", (d, i) => {
        if (i === waterfallData.length - 1) return neutralColor; // 最後一個是總計
        return d.isPositive ? positiveColor : negativeColor;
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("opacity", 0.85)
      .style("cursor", "pointer");

    // 添加懸停效果
    bars
      .on("mouseover", function(event, d) {
        d3.select(this).style("opacity", 1);
        
        // 創建 tooltip
        const tooltip = g.append("g")
          .attr("class", "tooltip");

        const tooltipRect = tooltip.append("rect")
          .attr("fill", "rgba(0,0,0,0.9)")
          .attr("rx", 6)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);

        const tooltipText = tooltip.append("text")
          .attr("fill", "white")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle");

        tooltipText.append("tspan")
          .attr("x", 0)
          .attr("dy", "1.2em")
          .style("font-weight", "bold")
          .text(`${d.label}`);

        tooltipText.append("tspan")
          .attr("x", 0)
          .attr("dy", "1.2em")
          .text(`變化: ${d.isPositive ? '+' : ''}${d.value.toFixed(0)}`);

        tooltipText.append("tspan")
          .attr("x", 0)
          .attr("dy", "1.2em")
          .text(`累積: ${d.end.toFixed(0)}`);

        // 計算 tooltip 位置和尺寸
        const bbox = tooltipText.node().getBBox();
        const padding = 10;
        
        tooltipRect
          .attr("x", bbox.x - padding)
          .attr("y", bbox.y - padding)
          .attr("width", bbox.width + padding * 2)
          .attr("height", bbox.height + padding * 2);

        const mouseX = xScale(d.label) + xScale.bandwidth() / 2;
        const mouseY = yScale(Math.max(d.start, d.end)) - 20;
        
        tooltip.attr("transform", `translate(${mouseX}, ${mouseY})`);
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 0.85);
        g.select(".tooltip").remove();
      });

    // 添加連接線（瀑布效果）
    waterfallData.forEach((d, i) => {
      if (i < waterfallData.length - 1) {
        const currentEnd = d.end;
        const nextStart = waterfallData[i + 1].start;
        
        // 只有當當前結束值等於下一個開始值時才畫連接線
        if (Math.abs(currentEnd - nextStart) < 0.01) {
          g.append("line")
            .attr("class", "connecting-line")
            .attr("x1", xScale(d.label) + xScale.bandwidth())
            .attr("y1", yScale(currentEnd))
            .attr("x2", xScale(waterfallData[i + 1].label))
            .attr("y2", yScale(currentEnd))
            .attr("stroke", "#666")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "4,4")
            .style("opacity", 0.8);
        }
      }
    });

    // 智能標籤定位函數
    const getOptimalLabelPosition = (d, barTop, barBottom) => {
      const barHeight = Math.abs(barTop - barBottom);
      const centerY = (barTop + barBottom) / 2;
      
      // 如果柱子夠高，標籤放在柱子內部
      if (barHeight > 40) {
        return centerY;
      }
      // 否則根據柱子方向放在外部
      else if (d.isPositive) {
        return barTop - 15; // 正值柱子上方
      } else {
        return barBottom + 15; // 負值柱子下方
      }
    };

    // 添加數值標籤 - 改進定位邏輯
    g.selectAll(".value-label")
      .data(waterfallData)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", d => xScale(d.label) + xScale.bandwidth() / 2)
      .attr("y", d => {
        const barTop = yScale(Math.max(d.start, d.end));
        const barBottom = yScale(Math.min(d.start, d.end));
        return getOptimalLabelPosition(d, barTop, barBottom);
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("fill", d => {
        const barHeight = Math.abs(yScale(d.start) - yScale(d.end));
        // 如果標籤在柱子內部，使用白色；否則使用深色
        return barHeight > 40 ? "#fff" : "#333";
      })
      .style("text-shadow", d => {
        const barHeight = Math.abs(yScale(d.start) - yScale(d.end));
        // 如果標籤在外部，添加陰影提高可讀性
        return barHeight <= 40 ? "1px 1px 2px rgba(255,255,255,0.8)" : "1px 1px 2px rgba(0,0,0,0.5)";
      })
      .text(d => {
        if (d.value === 0) return "0";
        return d.isPositive ? `+${d.value.toFixed(0)}` : d.value.toFixed(0);
      });

    // 添加累積值標籤 - 只在柱子下方顯示，避免重疊
    g.selectAll(".cumulative-label")
      .data(waterfallData.filter((d, i) => i % 2 === 0 || i === waterfallData.length - 1)) // 間隔顯示或最後一個
      .enter()
      .append("text")
      .attr("class", "cumulative-label")
      .attr("x", d => xScale(d.label) + xScale.bandwidth() / 2)
      .attr("y", height + 25) // 固定在 X 軸下方
      .attr("text-anchor", "middle")
      .style("font-size", "9px")
      .style("fill", "#666")
      .style("font-weight", "normal")
      .text(d => `累積: ${d.end.toFixed(0)}`);

    // 創建坐標軸
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => d3.format(",.0f")(d))
      .ticks(8);

    // 添加 X 軸
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-30)"); // 減少旋轉角度

    // 添加 Y 軸
    g.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "10px");

    // 添加零線
    if (yScale.domain()[0] <= 0 && yScale.domain()[1] >= 0) {
      g.append("line")
        .attr("class", "zero-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("stroke", "#333")
        .attr("stroke-width", 2)
        .style("opacity", 0.8);
    }

    // 添加網格線
    const yTicks = yScale.ticks(8);
    g.selectAll(".grid-line")
      .data(yTicks)
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 0.5)
      .style("opacity", 0.6);

    // 添加標題
    g.append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text(options.title || `${data.labelColumn} 瀑布圖`);

    // 添加軸標籤
    g.append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text(data.labelColumn);

    g.append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 25)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text(`累積 ${data.valueColumn}`);

    // 添加圖例 - 移到右上角避免重疊
    const legend = g.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100}, -20)`);

    const legendData = [
      { label: "增加", color: positiveColor },
      { label: "減少", color: negativeColor },
      { label: "總計", color: neutralColor }
    ];

    const legendItems = legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 18})`);

    legendItems.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", d => d.color)
      .attr("rx", 2);

    legendItems.append("text")
      .attr("x", 16)
      .attr("y", 6)
      .attr("dy", "0.35em")
      .style("font-size", "11px")
      .style("fill", "#333")
      .text(d => d.label);

  }, [data, options]);

  // 錯誤處理
  if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💧</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>瀑布圖需要有效資料</div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#999' }}>
            請確保資料包含 {data?.labelColumn} 和 {data?.valueColumn} 欄位
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

export default WaterfallChart;