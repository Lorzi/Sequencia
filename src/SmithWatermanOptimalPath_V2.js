export function findPathsSW(arrowedMatrix,maxScoreList,transfMatrix,computeLimit) {
    const paths = []; // Liste pour stocker les chemins trouvés
    const queue = []; // File pour suivre les chemins


    for(let i =0;i < maxScoreList.length; i++) {
        const yMax = maxScoreList[i][0];
        const xMax = maxScoreList[i][1];
        // Ajoute la dernière case à la file
        queue.push([[yMax, xMax]]);

        // Tant que la file n'est pas vide
        while (queue.length > 0) {
            const path = queue.shift(); // Récupère un chemin de la file
            const [y, x] = path[0]; // Récupère la position actuelle du chemin
            if(paths.length === computeLimit){
                return(paths);
            }
            //Si on atteint la première case, ajoute le chemin trouvé à la liste des chemins
            if (transfMatrix[y][x] === 0) { //Si on trouve un zero on s'arrete

                path.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
                paths.push(path);

                continue;
            }


            let arrows = arrowedMatrix[y][x].toString();

            // Explore les directions possibles selon les flèches de la case
            if (arrows.includes("↖")) {
                queue.push([[y - 1, x - 1], ...path]); // Déplacement en diagonale
            }
            if (arrows.includes("↑")) {
                queue.push([[y - 1, x], ...path]); // Déplacement vers le haut
            }
            if (arrows.includes("←")) {
                queue.push([[y, x - 1], ...path]); // Déplacement vers la gauche
            }

        }
    }

        if (paths.length === 0) {
            return ([[[0,0]]]);
        } else {
            return paths;
        }

}