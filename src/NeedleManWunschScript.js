
export function NeedleManWunschScript(S1,S2,Match,Missmatch,Gap){

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
            console.log(subMatrix);
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
        let cumulative = 0;

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

                transfMatrix[i].push(Math.max(transfMatrix[i - 1][j - 1] + subMatrix[i - 1][j - 1], transfMatrix[i - 1][j] + Gap, transfMatrix[i][j - 1] + Gap))
            }
        }

        return transfMatrix
    }
    const 테스트매트릭스 = createSubMatrix(S1,S2,Match,Missmatch);
    return(createTransfMatrix(S1,S2,테스트매트릭스,Gap))

}

