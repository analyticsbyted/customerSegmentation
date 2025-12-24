# Customer Intelligence Suite | Project Memory

## Project Overview
This project focuses on **Shopping Mall Customer Segmentation** using unsupervised machine learning techniques. The primary goal is to analyze customer behavior to identify distinct target groups based on income, age, and spending scores.

## 🏁 Key Milestones
- [x] **Exploratory Data Analysis (EDA):** Baseline research in `segmentation.ipynb`.
- [x] **Clustering Engine:** Implementation of K-Means in `final_analysis.py`.
- [x] **Bivariate vs Multivariate:** Added a dual-mode analysis path for richer insights.
- [x] **Interactive Dashboard:** Premium glassmorphism UI built with Vite & Chart.js.
- [x] **Cloud Deployment:** Hosted on AWS S3 (`ted-customer-intelligence-dashboard`).

## 📁 Key Files
- **`final_analysis.py`**: The production engine. Performs data loading, scaling, dual-model clustering, and exports `data.json` for the dashboard.
- **`customer-analytics/`**: The web dashboard source code.
- **`Mall_Customers.csv`**: Source dataset.
- **`Clustering_Final.csv`**: Output data containing assignments for both Multivariate and Bivariate clusters.
- **`segmentation.ipynb`**: Original exploratory notebook.

## 🛠 Analytics Engine Details
- **Preprocessing**: One-hot encoding for Gender, standard scaling for all numerical features.
- **Optimization**: Elbow Method used to identify $K=5$ as the optimal cluster count.
- **Modes**:
  - **Bivariate**: Focuses on Income + Spending Score (produces the most visually distinct groups).
  - **Multivariate**: Focuses on Age + Gender + Income + Spending Score.

## 🌐 Live Presence
- **URL**: [Live Dashboard](http://ted-customer-intelligence-dashboard.s3-website-us-east-1.amazonaws.com/)
- **Infrastructure**: AWS S3 Static Website with public read policy and `Project=customerSegmentation` tags.

## Usage
1. Run `python3 final_analysis.py` to regenerate model outputs.
2. Deploy to S3 using `aws s3 sync customer-analytics/dist/ s3://ted-customer-intelligence-dashboard/ --region us-east-1`.
