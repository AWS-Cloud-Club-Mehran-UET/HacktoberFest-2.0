import streamlit as st
import pandas as pd
import joblib 
import seaborn as sns 
import matplotlib.pyplot as plt

# Load trained model
model = joblib.load("model.pkl")  
df = pd.read_csv('dataset.csv')
st.title("Smart Machine Failure Prediction")


air_temp = st.number_input("Air Temperature (°C)", min_value=0.0, max_value=100.0, value=30.0)
process_temp = st.number_input("Process Temperature (°C)", min_value=0.0, max_value=200.0, value=80.0)
rotational_speed = st.number_input("Rotational Speed (RPM)", min_value=0, max_value=5000, value=1500)
torque = st.number_input("Torque (Nm)", min_value=0.0, max_value=500.0, value=40.0)
tool_wear = st.number_input("Tool Wear (minutes)", min_value=0, max_value=500, value=120)

# Machine type selection
machine_type = st.selectbox("Machine Type", ["L", "M"])
Type_L = 1 if machine_type == "L" else 0
Type_M = 1 if machine_type == "M" else 0

# Derived features
Torque_to_Speed_Ratio = torque / rotational_speed if rotational_speed != 0 else 0
temp_diff = process_temp - air_temp

# Create input dataframe with exact column names
input_df = pd.DataFrame([[
    air_temp, process_temp, rotational_speed, torque, tool_wear,
    Torque_to_Speed_Ratio, Type_L, Type_M, temp_diff
]], columns=[
    'air_temp', 'process_temp', 'rotational_speed', 'torque', 'tool_wear',
    'Torque_to_Speed_Ratio', 'Type_L', 'Type_M', 'temp_diff'
])

# Predict button
if st.button("Predict"):
    prediction = model.predict(input_df)[0]
    result = "Fail" if prediction == 1 else "Pass"
    st.success(f"Machine predicted to: {result}")


st.subheader("Dataset Analysis (EDA)")

st.write("Dataset Preview:")
st.write(df.head())

st.write("Shape of Dataset:", df.shape)

st.write("Missing Values:")
st.write(df.isnull().sum())

# Correlation heatmap
st.write("Correlation Heatmap:")
numeric_cols = df.select_dtypes(include=["float64", "int64"]).columns
plt.figure(figsize=(10,6))
sns.heatmap(df[numeric_cols].corr(), annot=True, cmap="coolwarm")
st.pyplot(plt)

# Histograms
st.write("Histograms of Numeric Columns:")
for col in numeric_cols:
    plt.figure(figsize=(6,4))
    sns.histplot(df[col], kde=True)
    st.pyplot(plt)

# Target Distribution
target_col = "Machine failure"
if target_col in df.columns:
    st.write(f"Distribution of {target_col}:")
    plt.figure(figsize=(6,4))
    sns.countplot(x=target_col, data=df)
    st.pyplot(plt)
else:
    st.warning(f"Column '{target_col}' not found in dataset.")