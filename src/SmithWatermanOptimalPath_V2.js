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

        //Tant que la file n'est pas vide
        while (queue.length > 0) {
            const path = queue.shift(); //Get a path from the queue
            const [y, x] = path[0]; //Get the current position of the path
            if(paths.length === computeLimit){
                return(paths);
            }
            //If we reach the first box, add the path found to the list of paths
            if (transfMatrix[y][x] === 0) { //If we find a zero we stop

                path.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
                paths.push(path);

                continue;
            }


            let arrows = arrowedMatrix[y][x].toString();

            //Explore possible directions according to the arrows in the box
            if (arrows.includes("↖")) {
                queue.push([[y - 1, x - 1], ...path]); //Diagonal movement
            }
            if (arrows.includes("↑")) {
                queue.push([[y - 1, x], ...path]); //Move up
            }
            if (arrows.includes("←")) {
                queue.push([[y, x - 1], ...path]); //Move left
            }
        }
    }
        if (paths.length === 0) {
            return ([[[0,0]]]);
        } else {
            return paths;
        }

}