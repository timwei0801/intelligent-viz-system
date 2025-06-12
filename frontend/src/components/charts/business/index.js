// 商業智慧圖表組件集合
export { default as GaugeChart } from './GaugeChart';
export { default as FunnelChart } from './FunnelChart';
export { default as SankeyChart } from './SankeyChart';
export { default as TreemapChart } from './TreemapChart';
export { default as BulletChart } from './BulletChart';
export { default as KPICard } from './KPICard';

// 商業圖表配置
export const BUSINESS_CHART_CONFIGS = {
  gauge: {
    name: '儀表板圖',
    description: '顯示單一指標的進度和狀態',
    category: 'business',
    requiredData: ['單一數值', '目標值（可選）'],
    useCases: ['KPI監控', '完成度展示', '效能指標']
  },
  
  funnel: {
    name: '漏斗圖',
    description: '展示轉換流程中各階段的數量變化',
    category: 'business',
    requiredData: ['階段標籤', '對應數值'],
    useCases: ['銷售漏斗', '轉換分析', '流程優化']
  },
  
  sankey: {
    name: '桑基圖',
    description: '視覺化流量在不同節點間的分配',
    category: 'business',
    requiredData: ['來源節點', '目標節點', '流量數值'],
    useCases: ['資金流向', '用戶流向', '能源分析']
  },
  
  treemap: {
    name: '樹狀圖',
    description: '用矩形大小表示層次化數據的比例關係',
    category: 'business',
    requiredData: ['分類標籤', '數值', '父級分類（可選）'],
    useCases: ['市場份額', '預算分配', '組織結構']
  },
  

  bullet: {
    name: '子彈圖',
    description: '比較實際值與目標值的進度圖表',
    category: 'business',
    requiredData: ['實際值', '目標值', '標籤'],
    useCases: ['KPI比較', '績效評估', '目標達成']
  },
  
kpiCard: {
    name: 'KPI卡片',
    description: '突出顯示關鍵績效指標',
    category: 'business',
    requiredData: ['指標名稱', '當前值', '比較值（可選）'],
    useCases: ['儀表板', '績效展示', '狀態監控']
  }
};

// 商業圖表工具函數
export const BusinessChartUtils = {
  // 根據數據推薦合適的商業圖表
  recommendBusinessChart: (dataInfo) => {
    const { numericalColumns, categoricalColumns, totalRows } = dataInfo;
    const recommendations = [];

    // 推薦邏輯
    if (numericalColumns >= 1 && categoricalColumns >= 1) {
      if (categoricalColumns === 1 && totalRows <= 8) {
        recommendations.push('funnel');
      }
      if (totalRows >= 5) {
        recommendations.push('treemap');
      }
    }

    if (numericalColumns >= 1 && categoricalColumns >= 2) {
      recommendations.push('sankey');
    }

    if (numericalColumns === 1) {
      recommendations.push('gauge');
    }

    return recommendations;
  },

  // 驗證數據是否適合特定圖表
  validateDataForChart: (data, chartType) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { valid: false, reason: '數據為空或格式不正確' };
    }

    const firstRow = data[0];
    const columns = Object.keys(firstRow);
    const numericalColumns = columns.filter(col => 
      !isNaN(parseFloat(firstRow[col]))
    );
    const categoricalColumns = columns.filter(col => 
      isNaN(parseFloat(firstRow[col]))
    );

    switch (chartType) {
      case 'gauge':
        if (numericalColumns.length < 1) {
          return { valid: false, reason: '儀表板圖需要至少一個數值欄位' };
        }
        break;

      case 'funnel':
        if (numericalColumns.length < 1 || categoricalColumns.length < 1) {
          return { valid: false, reason: '漏斗圖需要分類標籤和對應數值' };
        }
        break;

      case 'sankey':
        if (categoricalColumns.length < 2 || numericalColumns.length < 1) {
          return { valid: false, reason: '桑基圖需要來源、目標欄位和流量數值' };
        }
        break;

      case 'treemap':
        if (numericalColumns.length < 1 || categoricalColumns.length < 1) {
          return { valid: false, reason: '樹狀圖需要分類標籤和對應數值' };
        }
        break;

      default:
        return { valid: true };
    }

    return { valid: true };
  },

  // 為商業圖表生成預設配置
  getDefaultConfig: (chartType, dataInfo) => {
    const { columns, types } = dataInfo;
    const numericalColumns = columns.filter(col => types[col] === 'numerical');
    const categoricalColumns = columns.filter(col => types[col] === 'categorical');

    const configs = {
      gauge: {
        valueColumn: numericalColumns[0],
        title: `${numericalColumns[0]} 指標監控`,
        thresholds: [30, 70],
        unit: ''
      },

      funnel: {
        labelColumn: categoricalColumns[0],
        valueColumn: numericalColumns[0],
        title: `${categoricalColumns[0]} 轉換漏斗`
      },

      sankey: {
        sourceColumn: categoricalColumns[0],
        targetColumn: categoricalColumns[1],
        valueColumn: numericalColumns[0],
        title: `${categoricalColumns[0]} → ${categoricalColumns[1]} 流向分析`
      },

      treemap: {
        labelColumn: categoricalColumns[0],
        valueColumn: numericalColumns[0],
        parentColumn: categoricalColumns[1] || null,
        title: `${categoricalColumns[0]} 組成分析`
      }
    };

    return configs[chartType] || {};
  }
};