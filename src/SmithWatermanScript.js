import createSubMatrix from "./components/subMatrixGenerator";

/**
 * Script to create the score matrix with Smith-Waterman algorithm and will slightly differ depending on the chosen parameter, activated options, chosen variant, etc...
 * @param S1
 * @param S2
 * @param Match
 * @param Missmatch
 * @param Gap
 * @returns {(*|[])[]}
 * @constructor
 */
export function SmithWatermanScript(S1,S2,Match,Missmatch,Gap) {

    /**
     * Create and return the transformed matrix (score matrix) that will help to find the best path possible, this is also the matrix that should be displayed on the screen
     * Smith-Waterman algorithm
     * @param S1
     * @param S2
     * @param subMatrix
     * @param Gap
     * @returns {[][]}
     */
    function createTransfMatrix(S1,S2,subMatrix,Gap){
        let i,j=0;
        const transfMatrix = [];
        const lenX = S2.length;
        const lenY= S1.length;
        const first_line = [];
        let caseValue = 0;
        let maxScore = 0;
        let maxCoordList = [];
        for (i=0;i<lenX +1;i++){ //Creation of the first line which is an exceptional case of the algorithm
            first_line.push(0);
        }

        transfMatrix.push(first_line) //Added the first line
        for(i=1;i<lenY+1;i++){
            transfMatrix.push([0]); //Adding the first column gradually (mandatory to calculate the rest)
            for(j=1;j<lenX+1;j++) {
                //Max    (Diagonal                                                   , Vertical,                   Horizontal                   ,0)
                caseValue = Math.max(transfMatrix[i - 1][j - 1] + subMatrix[i - 1][j - 1], transfMatrix[i - 1][j] + Gap, transfMatrix[i][j - 1] + Gap,0)
                transfMatrix[i].push(caseValue); //Core of the algorithm #This is typically where we will display the steps on the GUI each time
                if (caseValue > maxScore){ //Filling a list with coordinates which corresponds to the maximums in order to be able to do the traceback
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