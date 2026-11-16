![LDI Conference 2026 event poster: August 7, 9:00 to 16:30, 3999 Côte-Sainte-Catherine Road, Montréal](/images/albums/2026-08-07-ldi-conference/event-poster.webp)

[Mahdi Loutfi](/team/mahdi-loutfi) presented a poster on [MEDiml](/research/mediml) at the **LDI Conference 2026**, held on August 7, 2026 (9:00 to 16:30) at the Lady Davis Institute for Medical Research of the Jewish General Hospital, 3999 Côte-Sainte-Catherine Road, Montréal. Organized by the LDI Trainee Committee (LDITC), with the support of C3i, the conference invites undergraduate and graduate students to present their research as a poster or a three-minute thesis, with prizes awarded to the best presentations.

## Summary

**Purpose**: Clinical translation of radiomics is hindered by the high-dimensional feature sets and lack of accessible tools for clinicians. MEDiml, an open-source platform designed to help democratize the development of radiomics models by identifying the simplest predictive features through both a code-based and graphical interface.

**Methods**: MEDiml was evaluated using 89,714 features from five oncological datasets (n=2,104). Tasks included histology subtype prediction for non-small cell lung cancer (NSCLC, MRI); renal cell carcinoma (RCC, MRI); and RCC (contrast-enhanced CT); IDH1 mutation prediction for low-grade glioma (LGG, MRI); and grade prediction for meningioma (MRI). For modeling, features are categorized by complexity (morphological, intensity, texture, linear/nonlinear filters) for XGBoost training. The pipeline cleans invariants and filters collinearity, retaining only features highly correlated with clinical endpoints.

**Results**: We released the MEDiml software with detailed documentation (mediml.app). Evaluation demonstrated that maximum predictive performance does not always require high-complexity features. Optimal levels were: morphological for LGG-IDH1 and Meningioma-grading; intensity in NSCLC and RCC -CECT; and texture for RCC-MRI. In the RCC-CECT cohort, optimizing the re-segmentation range, a parameter for excluding non-target voxels affecting intensity features, improved performance from an AUC of 0.82 to 0.86.

**Conclusion**: MEDiml successfully identifies the "optimal complexity level" for specific clinical outcomes, demonstrating that simpler models can often match or exceed the performance of high-dimensional sets. By providing an interactive, user-friendly interface and a strategy for feature minimization, MEDiml lowers the barrier to entry for clinicians, providing a scalable pathway for the clinical integration of radiomic biomarkers.

![Oral presentation in the conference room during the LDI Conference 2026](/images/albums/2026-08-07-ldi-conference/presentation-room.webp)
