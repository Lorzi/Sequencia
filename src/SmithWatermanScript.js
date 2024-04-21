export function SmithWatermanScript(S1,S2,Match,Missmatch,Gap,operation_mm) {

    function createSubMatrix(S1,S2,Match,Missmatch){
        let i =0,j=0;
        const subMatrix = [];

        for(i=0;i<S1.length;i++){
            const line = [];
            for(j=0;j<S2.length;j++){
                if (S1[i] === S2[j]) {
                    line.push(Match);
                }
                else {
                    line.push(Missmatch);
                }
            }

            subMatrix.push(line);
        }
        // eslint-disable-next-line no-restricted-globals

        return subMatrix;

    }

    function createTransfMatrix(S1,S2,subMatrix,Gap){
        let i =0,j=0;
        const transfMatrix = [];
        const lenX = S2.length;
        const lenY= S1.length;
        const first_line = [];
        let caseValue = 0;
        let maxScore = 0;
        let maxCoordList = [];


        for (i=0;i<lenX +1;i++){ //#Creation de la première ligne qui est un cas exceptionnel de l'algorithme
            first_line.push(0);
        }

        transfMatrix.push(first_line) //#Ajout de la premiere ligne
        for(i=1;i<lenY+1;i++){
            transfMatrix.push([0]); //#Ajout de la première colonne au fur et a mesure (obligatoire pour calculer la suite)
            for(j=1;j<lenX+1;j++) {
                //Max    (Diagonal                                                   , Vertical,                   Horizontal                   ,0)
                caseValue = Math.max(transfMatrix[i - 1][j - 1] + subMatrix[i - 1][j - 1], transfMatrix[i - 1][j] + Gap, transfMatrix[i][j - 1] + Gap,0)
                transfMatrix[i].push(caseValue); //#Noyau de l'algorithme #C'est ty^piquement a cet endroit qu'on va afficher a chaque fois les étapes sur le GUI
                if (caseValue > maxScore){ //Remplissage d'une liste de coordonnée qui correspond aux maximums afin de pouvoir faire le traceback
                    maxScore = caseValue;
                    maxCoordList = [[i,j]];
                }
                else if(caseValue === maxScore){
                    maxCoordList.push([i,j]);
                }
            }
        }
        return [transfMatrix,maxCoordList]
    }
    const subMatrix = createSubMatrix(S1,S2,Match,Missmatch);
    const transfMatrixResult = createTransfMatrix(S1,S2,subMatrix,Gap);
    const transfMatrix = transfMatrixResult[0];
    const maxCoordList = transfMatrixResult[1];


    return([subMatrix,transfMatrix,maxCoordList]);
}