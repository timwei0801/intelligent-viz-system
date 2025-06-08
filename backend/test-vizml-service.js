const modernVizMLService = require('./services/modernVizMLService');

const testData = [
  {"日期":"2024-01-01","產品類別":"電子產品","銷售額":15000,"銷售量":50,"地區":"台北"},
  {"日期":"2024-01-02","產品類別":"服飾","銷售額":8000,"銷售量":120,"地區":"台中"}
];

async function testService() {
  try {
    console.log('🧪 開始測試 VizML Service...');
    const result = await modernVizMLService.recommendVisualization(testData);
    console.log('🎉 測試成功!');
    console.log('結果:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('💥 測試失敗:', error.message);
    console.error('完整錯誤:', error);
  }
}

testService();