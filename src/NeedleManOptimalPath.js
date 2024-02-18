/*Determine le chemin optimal de la matrice finale en prenant en entrée la Sequence 1
et 2, la matrice de subsitution, la matrice transformée et la valeur du match. Ce
chemin optimal est ensuite le retourne en liste
Determine the optimal path of the final matrix and put it inside a array that is returned
 */
export function determineOptimalTraceback(S1,S2,subMatrix,transfMatrix,match){
    let y = S1.length, x= S2.length;

    let path = [[y,x]]
    while(x!==0 && y!==0){
        if(subMatrix[y-1][x-1]===match){
            y-=1;
            x-=1;
            path.push([y,x]);
            //On ajoute une ↖
        }
        else{
            if(transfMatrix[y-1][x] > transfMatrix[y][x-1]){
                if(transfMatrix[y-1][x]>transfMatrix[y-1][x-1]){
                    y-=1;
                    path.push([y,x]);
                }
                else{
                    x-=1;
                    y-=1;
                    path.push([y,x]);
                }
            }
            else{
                if(transfMatrix[y][x-1] > transfMatrix[y-1][x-1]){
                    x-=1;
                    path.push([y,x]);

                }
                else{
                    x-=1;
                    y-=1;
                    path.push([y,x]);
                }
            }
        }
    }
    path.push([0,0]);
    return path;
}