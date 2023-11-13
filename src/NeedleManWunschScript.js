export function NeedleManWunschScript(S1,S2,Match,Missmatch,Gap){

    /*# Create and return the Substitution matrix that will be needed in order to fulfill the transformed matrix*/
    function createSubMatrix(S1,S2,Match,Missmatch){
        let i =0,j=0;
        const subMatrix = []

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
        console.log(subMatrix)
        return subMatrix;

    }

    /*#  Create and return the transformed matrix that is will help to find the best path possible, this is also the matrix that should be displayed on the screen*/
    function createTransfMatrix(S1,S2,subMatrix,Gap){
        let i =0,j=0;
        const transfMatrix = [];
        const lenX = S2.length;
        const lenY= S1.length;
        const first_line = [];
        let cumulative = 0;

        for (i=0;i<lenX +1;i++){ //#Creation de la première ligne qui est un cas exceptionnel de l'algorithme
            first_line.push(cumulative);
            cumulative += Gap;
        }
        transfMatrix.push(first_line) //#Ajout de la premiere ligne
        cumulative = 0

        for(i=1;i<lenY+1;i++){
            cumulative += Gap
            transfMatrix.push([cumulative]) //#Ajout de la première colonne au fur et a mesure (obligatoire pour calculer la suite)
            for(j=1;j<lenX+1;j++) {

                transfMatrix[i].push(Math.max(transfMatrix[i - 1][j - 1] + subMatrix[i - 1][j - 1], transfMatrix[i - 1][j] + Gap, transfMatrix[i][j - 1] + Gap)) //#Noyau de l'algorithme #C'est ty^piquement a cet endroit qu'on va afficher a chaque fois les étapes sur le GUI
            }
        }
        return transfMatrix
    }


    const 테스트매트릭스 = createSubMatrix(S1,S2,Match,Missmatch);
    const transfMatrix = createTransfMatrix(S1,S2,테스트매트릭스,Gap);

    return([테스트매트릭스,transfMatrix]);

}

