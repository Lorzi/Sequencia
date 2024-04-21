export function determineArrowedMatrix(S1,S2,subMatrix,transfMatrix,match,gap,missmatch){ //Optimisation possible en combinant le fait de mettre les fleches et les path en meme temps ? comme dans SW
    let y = S1.length, x= S2.length;

    //CREATION MATRICE FLECHE INITIALISEE DE ZERO
    let arrowedMatrix = [];
    // Ajout de lignes à la matrice
    for (let i = 0; i < y+1; i++) {
        arrowedMatrix[i] = [];
        //ajout colonne
        for (let j = 0; j < x+1; j++) {
            if (j===0){
                arrowedMatrix[i][j] = "⬆";
                if(i===0){
                    arrowedMatrix[i][j] = "⮔"
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
            //CAS VERTICAL
            if(transfMatrix[y-1][x] + gap === transfMatrix[y][x]){
                arrowWord = arrowWord + "↑";
            }
            //CAS DIAGONAL
                //CAS MATCH
            if(subMatrix[y-1][x-1]===match){
                if(transfMatrix[y-1][x-1] + match === transfMatrix[y][x]){
                    arrowWord = arrowWord + "↖";
                }
            }
                //CAS MISSMATCH
            if(subMatrix[y-1][x-1]!==match){
                if(transfMatrix[y-1][x-1] + missmatch === transfMatrix[y][x]){
                    arrowWord = arrowWord + "↖";
                }
            }
            //CAS HORIZONTAL
            if(transfMatrix[y][x-1] + gap === transfMatrix[y][x]){
                arrowWord = arrowWord + "←";
            }
            else if(arrowWord.length === 0){
                arrowWord = arrowWord + "‎ ";
            }
            //TOTAL WORD + PUSH DANS LA MATRICE LES FLECHES
            arrowedMatrix[y][x] = arrowWord;
            // if(arrowedMatrix.length === 100){
            //     return arrowedMatrix;
            // }
            //DECREMENTER X
            x-=1;
            }
        y-=1;
        x = S2.length;
        }
        //DECREMENTER Y ET INCREMENTER X DE TAILLE S2


    return arrowedMatrix;
}

export function findPaths(arrowedMatrix,computeLimit) {
    const paths = []; // Liste pour stocker les chemins trouvés
    const queue = []; // File pour suivre les chemins

    const yMax = arrowedMatrix.length - 1;
    const xMax = arrowedMatrix[0].length - 1;
    // Ajoute la dernière case à la file
    queue.push([[yMax, xMax]]);

    // Tant que la file n'est pas vide
    while (queue.length > 0) {
        const path = queue.shift(); // Récupère un chemin de la file
        const [y, x] = path[0]; // Récupère la position actuelle du chemin

        //Si on atteint la première case, ajoute le chemin trouvé à la liste des chemins
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
            path.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            paths.push(path);
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
// export function allPaths(S1,S2,arrowedMatrix){
//     let y = S1.length - 1, x= S2.length - 1;
//     let pathNumber = 1;
//     let pathList = [];
//
//
//     while(pathNumber !== 0){
//         let onePath = [];
//         while(x!==0 && y!==0){
//             if (arrowedMatrix[y][x].length === 1){
//
//                 if (arrowedMatrix[y][x] === "←"){
//                     onePath.push([y,x]);
//                     x-=1;
//                 }
//                 if (arrowedMatrix[y][x] === "↖"){
//                     onePath.push([y,x]);
//                     x-=1;
//                     y-=1;
//                 }
//                 if (arrowedMatrix[y][x] === "↑"){
//                     onePath.push([y,x]);
//                     y-=1;
//                 }
//
//             }
//
//         }
//
//     }
//
//
// }