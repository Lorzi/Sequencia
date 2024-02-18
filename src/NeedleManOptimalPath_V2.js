export function determineArrowedMatrix(S1,S2,subMatrix,transfMatrix,match,gap,missmatch){
    let y = S1.length, x= S2.length;

    //CREATION MATRICE FLECHE INITIALISEE DE ZERO
    let arrowedMatrix = [];
    // Ajout de lignes à la matrice
    for (let i = 0; i < y+1; i++) {
        arrowedMatrix[i] = [];
        //ajout colonne
        for (let j = 0; j < x+1; j++) {
            arrowedMatrix[i][j] = 0;
        }
    }

    while (y!==0){
        while (x!==0){
            let arrowWord ="";
            //CAS VERTICAL
            if(transfMatrix[y-1][x] + gap === transfMatrix[y][x]){
                arrowWord = arrowWord + "↑";
            }
            //CAS DIAGONAL
                //CAS MATCH
            if(subMatrix[y-1][x-1]===match){
                if(transfMatrix[y-1][x-1] + match === transfMatrix[y][x]){
                    arrowWord = arrowWord + "↖";
                }
            }
                //CAS MISSMATCH
            if(subMatrix[y-1][x-1]!==match){
                if(transfMatrix[y-1][x-1] + missmatch === transfMatrix[y][x]){
                    arrowWord = arrowWord + "↖";
                }
            }
            //CAS HORIZONTAL
            if(transfMatrix[y][x-1] + gap === transfMatrix[y][x]){
                arrowWord = arrowWord + "←";
            }
            //TOTAL WORD + PUSH DANS LA MATRICE LES FLECHES
            arrowedMatrix[y][x] = arrowWord;

            //DECREMENTER X
            x-=1;
            }
        y-=1;
        x = S2.length;
        }
        //DECREMENTER Y ET INCREMENTER X DE TAILLE S2


    return arrowedMatrix;
}