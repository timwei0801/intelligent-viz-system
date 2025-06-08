// 首先載入 polyfills
require('../utils/polyfills');

const Anthropic = require('@anthropic-ai/sdk');

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  // 分析使用者的中文自然語言輸入，轉換為視覺化需求
  async analyzeVisualizationIntent(userInput, dataInfo = null) {
    try {
      const systemPrompt = `你是一個專業的數據視覺化專家。請分析使用者的需求，並返回結構化的視覺化建議。

請根據使用者的描述，返回 JSON 格式的分析結果，包含：
- chartTypes: 建議的圖表類型陣列
- reasoning: 推薦理由
- dataRequirements: 所需的資料欄位類型
- visualElements: 視覺元素建議

範例輸出：
{
  "chartTypes": ["scatter", "line", "bar"],
  "reasoning": "基於您的需求分析...",
  "dataRequirements": ["numerical", "categorical"],
  "visualElements": {
    "xAxis": "時間",
    "yAxis": "數值",
    "color": "分類"
  }
}`;

      const dataContext = dataInfo ? `\n\n資料資訊：${JSON.stringify(dataInfo)}` : '';
      
      const response = await this.client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `${systemPrompt}\n\n使用者需求：${userInput}${dataContext}`
        }]
      });

      // 嘗試解析 JSON 回應
      const content = response.content[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        // 如果沒有找到 JSON，返回基本結構
        return {
          chartTypes: ["bar", "line"],
          reasoning: content,
          dataRequirements: ["numerical"],
          visualElements: {}
        };
      }
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('分析視覺化需求時發生錯誤');
    }
  }

  // 解釋圖表選擇的教育功能
  async explainChartChoice(chartType, dataContext) {
    try {
      const response = await this.client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `請用繁體中文解釋為什麼 ${chartType} 圖表適合這個資料情境：${dataContext}
          
          請包含：
          1. 適用場景
          2. 優點
          3. 注意事項
          4. 使用建議`
        }]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('生成圖表解釋時發生錯誤');
    }
  }
}

module.exports = new ClaudeService();