import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import warnings

warnings.filterwarnings('ignore')

# 1. Load Data
df = pd.read_csv('Mall_Customers.csv')
df.rename(columns={'Genre':'Gender','Spending Score (1-100)':'Spending Score'}, inplace=True)

# 2. Preprocessing
df['Gender_Male'] = pd.get_dummies(df['Gender'], drop_first=True)
dff = df[['Age', 'Annual Income (k$)', 'Spending Score', 'Gender_Male']]

# 3. Scaling
scale = StandardScaler()
dff_scaled = scale.fit_transform(dff)

# 4. Multivariate K-Means Clustering
# Using 5 clusters to align with the original study
algorithm = KMeans(n_clusters=5, init='k-means++', n_init=10, max_iter=300, 
                   tol=0.0001, random_state=111, algorithm='elkan')
algorithm.fit(dff_scaled)
df['Multivariate Cluster'] = algorithm.labels_

# 5. Bivariate K-Means Clustering (Income vs Spending)
# This often shows more distinct spatial groups in 2D
bivariate_features = df[['Annual Income (k$)', 'Spending Score']]
bivariate_scale = StandardScaler()
bivariate_scaled = bivariate_scale.fit_transform(bivariate_features)

bivariate_algorithm = KMeans(n_clusters=5, init='k-means++', n_init=10, max_iter=300, 
                             tol=0.0001, random_state=111, algorithm='elkan')
bivariate_algorithm.fit(bivariate_scaled)
df['Bivariate Cluster'] = bivariate_algorithm.labels_

# 6. Calculate Inertia Scores for Optimization Plot
inertia_multivariate = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, init='k-means++', n_init=10, random_state=111)
    km.fit(dff_scaled)
    inertia_multivariate.append(float(km.inertia_))

inertia_bivariate = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, init='k-means++', n_init=10, random_state=111)
    km.fit(bivariate_scaled)
    inertia_bivariate.append(float(km.inertia_))

# 7. Analysis
cluster_summary = df.groupby('Multivariate Cluster')[['Age', 'Annual Income (k$)', 'Spending Score']].mean()
print("--- Multivariate Cluster Summary Statistics ---")
print(cluster_summary)

# 8. Save Results
df.to_csv('Clustering_Final.csv', index=False)

# Export to JSON for the dashboard
import json
dashboard_data = {
    "customers": df.to_dict(orient='records'),
    "optimization": {
        "multivariate": inertia_multivariate,
        "bivariate": inertia_bivariate
    }
}

with open('customer-analytics/data.json', 'w') as f:
    json.dump(dashboard_data, f, indent=2)

print("\nFinal results saved to 'Clustering_Final.csv' and 'customer-analytics/data.json'")

# 9. Visualization
sns.set(style="whitegrid")
g = sns.pairplot(df, vars=['Age', 'Annual Income (k$)', 'Spending Score'], 
                 hue='Multivariate Cluster', palette='bright', diag_kind='kde')
g.fig.suptitle('Multivariate Customer Segments', y=1.02)
plt.savefig('multivariate_clusters.png')
print("Visualization saved as 'multivariate_clusters.png'")
