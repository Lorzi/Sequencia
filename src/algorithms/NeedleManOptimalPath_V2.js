import {addPathsToQueue, comparePath} from "../utils";

/**
 * Function that determines the arrow matrix and returns it in list form
 * The arrow matrix is a list of arrow that indicate which direction can be taken by a path in a traceback.
 * Analyse the arrowedMatrix and return a list of optimals paths
 * @param S1
 * @param S2
 * @param subMatrix
 * @param transfMatrix
 * @param match
 * @param gap
 * @param missmatch
 * @returns {[]}
 */
export function determineArrowedMatrix(S1,S2,subMatrix,transfMatrix,match,gap,missmatch){
    let y = S1.length, x= S2.length;

    //CREATION OF ARROW MATRIX INITIALIZED FROM ZERO
    let arrowedMatrix = [];
    // Adding rows to the matrix
    for (let i = 0; i < y+1; i++) {
        arrowedMatrix[i] = [];
        //add columns
        for (let j = 0; j < x+1; j++) {
            if (j===0){
                arrowedMatrix[i][j] = "⬆";
                if(i===0){
                    arrowedMatrix[i][j] = "○"
                }

            }
            else{
                arrowedMatrix[i][j] = "⬅";
            }

        }
    }

    while (y!==0){
        while (x!==0){
            let arrowWord ="";
            //VERTICAL CASE
            if(transfMatrix[y-1][x] + gap === transfMatrix[y][x]){
                arrowWord = arrowWord + "↑";
            }
            //DIAGONAL CASE
                //MATCH CASE
            if(subMatrix[y-1][x-1]===match){
                if(transfMatrix[y-1][x-1] + match === transfMatrix[y][x]){
                    arrowWord = arrowWord + "↖";
                }
            }
                //MISMATCH CASE
            if(subMatrix[y-1][x-1]!==match){
                if(transfMatrix[y-1][x-1] + missmatch === transfMatrix[y][x]){
                    arrowWord = arrowWord + "↖";
                }
            }
            //HORIZONTAL CASE
            if(transfMatrix[y][x-1] + gap === transfMatrix[y][x]){
                arrowWord = arrowWord + "←";
            }
            else if(arrowWord.length === 0){
                arrowWord = arrowWord + " ";
            }
            //TOTAL WORD + PUSH IN THE ARROWS MATRIX
            arrowedMatrix[y][x] = arrowWord;
            x-=1;
            }
        y-=1;
        x = S2.length; //DECREMENT Y AND INCREMENT X OF SIZE S2
        }

    return arrowedMatrix;
}

/**
 * Function which allows you to find the optimal paths using the arrow matrix
 * @param arrowedMatrix
 * @param computeLimit
 * @returns {number[][][]|[]}
 */
export function findPaths(arrowedMatrix,computeLimit) {
    const paths = [];
    const queue = [];

    const yMax = arrowedMatrix.length - 1;
    const xMax = arrowedMatrix[0].length - 1;

    // Add the last box/case to the queue
    queue.push([[yMax, xMax]]);

    while (queue.length > 0) {
        const path = queue.shift();
        const [y, x] = path[0];
        //If we reach the first box, add the path found to the list of paths
        if (y === 0 || x === 0) {
            let yNew = y, xNew = x;
            if(y===0 && x!==0){
                while(xNew!==0){
                    path.push([yNew, xNew - 1]);
                    xNew-=1;
                }
            }
            if(x===0 && y!==0){
                while(yNew!==0){
                    path.push([yNew-1, xNew]);
                    yNew-=1;
                }
            }
            path.sort(comparePath);

            paths.push(path);
            continue;
        }

        let arrows = arrowedMatrix[y][x].toString();
        // Explore the possible directions according to the arrows in the box
        addPathsToQueue(queue, path, y, x, arrows);
        if (paths.length === computeLimit){
            return(paths);
        }
    }

    if (paths.length === 0){
        return([[[yMax, xMax]]]);
    }
    else{
        return paths;
    }
}
