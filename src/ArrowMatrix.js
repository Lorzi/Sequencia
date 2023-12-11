export function determineArrowMatrix(S1, S2, subMatrix, transfMatrix, match){
    let y = S1.length, x= S2.length;
    let save_y = S1.length
    let save_x = S2.length


    let wholePath = []

    function determineWholePath2(y,x,subMatrix,transfMatrix,match){
        let aPath = []
        while(x!==0 && y!==0){
            let direction = ""
            if(subMatrix[y-1][x-1]===match){//MATCH
                aPath.push([y,x,"↖"])
                y-=1
                x-=1


                //On ajoute une ↖
            }
            else{

                if(transfMatrix[y][x-1] > transfMatrix[y][x]){
                    direction += "←";
                }
                if(transfMatrix[y-1][x-1] > transfMatrix[y][x]){
                    direction += "↖";
                }
                if(transfMatrix[y-1][x] > transfMatrix[y][x] ){
                    direction += "↑";

                }

                switch (direction) {
                    case "↑":
                        aPath.push([y,x,"↑"])
                        y-=1
                        break;
                    case "←":
                        aPath.push([y,x,"←"])
                        x-=1
                        break;
                    case "↖":
                        aPath.push([y,x,"↖"])
                        y-=1
                        x-=1
                        break;
                    case "↖↑":
                        aPath.push([y,x,"↖↑"])
                        y-=1
                        aPath = aPath.concat(...determineWholePath2(y,x,subMatrix,transfMatrix,match)) //↖
                        x-=1
                        aPath = aPath.concat(...determineWholePath2(y,x,subMatrix,transfMatrix,match))
                        break;
                    case "←↖":
                        aPath.push([y,x,"←↖"])
                        x-=1
                        aPath = aPath.concat(...determineWholePath2(y,x,subMatrix,transfMatrix,match)) //↖
                        y-=1
                        aPath = aPath.concat(...determineWholePath2(y,x,subMatrix,transfMatrix,match))
                        break;
                    case "←↑":
                        aPath.push([y,x,"←↑"])
                        x-=1
                        aPath.concat(...determineWholePath2(y,x,subMatrix,transfMatrix,match)) //↖
                        x+=1
                        y-=1
                        aPath.concat(...determineWholePath2(y,x,subMatrix,transfMatrix,match))
                        break;
                    case "←↖↑":
                        aPath.push([y,x,"←↖↑"])
                        x-=1
                        aPath.concat(...determineWholePath2(y,x,subMatrix,transfMatrix,match)) //↖
                        y-=1
                        aPath.concat(...determineWholePath2(y,x,subMatrix,transfMatrix,match))
                        x+=1
                        aPath.concat(...determineWholePath2(y,x,subMatrix,transfMatrix,match))
                        break;

                    default:
                        console.log("match then");

                        break;


                
            }


        }



    }
    wholePath.push(aPath)
    return aPath
}
function finalizedArrowMatrix(){
    let matrix = [];
    // Ajout de lignes à la matrice
    for (let i = 0; i < save_y+1; i++) {
        matrix[i] = [];
        //ajout colonne
        for (let j = 0; j < save_x+1; j++) {
            matrix[i][j] = 0;
        }
    }
    console.log("BIG MATRICE 1")
    console.log(matrix) //POURQUOI YA DES PUTAIN DE FLECHE DANS MA MATRICE WALLAH
    console.log("BIG MATRICE 2")
    for (let bPath of wholePath){
        if (bPath === undefined) {
            console.log("BIG UNDEFINED B")
            continue
        }
        else{
            for(let cPath of bPath){
                let xx = cPath[0], yy = cPath[1], zz = cPath[2]
                if(cPath[1] === undefined || cPath[0] === undefined){
                    console.log("BIG UNDEFINED C")
                    console.log("cPath[0]:", cPath[0]);
                    console.log("cPath[1]:", cPath[1]);
                    console.log(cPath[1])
                    xx = 0
                    yy = 0
                    zz = 0

                }
                else{
                    if (matrix[xx] === undefined){
                        console.log("matrix")
                    }
                    else if (matrix[xx][yy] === 0){
                        matrix[xx][yy] = zz;
                    }
                    else if (matrix[xx][yy].length < zz.length){
                        matrix[xx][yy] = zz;
                    }
                }

            }
        }

    }
    return matrix
}
    determineWholePath2(y,x,subMatrix,transfMatrix,match)
    console.log(wholePath)
    let mad_matrix = finalizedArrowMatrix()
    return(mad_matrix)
}