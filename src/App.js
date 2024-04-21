import React, {useEffect, useState} from 'react';
import {Case} from "./Case";
import {Line} from "./Line";
import {NeedleManWunschScript} from "./NeedleManWunschScript";
import {LetterLine} from "./LetterLine";
import sequenciaImage from "./glitch-goblin.png"
import {determineArrowedMatrix, findPaths} from "./NeedleManOptimalPath_V2";
import DataTable from "./components/DataTable"
import SubTable from "./components/SubTable";
import {Box, TextField} from "@mui/material";
import CheckBox from "./components/NeedlemanExtra";
import NeedlemanExtra from "./components/NeedlemanExtra";
import SmithWaterManExtra from "./components/SmithWaterManExtra";
import {SmithWatermanScript} from "./SmithWatermanScript";
import {findPathSW} from "./SmithWatermanOptimalPath";
import {determineArrowedMatrixSW2, findPathsSW} from "./SmithWatermanOptimalPath_V2";

/**
 * Heart of the application,
 * allows you to launch the program, takes care of the display and placement of the different elements on the page.
 * It returns different HTML elements in the same page
 * @returns {Element}
 * @constructor
 */
export default function App(){

    //INITIALISATION AREA START -------------------------------------------------------------------
    let [sequence1 ,setSequence1] = useState('')
    let [sequence2 ,setSequence2] = useState('')
    let [match,setMatch] = useState(1)
    let [missmatch ,setMissmatch] = useState(-1)
    let [gap,setGap]=useState(-2)
    let [pathCounter, setPathCounter] = useState(0);
    let [matchString, setMatchString] = useState(""); //Utile pour le LCS permet de faire un string de tout les caracteres ayuant un match
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("Needleman-Wunsch");
    const [selectedVariant,setSelectedVariant] = useState("default");
    const [operationMm,setOperationMm] = useState(0);
    const [computeLimit, setComputeLimit] = useState(10000);
    let matrixTestData = NeedleManWunschScript(sequence1,sequence2,match,missmatch,gap,operationMm)//liste qui contient la matrice de Substitution et la matrice transformée
    let matrixFinal = matrixTestData[1]; //Matrice transformée
    let arrowedMatrix = determineArrowedMatrix(sequence1,sequence2,matrixTestData[0],matrixFinal,match,gap,missmatch)
    let allPath = findPaths(arrowedMatrix,computeLimit);
    let optPath = allPath[pathCounter];
    const [finalScore, setFinalScore] = useState(0);

    const [chosenCase, setChosenCase] = useState([]);
    const [extraParameters,setExtraParameters]= useState(); //SERT A QUOI ?
    const [missmatchDisabled , setMissmatchDisabled] = useState(false)
    const [matchDisabled , setMatchDisabled] = useState(false)
    const [gapDisabled , setGapDisabled] = useState(false)
    const [colorVariantCase,setColorVariantCase] = useState([]);
    const mergedAllPath = allPath.reduce((merged, current) => {
        current.forEach(path => {
            if (!merged.includes(path)) {
                merged.push(path);
            }
        });
        return merged;
    }, []);
    if(selectedAlgorithm === "Smith-Waterman"){
        matrixTestData = SmithWatermanScript(sequence1,sequence2,match,missmatch,gap)  //liste qui contient la matrice de Substitution et la matrice transformée
        matrixFinal = matrixTestData[1];
        arrowedMatrix = determineArrowedMatrix(sequence1,sequence2,matrixTestData[0], matrixTestData[1],match,gap,missmatch);
        allPath = findPathsSW(arrowedMatrix,matrixTestData[2],matrixFinal,computeLimit);
        optPath = allPath[pathCounter];
    }

//INITIALISATION AREA END -------------------------------------------------------------------
    const alignmentResultResolver =(actualPath) => {
        let alignedSeq1 ="", alignedSeq2="";

        for(let i=1,j1=0,j2=0;i<actualPath.length;i++){
            if(actualPath[i-1][0] !== actualPath[i][0] && actualPath[i-1][1]!==actualPath[i][1]){
                alignedSeq1+=sequence1[j1];
                alignedSeq2+=sequence2[j2];
                j1++;
                j2++;
            }
            if(actualPath[i-1][0] === actualPath[i][0] && actualPath[i-1][1] < actualPath[i][1]){
                alignedSeq2+=sequence2[j2];
                j2++;
                alignedSeq1+="-";
            }
            if(actualPath[i-1][0] < actualPath[i][0] && actualPath[i-1][1] === actualPath[i][1]){
                alignedSeq1+=sequence1[j1];
                j1++;
                alignedSeq2+="-";
            }
        }
        return([alignedSeq1,alignedSeq2]);
    }
    const allAlignmentResultResolver = (allPath) =>{
        let result = [];
        for(let i=0;i<allPath.length;i++){
            result.push(alignmentResultResolver(allPath[i]))
        }
        return result;
    }
    let allAlignedResult = allAlignmentResultResolver(allPath);


    const matchStringResolver = (actualPath) => {
        let alignedSequences = alignmentResultResolver(optPath);
        let matchString = "";
        let coloredGreenCase =[]
        let count =0;
        while(count !== actualPath.length-1){
            if (alignedSequences[0][count] === alignedSequences[1][count]){
                matchString+=alignedSequences[0][count];
                coloredGreenCase.push(actualPath[count+1]); //Push dans une liste les coordonnées des cases qu'on doit colorier pour mettre en évidence le LCS
                count++;
            }
            else{
                count++;
            }
        }
        setMatchString(matchString);
        setColorVariantCase(coloredGreenCase);

    }
    const checkVariant = () => {
        if(matrixFinal[0].length === 0) {
            setFinalScore(0);
        }
        else {
            if(selectedAlgorithm === "Smith-Waterman"){
                if(sequence1.length ===0 || sequence2.length ===0){
                    setFinalScore(0);
                }
                else{
                    setFinalScore(matrixFinal[matrixTestData[2][0][0]][matrixTestData[2][0][1]]);
                }
                setExtraParameters(<SmithWaterManExtra/>)
            }
            if(selectedAlgorithm === "Needleman-Wunsch"){
                setFinalScore(matrixFinal[sequence1.length][sequence2.length]);
                setExtraParameters(<NeedlemanExtra chooseSelectedVariant = {chooseSelectedVariant}/>);
            }

        }

        if(selectedVariant === "default"){
            setMissmatchDisabled(false);
            setMatchDisabled(false);
            setGapDisabled(false);
            setMatchString("");
            setOperationMm(0);

        }
        else if(selectedVariant === "LCS"){
            setMissmatchDisabled(true);
            setMissmatch(0);
            setMatchDisabled(true);
            setMatch(1);
            setGapDisabled(true);
            setGap(0);
            setOperationMm(0);
            matchStringResolver(optPath);
        }

        else if(selectedVariant === "wagnerf"){
            setMatch(0);
            setMissmatchDisabled(true);
            setMissmatch(1);
            setMatchDisabled(true);
            setGap(1);
            setGapDisabled(true);
            setOperationMm(1);

        }


    }
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

        setExtraParameters(<NeedlemanExtra chooseSelectedVariant = {chooseSelectedVariant} />); //PERMET De mettre la variante par defaut sinon elle n'apparait qu'apres avoir cliquer 2 fois sur needleman
        checkVariant();

        setDisplayedMatrix(displayed_matrix =>
            <div className="matrix-row">
                {matrixFinal.map((x,xIndex)=> (
                    <div className="matrix-line">
                        <div>
                            {x.map ((y,yIndex) => (
                                <Case
                                    key = {[xIndex,yIndex]}
                                    value = {y}
                                    color={
                                        (colorVariantCase.some(coord => coord[0] === xIndex && coord[1] === yIndex)) && selectedVariant === "LCS" ? 'green' :
                                                                                     ((chosenCase[0] === xIndex && chosenCase[1] === yIndex)) ? 'darkred' :
                                                                                         (optPath.some(coord => coord[0] === xIndex && coord[1] === yIndex)) ? 'red' : 'white'
                                    } //Si il est vrai qu'on trouve dans optPath des coord = aux index alors on le colorie en rouge
                                    //Change de couleur en rouge si la case est retrouvé dans le chemin optimal
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
        <button id={"displayed_button"} onClick={() => {
            onDisplayPath();
            let aligned_components = alignmentResultResolver(pathCounter,optPath);
        }}>Display optimal path</button>

    const handleLeftButtonClick = () => {
        if(pathCounter===0){
            setPathCounter(allPath.length-1);
        }
        else{
            setPathCounter(pathCounter-1);
        }
        setChosenCase([])
        onDisplayPath();
    };

    const choosePathCounter = (chosenId) =>{
        setPathCounter(chosenId);
        setChosenCase([])
    };

    const chooseCase = (chosenCase) =>{
        setChosenCase(chosenCase);
        onDisplayPath();
    }
    const chooseSelectedVariant = (selectedVariant) =>{
        setSelectedVariant(selectedVariant);
        setPathCounter(0);
    };


    const handleRightButtonClick = () => {
        if(pathCounter+1===allPath.length){
            setPathCounter(0);
        }
        else{
            setPathCounter(pathCounter+1);
        }
        setChosenCase([])
        onDisplayPath();
    };

    const handleResetValueButtonClick = () => {
        setPathCounter(0);
        setMatch(1);
        setMissmatch(-1);
        setGap(-2);
    }


    useEffect(() => {
        onDisplayPath(); // Exécuter onDisplayPath() lorsque pathCounter est mis à jour
    }, [pathCounter,chosenCase,gap,colorVariantCase,selectedAlgorithm]);
    useEffect(() => {
        checkVariant(); // Exécuter onDisplayPath() lorsque pathCounter est mis à jour
    }, [selectedVariant,pathCounter]);


    const leftOnPath =
        <button onClick={() => handleLeftButtonClick()}>←</button>

    const rightOnPath =
        <button onClick={() => handleRightButtonClick()}>→</button>

    const resetValueButton =
        <button disabled = {gapDisabled} onClick={() => handleResetValueButtonClick()}>Reset value</button>

    /*Composant contenant les box graphiques qui permettent d'entrer les informations (Sequence 1/Sequence 2)*/
    const sequenceBox =
        <div style={{ display: 'flex', flexDirection: 'COLUMN' }}>
            <Box
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="sequence1"
                    label="Sequence 1"
                    variant="outlined"
                    type="text"
                    value={sequence1}
                    style={{
                        width: '300px',
                        padding: '5px',
                        outline: 'none', // Supprimer la bordure par défaut sur le focus
                        transition: 'box-shadow 0.3s', // Ajouter une transition pour un effet fluide
                }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.5)'} // Ajouter le glow en focus
                    onBlur={(e) => e.target.style.boxShadow = 'none'} // Supprimer le glow lorsque le focus est perdu
                    inputProps={{maxLength: 15}} //LIMITER LE TEXTE ENTRE A 15
                    onChange={(e) => {
                        setPathCounter(0)
                        setSequence1(e.target.value)
                        setChosenCase([])
                        onDisplayPath()
                    }
                    }
                    onKeyUp={(e) => {
                        onDisplayPath()
                    }}/>
            </Box>

            <Box
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField id="sequence2" label="Sequence 2" variant="outlined"
                           type="text"
                           value={sequence2}
                           style={{
                               width: '300px',
                               padding: '5px',
                               outline: 'none', // Supprimer la bordure par défaut sur le focus
                               transition: 'box-shadow 0.3s', // Ajouter une transition pour un effet fluide
                           }}
                           onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.5)'} // Ajouter le glow en focus
                           onBlur={(e) => e.target.style.boxShadow = 'none'} // Supprimer le glow lorsque le focus est perdu
                           inputProps={{maxLength: 15}} //LIMITER LE TEXTE ENTRE A 15
                           onChange={(e) => {
                               setPathCounter(0)
                               setSequence2(e.target.value)
                               setChosenCase([])
                               onDisplayPath()
                           }
                           }
                           onKeyUp={(e) => {

                               onDisplayPath()
                           }}
                />
            </Box>
        </div>

    /*Composant contenant les box graphiques qui permettent d'entrer les informations (Match/Mismatch/Gap)*/
    const valueBox =
        <div>
            <label htmlFor="match" style={{marginLeft: '5px'}}>Match : </label>
            <input
                type="number"
                id="match"
                value={match}
                onChange={(e) => {
                    setPathCounter(0);
                    const newMatch = e.target.value
                    setMatch(+newMatch) /*Le probeme est que en passant des nombre en argument c'est une chaine string qui se met a la place d'un number*/
                    onDisplayPath()
                    setChosenCase([])
                }

            }
                onKeyUp={(e) => {
                    onDisplayPath()
                    setChosenCase([])
                }}
                disabled={matchDisabled}

                style={ { width: "50px", padding: "5px" }}
            />
            <label htmlFor="missmatch" style={{marginLeft: '5px'}}>Missmatch : </label>
            <input
                type="number"
                id="missmatch"
                value={missmatch}
                onChange={(e) => {
                    setPathCounter(0);
                    const newMissmatch = e.target.value
                    setMissmatch(+newMissmatch)

                    onDisplayPath()
                    setChosenCase([])
                }
                }
                onKeyUp={(e) => {
                    onDisplayPath()
                    setChosenCase([])
                }}
                disabled={missmatchDisabled}

                style={{ width: "50px", padding: "5px" }}
            />
            <label htmlFor="gap" style={{marginLeft: '5px'}}>Gap : </label>
            <input
                type="number"
                id="gap"
                value={gap}
                onChange={(e) => {
                    setPathCounter(0);
                    const newGap = e.target.value
                    setGap(+newGap)

                    onDisplayPath()
                    setChosenCase([])
                }
                }
                onKeyUp={(e) => {
                    onDisplayPath()
                    setChosenCase([])
                }}
                disabled={gapDisabled}


                style={ { width: "50px", padding: "5px" }}

            />
            <label htmlFor="gap" style={{marginLeft: '5px'}}>Compute Limit : </label>
            <input
                type="number"
                id="computeLimit"
                value={computeLimit}
                onChange={(e) => {
                    setPathCounter(0);
                    const newComputeLimit = e.target.value
                    setComputeLimit(+newComputeLimit)
                    onDisplayPath()
                }
                }
                onKeyUp={(e) => {
                    onDisplayPath()
                }}
                style={ { width: "90px", padding: "5px" }}
            />
        </div>

    const selector =
        <div style={{ display: 'flex'}}>
            <div>
                <label>Choix de l'algorithme : </label>
                <select

                    value ={selectedAlgorithm}
                    onChange = {(e) => {
                        setPathCounter(0);
                        setSelectedAlgorithm(e.target.value)
                        const selectedValue = e.target.value
                        if(selectedValue === "Needleman-Wunsch"){
                            setExtraParameters(<NeedlemanExtra chooseSelectedVariant = {chooseSelectedVariant}/>);
                           // setMatrixTestData(NeedleManWunschScript(sequence1,sequence2,match,missmatch,gap,operationMm)); //liste qui contient la matrice de Substitution et la matrice transformée
                            matrixTestData = NeedleManWunschScript(sequence1,sequence2,match,missmatch,gap,operationMm);
                            matrixFinal = matrixTestData[1]; //Matrice transformée
                            setSelectedVariant("default")

                        }
                        if(selectedValue === "Smith-Waterman"){
                            setExtraParameters(<SmithWaterManExtra chooseSelectedVariant ={chooseSelectedVariant}/>);
                            //setMatrixTestData(SmithWatermanScript(sequence1,sequence2,match,missmatch,gap,operationMm)); //liste qui contient la matrice de Substitution et la matrice transformée
                            matrixTestData = SmithWatermanScript(sequence1,sequence2,match,missmatch,gap,operationMm);
                            matrixFinal = matrixTestData[1]; //Matrice transformée
                            setSelectedVariant("default")
                        }

                    }
                    }
                >
                    <option value = "Needleman-Wunsch">Needleman-Wunsch</option>
                    <option value = "Smith-Waterman">Smith-Waterman</option>
                    <option value = "Algorithme 3">Algorithme 3</option>
                </select>
            </div>
            <div style={{marginLeft: '10px'}}/>
            <label>Variante : </label>
            <div style={{marginLeft: '5px'}}/>
            {extraParameters}
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

    let resultDisplayElement =
        <div>
            <div style={{
                display: 'flex',
            }}>
                {[...allAlignedResult[pathCounter][0]].map((char, index) => (
                    <div key={index} style={{
                        fontSize: '2.1rem',
                        fontFamily: 'monospace',
                        marginRight: '10px', // Espacement entre les caractères
                    }}>{char}</div>
                ))}
            </div>
            <div style={{
                display: 'flex',
            }}>
                {[...allAlignedResult[pathCounter][1]].map((char, index) => (
                    <div key={index} style={{
                        fontSize: '2.1rem',
                        fontFamily: 'monospace',
                        marginRight: '10px', // Espacement entre les caractères
                    }}>{char}</div>
                ))}
            </div>
        </div>

    let upElement =
        <div>
            <img src={sequenciaImage} alt="Title of the website"   />
            <div style = {{ margin: '20px'}} />
            <label><strong>Outil de visualisation d'alignement de séquences réalisé par BOIVIN Lorentz dans le cadre du projet de Master 1 à l'Université de Mons.</strong></label>
            <div style = {{ margin: '20px'}} />
            {sequenceBox}
            <div style = {{ margin: '20px'}} />
            {selector}
            <div style = {{ margin: '20px'}} />
            {valueBox}
            <div style = {{ margin: '20px'}} />

            <div style = {{ display: 'flex', flexDirection: 'row'}}>
                {displayPathButton}
                <div style={{marginLeft: '5px'}}/>
                {leftOnPath}
                <div style={{marginLeft: '5px'}}/>
                {rightOnPath}
                <div style={{marginLeft: '5px'}}/>
                {resetValueButton}

            </div>
            <div style = {{ margin: '20px'}} />
            <label>Nombre de chemins optimaux existants : </label> {allPath.length}
            <div style = {{ margin: '20px'}} />
            <label>Index du chemin actuel : </label> {pathCounter}
            <div style = {{ margin: '20px'}} />
        </div>

        return (
        <div style={{ marginLeft: '20px',marginTop: "20px",marginBottom: '50px'}}>
            <div style={{ position: 'relative'}}>
                {upElement}
                <div style={{
                    position: 'absolute',
                    top: '300px', // Positionne l'élément au milieu de la hauteur de l'écran
                    left: '780px', // Positionne l'élément juste à droite de upElement avec un espacement de 20px
                    transform: 'translateY(-50%)', // Centre l'élément verticalement
                    fontFamily: 'monospace',
                }}>
                    {resultDisplayElement}
                    <div style={{
                        fontSize: '2.1rem',
                        position: 'relative',
                        top: '100px', // Positionne l'élément au milieu de la hauteur de l'écran
                        left: '00px', // Positionne l'élément juste à droite de upElement avec un espacement de 20px

                        fontFamily: 'monospace',
                    }}>
                        Score :
                        {finalScore}
                    </div>

                    <div style={{
                        fontSize: '2.1rem',
                        position: 'relative',
                        top: '100px', // Positionne l'élément au milieu de la hauteur de l'écran
                        left: '00px', // Positionne l'élément juste à droite de upElement avec un espacement de 20px
                        fontFamily: 'monospace',
                    }}>
                        {matchString}
                    </div>
                </div>
            </div>
            {TwoMatrix}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <DataTable allPath = {allPath} choosePathCounter = {choosePathCounter} allAlignedResult = {allAlignedResult}/>
                <SubTable uniquePath = {optPath} modSequence1 = {allAlignedResult[pathCounter][0]} modSequence2 = {allAlignedResult[pathCounter][1]} transfMatrix = {matrixFinal} chooseCase = {chooseCase} rawSequence1={sequence1} rawSequence2={sequence2}/>
            </div>
        </div>
    );
}
