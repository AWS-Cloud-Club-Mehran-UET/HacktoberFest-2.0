# 01_data_explore.py
# Step 1: Basic Data Exploration for Smart Agriculture Failure Prediction

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# ---------- Load Data ----------
data_path = os.path.join("data", "sensor_data.csv")  # <-- make sure your CSV is in the data/ folder
df = pd.read_csv(data_path,sep="\t")
df.columns = df.columns.str.strip().str.replace(" ", "_")

# ---------- Quick Overview ----------
print("\n🔹 Data Preview:")
print(df.head())

print("\n🔹 Shape (rows, columns):", df.shape)
print("\n🔹 Column Info:")
print(df.info())

# ---------- Missing Values ----------
print("\n🔹 Missing Values per Column:")
print(df.isnull().sum())

# ---------- Duplicates ----------
print("\n🔹 Number of Duplicates:", df.duplicated().sum())

# ---------- Target Distribution ----------
target_col = "Machine_failure"  # <-- rename if your target column is different
plt.figure(figsize=(5, 4))
sns.countplot(data=df, x=target_col)
plt.title("Target Class Distribution (0 = Healthy, 1 = Failure)")
plt.savefig(os.path.join("outputs", "target_distribution.png"))
plt.show()
