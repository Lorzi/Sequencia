import {addPathsToQueue} from "./utils";

/**
 * Allows you to find the optimal paths in the arrow matrix for the Smith-Waterman algorithm.
 * @param arrowedMatrix
 * @param maxScoreList
 * @param transfMatrix
 * @param computeLimit
 * @returns {number[][][]|[]}
 */
export function findPathsSW(arrowedMatrix,maxScoreList,transfMatrix,computeLimit) {
    const paths = []; //List to store found paths
    const queue = []; //File to follow the paths

    for(let i =0;i < maxScoreList.length; i++) {
        const yMax = maxScoreList[i][0];
        const xMax = maxScoreList[i][1];
        //Add the last box to the queue
        queue.push([[yMax, xMax]]);

        //While the queue is not empty
        while (queue.length > 0) {
            const path = queue.shift(); //Get a path from the queue
            const [y, x] = path[0]; //Get the current position of the path
            if(paths.length === computeLimit){
                return(paths);
            }
            //If we reach the first box, add the path found to the list of paths
            if (transfMatrix[y][x] === 0) { //If we find a zero we stop

                path.sort((y, x) => { //Sort of an array, compare first element then next element
                    let result = y[0] - x[0];
                    if (result === 0) {
                        result = y[1] - x[1];
                    }
                    return result;
                });
                paths.push(path);
                continue;
            }
            let arrows = arrowedMatrix[y][x].toString();
            //Explore possible directions according to the arrows in the box
            addPathsToQueue(queue, path, y, x, arrows);
        }
    }
        if (paths.length === 0) {
            return ([[[0,0]]]);
        } else {
            return paths;
        }

}