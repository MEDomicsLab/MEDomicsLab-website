---
title: "Project: Multimodal fusion of histopathology and clinical data for survival prediction in oncology"

type: book

authors:
  - Juan Duran
  - Martin Vallières
  - Shirin A. Enger
---

## Status

In progress (2023 - today)

## Type

Doctorate

## Description

Accurate prediction of survival, such as progression-free survival (PFS), is critical for precision oncology: it helps clinicians tailor treatment and follow-up to each patient. Two rich sources of information are available for this task: whole-slide histopathology images, which capture the tumour's morphology at the cellular level, and clinical variables such as age, stage and treatment. This project develops AI-powered survival models that combine both modalities, with the goal of translating these models into tangible benefit for patients.

The project focuses on three questions:

- **Multimodal fusion**: how best to combine histopathology images and clinical data, comparing intermediate fusion strategies (which merge the two modalities inside the model) with late fusion strategies (which combine the predictions of separate models).
- **Rigorous evaluation**: how to benchmark survival models reliably. Most multimodal survival studies rely on a single fusion strategy, one-off cross-validation runs and discrimination metrics only, leaving gaps in systematic evaluation and calibration.
- **Interpretability**: how to make survival models understandable and interrogatable by clinicians, and how to use interpretable AI to uncover the pathological features that drive predictions.

## Recent Advances

**CP-fuse (2025)**: in an article published in _Machine Learning with Applications_, we evaluated clinico-pathological fusion for PFS prediction across five cohorts of The Cancer Genome Atlas (TCGA): bladder cancer, uterine corpus endometrial carcinoma, lung adenocarcinoma, breast cancer, and head and neck squamous cell carcinoma (2,984 patients in total). Whole-slide images were encoded with a Hierarchical Image Pyramid Transformer (HIPT) and clinical variables with a Feature Tokenizer-Transformer (FT-Transformer). Three intermediate fusion strategies (marginal, cross-attention and variational autoencoder) and two late fusion strategies (trainable weights and meta-learning) were trained end-to-end with DeepSurv.

To account for the variance that single-run evaluations overlook, each model was evaluated with 100 repetitions of 10-fold cross-validation. Variational autoencoder fusion achieved the best PFS prediction (concordance index) in four cohorts: bladder (0.739 ± 0.019), endometrial (0.770 ± 0.021), lung (0.683 ± 0.018) and breast (0.760 ± 0.021) cancers, while meta-learning was best for head and neck cancer (0.686 ± 0.022). Integrated Brier Scores (0.066 to 0.142) revealed variability in calibration, which highlights the importance of combining discrimination and calibration metrics with rigorous validation for clinically meaningful survival modelling.

## Publications

- [Beyond single-run metrics with CP-fuse: A rigorous multi-cohort evaluation of clinico-pathological fusion for improved survival prediction in TCGA](https://doi.org/10.1016/j.mlwa.2025.100789) (Machine Learning with Applications, 2025)
- [An Agentic Framework for Interrogatable and Interpretable Survival Analysis](/publications/an-agentic-framework-for-interrogatable-and-interpretable-survival-analysis-2026) (Radiotherapy and Oncology, CARO ASM 2026)
