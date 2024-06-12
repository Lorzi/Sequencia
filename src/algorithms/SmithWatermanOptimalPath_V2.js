import {addPathsToQueue, comparePath} from "../utils";

/**
 * Allows you to find the optimal paths in the arrow matrix for the Smith-Waterman algorithm.
 * Analyse the arrowedMatrix and return a list of optimals paths
 * @param arrowedMatrix
 * @param maxScoreList
 * @param transfMatrix
 * @param computeLimit
 * @returns {number[][][]|[]}
 */
export function findPathsSW(arrowedMatrix,maxScoreList,transfMatrix,computeLimit) {
    const paths = [];
    const queue = [];

    for(let i =0;i < maxScoreList.length; i++) {
        const yMax = maxScoreList[i][0];
        const xMax = maxScoreList[i][1];
        //Add the last case to the queue
        queue.push([[yMax, xMax]]);

        while (queue.length > 0) {
            const path = queue.shift();
            const [y, x] = path[0];
            if(paths.length === computeLimit){
                return(paths);
            }
            //The iteration stops if we find a zero
            if (transfMatrix[y][x] === 0) {
                path.sort(comparePath);
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