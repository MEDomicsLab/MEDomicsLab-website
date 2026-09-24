## Date

2026-02-25

## Authors

- Teodora Boblea Podasca<sup>1</sup>
- [Mahdi Loutfi](/team/mahdi-loutfi)<sup>2</sup>
- Marc-Antoine Blais<sup>3</sup>
- Marie-Lou Gadoury-Campbell<sup>3</sup>
- Stéphanie Boulet<sup>4</sup>
- [Martin Vallières](/team/martin-vallieres)<sup>2</sup>
- Patrick O. Richard<sup>1</sup>

<sup>1</sup> Division of Urology, Department of Surgery, Centre Hospitalier Universitaire de Sherbrooke, Sherbrooke, Canada

<sup>2</sup> Department of Computer Science, Université de Sherbrooke, Sherbrooke, Canada

<sup>3</sup> Faculty of Medicine and Health Sciences, Université de Sherbrooke, Sherbrooke, Canada

<sup>4</sup> Division of Urology, Department of Surgery, Centre Hospitalier de l’Université Laval, Québec, Canada

## Abstract

**Purpose**

To determine the histology of a renal mass, physicians cannot rely on imaging alone. Radiomics, the extraction of quantitative data from medical imaging, could help address this challenge. This study aimed to build a classification model using CT-scan radiomics and/or clinical features to distinguish clear cell renal cell carcinoma (ccRCC) from other histologies.

**Methods**

The study included patients who underwent surgery for suspected localized renal cell carcinoma. A total of 345 masses were included, 72% of which were ccRCC and 28% of which had other histologies. Clinical data were extracted, and each renal mass was manually segmented on CT and contrast-enhanced CT (CECT). A total of 171 radiomics features were extracted from each lesion. The dataset was randomly split into a learning set (80%) and a hold-out set (20%). The learning set was further divided into 10 subsets, each split into training (80%) and testing (20%) sets, and used to train and test 10 independent machine learning models using the XGBoost algorithm. The best model was subsequently validated on the hold-out set.

**Results**

The CECT-based radiomics model showed the best performance, with an area under the curve (AUC) of 0.80, sensitivity of 67%, and specificity of 77%. Adding clinical features to the model did not improve its performance. On the hold-out set, the final model achieved an AUC of 0.88, with 56% sensitivity and 93% specificity.

**Conclusions**

The radiomics-based classification model showed high performance in differentiating ccRCC from other histologies using CECT scans. These findings support the role of radiomics as a potential non-invasive tool in kidney cancer management. However, external validation on independent cohorts is needed before clinical application.

## Links

- [World Journal of Urology](https://doi.org/10.1007/s00345-026-06296-2)
