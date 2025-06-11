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
    unit = ''
  } = options;

  // 計算當前值
  const values = data.datasets[0].data;
  const currentValue = values[0];
  const percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;

  // 根據閾值確定顏色
  let color = '#4CAF50'; // 綠色 (好)
  let status = '良好';
  
  if (percentage < thresholds[0]) {
    color = '#F44336'; // 紅色 (差)
    status = '需改善';
  } else if (percentage < thresholds[1]) {
    color = '#FF9800'; // 橙色 (中等)
    status = '中等';
  }

  // 更新資料顏色
  const chartData = {
    ...data,
    datasets: [{
      ...data.datasets[0],
      backgroundColor: [color, '#E0E0E0']
    }]
  };

  const chartOptions = {
    ...options,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...options.plugins,
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Doughnut data={chartData} options={chartOptions} />
      
      {/* 中心文字覆蓋 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -20%)',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: color,
          lineHeight: 1
        }}>
          {currentValue.toFixed(1)}{unit}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#666',
          marginTop: '4px'
        }}>
          {status}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#999',
          marginTop: '2px'
        }}>
          {percentage.toFixed(0)}%
        </div>
      </div>

      {/* 標題 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }}>
        {title}
      </div>

      {/* 刻度標示 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '10px',
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between',
        width: '80%'
      }}>
        <span>{minValue}</span>
        <span>{((maxValue - minValue) / 2 + minValue).toFixed(0)}</span>
        <span>{maxValue}</span>
      </div>
    </div>
  );
};

export default GaugeChart;