
import sys
import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

def extract_statistical_features(df):
    """提取統計特徵（模仿 VizML 的 841 種特徵）"""
    features = []
    
    for col in df.columns:
        if df[col].dtype in ['int64', 'float64']:
            # 數值型欄位特徵
            features.extend([
                df[col].mean(),
                df[col].std(),
                df[col].min(),
                df[col].max(),
                df[col].median(),
                df[col].skew(),
                df[col].kurtosis(),
                df[col].nunique() / len(df),  # 唯一值比例
                df[col].isnull().sum() / len(df),  # 缺失值比例
            ])
        else:
            # 類別型欄位特徵
            features.extend([
                df[col].nunique(),
                len(df[col].astype(str).str.len().mean() if len(df) > 0 else 0),
                df[col].isnull().sum() / len(df),
                0, 0, 0, 0, 0, 0  # 填充到與數值型相同長度
            ])
    
    # 資料集整體特徵
    dataset_features = [
        len(df),  # 行數
        len(df.columns),  # 欄數
        df.select_dtypes(include=[np.number]).shape[1],  # 數值欄數
        df.select_dtypes(include=['object']).shape[1],  # 類別欄數
        df.isnull().sum().sum() / (len(df) * len(df.columns)),  # 整體缺失率
    ]
    
    features.extend(dataset_features)
    
    # 確保特徵向量長度一致（填充到 841 維）
    target_length = 841
    if len(features) < target_length:
        features.extend([0] * (target_length - len(features)))
    elif len(features) > target_length:
        features = features[:target_length]
    
    return np.array(features)

def main():
    try:
        data_file = sys.argv[1]
        
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        df = pd.DataFrame(data)
        features = extract_statistical_features(df)
        
        result = {
            "features": features.tolist(),
            "feature_count": len(features),
            "data_shape": [len(df), len(df.columns)],
            "column_types": {col: str(df[col].dtype) for col in df.columns},
            "status": "success"
        }
        
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({"error": str(e), "status": "error"}, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
