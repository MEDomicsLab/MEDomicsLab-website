---
title: "Project: MEDomics: A Collaborative Platform for Medical Data Modeling"

type: book

authors:
  - Andréanne Allaire
  - Brahim Fakri
  - Cedrik Lampron
  - Charles Lévesque-Matte
  - Charles-Olivier Ipperciel
  - Clarisse Cheng
  - Corentin Gauthier
  - Guillaume Blain
  - Hithem Lamri
  - Jonathan Perron
  - Kayla Davio-Roy
  - Ludmila Amriou
  - Lyna Hiba Chikouche
  - Mahdi Loutfi
  - Mamadou Mountagha Bah
  - Mariem Kallel
  - Mohammed Benabbassi
  - Nicolas Longchamps
  - Ouael Nedjem Eddine SAHBI
  - Robin Mailhot
  - Sarah Denis
  - Martin Vallières
---

![MEDomics platform](/images/albums/research-medomics_platform/MEDomicsLab-Principles-1.webp "MEDomics platform")

## Status

In progress (2020-today)

## Type

General

## Description

[//]: # "MEDomics platform is an _open-source_ computing platform for integrative data modeling in medicine. It was created by an "
[//]: # "international consortium of medical scientists (<https://medomics.ai>), whose main goal is to facilitate the "
[//]: # "development and clinical translation of artificial intelligence (AI) applications in medicine. The platform is based "
[//]: # "on the Python programming language and contains five major modules that allow loading, processing, exploring "
[//]: # "multi-omics data, and creating and evaluating actionable models for precision medicine. MEDomics platform's intrinsic "
[//]: # "workflow is designed to provide different levels of abstraction of methodological complexity to users and developers "
[//]: # "via application scripts, option parameters and class structures. In general, MEDomics platform is envisioned to be at the "
[//]: # "center of multidisciplinary research teams and hospital database infrastructures."
[//]: #
[//]: # 'Recent advances in so-called "omics" technologies (genomics, radiomics, proteomics, etc.) offer unprecedented '
[//]: # "opportunities to characterize biological processes that are related to certain phenotypes. The effective combination "
[//]: # 'of these elements as "multi-omics modeling" will certainly allow us to better tailor treatments to individual '
[//]: # 'patients (i.e., "precision medicine").'
[//]: #
[//]: # "Given the complexity of medical problems, achieving the full potential of precision medicine is directly related "
[//]: # "to our ability to properly manage, structure and leverage our hospital databases. Therefore, mastering and combining "
[//]: # 'the following data analysis techniques should increase the impact of the "multi-omics" prediction models that are '
[//]: # "built from these databases:"
[//]: #
[//]: # "1. _Image analysis_: extraction of radiomic features allows us to better characterize tumor heterogeneity. The [MEDiml](/research/mediml) package is the dedicated component for this task."
[//]: # "2. _Machine learning_: some learning techniques allow us to better combine data from different categories (such as multi-omics)."
[//]: # "3. _Deep learning_: the multitude of deep neural network architectures offers several possibilities for the automatic learning of different tasks in medicine. The performance of some networks is sometimes superior to that of humans."
[//]: # "4. _Automatic text processing_: automatic processing and coding of textual reports from electronic patient records would allow for better integration of information relevant to multi-omics modeling throughout the patient management period."
[//]: # "5. _Federated learning_: in order to increase the amount of modeled data from different health care institutions, a distributed learning approach can be used - data is kept within the boundaries of each institution, thus avoiding data transfer and privacy issues."

Version 1.0 of the MEDomics platform was launched in 2024. The MEDomics platform is the core component of our research laboratory, with the central role of enhancing the working synergy between clinical researchers and computer scientists for medical data modeling. The platform consists of an interactive front-end interface linked to a reproducible back-end code package via a code generation feature. It can be deployed on standard research laptops, keeping hardware requirements low. It is designed with three core layers and seven modules: (i) [Design]: Input, Extraction, Exploratory; (ii) [Development]: Machine Learning, Evaluation, Federated Learning; and (iii) [Deployment]: Application.

MEDomics also gave birth to several useful applications under various projects: MED3pa, MEDfl, MEDiml, with more applications under construction.

For more information, see the [project website](https://medomics.app/).

The figures below provide an overview of the core architecture of the MEDomics platform.

![MEDomics goal](/images/albums/research-medomics_platform/MEDomicsLab-Principles-2.webp)
![MEDomics overview](/images/albums/research-medomics_platform/MEDomicsLab-Principles-3.webp)
![MEDomics workflow](/images/albums/research-medomics_platform/MEDomicsLab-Principles-4.webp)

[//]: # "This platform is being developed in collaboration with: "
[//]: # "- [University California San Francisco](https://www.ucsf.edu/) (Olivier Morin, Taman Upadhaya, Jorge Barrios)"
[//]: # "- [University of Toronto](https://www.utoronto.ca/) (Jan Seuntjens)"
[//]: # "- [The D-Lab](https://precisionmedicinemaastricht.eu/the-d-lab/) (Philippe Lambin, Henry Woodruff, Avishek Chatterjee)"
[//]: # "- [Oncoray](https://www.oncoray.de/) (Alex Zwanenburg, Steffen Löck)"
[//]: # "- [Université Laval](https://www.ulaval.ca/) (Louis Archambault, Philippe Després) "
