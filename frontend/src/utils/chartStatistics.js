// ===========================================
// 統計學原理的圖表配置邏輯
// 根據統計學最佳實踐為每種圖表類型提供合適的軸配置
// ===========================================

/**
 * 根據統計學原理推薦圖表配置
 * @param {string} chartType - 圖表類型
 * @param {array} numericalColumns - 數值型欄位
 * @param {array} categoricalColumns - 分類型欄位
 * @param {array} temporalColumns - 時間型欄位
 * @param {array} allColumns - 所有欄位
 * @returns {object} 推薦的圖表配置
 */
export const getStatisticalChartConfig = (chartType, numericalColumns, categoricalColumns, temporalColumns, allColumns) => {
  
  console.log('🔬 統計學配置分析:', {
    chartType,
    numerical: numericalColumns,
    categorical: categoricalColumns,
    temporal: temporalColumns
  });

  switch (chartType.toLowerCase()) {
    
    // === 比較型圖表 ===
    
    // 長條圖：比較不同類別的數值
    case 'bar':
      return {
        xColumn: categoricalColumns[0] || allColumns[0],     // X軸：分類變數
        yColumn: numericalColumns[0] || allColumns[1],       // Y軸：數值變數
        groupBy: categoricalColumns[1] || '',               // 可選：次級分類
        title: `${categoricalColumns[0] || '類別'} 的 ${numericalColumns[0] || '數值'} 比較`,
        description: '適合比較不同類別的數值大小',
        statisticalPurpose: '類別比較'
      };

    // 水平長條圖：當類別名稱較長或要強調數值排序時
    case 'horizontalbar':
      return {
        xColumn: numericalColumns[0] || allColumns[1],       // X軸：數值變數（水平）
        yColumn: categoricalColumns[0] || allColumns[0],     // Y軸：分類變數（垂直）
        title: `${categoricalColumns[0] || '類別'} 水平排序圖`,
        description: '適合類別名稱較長或強調排序的場景',
        statisticalPurpose: '類別排序比較'
      };

    // 分組長條圖：多維度比較
    case 'groupedbar':
      return {
        xColumn: categoricalColumns[0] || allColumns[0],     // X軸：主分類
        groupByColumn: categoricalColumns[1] || categoricalColumns[0], // 分組：子分類
        valueColumn: numericalColumns[0] || allColumns[2],   // 數值：要比較的指標
        title: `${categoricalColumns[0] || '主類別'} 按 ${categoricalColumns[1] || '子類別'} 分組比較`,
        description: '適合比較主類別下不同子類別的數值',
        statisticalPurpose: '多維度分組比較'
      };

    // 堆疊長條圖：部分與整體關係
    case 'stackedbar':
      return {
        xColumn: categoricalColumns[0] || allColumns[0],     // X軸：主分類
        groupByColumn: categoricalColumns[1] || categoricalColumns[0], // 堆疊：組成部分
        valueColumn: numericalColumns[0] || allColumns[2],   // 數值：要堆疊的數量
        title: `${categoricalColumns[0] || '主類別'} 的組成結構分析`,
        description: '適合展示整體中各部分的組成比例',
        statisticalPurpose: '部分與整體關係'
      };

    // === 趨勢型圖表 ===
    
    // 線圖：展示變化趨勢
    case 'line':
      return {
        xColumn: temporalColumns[0] || categoricalColumns[0] || allColumns[0], // X軸：時間或順序
        yColumn: numericalColumns[0] || allColumns[1],       // Y軸：要觀察趨勢的數值
        title: `${numericalColumns[0] || '數值'} 變化趨勢`,
        description: '適合展示數值隨時間或順序的變化',
        statisticalPurpose: '趨勢分析'
      };

    // 面積圖：強調累積效果的趨勢
    case 'area':
      return {
        xColumn: temporalColumns[0] || categoricalColumns[0] || allColumns[0],
        yColumn: numericalColumns[0] || allColumns[1],
        title: `${numericalColumns[0] || '數值'} 累積趨勢`,
        description: '適合展示累積效果和趨勢',
        statisticalPurpose: '累積趨勢分析'
      };

    // 堆疊面積圖：多系列累積趨勢
    case 'stackedarea':
      return {
        xColumn: temporalColumns[0] || categoricalColumns[0] || allColumns[0], // X軸：時間
        groupByColumn: categoricalColumns[0] || categoricalColumns[1],         // 分組：不同系列
        valueColumn: numericalColumns[0] || allColumns[2],                     // 數值：累積數量
        title: `多系列累積趨勢分析`,
        description: '適合展示多個系列隨時間的累積變化',
        statisticalPurpose: '多系列累積趨勢'
      };

    // 階梯線圖：離散變化
    case 'stepline':
      return {
        xColumn: temporalColumns[0] || categoricalColumns[0] || allColumns[0],
        yColumn: numericalColumns[0] || allColumns[1],
        title: `${numericalColumns[0] || '數值'} 階梯變化`,
        description: '適合展示離散的、階段性的變化',
        statisticalPurpose: '階段性變化分析'
      };

    // === 關係型圖表 ===
    
    // 散佈圖：兩變數相關性
    case 'scatter':
      return {
        xColumn: numericalColumns[0] || allColumns[0],       // X軸：自變數
        yColumn: numericalColumns[1] || numericalColumns[0] || allColumns[1], // Y軸：依變數
        colorBy: categoricalColumns[0] || '',               // 可選：按類別著色
        title: `${numericalColumns[0] || 'X變數'} vs ${numericalColumns[1] || 'Y變數'} 關係分析`,
        description: '適合探索兩個數值變數之間的關係',
        statisticalPurpose: '相關性分析'
      };

    // 氣泡圖：三變數關係
    case 'bubble':
      return {
        xColumn: numericalColumns[0] || allColumns[0],       // X軸：第一數值變數
        yColumn: numericalColumns[1] || numericalColumns[0] || allColumns[1], // Y軸：第二數值變數
        sizeBy: numericalColumns[2] || numericalColumns[0] || allColumns[2],  // 大小：第三數值變數
        colorBy: categoricalColumns[0] || '',               // 可選：按類別著色
        title: `三維關係分析`,
        description: '適合同時分析三個變數之間的關係',
        statisticalPurpose: '多變數關係分析'
      };

    // === 組成型圖表 ===
    
    // 圓餅圖：比例組成
    case 'pie':
    case 'doughnut':
      return {
        xColumn: categoricalColumns[0] || allColumns[0],     // 類別
        yColumn: numericalColumns[0] || allColumns[1],       // 數值
        title: `${categoricalColumns[0] || '類別'} 組成比例`,
        description: '適合展示各部分占整體的比例',
        statisticalPurpose: '比例組成分析'
      };

    // 極坐標圖：循環數據或多維比較
    case 'polararea':
      return {
        xColumn: categoricalColumns[0] || allColumns[0],
        yColumn: numericalColumns[0] || allColumns[1],
        title: `${categoricalColumns[0] || '類別'} 極坐標分布`,
        description: '適合循環數據或多維度比較',
        statisticalPurpose: '循環數據分析'
      };

    // === 多維度型圖表 ===
    
    // 雷達圖：多指標綜合評估
    case 'radar':
      return {
        xColumn: categoricalColumns[0] || allColumns[0],     // 各個指標維度
        yColumn: numericalColumns[0] || allColumns[1],       // 各指標的數值
        groupBy: categoricalColumns[1] || '',               // 可選：不同對象
        title: `多指標雷達分析`,
        description: '適合多個指標的綜合評估和比較',
        statisticalPurpose: '多指標評估'
      };

    // === 分布型圖表 ===
    
    // 直方圖：單變數分布
    case 'histogram':
      return {
        xColumn: numericalColumns[0] || allColumns[0],       // 要分析分布的變數
        bins: 20,                                            // 分組數量
        title: `${numericalColumns[0] || '數值'} 分布分析`,
        description: '適合了解單一數值變數的分布形狀',
        statisticalPurpose: '分布分析'
      };

    // 箱型圖：分布統計摘要
    case 'boxplot':
      return {
        yColumn: numericalColumns[0] || allColumns[0],       // 要分析的數值變數
        groupBy: categoricalColumns[0] || '',               // 可選：按類別分組
        title: `${numericalColumns[0] || '數值'} 箱型圖${categoricalColumns[0] ? ` (按 ${categoricalColumns[0]} 分組)` : ''}`,
        description: '適合比較不同組別的分布特徵',
        statisticalPurpose: '分布統計比較'
      };

    // 小提琴圖：詳細分布形狀
    case 'violin':
      return {
        yColumn: numericalColumns[0] || allColumns[0],
        groupBy: categoricalColumns[0] || '',
        title: `${numericalColumns[0] || '數值'} 小提琴圖${categoricalColumns[0] ? ` (按 ${categoricalColumns[0]} 分組)` : ''}`,
        description: '適合詳細比較不同組別的分布形狀',
        statisticalPurpose: '詳細分布分析'
      };

    // === 關聯型圖表 ===
    
    // 熱力圖：兩分類變數的關聯
    case 'heatmap':
      return {
        xColumn: categoricalColumns[0] || allColumns[0],     // X軸分類
        yColumn: categoricalColumns[1] || categoricalColumns[0] || allColumns[1], // Y軸分類
        valueColumn: numericalColumns[0] || allColumns[2],   // 關聯強度
        title: `${categoricalColumns[0] || 'X類別'} vs ${categoricalColumns[1] || 'Y類別'} 關聯熱力圖`,
        description: '適合展示兩個分類變數之間的關聯強度',
        statisticalPurpose: '關聯分析'
      };

    // === 流程型圖表 ===
    
    // 混合圖表：雙軸比較不同量級數據
    case 'mixedchart':
      return {
        xColumn: temporalColumns[0] || categoricalColumns[0] || allColumns[0], // X軸：時間或分類
        barColumn: numericalColumns[0] || allColumns[1],     // 左軸(柱狀)：第一指標
        lineColumn: numericalColumns[1] || numericalColumns[0] || allColumns[2], // 右軸(線條)：第二指標
        title: `雙軸對比分析：${numericalColumns[0] || '指標1'} vs ${numericalColumns[1] || '指標2'}`,
        description: '適合比較兩個不同量級或性質的指標',
        statisticalPurpose: '雙軸對比分析'
      };

    // 瀑布圖：累積變化過程
    case 'waterfall':
      return {
        xColumn: categoricalColumns[0] || allColumns[0],     // 各個階段
        yColumn: numericalColumns[0] || allColumns[1],       // 變化量
        title: `${categoricalColumns[0] || '階段'} 累積變化分析`,
        description: '適合展示從起點到終點的累積變化過程',
        statisticalPurpose: '累積變化分析'
      };

    // 漏斗圖：轉換流程分析
    case 'funnel':
      return {
        xColumn: categoricalColumns[0] || allColumns[0],     // 各個階段
        yColumn: numericalColumns[0] || allColumns[1],       // 各階段數量
        title: `${categoricalColumns[0] || '階段'} 轉換漏斗分析`,
        description: '適合分析多階段流程的轉換效率',
        statisticalPurpose: '轉換率分析'
      };

    // === 商業智慧圖表 ===
    
    // 儀表板圖：KPI監控
    case 'gauge':
      return {
        valueColumn: numericalColumns[0] || allColumns[0],   // 監控指標
        target: null,                                        // 目標值（自動計算）
        thresholds: [30, 70],                               // 預警閾值
        title: `${numericalColumns[0] || '指標'} 監控儀表板`,
        description: '適合監控單一關鍵指標的達成狀況',
        statisticalPurpose: 'KPI監控'
      };

    // 子彈圖：目標達成分析
    case 'bullet':
      return {
        xColumn: categoricalColumns[0] || allColumns[0],     // 項目名稱
        valueColumn: numericalColumns[0] || allColumns[1],   // 實際值
        targetColumn: numericalColumns[1] || numericalColumns[0] || allColumns[2], // 目標值
        title: `${categoricalColumns[0] || '項目'} 目標達成分析`,
        description: '適合比較實際績效與目標的差距',
        statisticalPurpose: '目標達成分析'
      };

    // KPI卡片：關鍵指標展示
    case 'kpicard':
      return {
        valueColumn: numericalColumns[0] || allColumns[0],
        title: `${numericalColumns[0] || '指標'} KPI`,
        format: 'number',
        showTrend: true,
        description: '適合突出顯示關鍵業務指標',
        statisticalPurpose: '關鍵指標展示'
      };

    // 桑基圖：流向分析
    case 'sankey':
      return {
        sourceColumn: categoricalColumns[0] || allColumns[0], // 來源
        targetColumn: categoricalColumns[1] || allColumns[1], // 目標
        valueColumn: numericalColumns[0] || allColumns[2],    // 流量
        title: `${categoricalColumns[0] || '來源'} → ${categoricalColumns[1] || '目標'} 流向分析`,
        description: '適合分析資源在不同類別間的流動',
        statisticalPurpose: '流向分析'
      };

    // 樹狀圖：層級結構
    case 'treemap':
      return {
        labelColumn: categoricalColumns[0] || allColumns[0], // 類別標籤
        valueColumn: numericalColumns[0] || allColumns[1],   // 區塊大小
        groupByColumn: categoricalColumns[1] || categoricalColumns[0], // 分組
        title: `${categoricalColumns[0] || '類別'} 層級結構分析`,
        description: '適合展示層級結構中各部分的相對大小',
        statisticalPurpose: '層級結構分析'
      };

    // === 預設情況 ===
    default:
      return {
        xColumn: categoricalColumns[0] || temporalColumns[0] || allColumns[0],
        yColumn: numericalColumns[0] || allColumns[1],
        title: `${allColumns[0] || 'X軸'} vs ${allColumns[1] || 'Y軸'} 分析`,
        description: '通用圖表配置',
        statisticalPurpose: '數據探索'
      };
  }
};

/**
 * 獲取圖表的統計學建議
 * @param {string} chartType - 圖表類型
 * @returns {object} 統計學建議
 */
export const getStatisticalAdvice = (chartType) => {
  const adviceMap = {
    // 比較型圖表建議
    bar: {
      whenToUse: '當需要比較不同類別的數值時',
      dataRequirements: '至少需要一個分類變數和一個數值變數',
      bestPractices: ['排序類別以便比較', '使用一致的顏色方案', '從零開始Y軸'],
      avoid: ['類別過多（建議少於10個）', '使用3D效果', '截斷Y軸']
    },
    
    horizontalbar: {
      whenToUse: '當類別名稱較長或需要強調排序時',
      dataRequirements: '與長條圖相同',
      bestPractices: ['按數值大小排序', '類別名稱靠右對齊', '突出最重要的幾個類別'],
      avoid: ['類別過多', '使用過於鮮豔的顏色']
    },

    line: {
      whenToUse: '展示數值隨時間或順序的變化趨勢',
      dataRequirements: 'X軸為時間或有序變數，Y軸為數值變數',
      bestPractices: ['保持線條簡潔', '使用適當的時間間隔', '添加趨勢標註'],
      avoid: ['連接不相關的點', '使用過多線條（建議少於5條）']
    },

    scatter: {
      whenToUse: '探索兩個數值變數之間的關係',
      dataRequirements: '兩個數值變數',
      bestPractices: ['添加趨勢線', '使用透明度處理重疊', '考慮添加第三變數作為顏色'],
      avoid: ['數據點過多導致過度繪製', '忽略異常值']
    },

    pie: {
      whenToUse: '展示部分與整體的比例關係',
      dataRequirements: '分類變數和對應的數值',
      bestPractices: ['類別數量少於7個', '最大的扇形放在12點位置', '使用清晰的標籤'],
      avoid: ['類別過多', '使用3D效果', '比較多個圓餅圖']
    },

    histogram: {
      whenToUse: '了解數值變數的分布形狀',
      dataRequirements: '一個數值變數',
      bestPractices: ['選擇適當的分組數', '標註統計量（均值、中位數）', '考慮使用密度曲線'],
      avoid: ['分組過少或過多', '忽略分布的偏態性']
    },

    boxplot: {
      whenToUse: '比較不同組別的分布特徵',
      dataRequirements: '數值變數，可選分組變數',
      bestPractices: ['標註統計意義', '處理異常值', '使用小提琴圖補充分布形狀'],
      avoid: ['組別過多', '忽略樣本量差異']
    }
  };

  return adviceMap[chartType] || {
    whenToUse: '根據數據特性選擇合適的圖表類型',
    dataRequirements: '確保數據品質和完整性',
    bestPractices: ['保持圖表簡潔清晰', '使用適當的顏色對比', '添加必要的標題和標籤'],
    avoid: ['過度裝飾', '誤導性的視覺效果', '忽略數據完整性']
  };
};

/**
 * 驗證圖表配置的統計學合理性
 * @param {string} chartType - 圖表類型
 * @param {object} config - 圖表配置
 * @param {object} dataInfo - 數據資訊
 * @returns {object} 驗證結果
 */
export const validateStatisticalConfig = (chartType, config, dataInfo) => {
  const warnings = [];
  const suggestions = [];

  // 通用驗證
  if (!config.xColumn && !config.valueColumn) {
    warnings.push('缺少必要的數據欄位配置');
  }

  // 特定圖表類型驗證
  switch (chartType.toLowerCase()) {
    case 'bar':
    case 'horizontalbar':
      if (dataInfo.types[config.xColumn] === 'numerical' && dataInfo.types[config.yColumn] === 'categorical') {
        warnings.push('建議將分類變數放在X軸，數值變數放在Y軸');
        suggestions.push('交換X軸和Y軸的欄位選擇');
      }
      break;

    case 'line':
      if (dataInfo.types[config.xColumn] !== 'temporal' && dataInfo.types[config.xColumn] !== 'categorical') {
        suggestions.push('線圖通常使用時間或有序類別作為X軸');
      }
      break;

    case 'scatter':
      if (dataInfo.types[config.xColumn] !== 'numerical' || dataInfo.types[config.yColumn] !== 'numerical') {
        warnings.push('散佈圖需要兩個數值變數');
      }
      break;

    case 'pie':
      if (dataInfo.uniqueValues && dataInfo.uniqueValues[config.xColumn] > 7) {
        warnings.push('圓餅圖類別過多，建議少於7個');
        suggestions.push('考慮合併小類別或使用長條圖');
      }
      break;

    case 'histogram':
      if (dataInfo.types[config.xColumn] !== 'numerical') {
        warnings.push('直方圖需要數值變數');
      }
      break;
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions,
    statisticalAdvice: getStatisticalAdvice(chartType)
  };
};

/**
 * 根據數據特性推薦最適合的圖表類型
 * @param {object} dataInfo - 數據資訊
 * @returns {array} 推薦的圖表類型列表
 */
export const recommendChartTypes = (dataInfo) => {
  const { numericalColumns, categoricalColumns, temporalColumns, rowCount } = dataInfo;
  const recommendations = [];

  // 基於數據特性的推薦邏輯
  if (categoricalColumns.length >= 1 && numericalColumns.length >= 1) {
    if (categoricalColumns[0] && dataInfo.uniqueValues[categoricalColumns[0]] <= 10) {
      recommendations.push({
        type: 'bar',
        reason: '適合比較不同類別的數值',
        confidence: 0.9
      });
    }
    
    if (dataInfo.uniqueValues[categoricalColumns[0]] <= 6) {
      recommendations.push({
        type: 'pie',
        reason: '適合展示各類別的組成比例',
        confidence: 0.8
      });
    }
  }

  if (temporalColumns.length >= 1 && numericalColumns.length >= 1) {
    recommendations.push({
      type: 'line',
      reason: '適合展示時間序列趨勢',
      confidence: 0.95
    });
  }

  if (numericalColumns.length >= 2) {
    recommendations.push({
      type: 'scatter',
      reason: '適合探索兩個數值變數的關係',
      confidence: 0.85
    });
  }

  if (numericalColumns.length >= 1) {
    recommendations.push({
      type: 'histogram',
      reason: '適合了解數值分布',
      confidence: 0.8
    });
  }

  if (categoricalColumns.length >= 2 && numericalColumns.length >= 1) {
    recommendations.push({
      type: 'groupedbar',
      reason: '適合多維度分組比較',
      confidence: 0.8
    });
  }

  // 按信心度排序
  return recommendations.sort((a, b) => b.confidence - a.confidence);
};

export default {
  getStatisticalChartConfig,
  getStatisticalAdvice,
  validateStatisticalConfig,
  recommendChartTypes
};