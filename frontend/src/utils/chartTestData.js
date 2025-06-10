// 測試資料生成器
export const generateTestData = {
  // 生成時間序列資料
  timeSeries: (points = 12) => {
    const labels = Array.from({ length: points }, (_, i) => `${i + 1}月`);
    const data = Array.from({ length: points }, () => Math.floor(Math.random() * 100));
    
    return {
      labels,
      datasets: [{
        label: '數據',
        data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }]
    };
  },

  // 生成分類資料
  categorical: (categories = ['A', 'B', 'C', 'D']) => {
    const data = categories.map(() => Math.floor(Math.random() * 100));
    
    return {
      labels: categories,
      data
    };
  },

  // 生成散佈圖資料
  scatter: (points = 20) => {
    const data = Array.from({ length: points }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));

    return {
      datasets: [{
        label: '數據點',
        data,
        backgroundColor: 'rgba(255, 99, 132, 0.7)'
      }]
    };
  },

  // 生成多系列資料
  multiSeries: (series = 2, points = 6) => {
    const labels = Array.from({ length: points }, (_, i) => `項目${i + 1}`);
    const datasets = Array.from({ length: series }, (_, i) => ({
      label: `系列${i + 1}`,
      data: Array.from({ length: points }, () => Math.floor(Math.random() * 100)),
      borderColor: `hsl(${i * 60}, 70%, 50%)`,
      backgroundColor: `hsla(${i * 60}, 70%, 50%, 0.3)`
    }));

    return { labels, datasets };
  }
};