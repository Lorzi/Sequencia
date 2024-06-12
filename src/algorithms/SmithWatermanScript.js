import createSubMatrix from "../components/subMatrixGenerator";

/**
 * Script to create the score matrix with Smith-Waterman algorithm and will slightly differ depending on the chosen parameter, activated options, chosen variant, etc...
 * @param S1
 * @param S2
 * @param Match
 * @param Mismatch
 * @param Gap
 * @returns {(*|[])[]}
 * @constructor
 */
export function SmithWatermanScript(S1,S2,Match,Mismatch,Gap) {
    /**
     * Create and return the transformed matrix (score matrix) that will help to find the best path possible
     * This algorithm is the Smith-Waterman algorithm
     * Returns a list containing the sub-matrix, the transfMatrix (score matrix) and the max score (needed to know where the optimal paths are)
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

        for (i=0;i<lenX +1;i++){
            first_line.push(0);
        }
        transfMatrix.push(first_line)
        for(i=1;i<lenY+1;i++){
            transfMatrix.push([0]);
            for(j=1;j<lenX+1;j++) {
                //Core of the algorithm -> This is where we compute and fill every case of the score matrix (transfMatrix).
                caseValue = Math.max(transfMatrix[i - 1][j - 1] + subMatrix[i - 1][j - 1], transfMatrix[i - 1][j] + Gap, transfMatrix[i][j - 1] + Gap,0)
                transfMatrix[i].push(caseValue);
                if (caseValue > maxScore){
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
    const subMatrix = createSubMatrix(S1,S2,Match,Mismatch);
    const transfMatrixResult = createTransfMatrix(S1,S2,subMatrix,Gap);
    const transfMatrix = transfMatrixResult[0];
    const maxCoordList = transfMatrixResult[1];

    return([subMatrix,transfMatrix,maxCoordList]);
}