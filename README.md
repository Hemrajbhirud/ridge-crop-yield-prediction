Crop Yield Prediction using Regularized Ridge Regression

Machine Learning – Unit 2 Project

Project Overview

This project applies **Ridge Regression** to predict agricultural crop yield using soil and weather-related features.

The project focuses on **L2 regularization** and its role in handling multicollinearity between correlated predictors. Ridge Regression is used as the primary model and is evaluated against other regression algorithms.

The project also includes an interactive website for exploring the model and estimating crop yield.

---

Problem Statement

Crop yield depends on multiple soil and environmental factors. Some of these predictors can be correlated with each other, which may cause instability in ordinary linear regression coefficients.

This project uses **Ridge Regression** to reduce the effect of multicollinearity by applying an L2 penalty while maintaining an interpretable linear model.

---

Dataset

**Dataset:** Crop Yield Prediction using Soil and Weather

Features

* Fertilizer
* Temperature
* Nitrogen (N)
* Phosphorus (P)
* Potassium (K)

Target : Crop Yield

Dataset Size

* Total observations: **2,596**
* Training observations: **2,076**
* Testing observations: **520**

---

 Objectives

* Perform exploratory data analysis.
* Study relationships between soil and weather features.
* Identify multicollinearity between predictors.
* Preprocess and scale the input features.
* Implement Ridge Regression with L2 regularization.
* Tune the regularization parameter using cross-validation.
* Compare different regression algorithms.
* Evaluate model performance on unseen test data.
* Develop an interactive crop-yield prediction website.

---

Methodology
 1. Data Collection

The dataset is loaded and analyzed using Python and Pandas.

### 2. Exploratory Data Analysis

The project includes:

* Descriptive statistics
* Missing-value analysis
* Correlation matrix
* Feature distributions
* Pairwise relationships

3. Preprocessing

The data is divided into training and testing sets using an **80/20 split**. The features are standardized using **StandardScaler**.

 4. Ridge Regression

Ridge Regression is used as the primary model. It applies an **L2 regularization penalty** to control coefficient magnitude and handle multicollinearity.

 5. Hyperparameter Tuning

The regularization parameter **alpha** is selected using **5-fold cross-validation**.

Best Alpha:1.5264

### 6. Comparative Evaluation

The project compares:

* Linear Regression
* Ridge Regression
* Lasso Regression
* ElasticNet

The models are evaluated using **R², RMSE, and MAE**.

---

Results

| Model                   |     R² |   RMSE |    MAE |
| ----------------------- | -----: | -----: | -----: |
| Lasso Regression        | 0.8637 | 0.7157 | 0.5823 |
| ElasticNet              | 0.8636 | 0.7159 | 0.5821 |
| Ridge Regression        | 0.8627 | 0.7182 | 0.5793 |
| Linear Regression (OLS) | 0.8626 | 0.7185 | 0.5791 |

Ridge Regression

* **R²:** 0.8627
* **RMSE:** 0.7182
* **MAE:** 0.5793
* **Alpha:** 1.5264

---

Interactive Website

The project includes an interactive **Field Yield Estimation Calculator** where users can enter field conditions such as:

* Nitrogen
* Phosphorus
* Potassium
* Fertilizer
* Temperature

The website provides an estimated crop yield and presents the model methodology, analysis, and evaluation results.

---

Technologies Used

* Python
* NumPy
* Pandas
* Matplotlib
* Seaborn
* Scikit-learn
* HTML
* CSS
* JavaScript
* Chart.js
* Google Colab
* GitHub

---

Project Structure

text
ridge-crop-yield-prediction/
├── index.html
├── style.css
├── app.js
├── data.js
├── chart.min.js
├── assets/
├── Crop Yiled with Soil and Weather.csv
└── Ridge_Regression_Crop_Yieldd.ipynb
```


## Conclusion

This project demonstrates the application of **Ridge Regression for crop-yield prediction** using soil and weather variables. L2 regularization is used to control coefficient magnitude and address multicollinearity. The selected Ridge model with **alpha = 1.5264** achieves an **R² of 0.8627**, an **RMSE of 0.7182**, and an **MAE of 0.5793** on the test data.
