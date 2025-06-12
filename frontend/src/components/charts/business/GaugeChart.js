import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({ data, options = {} }) => {
  // 從選項中提取儀表板特定配置
  const {
    title = '儀表板',
    minValue = 0,
    maxValue = 100,
    thresholds = [30, 70],
    unit = '',
    showPercentage = true
  } = options;

  // 更智能的數值計算
  const calculateCurrentValue = () => {
    if (!data || !data.datasets || !data.datasets[0] || !data.datasets[0].data) {
      return 50; // 預設值
    }

    const values = data.datasets[0].data;
    
    // 如果資料只有一個值，直接使用
    if (values.length === 1) {
      return parseFloat(values[0]) || 0;
    }

    // 如果是儀表板格式 [currentValue, remainingValue]
    if (values.length === 2) {
      return parseFloat(values[0]) || 0;
    }

    // 如果是多個值，計算平均值
    const numericValues = values.filter(val => !isNaN(parseFloat(val)));
    if (numericValues.length === 0) return 50;
    
    return numericValues.reduce((sum, val) => sum + parseFloat(val), 0) / numericValues.length;
  };

  const currentValue = calculateCurrentValue();
  
  // 自動調整最大值範圍
  const autoMaxValue = maxValue === 100 && currentValue > 100 ? 
    Math.ceil(currentValue * 1.2 / 10) * 10 : maxValue;
  
  const percentage = ((currentValue - minValue) / (autoMaxValue - minValue)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // 根據閾值確定顏色和狀態
  const getColorAndStatus = () => {
    if (clampedPercentage < thresholds[0]) {
      return {
        color: '#F44336', // 紅色 (差)
        status: '需改善',
        statusColor: '#F44336'
      };
    } else if (clampedPercentage < thresholds[1]) {
      return {
        color: '#FF9800', // 橙色 (中等)
        status: '中等',
        statusColor: '#FF9800'
      };
    } else {
      return {
        color: '#4CAF50', // 綠色 (好)
        status: '良好',
        statusColor: '#4CAF50'
      };
    }
  };

  const { color, status, statusColor } = getColorAndStatus();

  // 計算儀表板的值
  const gaugeValue = (clampedPercentage / 100) * 180; // 半圓的180度
  const remainingValue = 180 - gaugeValue;

  // 更新資料配置
  const chartData = {
    datasets: [{
      data: [gaugeValue, remainingValue, 180], // 第三個值用於填滿下半圓
      backgroundColor: [color, '#E0E0E0', 'transparent'],
      borderColor: [color, '#E0E0E0', 'transparent'],
      borderWidth: 0,
      cutout: '75%',
      rotation: 270, // 從底部開始
      circumference: 180 // 只顯示上半圓
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };

  // 計算刻度標記
  const generateScaleMarks = () => {
    const marks = [];
    const steps = 5; // 5個刻度標記
    for (let i = 0; i <= steps; i++) {
      const value = minValue + (i * (autoMaxValue - minValue)) / steps;
      marks.push(value.toFixed(0));
    }
    return marks;
  };

  const scaleMarks = generateScaleMarks();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 儀表板圖表 */}
      <div style={{ position: 'relative', height: '70%' }}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
      
      {/* 中心數值顯示 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -10%)',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: color,
          lineHeight: 1,
          marginBottom: '4px'
        }}>
          {currentValue.toFixed(1)}{unit}
        </div>
        {showPercentage && (
          <div style={{
            fontSize: '14px',
            color: statusColor,
            fontWeight: '500'
          }}>
            {clampedPercentage.toFixed(0)}%
          </div>
        )}
        <div style={{
          fontSize: '12px',
          color: statusColor,
          marginTop: '2px',
          fontWeight: '500'
        }}>
          {status}
        </div>
      </div>

      {/* 標題 */}
      <div style={{
        position: 'absolute',
        top: '5px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center'
      }}>
        {title}
      </div>

      {/* 刻度標示 */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '10px',
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between',
        width: '85%'
      }}>
        {scaleMarks.map((mark, index) => (
          <span key={index} style={{ 
            fontWeight: index === 0 || index === scaleMarks.length - 1 ? 'bold' : 'normal'
          }}>
            {mark}
          </span>
        ))}
      </div>

      {/* 狀態指示器 */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        fontSize: '10px',
        color: '#999'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
          marginRight: '4px'
        }}></div>
        範圍: {minValue} - {autoMaxValue}{unit}
      </div>
    </div>
  );
};

export default GaugeChart;