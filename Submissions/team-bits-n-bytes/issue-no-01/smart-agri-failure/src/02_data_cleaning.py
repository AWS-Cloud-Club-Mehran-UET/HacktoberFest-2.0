import pandas as pd
import os

# Load CSV file
data_path = os.path.join("data", "sensor_data.csv")
df = pd.read_csv(data_path)

print(f"🔹 Original shape: {df.shape}")

# Clean column names: remove spaces and special characters for easier access
df.columns = df.columns.str.strip().str.replace(" ", "_").str.replace("[", "").str.replace("]", "")

# Drop unnecessary columns
df = df.drop(columns=["UDI", "Product_ID"], errors="ignore")  # Ignore if not present

# Check for missing values
print("\n🔹 Missing values per column:")
print(df.isnull().sum())

# Fill missing values (if any)
df = df.fillna(df.mean(numeric_only=True))

# Encode categorical columns (like 'Type')
if "Type" in df.columns:
    df["Type"] = df["Type"].astype("category").cat.codes

# Print cleaned shape and preview
print(f"\n✅ Cleaned shape: {df.shape}")
print("\n🔹 Sample data after cleaning:")
print(df.head())

# Save cleaned data
output_path = os.path.join("data", "cleaned_data.csv")
df.to_csv(output_path, index=False)

print(f"\n💾 Cleaned data saved to: {output_path}")

