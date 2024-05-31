/**
 * Creates the match/missmatch matrix to divide work and make it easier to add the gaps in another function (when creating the transfMatrix)
 * @param S1
 * @param S2
 * @param Match
 * @param Mismatch
 * @returns {[]}
 */
export default function createSubMatrix(S1,S2,Match,Mismatch){
    let i,j=0;
    const subMatrix = [];

    for(i=0;i<S1.length;i++){
        const line = [];
        for(j=0;j<S2.length;j++){
            if (S1[i] === S2[j]) {
                line.push(Match);
            }
            else {
                line.push(Mismatch);
            }
        }

        subMatrix.push(line);
    }
    // eslint-disable-next-line no-restricted-globals

    return subMatrix;

}

/**
 * Create the sub-matrix according to the scores of the custom or blosum matrix set in parameter
 * @param S1
 * @param S2
 * @param blosumCustom
 * @returns {[]}
 */
   export function createSubMatrixBLOSUM(S1,S2,blosumCustom){

       let i,j=0;
       const subMatrix = [];

       for(i=0;i<S1.length;i++){
           const line = [];
           for(j=0;j<S2.length;j++){
               if(S1[i] in blosumCustom && S2[j] in blosumCustom){
                   line.push(blosumCustom[S1[i]][S2[j]])
               }
               else{
                   console.log("Don't exist in this blosum matrix");
               }

           }

           subMatrix.push(line);
       }
       // eslint-disable-next-line no-restricted-globals

       return subMatrix;

   }