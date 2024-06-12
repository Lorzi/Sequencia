# SEQUENCIA

Sequencia is a web framework for visualizing and learning sequence alignments developed by BOIVIN Lorentz, student at the University of Mons (UMons) and supervised by Mr. Tom Mens.
It was developed to allow anyone with any interest in this subject or in bioinformatics to understand how it works.
This comes in the form of a web application running directly in a web browser that is easy to install and use.

The framework exist in English and in French (in a older version). Choose the right version in the releases section.
## Installation

Download the last release of this framework.\
First make sure, Node.js is installed on your computer.\
If not, you can install it at this address : https://nodejs.org/en

Extract the build file and open a console in the location of the directory.

Install serve on your machine, you can type this in a console :
```
npm install serve
```
Start the framework in local :
```
serve -s build
```
or
```
npx serve -s build
```
Then you can now enjoy the app by opening http://localhost:3000 in your browser.

## Usage

Once you are on http://localhost:3000, you will arrive on a main menu.
You can choose between 4 differents options :
- Normal Mode (Mode Normal)
- Game mode (Mode jeu)
- BLOSUM Mode (Mode BLOSUM)
- Help and infos (Aide et informations)

In the Normal mode, you can visualise the alignement of sequences and try differents others algorithms and variants.\
In the game mode, you can choose between 2 differents game mode that will help you to understand how the alignment are made and how we compute the optimal paths.\
In the BLOSUM mode, you can upload your own custom matrix of score. In the release, you will find a template with bunch of ZERO and letters. It's a .JSON file, you juste have to put the value you want. Otherwise ti use the BLOSUM62 matrix and apply the algorithm of NeedlemanWunsch.
In Help and info you can find a documentation but the language is only available in French for the moment.

## About
Link of the repository : https://github.com/Lorzi/Sequencia
This framework is based on the Needleman-Wunsch and Smith-Waterman algorithms.
The code has been created on base of the recursive formula of theses algorithms.
And the documentation part is inspired by some books and Wikipedia pages of theses algorithms.
All the sources are available in the report associated to this project.

You can find every sources inside the report : https://1drv.ms/b/s!ApdrD7C8eYGn_RBxTBgH_jRE8oyU?e=yOvmGy
A video presentation of the framework is available in French here : https://youtu.be/WyVwGiGKclo
