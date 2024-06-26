import createSubMatrix, {createSubMatrixBLOSUM} from "../components/subMatrixGenerator";

/**
 * Script to create the score matrix with Needleman-Wunsch algorithm and will slightly differ depending on the chosen parameter, activated options, chosen variant, etc...
 * @param S1
 * @param S2
 * @param Match
 * @param Mismatch
 * @param Gap
 * @param operation_mm Max or Min
 * @param blosumCheck Usage or not of the custom score matrix
 * @param blosumCustom Custom matrix chosen from the file input by the user
 * @returns {([]|[])[]}
 * @constructor
 */
export function NeedleManWunschScript(S1,S2,Match,Mismatch,Gap,operation_mm,blosumCheck,blosumCustom){
    let operationMaxMin = Math.max;
    if(operation_mm ===0){
        operationMaxMin = Math.max;
    }
    else if(operation_mm===1){
        operationMaxMin = Math.min;
    }

    /**
     * Create and return the transformed matrix (score matrix) that will help to find the best path possible, this is also the matrix that should be displayed on the screen
     * Needleman-Wunsch algorithm
     * @param S1
     * @param S2
     * @param subMatrix
     * @param Gap
     * @returns {[]}
     */
    function createTransfMatrix(S1,S2,subMatrix,Gap){
        let i,j=0;
        const transfMatrix = [];
        const lenX = S2.length;
        const lenY= S1.length;
        const first_line = [];
        let cumulative = 0;

        //Creation of the first line which is an exceptional case of the algorithm
        for (i=0;i<lenX +1;i++){
            first_line.push(cumulative);
            cumulative += Gap;
        }
        transfMatrix.push(first_line)
        cumulative = 0

        for(i=1;i<lenY+1;i++){
            cumulative += Gap
            transfMatrix.push([cumulative])

            for(j=1;j<lenX+1;j++) {
                //Core of the algorithm -> This is where each value of the score matrix is computed
                transfMatrix[i].push(operationMaxMin(transfMatrix[i - 1][j - 1] + subMatrix[i - 1][j - 1] , transfMatrix[i - 1][j] + Gap, transfMatrix[i][j - 1] + Gap))
            }
        }
        return transfMatrix
    }

    //SubMatrix creation, check if blosum mode is active or not
    let subMatrix;
    if (blosumCheck){
        subMatrix = createSubMatrixBLOSUM(S1,S2,blosumCustom);

    }
    else{
        subMatrix = createSubMatrix(S1,S2,Match,Mismatch);

    }

    const transfMatrix = createTransfMatrix(S1,S2,subMatrix,Gap);

    return([subMatrix,transfMatrix]);

}
//Put off the comment to start tests
//module.exports =NeedleManWunschScript;


