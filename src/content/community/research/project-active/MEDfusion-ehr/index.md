---
Title: MEDfusion-ehr – Hierarchical sub-modal fusion within a landscape of EHR models
Type: Book
authors:
  - Steven Ravary
  - Martin Vallières
  - Danilo Bzdok
---

![MEDfusion-ehr landscape of EHR models, with performance, feasibility and interpretability as axes and explainability as colour](/images/albums/research-MEDfusion-ehr/MEDfusion-ehr.webp "MEDfusion-ehr: a landscape for choosing EHR models that can be deployed and understood")

## Status

In progress (October 2026 - today)

## Type

General · MEDomics Ecosystem

## Description

MEDfusion-ehr (hierarchical sub-modal fusion within a performance, feasibility and interpretability landscape of EHR models) is a research project on choosing models for structured electronic health records (EHR). Many methods exist for predicting outcomes from EHR, and the models that perform best are too often not deployable in clinical settings, or in some research settings, because of the compute, memory or licences they need. MEDfusion-ehr helps researchers and clinicians choose among them. It places each method in a landscape defined by three axes (performance, feasibility and interpretability), with explainability shown as colour. Users can then follow a priority (a vector) or look at a slice (a plane) to reach a short list of suitable models.

Within this landscape, MEDfusion-ehr develops _hierarchical sub-modal fusion_ as the interpretable target: a model that fuses sub-modalities of the EHR (vital signs, laboratory results and diagnoses) in a readable hierarchy with inspectable branch weights. It is benchmarked against strong baselines, including the EHR foundation model MOTOR, on the INSPECT dataset.

MEDfusion-ehr has two components:

- **The landscape**: ordered scales (bins) for performance, feasibility (time and memory, grounded in a measured hardware profile), interpretability and explainability, characterised for EHR.
- **The software (in development)**: a MEDomics module that re-runs the methods on a new dataset, rebuilds the landscape, and lets teams of clinicians and machine-learning researchers choose models together.

The project aims to let users:

- compare models from different families (linear, gradient-boosted trees, stacked and hierarchical fusion, foundation models) on the same patients and prediction times;
- place each model on the four scales and see the trade-offs between them;
- choose a priority, such as feasibility first or interpretability first, and see the candidate models along it;
- measure how much performance is given up for interpretability, with paired confidence intervals;
- rebuild the landscape for their own dataset and hardware.

## Recent Advances

- **First baselines (2026)**: a linear model, LightGBM and the MOTOR foundation model (linear probe) are compared on INSPECT, on the same patients and prediction times, for 1-, 6- and 12-month mortality.
- **Hardware profile (2026)**: sustained compute, memory bandwidth and roofline ridge points measured on a laptop, a desktop and a workstation, for CPU and GPU.
- **Performance scale (in progress)**: a two-stage scale with an expected class from published benchmarks, then a measured skill against a fixed reference.

## First Study

The first study uses INSPECT, a public multimodal EHR dataset. It works from vital signs, laboratory results and diagnosis groups, with the same patient-level split for all models.

## Links

- Coming soon
