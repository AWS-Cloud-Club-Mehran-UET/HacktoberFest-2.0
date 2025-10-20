

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE
import joblib

# Load dataset
df = pd.read_csv("dataset.csv")

# Rename columns
df.rename(columns={
    'UDI': 'id',
    'Air temperature [K]': 'air_temp',
    'Process temperature [K]': 'process_temp',
    'Rotational speed [rpm]': 'rotational_speed',
    'Torque [Nm]': 'torque',
    'Tool wear [min]': 'tool_wear',
    'Machine failure': 'machine_failure',
    'TWF': 'tool_wear_failure',
    'HDF': 'heat_dissipation_failure',
    'PWF': 'power_failure',
    'OSF': 'overstrain_failure',
    'RNF': 'random_failure'
}, inplace=True)

# Clean data
df.drop_duplicates(inplace=True)
df = pd.get_dummies(df, columns=['Type'], drop_first=True)

# Feature engineering
df['torque_to_speed_ratio'] = df['torque'] / df['rotational_speed']
df['temp_diff'] = df['process_temp'] - df['air_temp']

num_cols = ['air_temp','process_temp','rotational_speed','torque','tool_wear']
scaler = StandardScaler()
df[num_cols] = scaler.fit_transform(df[num_cols])

# Prepare data
X = df.drop(columns=['id','Product ID','machine_failure',
                     'tool_wear_failure','heat_dissipation_failure',
                     'power_failure','overstrain_failure','random_failure'])
y = df['machine_failure']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Handle imbalance with SMOTE
smote = SMOTE(random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_res, y_train_res)

# Save model and scaler
joblib.dump(model, "machine_failure_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("Model and scaler saved successfully.")
