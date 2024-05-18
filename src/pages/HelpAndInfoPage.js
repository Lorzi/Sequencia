import React from 'react'
import {Box} from "@mui/material";
export default function helpAndInfoPage() {

    const gameModeInfo =
        <Box
            component="section"
            sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 500, height: 700, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
            <div style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '20px' }}>
                Explications :
            </div>
            <div style={{fontSize: '1.2em', textAlign: 'left' }}>
                <div style={{ marginTop: '10px' }}>
                    Bienvenue dans le mode jeu.
                </div>
                <div style={{ marginTop: '10px' }}>
                    Dans ce mode, vous trouverez deux modes de jeu différents basés sur l'algorithme de Needleman-Wunsch :
                </div>
                <div style={{ marginTop: '10px' }}>
                    - Un mode de jeu "Remplissage matrice score" où le but est de comprendre comment on crée la matrice de score.
                    <div/>
                    - Et un mode de jeu "Découverte chemin optimal" où le but est de trouver un chemin optimal (effectuer le traceback) en se trompant le moins possible.
                </div>
                <div style={{ marginTop: '10px' }}>
                    Il suffit de remplir les champs de séquence 1 et séquence 2 pour commencer à jouer.
                </div>
                <div style={{ marginTop: '10px' }}>
                    Des indications et explications sur la manière d'obtenir les résultats afin de vous aider se trouvent en bas de la page.
                </div>
                <div style={{ marginTop: '10px' }}>
                    Pour jouer au mode "Remplissage matrice score", il suffit d'entrer sa réponse dans le champs prévu à cet effet et soumettre la réponse à chaque itération en appuyant sur le bouton. Si une erreur a été faite, la case deviendra colorée, sinon elle restera blanche.
                </div>
                <div style={{ marginTop: '10px' }}>
                    Pour jouer au mode "Découverte chemin optimal", il suffit de cliquer directement sur les cases bleues dans la matrice. Si vous avez trouvé la bonne case, elle deviendra verte, sinon, elle deviendra rouge.
                </div>
                <div style={{ marginTop: '20px' }}>
                    Bon amusement !
                </div>
            </div>
        </Box>

    const matrixFillInfo =
        <Box
            component="section"
            sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 650, height: 700, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
            <div style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '20px' }}>
                Explications :
            </div>
            <div style={{fontSize: '1.2em', textAlign: 'left' }}>
                <div style={{ marginTop: '10px' }}>
                    Pour le remplissage des matrice,
                </div>
                <div style={{ marginTop: '10px' }}>
                    La première étape est de remplir la première ligne. Celle-ci est la somme cumulative des gaps à chaque itérations.
                </div>
                <div style={{ marginTop: '10px' }}>
                    Ensuite, on calcule 3 valeurs : "TOP VALUE","DIAGONAL VALUE" et "LEFT VALUE" selon la position de la case.
                    <div/>
                    - TOP VALUE est la valeur au dessus de notre case recherchée + la valeur du gap.
                    <div/>
                    - HORIZONTAL VALUE est la valeur qui se situe en diagonal par rapport à notre case recherchée + la valeur du match si les 2 caractères associé des séquences sont égaux ou la valeur du mismatch sinon.
                    <div/>
                    - LEFT VALUE est la valeur à gauche de notre case recherchée + la valeur du gap.
                </div>
                <div style={{ marginTop: '10px' }}>
                    La dernière étape s'agit de prendre la valeur maximale parmis ces 3 valeurs.
                </div>
                <div style={{ marginTop: '20px' }}>
                    Un petit outil visuel a été élaboré au dessus de ces explications afin de mieux comprendre d'où viennent les valeurs. L'aide commence à partir de la deuxième ligne dans la matrice.
                </div>
            </div>
        </Box>

    const pathExplorerInfo =
        <Box
            component="section"
            sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 650, height: 700, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
            <div style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '20px' }}>
                Explications :
            </div>
            <div style={{fontSize: '1.2em', textAlign: 'left' }}>
                <div style={{ marginTop: '10px' }}>
                    Pour trouver un chemin optimal,
                </div>
                <div style={{ marginTop: '10px' }}>
                    La méthode consiste à soustraire la valeur de la case actuelle pour chaque case possible :
                </div>
                <div style={{ marginTop: '10px' }}>
                    Soustraire à la case du haut, pour que l'on accepte cette case du haut comme solution, il faut que le résultat de la soustraction (case actuelle - case du haut) soit égal au gap
                    <div/>
                    <div style={{ marginTop: '10px' }}>
                        Soustraire à la case diagonale (haut a gauche), pour que l'on accepte cette case diagonale comme solution, il faut que le résultat de la soustraction (case actuelle - case diagonale) soit égal au match (et qu'il y ait un match) ou au mismatch (et qu'il y ait un mismatch).
                        <div/></div>
                    <div style={{ marginTop: '10px' }}>
                        Soustraire à la case de gauche, pour que l'on accepte cette case de gauche comme solution, il faut que le résultat de la soustraction (case actuelle - case de gauche) soit égal au gap.
                        <div/></div>
                </div>
                <div style={{ marginTop: '10px' }}>
                    La dernière étape s'agit de cliquer sur une case qui est "acceptée" après nos calculs.
                </div>
                <div style={{ marginTop: '20px' }}>
                    Un petit calculateur a été élaboré au dessus de ces explications afin de mieux visualiser le calcul qui permet de déterminer quel case est acceptée ou pas.
                </div>
            </div>
        </Box>

    return(
        <div>
            {gameModeInfo}
            {matrixFillInfo}
            {pathExplorerInfo}
        </div>
    );
}


