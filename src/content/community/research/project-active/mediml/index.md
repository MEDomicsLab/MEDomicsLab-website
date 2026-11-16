---
title: "Project: MEDiml – Medical Image analysis with Machine Learning"

type: book

authors:
  - Mahdi Loutfi
  - Martin Vallières
---

![MEDiml workflow: datasets, DataManager, image inputs, subpackages, radiomic features and machine learning outputs](/images/albums/research-mediml/mediml-overview.svg "MEDiml package workflow")

## Status

In progress (April 2022 - today)

## Type

General · MEDomics Ecosystem

## Description

[MEDiml](https://www.mediml.app) (MEDical Image analysis with Machine Learning, formerly MEDimage) is an _open-source_ radiomics platform that covers the whole workflow, from raw medical images to predictive models. It turns medical images (CT, MRI, PET and radiotherapy dose maps) into quantitative features that can feed predictive models of diagnosis, treatment response or outcome. MEDiml follows the norms of the [Image Biomarker Standardisation Initiative (IBSI)](https://theibsi.github.io/), so that image processing and feature extraction stay standardized and reproducible.

MEDiml has two components that share the same computational engine:

- **[MEDiml-pkg](https://github.com/MEDomicsLab/MEDiml-pkg)**: a Python package (`pip install MEDiml`) to process multi-modal medical images, extract radiomic features, and train and test machine learning models. It can be used from the command line for batch extraction, or imported in scripts and notebooks for finer control. Its [documentation](https://mediml.readthedocs.io/) includes tutorials and Google Colab notebooks.
- **[MEDiml-app](https://github.com/MEDomicsLab/MEDiml-app)**: a desktop application for Windows, macOS and Linux that runs the full radiomics pipeline without writing code. It is aimed at clinicians, medical physicists and clinical researchers who do not program. Its [documentation](https://medomicslab.gitbook.io/mediml-app-docs) covers installation, the interface and each module.

With MEDiml, users can:

- convert DICOM and NIfTI datasets to the MEDiml format and validate them;
- explore scans and regions of interest, and run radiomics pre-checks before extraction;
- extract radiomics and dosiomics features for a single scan or a whole dataset, using ready-to-use, editable and validated settings;
- train and evaluate machine learning models on the extracted features, comparing feature sets of increasing complexity to find the simplest one that answers a clinical question;
- save results with their settings for reporting and reproducibility, and export workflows designed in the app as Python code.

## Recent Advances

- **First stable releases (November 2026)**: MEDiml-pkg 1.0.0 is available on [PyPI](https://pypi.org/project/MEDiml/), and MEDiml-app 1.0.0 is available for [download](https://www.mediml.app) on Windows, macOS and Linux.
- **Software paper and reference manual (2026)**: the MEDiml software paper ([arXiv:2610.37715](https://arxiv.org/abs/2610.37715)), submitted to the Journal of Open Source Software, and the [Reference Manual of MEDiml](https://arxiv.org/abs/2610.29666), which explains the radiomics concepts, the software architecture and installation, compares MEDiml with other tools, and illustrates its use on five oncological imaging cohorts.
- **Rename**: the project was renamed from MEDimage to MEDiml, and its code is now split between the package and application repositories.

## Proof of Concept: Soft-Tissue Sarcoma

The [first official proof of concept](https://medomicslab.gitbook.io/mediml-app-docs/soft-tissue-sarcoma-poc) walks through a full radiomics study in MEDiml-app: predicting lung metastasis in patients with soft-tissue sarcoma of the extremities from pre-treatment images. It uses the public Soft-Tissue-Sarcoma collection of The Cancer Imaging Archive (51 patients, 19 of whom developed lung metastases), with FDG-PET, CT, T1-weighted and T2-weighted fat-suppressed MRI scans and expert tumour contours. A light version with 10 patients is available for learning the workflow, and the imaging data is published on [Zenodo](https://zenodo.org/records/23103630).

The guide covers five steps: single-scan extraction, radiomics pre-checks in the DataManager, batch extraction, model training in the Learning module, and analysis of the results. In this workflow, logistic regression performed best and the final model relied mainly on first-order intensity features from PET, while the [original study by Vallières et al. (2015)](https://doi.org/10.1088/0031-9155/60/14/5471) relied mainly on texture features from combined PET and MRI.

## Publications

- [Medical Image Analysis with Machine Learning (MEDiml): Strategies for Simpler Radiomics](/publications/medical-image-analysis-with-machine-learning-mediml-strategies-for-simpler-radiomics-2026) (arXiv, 2026)
- [Reference Manual of MEDiml](/publications/reference-manual-of-mediml-2026) (arXiv, 2026)
- [Unraveling Radiomics Complexity: Strategies for Optimal Simplicity in Predictive Modeling](/publications/unraveling-radiomics-complexity-strategies-for-optimal-simplicity-in-predictive-modeling-2024) (arXiv, 2024)

## Related Events

- [CTR Horizons 2026](/community/events/2026-11-25-ctr-horizons) (trainee presentation, McGill Centre for Translational Research in Cancer, November 2026)
- [13th RRCancer & Marathon of Hope Québec Symposium](/community/events/2026-09-30-rrcancer-symposium) (oral presentation, CHUM, September 2026)
- [Simpler Radiomics Can Be Enough: Identifying the Minimal Feature Complexity Required for Accurate Prediction](/community/events/simpler-radiomics-can-be-enough-identifying-the-minimal-feature-complexity-required-for-accurate-prediction-2026) (LDI Conference, August 2026)
- [An international standard compliant tool for radiomic feature extraction from medical images](/community/events/an-international-standard-compliant-tool-for-radiomic-feature-extraction-from-medical-images-2022) (MIDL 2022, June 2022)
- [A compliant package with international standards for radiomics analysis of medical images](/community/events/a-compliant-package-with-international-standards-for-radiomics-analysis-of-medical-images-2022) (CIRIUS, October 2022)

## Links

- [Official website](https://www.mediml.app)
- [MEDiml-app documentation](https://medomicslab.gitbook.io/mediml-app-docs)
- [MEDiml-pkg documentation](https://mediml.readthedocs.io/)
- [MEDiml-app repository](https://github.com/MEDomicsLab/MEDiml-app)
- [MEDiml-pkg repository](https://github.com/MEDomicsLab/MEDiml-pkg)
- [MEDomics Discord](https://discord.com/invite/ZbaGj8E6mP)
