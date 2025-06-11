import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// 註冊所有必要的 Chart.js 組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 設定 Chart.js 全域預設值
ChartJS.defaults.font = {
  family: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  size: 12
};

ChartJS.defaults.color = '#666';
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

export default ChartJS;

export const getDefaultChartOptions = (chartType) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    }
  };

  switch (chartType?.toLowerCase()) {
    case 'pie':
    case 'doughnut':
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: { position: 'bottom' }
        }
      };
    
    case 'radar':
      return {
        ...baseOptions,
        scales: {
          r: {
            beginAtZero: true
          }
        }
      };
    
    default:
      return {
        ...baseOptions,
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.1)' } },
          y: { 
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        }
      };
  }
};