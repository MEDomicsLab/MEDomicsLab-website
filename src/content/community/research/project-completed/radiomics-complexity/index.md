---
title: "Project: Analyzing the Complexity of Radiomics: Approaches for Simplified Modeling"

type: book

authors:
  - Mahdi Loutfi
  - Martin Vallières
---

## Status

Completed (2021-2024)

## Type

Master's

## Objective

The project consists of a systematic evaluation of the potential of prediction for medical image-based analysis of
increasing complexity in the precision oncology spectrum.

## Issue and objective

Recent advances in "omics" technology have created opportunities to characterize biological processes correlated with tumor phenotypes. We anticipate that integrative modeling of available oncology data will provide the ability to make accurate tumor phenotype predictions, which in turn would allow for better monitoring and tailoring of patient-specific treatments (i.e. "precision oncology"). To potentially improve radiomic analysis (i.e.: Quantitative extraction of useful data from all types of medical images), radiomic features of the tumor region can be extracted from medical images filtered with different types of filters (e.g.: texture filtering or texture smoothing). These features can be extracted using the [MEDiml](/research/mediml) package, but they expose different levels of complexity, which leads us to investigate in this project, the spectrum of complexity of medical images for the resolving of several problems in precision oncology and study the changes in these different levels of complexity from an image modality to another.

## The birth of MEDiml

This project is where MEDiml was born, under its original name MEDimage. The package was first developed to extract the radiomic features at every level of complexity studied here, and it has since grown into an open-source, IBSI-compliant radiomics platform, available as a Python package and a no-code desktop application. MEDiml is still in continuous development: see the [MEDiml project](/research/mediml) for its latest progress.

## Database

We already have a large database on which the analysis of the levels of complexity will be carried out. It contains multiple combinations of image modalities and prediction problems (13 combinations in all), as shown in the table below:

![Databases (Medical images)](/images/albums/research-radiomics-complexity/bd.svg "Medical images database")

## Results

![For each dataset and outcome, (A) the predictive performance at each level of radiomic complexity, from morphological features to filtered textural features, with the optimal level highlighted, and (B) the most important features of that optimal level](/images/albums/research-radiomics-complexity/results.webp "Identification and explanation of the optimal complexity level for each dataset and outcome")

## Publication

This work was released in July 2024 as the preprint
[Unraveling Radiomics Complexity: Strategies for Optimal Simplicity in Predictive Modeling](/publications/unraveling-radiomics-complexity-strategies-for-optimal-simplicity-in-predictive-modeling-2024)
on arXiv
([article link](https://arxiv.org/abs/2407.04888)).
