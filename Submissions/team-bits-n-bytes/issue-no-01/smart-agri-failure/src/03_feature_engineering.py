import pandas as pd
import numpy as np
import os

# =========================
# 1. Load the cleaned dataset
# =========================
data_path = os.path.join("data", "cleaned_data.csv")
df = pd.read_csv(data_path, sep="\t")  # Use sep='\t' if needed

# If it loads as 1 column incorrectly, reload without sep
if df.shape[1] == 1:
    df = pd.read_csv(data_path)

print(f"🔹 Loaded data shape: {df.shape}")
print(f"🔹 Columns: {list(df.columns)}")

# =========================
# 2. Feature Engineering
# =========================
# New numeric features
df["Temp_Diff"] = df["Process_temperature_K"] - df["Air_temperature_K"]
df["Torque_per_Speed"] = df["Torque_Nm"] / df["Rotational_speed_rpm"]
df["Tool_wear_log"] = df["Tool_wear_min"].apply(lambda x: 0 if x == 0 else np.log1p(x))

# Drop duplicates
df = df.drop_duplicates()

# =========================
# 3. Encode categorical columns
# =========================
categorical_cols = df.select_dtypes(include=['object']).columns
if len(categorical_cols) > 0:
    print(f"🔹 Encoding categorical columns: {list(categorical_cols)}")
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)  # one-hot encoding

# =========================
# 4. Save engineered data
# =========================
output_path = os.path.join("data", "feature_engineered_data.csv")
df.to_csv(output_path, index=False)

print(f"✅ Feature engineering complete! New shape: {df.shape}")
print(f"💾 Saved to: {output_path}")

print("\n🔹 Sample of new features:")
print(df.head())
