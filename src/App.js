import React, {useEffect, useState} from 'react';
import {Case} from "./Case";
import {Line} from "./Line";
import {NeedleManWunschScript} from "./NeedleManWunschScript";
import {determineOptimalTraceback} from "./NeedleManOptimalPath";
import {determineArrowMatrix} from "./ArrowMatrix";
import {LetterLine} from "./LetterLine";
import sequenciaImage from "./glitch-goblin.png"
import {determineArrowedMatrix, findPaths} from "./NeedleManOptimalPath_V2";


export default function App(){
    let [sequence1 ,setSequence1] = useState('')
    let [sequence2 ,setSequence2] = useState('')
    let [match,setMatch] = useState(1)
    let [missmatch ,setMissmatch] = useState(-1)
    let [gap,setGap]=useState(-2)
    let [pathCounter, setPathCounter] = useState(0);

    const [selectedAlgorithm, setSelectedAlgorithm] = useState("Needleman-Wunsch");


    let matrixTestData = NeedleManWunschScript(sequence1,sequence2,match,missmatch,gap) //liste qui contient la matrice de Substitution et la matrice transformée
    let matrixFinal = matrixTestData[1]; //Matrice transformée

    //let optPath = determineOptimalTraceback(sequence1,sequence2,matrixTestData[0],matrixFinal,match) //Liste qui contient l'ensemble des points qui sont issus du chemin optimal
    //let arrowedMatrix = matrixTestData[0]
    let arrowedMatrix = determineArrowedMatrix(sequence1,sequence2,matrixTestData[0],matrixFinal,match,gap,missmatch)
    let allPath = findPaths(arrowedMatrix);
    let optPath = allPath[pathCounter];
    //let mergedAllPath = allPath.reduce((acc, current) => acc.concat(current), []);//Utile pour l'affichage en jaune de tout les chemins possible sur la matrice fléchée
    console.log("c'est merged");
    //console.log(mergedAllPath)

    const mergedAllPath = allPath.reduce((merged, current) => {
        current.forEach(path => {
            if (!merged.includes(path)) {
                merged.push(path);
            }
        });
        return merged;
    }, []);


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

    //Matrice de flèches
    const [displayedArrowed_matrix,setDisplayedArrowedMatrix] = useState(
        <div className="matrix-row">
            {arrowedMatrix.map((x,xIndex)=> (
                <div className="matrix-line">
                    {Line(x,xIndex)}
                </div>
            ))}
        </div>
    );

    //Composant affichage SEQUENCE MOT 2
    const [displayedSeq,setDisplayedSeq] = useState(
        <div className="line">
            {LetterLine(sequence2)}
        </div>
    )
    //Composant affichage SEQUENCE MOT 1
    const [displayedOtherSeq,setDisplayedOtherSeq] = useState(
        <div className="column">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {LetterLine(sequence1)}
            </div>
        </div>
    )


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

        //Actualisation de la matrice fléchée
        setDisplayedArrowedMatrix(displayedArrowed_matrix =>
            <div className="matrix-row">
                {arrowedMatrix.map((x,xIndex)=> (
                    <div className="matrix-line">
                        <div>
                            {x.map ((y,yIndex) => (
                                <Case
                                    key = {[xIndex,yIndex]}
                                    value = {y}
                                    color={mergedAllPath.some(coord => coord[0] === xIndex && coord[1] === yIndex) ? 'orange' : 'white'}
                                    //Change de couleur en rouge si la case est retrouvé dans le chemin optimal
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );

        //Actualisation de la Sequence 2 affichée
        setDisplayedSeq(displayedSeq => (
            <div>
                <Case
                    key = {["first-case"]}
                    value = {"-"}
                    color = {'light_blue'}
                />
                <Case
                    key = {["first-case"]}
                    value = {"-"}
                    color = {'light_blue'}
                />
                {sequence2.split('').map ((y,yIndex) => (
                    <Case
                        key = {[yIndex]}
                        value = {y}
                        color = {'light_blue'}
                    />
                ))}
            </div>
        ))

        setDisplayedOtherSeq(displayedOtherSeq => (


            <div style={{ display: 'flex', flexDirection: 'column' }}>

                <div>
                    <Case
                        key = {["first-case"]}
                        value = {"-"}
                        color = {'light_blue'}
                    />



                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {sequence1.split('').map ((y,yIndex) => (

                        <Case
                            key = {[yIndex]}
                            value = {y}
                            color = {'light_blue'}
                        />

                    ))}
                </div>
                </div>
            </div>
        ))


    }



    const displayPathButton =
        <button onClick={() => onDisplayPath() }>Display optimal path</button>

    const handleLeftButtonClick = () => {
        if(pathCounter===0){
            setPathCounter(allPath.length-1);
        }
        else{
            setPathCounter(pathCounter-1);
        }
        onDisplayPath();


    };

    const handleRightButtonClick = () => {
        if(pathCounter+1===allPath.length){
            setPathCounter(0);
        }
        else{
            setPathCounter(pathCounter+1);
        }
        onDisplayPath();
    };
    useEffect(() => {
        onDisplayPath(); // Exécuter onDisplayPath() lorsque pathCounter est mis à jour
    }, [pathCounter]);


    const leftOnPath =
        <button onClick={() => handleLeftButtonClick()}>←</button>

    const rightOnPath =
        <button onClick={() => handleRightButtonClick()}>→</button>

    /*Composant contenant les box graphiques qui permettent d'entrer les informations (Sequence 1/Sequence 2)*/
    const sequenceBox =
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="sequence1">Entrez la sequence 1 :</label>
            <input
                type="text"
                id="sequence1"
                value={sequence1}
                style={{
                    width: '200px',
                    padding: '5px',
                    outline: 'none', // Supprimer la bordure par défaut sur le focus
                    transition: 'box-shadow 0.3s', // Ajouter une transition pour un effet fluide
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.5)'} // Ajouter le glow en focus
                onBlur={(e) => e.target.style.boxShadow = 'none'} // Supprimer le glow lorsque le focus est perdu
                maxLength={15}
                onChange={(e) => {
                    setPathCounter(0)
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
                style={{
                    width: '200px',
                    padding: '5px',
                    outline: 'none', // Supprimer la bordure par défaut sur le focus
                    transition: 'box-shadow 0.3s', // Ajouter une transition pour un effet fluide
                }}                                                                                                                                                  //ALERTE CANIBALESQUE
                onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.5)'} // Ajouter le glow en focus
                onBlur={(e) => e.target.style.boxShadow = 'none'} // Supprimer le glow lorsque le focus est perdu


                maxLength={15}
                onChange={(e) => {
                    setPathCounter(0)
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
                    setPathCounter(0);
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
                    setPathCounter(0);
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
                    setPathCounter(0);
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

    let FullMatrix =
    <div>
        {displayedSeq}
        <div style={{ display: 'flex' }}>
            {displayedOtherSeq}
            {displayed_matrix}
        </div>
    </div>

    let FullMatrix2 =
        <div>
            {displayedSeq}
            <div style={{ display: 'flex' }}>
                {displayedOtherSeq}
                {displayedArrowed_matrix}
            </div>
        </div>



    let TwoMatrix =
        <div style={{ display: 'flex', position: 'relative'}}>
            <div style={{ marginLeft: '20px'}}/>
            {FullMatrix}
            <hr style={{ border: '2px solid #ccc', margin: '20px ' }} />
            <div style={{ marginLeft: '20px', position: 'absolute', top: '0px', left: '750px', zIndex: '2' }}>
            {FullMatrix2}
            </div>
        </div>

    return (
        <div style={{ marginLeft: '20px',marginTop: "20px",marginBottom: '50px'}}>

            <img src={sequenciaImage} alt="Title of the website"   />

            <div style = {{ margin: '20px'}} />
            <label>Made by Lorentz Boivin</label>
            <div style = {{ margin: '20px'}} />
            {sequenceBox}
            <div style = {{ margin: '20px'}} />
            {selector}
            <div style = {{ margin: '20px'}} />
            {valueBox}
            <div style = {{ margin: '20px'}} />
            {displayPathButton}
            {leftOnPath}
            {rightOnPath}
            <label>Nombre de chemins optimaux existants : </label> {allPath.length}
            <div style = {{ margin: '20px'}} />
            <label>Index du chemin actuel : </label> {pathCounter}
            <div style = {{ margin: '20px'}} />

            {TwoMatrix}

        </div>
    );
}
