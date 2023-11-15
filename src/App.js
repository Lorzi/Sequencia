import { useState } from 'react';
import {Case} from "./Case";
import {Line} from "./Line";
import {NeedleManWunschScript} from "./NeedleManWunschScript";
import {determineOptimalTraceback} from "./NeedleManOptimalPath";
export default function App(){
    let [sequence1 ,setSequence1] = useState('')
    let [sequence2 ,setSequence2] = useState('')
    let [match,setMatch] = useState(1)
    let [missmatch ,setMissmatch] = useState(-1)
    let [gap,setGap]=useState(-3)

    const [selectedAlgorithm, setSelectedAlgorithm] = useState("Needleman-Wunsch");


    let matrixTestData = NeedleManWunschScript(sequence1,sequence2,match,missmatch,gap) //liste qui contient la matrice de Substitution et la matrice transformée
    let matrixFinal = matrixTestData[1]; //Matrice transformée
    let optPath = determineOptimalTraceback(sequence1,sequence2,matrixTestData[0],matrixFinal,match) //Liste qui contient l'ensemble des points qui sont issus du chemin optimal

    //Matrice affichée sous forme de bouton en html
    const [displayed_matrix,setDisplayedMatrix] = useState(
        <div className="matrix-row">
            {matrixFinal.map((x,xIndex)=> (
                <div className="matrix-line">
                    {Line(x,xIndex)}
                </div>
            ))}
        </div>
    );

    /* Permet d'actualiser la matrice affichée avec les nouvelles informations et le chemin optimal */
    const onDisplayPath = () => {
        setDisplayedMatrix(displayed_matrix =>
            <div className="matrix-row">
                {matrixFinal.map((x,xIndex)=> (
                    <div className="matrix-line">
                        <div>
                            {x.map ((y,yIndex) => (
                                <Case
                                    key = {[xIndex,yIndex]}
                                    value = {y}
                                    color={optPath.some(coord => coord[0] === xIndex && coord[1] === yIndex) ? 'red' : 'white'} //Change de couleur en rouge si la case est retrouvé dans le chemin optimal
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const displayPathButton =
        <button onClick={() => onDisplayPath() }>Display optimal path</button>

    /*Composant contenant les box graphiques qui permettent d'entrer les informations (Sequence 1/Sequence 2)*/
    const sequenceBox =
        <div>
            <label htmlFor="sequence1">Entrez la sequence 1 :</label>
            <input
                type="text"
                id="sequence1"
                value={sequence1}
                onChange={(e) => {
                    setSequence1(e.target.value)
                    onDisplayPath()
                }
                }
                onKeyUp={(e) => {
                    onDisplayPath()
                }}

            />
            <label htmlFor="sequence2">Entrez la sequence 2 :</label>
            <input
                type="text"
                id="sequence2"
                value={sequence2}
                onChange={(e) => {
                    setSequence2(e.target.value)
                    onDisplayPath()
                }
                }
                onKeyUp={(e) => {
                    onDisplayPath()
                }}
            />
        </div>

    /*Composant contenant les box graphiques qui permettent d'entrer les informations (Match/Mismatch/Gap)*/
    const valueBox =
        <div>
            <label htmlFor="match">Match :</label>
            <input
                type="number"
                id="match"
                value={match}
                onChange={(e) => {
                    const newMatch = e.target.value
                    setMatch(+newMatch) /*Le probeme est que en passant des nombre en argument c'est une chaine string qui se met a la place d'un number*/

                    onDisplayPath()
                }

            }
                onKeyUp={(e) => {
                    onDisplayPath()
                }}

                style={ { width: "50px", padding: "5px" }}
            />
            <label htmlFor="missmatch">Missmatch :</label>
            <input
                type="number"
                id="missmatch"
                value={missmatch}
                onChange={(e) => {
                    const newMissmatch = e.target.value
                    setMissmatch(+newMissmatch)

                    onDisplayPath()
                }
                }
                onKeyUp={(e) => {
                    onDisplayPath()
                }}

                style={ { width: "50px", padding: "5px" }}
            />
            <label htmlFor="gap">Gap :</label>
            <input
                type="number"
                id="gap"
                value={gap}
                onChange={(e) => {
                    const newGap = e.target.value
                    setGap(+newGap)

                    onDisplayPath()
                }
                }
                onKeyUp={(e) => {
                    onDisplayPath()
                }}
                style={ { width: "50px", padding: "5px" }}
            />
        </div>
    const selector =
        <div>
            <label>Choix de l'algorithme :</label>
            <select
                value ={selectedAlgorithm}
                onChange = {(e) => {
                    setSelectedAlgorithm(e.target.value)
                    const selectedValue = e.target.value
                    if(selectedValue === "Needleman-Wunsch"){
                        matrixTestData = NeedleManWunschScript(sequence1,sequence2,match,missmatch,gap) //liste qui contient la matrice de Substitution et la matrice transformée
                        matrixFinal = matrixTestData[1]; //Matrice transformée
                        determineOptimalTraceback(sequence1,sequence2,matrixTestData[0],matrixFinal,match)
                        console.log("juste voir si on rentre ici trop de fois =)")
                    }
                    if(selectedValue === "Algorithme 2"){
                        matrixTestData = [0,1]//liste qui contient la matrice de Substitution et la matrice transformée
                        matrixFinal = matrixTestData[1]; //Matrice transformée
                        determineOptimalTraceback(sequence1,sequence2,matrixTestData[0],matrixFinal,match)
                        console.log("juste voir si on rentre ici trop de fois =)")
                    }

                }
                }
            >
                <option value = "Needleman-Wunsch">Needleman-Wunsch</option>
                <option value = "Algorithme 2">Algorithme 2</option>
                <option value = "Algorithme 3">Algorithme 3</option>

            </select>
        </div>

    return (
        <div>
            <h1 style = {{ fontsize: '2em'}}>NeedleMen-Wunsch prototype</h1>
            <div style = {{ margin: '20px'}} />
            <label>Made by Lorentz Boivin</label>
            <div style = {{ margin: '20px'}} />
            {sequenceBox}
            {selector}
            {valueBox}
            <div style = {{ margin: '10px'}} />
            {displayPathButton}
            <div style = {{ margin: '10px'}} />
            {displayed_matrix}

        </div>
    );
}
