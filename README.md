# 智能視覺化推薦系統 (Intelligent Visualization Recommendation System)

基於 AI 和機器學習的智能資料視覺化推薦系統，結合 Claude AI 自然語言處理和 VizML 特徵分析，為使用者提供最適合的圖表推薦。

## 功能特色

### 🤖 AI 驅動的智能推薦
- **Claude AI 自然語言理解**：支援中文描述，理解使用者的視覺化需求
- **VizML 機器學習分析**：基於 841 種資料特徵的專業推薦
- **混合推薦系統**：結合 AI 和 ML 的雙重智能分析

### 📊 豐富的圖表類型
- 基礎圖表：長條圖、線圖、散佈圖、圓餅圖
- 進階圖表：分組長條圖、面積圖、直方圖
- 客製化圖表：使用 D3.js 開發的特殊視覺化

### 📁 多格式資料支援
- CSV 檔案
- Excel 檔案 (.xlsx, .xls)
- JSON 格式
- 自動資料類型識別和統計分析

### 🎯 使用者友善設計
- 直觀的拖拽上傳介面
- 即時資料分析和預覽
- 教育導向的推薦解釋
- 響應式設計支援各種裝置

## 技術架構

### 前端技術
- **React.js** - 主要前端框架
- **Material-UI** - 現代化 UI 組件
- **Chart.js** - 基礎圖表渲染
- **D3.js** - 進階客製化視覺化
- **Axios** - API 通訊

### 後端技術
- **Node.js + Express** - RESTful API 服務
- **Python** - 資料分析和機器學習
- **Claude API** - 自然語言處理
- **VizML** - 視覺化推薦引擎
- **Multer** - 檔案上傳處理

### 資料處理
- **Pandas** - 資料操作和分析
- **NumPy** - 數值計算
- **Scikit-learn** - 機器學習特徵提取

## 安裝和使用

### 環境需求
- Node.js 16+ 
- Python 3.9+
- Conda 或 Miniconda

### 安裝步驟

1. **克隆專案**
```bash
git clone https://github.com/your-username/intelligent-viz-system.git
cd intelligent-viz-system

設置 Python 環境

bashconda create -n vizml python=3.9 -y
conda activate vizml
conda install pandas numpy scikit-learn matplotlib -y

安裝後端依賴

bashcd backend
npm install

安裝前端依賴

bashcd frontend
npm install

環境配置

bashcd backend
cp .env.example .env
# 編輯 .env 文件，添加您的 Claude API 金鑰

啟動服務

bash# 啟動後端 (終端 1)
cd backend
node server.js

# 啟動前端 (終端 2)
cd frontend
npm start
使用方法

上傳資料：拖拽 CSV/Excel/JSON 檔案到上傳區域
查看分析：系統自動分析資料結構和統計特徵
描述需求：用自然語言描述您的視覺化需求
獲取推薦：點擊 AI 推薦按鈕獲取智能建議
生成圖表：選擇推薦的圖表類型立即生成視覺化

專案結構
intelligent-viz-system/
├── backend/                 # 後端服務
│   ├── services/           # 業務邏輯服務
│   │   ├── claudeService.js      # Claude AI 整合
│   │   ├── modernVizMLService.js # VizML 推薦引擎
│   │   ├── dataService.js        # 資料處理服務
│   │   └── chartService.js       # 圖表生成服務
│   ├── python-scripts/     # Python 分析腳本
│   └── server.js          # Express 主服務器
├── frontend/               # React 前端應用
│   ├── src/
│   │   ├── components/    # React 組件
│   │   └── App.js        # 主應用組件
│   └── public/
├── external-projects/      # 外部專案整合
└── docs/                  # 專案文件
核心創新
1. 混合式 AI 推薦
結合大型語言模型的語義理解能力與傳統機器學習的統計分析，提供更準確的視覺化建議。
2. 中文自然語言支援
針對中文使用者優化的自然語言處理，支援中文描述的視覺化需求理解。
3. 教育導向設計
不僅提供推薦結果，還解釋推薦理由，幫助使用者學習資料視覺化的最佳實踐。
4. 擴展性架構
模組化設計支援新圖表類型的輕鬆添加和功能擴展。
開發背景
這個專案是數據科學研究所的學術專案，旨在探索 AI 技術在資料視覺化領域的應用潛力。通過整合現有的開源專案（VizML、Data Formulator、OpenCharts）並加入創新的 AI 功能，創造出一個功能完整、技術先進的智能視覺化系統。
貢獻
歡迎提交 Issue 和 Pull Request 來改進這個專案！
授權
本專案採用 MIT 授權條款。
聯絡
如有任何問題或建議，請透過 GitHub Issues 與我聯絡。
