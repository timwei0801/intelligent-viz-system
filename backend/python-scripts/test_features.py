#!/usr/bin/env python3
import sys
import json
import pandas as pd
import numpy as np

def main():
    try:
        if len(sys.argv) != 2:
            raise Exception("Usage: python test_features.py <data_file>")
        
        data_file = sys.argv[1]
        
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        df = pd.DataFrame(data)
        
        # 簡單的特徵提取 - 只計算基本統計
        features = [
            float(len(df)),  # 行數
            float(len(df.columns)),  # 欄數
            float(df.select_dtypes(include=[np.number]).shape[1]),  # 數值欄數
            float(df.select_dtypes(include=['object']).shape[1]),  # 文字欄數
            float(df.isnull().sum().sum()),  # 總缺失值
        ]
        
        # 填充到 10 維
        while len(features) < 10:
            features.append(0.0)
        
        result = {
            "features": features,
            "feature_count": len(features),
            "data_shape": [len(df), len(df.columns)],
            "column_info": {
                "columns": list(df.columns),
                "dtypes": {col: str(df[col].dtype) for col in df.columns}
            },
            "status": "success"
        }
        
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        error_result = {
            "error": str(e),
            "status": "error"
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
