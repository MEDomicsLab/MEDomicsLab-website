---
title: "Project: Refactoring of the MEDiml Codebase"

type: book

authors:
  - Andréanne Allaire
  - Clarisse Cheng
  - Corentin Gauthier
  - Mahdi Loutfi
  - Mohammed Benabbassi
  - Martin Vallières
---

![Schematic diagram of the MEDiml package](/images/albums/research-mediml/mediml-overview.webp "Schematic diagram of the MEDiml package")

## Status

Completed (April 2022 - August 2022)

## Type

General

## Description

This project aimed to improve the existing Python codebase of [MEDiml](/research/mediml) (then called MEDimage), the lab's _open-source_ software for medical image processing and radiomic feature extraction, standardized with the norms of the [Image Biomarker Standardisation Initiative (IBSI)](https://theibsi.github.io/).

The team refactored the package to make it easier to understand, use and maintain:

- the code was reorganized into clearer modules, classes and parameter options for loading and processing medical images and computing radiomic features;
- the docstrings were rewritten throughout the codebase, making each function and class easier to understand;
- the documentation was expanded with tutorials, demonstrations and instructions to introduce new users to the software;
- the code was made more readable and explainable, so that new contributors could follow and extend the radiomics workflow.

This work also laid the foundations of the first version of the MEDiml application, the graphical interface that now lets users run radiomics workflows without writing code. The project continues today as [MEDiml](/research/mediml).

Here is a video made by our intern [Corentin Gauthier](/team/corentin-gauthier), which presents what he did during his internship as well as the MEDiml project.

<p align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/ODJ3TD5H11Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>
