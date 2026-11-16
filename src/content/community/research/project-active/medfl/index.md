---
title: "Project: MEDfl: A Collaborative Framework for Federated Learning in Medicine"

type: book

authors:
  - Ouael Nedjem Eddine Sahbi
  - Martin Vallières
---

## Status

In progress (2024 - today)

## Type

Master's · MEDomics Ecosystem

## Description

Hospitals hold large amounts of clinical data that could be used to train artificial intelligence (AI) models, but regulations such as GDPR and HIPAA, and the need to protect patient privacy, prevent this data from being shared between institutions. As a result, models are often trained on small, single-site datasets that do not reflect the diversity of real patient populations.

[MEDfl](https://www.medfl.app/) is an _open-source_ federated learning framework that lets several institutions train a shared model without moving patient data. Each site keeps full control of its dataset; only model updates and aggregate statistics leave each site. MEDfl is built on the [Flower](https://flower.ai/) framework and also addresses a second challenge: making federated learning accessible to clinical researchers who do not program, so that computer scientists and medical experts can work together.

MEDfl has two components:

- **[MEDfl package](https://github.com/MEDomicsLab/MEDfl)**: a Python package (`pip install medfl`) that runs federated experiments either in _simulation_ (all clients run locally and experiments are tracked in a SQLite or MySQL database) or in the _real world_ (a central server coordinates remote clients, each reading its own local data). Its [documentation](https://medfl.readthedocs.io/en/latest/) includes tutorial notebooks.
- **MEDfl desktop application**: a no-code application for Windows, macOS and Linux, integrated into the MEDomics platform, where users design and launch federated learning experiments from a visual interface. Its [documentation](https://medomicslab.gitbook.io/medfl-app-docs/) covers installation and each step of the workflow.

With MEDfl, users can:

- connect hospitals to a federated network through a secure VPN, invite collaborators and check that each client is ready;
- validate local datasets (schema, columns, missing values, statistics) and client systems before training;
- build federated pipelines with drag-and-drop nodes for the model, the network, the optimization and the aggregation strategy (such as FedAvg, FedAdam, FedYogi or FedProx);
- train neural networks or federated XGBoost models for classification and regression;
- protect patients with client-side differential privacy, and improve performance on small datasets with transfer learning;
- tune hyperparameters with grid search or Optuna, including in a federated setting;
- evaluate models on federated holdout sets with pooled metrics and ROC/AUC curves, explain them with federated SHAP values, and export results for reproducibility.

## Related Events

- [Scientific Days RSN](/community/events/scientific-days-rsn-2026) (poster presentation, Université Laval, March 2026)
- [MEDfl: A Collaborative Framework for Federated Learning in Medicine](/community/events/medfl-a-collaborative-framework-for-federated-learning-in-medicine-2025) (T-CAIREM, November 2025)

## Links

- [Official website](https://www.medfl.app/)
- [MEDfl-app documentation](https://medomicslab.gitbook.io/medfl-app-docs/)
- [MEDfl package documentation](https://medfl.readthedocs.io/en/latest/)
- [MEDfl package repository](https://github.com/MEDomicsLab/MEDfl)
- [MEDfl on PyPI](https://pypi.org/project/medfl/)
- [Video tutorials](https://www.youtube.com/playlist?list=PLEPy2VhC4-D7Y4lkGMRpHG8ydVZQonkMJ)
