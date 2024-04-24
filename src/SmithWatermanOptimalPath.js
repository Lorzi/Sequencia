
// export function determineArrowedMatrixSW(S1,S2,subMatrix,transfMatrix,match,gap,missmatch,maxScoreCoordList){ //Optimisation possible en combinant le fait de mettre les fleches et les path en meme temps ? comme dans SW
//     let y = S1.length, x= S2.length;
//
//     //CREATION MATRICE FLECHE INITIALISEE DE ZERO
//     let arrowedMatrix = [];
//     // Ajout de lignes à la matrice
//     for (let i = 0; i < y+1; i++) {
//         arrowedMatrix[i] = [];
//         //ajout colonne
//         for (let j = 0; j < x+1; j++) {
//             if (j===0){
//                 arrowedMatrix[i][j] = "⬆";
//                 if(i===0){
//                     arrowedMatrix[i][j] = "⮔"
//                 }
//
//             }
//             else{
//                 arrowedMatrix[i][j] = "⬅";
//             }
//
//         }
//     }
//
//     for(let i =0;i < maxScoreCoordList.length; i++){
//
//
//     }
//
//     while (y!==0){
//         while (x!==0){
//             let arrowWord ="";
//             //CAS VERTICAL
//             if(transfMatrix[y-1][x] + gap === transfMatrix[y][x]){
//                 arrowWord = arrowWord + "↑";
//             }
//             //CAS DIAGONAL
//             //CAS MATCH
//             if(subMatrix[y-1][x-1]===match){
//                 if(transfMatrix[y-1][x-1] + match === transfMatrix[y][x]){
//                     arrowWord = arrowWord + "↖";
//                 }
//             }
//             //CAS MISSMATCH
//             if(subMatrix[y-1][x-1]!==match){
//                 if(transfMatrix[y-1][x-1] + missmatch === transfMatrix[y][x]){
//                     arrowWord = arrowWord + "↖";
//                 }
//             }
//             //CAS HORIZONTAL
//             if(transfMatrix[y][x-1] + gap === transfMatrix[y][x]){
//                 arrowWord = arrowWord + "←";
//             }
//             //TOTAL WORD + PUSH DANS LA MATRICE LES FLECHES
//             arrowedMatrix[y][x] = arrowWord;
//
//             //DECREMENTER X
//             x-=1;
//         }
//         y-=1;
//         x = S2.length;
//     }
//     //DECREMENTER Y ET INCREMENTER X DE TAILLE S2
//
//
//     return arrowedMatrix;
// }

export function findPathSW(transfMatrix,maxScoreCoordList,S1,S2){
    let tr = 1;
    let allPath = [];
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

    if(maxScoreCoordList.length === 0){

        return [[0,0]]
    }

    for(let i =0;i < maxScoreCoordList.length; i++){

        let uniquePath = [maxScoreCoordList[i]]
        let y = maxScoreCoordList[i][0];
        let x = maxScoreCoordList[i][1];

        while(tr!==0){
            let arrowWord ="";
            if(transfMatrix[y-1][x-1] === 0){
                uniquePath.push([y-1,x-1])
                tr = 0;
            }
            //Mouvement diagonal
            if(Math.max(transfMatrix[y-1][x],transfMatrix[y][x-1],transfMatrix[y-1][x-1]) === transfMatrix[y-1][x-1]){
                uniquePath.push([y-1,x-1])
                arrowWord = arrowWord + "↖";
            }
            else{
            //Mouvement vertical :
            if(Math.max(transfMatrix[y-1][x],transfMatrix[y][x-1],transfMatrix[y-1][x-1]) === transfMatrix[y-1][x]){
                arrowWord = arrowWord + "↑";
            }
            //Mouvement horizontal :
            if(Math.max(transfMatrix[y-1][x],transfMatrix[y][x-1],transfMatrix[y-1][x-1]) === transfMatrix[y][x-1]){
                arrowWord = arrowWord + "←";
            }
        }
            arrowedMatrix[y][x] = arrowWord;
            y--;
            x--;
        }

        allPath.push(uniquePath)
        tr=1;

    }

    return arrowedMatrix;
}

// export function findPathSW(transfMatrix,maxScoreCoordList){
//     let tr = 1;
//     let allPath = [];
//
//
//     if(maxScoreCoordList.length === 0){
//
//         return [[0,0]]
//     }
//
//     for(let i =0;i < maxScoreCoordList.length; i++){
//
//         let uniquePath = [maxScoreCoordList[i]]
//         let y = maxScoreCoordList[i][0];
//         let x = maxScoreCoordList[i][1];
//
//         //transfMatrix[maxScoreCoordList[i][0]] x
//         //transfMatrix[maxScoreCoordList[i][1]] y
//
//         while(tr!==0){
//
//             if(transfMatrix[y-1][x-1] === 0){
//                 uniquePath.push([y-1,x-1])
//                 tr = 0;
//             }
//             //Mouvement diagonal
//             else if(Math.max(transfMatrix[y-1][x],transfMatrix[y][x-1],transfMatrix[y-1][x-1]) === transfMatrix[y-1][x-1]){
//                 uniquePath.push([y-1,x-1])
//             }
//             //Mouvement vertical :
//             else if(Math.max(transfMatrix[y-1][x],transfMatrix[y][x-1],transfMatrix[y-1][x-1]) === transfMatrix[y-1][x]){
//                 uniquePath.push([y-1,x])
//             }
//             //Mouvement horizontal :
//             else if(Math.max(transfMatrix[y-1][x],transfMatrix[y][x-1],transfMatrix[y-1][x-1]) === transfMatrix[y-1][x]){
//                 uniquePath.push([y,x-1])
//             }
//             y--;
//             x--;
//         }
//
//         allPath.push(uniquePath)
//         tr=1;
//
//     }
//     return allPath;
// }