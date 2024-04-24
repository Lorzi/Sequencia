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
import NeedlemanExtra from "./components/NeedlemanExtra";
import SmithWaterManExtra from "./components/SmithWaterManExtra";
import {SmithWatermanScript} from "./SmithWatermanScript";
import {findPathsSW} from "./SmithWatermanOptimalPath_V2";
import {blosum62} from "./components/variants/blosum62";



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
    let [pathCounter, setPathCounter] = useState(0); //Counter that indicate which path in the allpath list we choose in the visualisation
    let [matchString, setMatchString] = useState(""); //Useful for the LCS function, make a string of every character that match for the LCS
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("Needleman-Wunsch");
    const [selectedVariant,setSelectedVariant] = useState("default");
    const [operationMm,setOperationMm] = useState(0); //Allows to change if we use a Max or Min in other class (Needleman-Wunsch or Smith-Waterman)
    const [computeLimit, setComputeLimit] = useState(10000); //Maximum bound for the computation of result, help to avoid infinite generation and thus crash
    const [blosumCheck, setBlosumCheck] = useState(false); //Check blosum option is activated
    const [blosumCustom,setBlosumCustom] = useState(blosum62); //Custom matrix, by default blosum62
    let matrixTestData = NeedleManWunschScript(sequence1,sequence2,match,missmatch,gap,operationMm,blosumCheck,blosumCustom)//list that countain subsitution matrix and scoreMatrix
    let matrixFinal = matrixTestData[1]; //Score Matrix, also knowned as transfMatrix in other class
    let arrowedMatrix = determineArrowedMatrix(sequence1,sequence2,matrixTestData[0],matrixFinal,match,gap,missmatch) //Matrix that contains the arrows and direction, important to generate paths
    let allPath = findPaths(arrowedMatrix,computeLimit); //list that contains every possible path/alignement on this session
    let optPath = allPath[pathCounter]; //one Path from allPath that as been chosen with the PathCounter
    const [finalScore, setFinalScore] = useState(0);
    const [chosenCase, setChosenCase] = useState([]);
    const [extraParameters,setExtraParameters]= useState(); //Parameters that change with the aglorithm chosen. Make appearing choice of variants
    const [missmatchDisabled , setMissmatchDisabled] = useState(false) //Allows to know if we have to disable or not the mismatch button, same for the next one
    const [matchDisabled , setMatchDisabled] = useState(false)
    const [gapDisabled , setGapDisabled] = useState(false)
    const [colorVariantCase,setColorVariantCase] = useState([]); //Coloring or not for a variant (example green for the LCS)
    //Merge every unique path for allPath in one list, very useful for displaying everypath on the arrowedmatrix (orange case)
    const mergedAllPath = allPath.reduce((merged, current) => {
        current.forEach(path => {
            if (!merged.includes(path)) {
                merged.push(path);
            }
        });
        return merged;
    }, []);
    if(selectedAlgorithm === "Smith-Waterman"){
        matrixTestData = SmithWatermanScript(sequence1,sequence2,match,missmatch,gap)
        matrixFinal = matrixTestData[1];
        arrowedMatrix = determineArrowedMatrix(sequence1,sequence2,matrixTestData[0], matrixTestData[1],match,gap,missmatch);
        allPath = findPathsSW(arrowedMatrix,matrixTestData[2],matrixFinal,computeLimit);
        optPath = allPath[pathCounter];
    }
    //INITIALISATION AREA END -------------------------------------------------------------------

    /**
     * Return the string sequence with the gaps "-"
     * It useful to display the results and see where are the gaps.
     * @param actualPath
     * @returns {[string,string]}
     */
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

    /**
     * Make a list of all aligned sequence of every path of the actual solution/actual alignment.
     * Useful for display when we have multiple optimal path for a same pair of sequence
     * @param allPath
     * @returns {[]}
     */
    const allAlignmentResultResolver = (allPath) =>{
        let result = [];
        for(let i=0;i<allPath.length;i++){
            result.push(alignmentResultResolver(allPath[i]))
        }
        return result;
    }
    let allAlignedResult = allAlignmentResultResolver(allPath);


    /**
     * Determine the coordinates of the boxes to be colored for the LCS in the matrix display
     * @param actualPath
     */
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

    /**
     * Supports left button execution -> decrement the pathcounter
     */
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

    /**
     * Supports the choice of a specific path counter outside this class
     */
    const choosePathCounter = (chosenId) =>{
        setPathCounter(chosenId);
        setChosenCase([])
    };

    /**
     * Allows the display of a specific "case"
     */
    const chooseCase = (chosenCase) =>{
        setChosenCase(chosenCase);
        onDisplayPath();
    }
    /**
     * Function used for the variant selection
     * @param selectedVariant
     */
    const chooseSelectedVariant = (selectedVariant) =>{
        setSelectedVariant(selectedVariant);
        setPathCounter(0);
    };

    /**
     * Supports right button execution -> increment pathcounter
     */
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

    /**
     * Handle a button that put back the initial values of PathCounter, Match, Mismatch and Gap
     */
    const handleResetValueButtonClick = () => {
        setPathCounter(0);
        setMatch(1);
        setMissmatch(-1);
        setGap(-2);
    }

    /**
     * Handle the custom matrix blosum file in .JSON input by the user
     * @param e
     */
    const handleFileBlosumLoad = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        try{
            reader.onload = function(e){
                try {
                    let matrixCustom2 = JSON.parse(e.target.result)
                    setBlosumCustom(matrixCustom2);
                }catch (jsonError){
                    console.error("File is nbot in a JSON format");
                }
            };
            reader.readAsText(file);
        }
        catch (error){
            console.error("Bad file format used");
        }
    }


    /**
     * useEffect function call the OnDisplayPath() to refresh the visual display of the elements when one of the deps is modified.
     * Same for the function checkVariant and its own deps.
     */
    useEffect(() => {
        onDisplayPath(); // Exécuter onDisplayPath() lorsque pathCounter est mis à jour
    }, [pathCounter,chosenCase,gap,colorVariantCase,selectedAlgorithm,blosumCheck,blosumCustom]);
    useEffect(() => {
        checkVariant(); // Exécuter onDisplayPath() lorsque pathCounter est mis à jour
    }, [selectedVariant,pathCounter]);

    /**
     * Function allowing you to check which variant has been chosen by the user and graying/adapting the parameters accordingly
     */
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
        if(blosumCheck){
            setMissmatchDisabled(false);
            setMatchDisabled(false);
            setMatch(0);
            setMissmatch(0);
        }

        else{
            setMissmatchDisabled(true);
            setMatchDisabled(true);
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

        else if(selectedVariant === "blosum"){
            setMissmatch(0);
            setMissmatchDisabled(true);
            setMatch(0);
            setGapDisabled(false);
            setMatchDisabled(true);
        }
    }
    //Matrix displayed as button matrix in html
    const [displayed_matrix,setDisplayedMatrix] = useState(
        <div className="matrix-row">
            {matrixFinal.map((x,xIndex)=> (
                <div className="matrix-line">
                    {Line(x,xIndex)}
                </div>
            ))}
        </div>
    );

    //Arrow matrix as button matrix in html
    const [displayedArrowed_matrix,setDisplayedArrowedMatrix] = useState(
        <div className="matrix-row">
            {arrowedMatrix.map((x,xIndex)=> (
                <div className="matrix-line">
                    {Line(x,xIndex)}
                </div>
            ))}
        </div>
    );

    //Display component SEQUENCE WORD 2
    const [displayedSeq,setDisplayedSeq] = useState(
        <div className="line">
            {LetterLine(sequence2)}
        </div>
    )
    //Display component SEQUENCE WORD 1
    const [displayedOtherSeq,setDisplayedOtherSeq] = useState(
        <div className="column">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {LetterLine(sequence1)}
            </div>
        </div>
    )


    /**
     * Allows you to update the displayed matrix with new information and the optimal path.
     * Display of the matrix and update of it each time this function is called.
     */
    const onDisplayPath = () => {
        setExtraParameters(<NeedlemanExtra chooseSelectedVariant = {chooseSelectedVariant} />); //PERMET De mettre la variante par defaut sinon elle n'apparait qu'apres avoir cliquer 2 fois sur needleman
        checkVariant();

        //Updating the score matrix
        setDisplayedMatrix(() =>
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
                                    } //If it is true that we find coord =  indexes in optPath then we color it red
                                    //Changes color to red if this box "case" is found in the optimal path
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );

        //Updating the arrow matrix
        setDisplayedArrowedMatrix(() =>
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

        //Updating the Sequence 2 display
        setDisplayedSeq(() => (
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
        //Updating the Sequence 1 display
        setDisplayedOtherSeq(() => (
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

    //Button that call onDisplayPath() in case the matrix don't update itself
    const displayPathButton =
        <button id={"displayed_button"} onClick={() => {
            onDisplayPath();

        }}>Display optimal path</button>

    //Button that decrement the PathCounter
    const leftOnPath =
        <button onClick={() => handleLeftButtonClick()}>←</button>
    //Button that increment the PathCounter
    const rightOnPath =
        <button onClick={() => handleRightButtonClick()}>→</button>
    //Button that reset the value by default
    const resetValueButton =
        <button disabled = {gapDisabled} onClick={() => handleResetValueButtonClick()}>Reset value</button>

    //Component containing the graphic boxes which allow information to be entered as an input (Sequence 1/Sequence 2)*/
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
                        outline: 'none',
                        transition: 'box-shadow 0.3s',
                }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.5)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                    inputProps={{maxLength: 15}} //Limit the length of the input text (here size of 15 characters)
                    onChange={(e) => {
                        setPathCounter(0)
                        setSequence1(e.target.value)
                        setChosenCase([])
                        onDisplayPath()
                    }
                    }
                    onKeyUp={() => {
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
                               outline: 'none',
                               transition: 'box-shadow 0.3s',
                           }}
                           onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.5)'}
                           onBlur={(e) => e.target.style.boxShadow = 'none'}
                           inputProps={{maxLength: 15}} //Limit the length of the input text (here size of 15 characters)
                           onChange={(e) => {
                               setPathCounter(0)
                               setSequence2(e.target.value)
                               setChosenCase([])
                               onDisplayPath()
                           }
                           }
                           onKeyUp={() => {

                               onDisplayPath()
                           }}
                />
            </Box>
        </div>

    //Component containing the graphic boxes which allow you to enter information (Match/Mismatch/Gap)
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
                    setMatch(+newMatch)
                    onDisplayPath()
                    setChosenCase([])
                }
            }
                onKeyUp={() => {
                    onDisplayPath()
                    setChosenCase([])
                }
            }
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
                onKeyUp={() => {
                    onDisplayPath()
                    setChosenCase([])
                }
            }
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
                onKeyUp={() => {
                    onDisplayPath()
                    setChosenCase([])
                }
            }
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
                onKeyUp={() => {
                    onDisplayPath()
                }
            }
                style={ { width: "90px", padding: "5px" }}
            />

        </div>
    //HTML component which allows you to select the algorithm used
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

            <div style={{marginLeft: '5px'}}/>
            <label>
                <input
                    type="checkbox"
                    checked={blosumCheck}
                    onChange={() => {
                        setPathCounter(0);
                        setBlosumCheck(!blosumCheck);


                    }}
                />
                BLOSUM et Custom (expérimental)
            </label>
            <div style={{marginLeft: '5px'}}/>
            <input type="file" onChange={(e) =>{
                handleFileBlosumLoad(e)
            }
            } />
        </div>

    //HTML component representing the score matrix as well as its column and its sequence line aligned to it
    let FullMatrix =
    <div>
        {displayedSeq}
        <div style={{ display: 'flex' }}>
            {displayedOtherSeq}
            {displayed_matrix}
        </div>
    </div>

    //HTML component representing the arrowed matrix as well as its column and its sequence line aligned to it
    let FullMatrix2 =
        <div>
            {displayedSeq}
            <div style={{ display: 'flex' }}>
                {displayedOtherSeq}
                {displayedArrowed_matrix}
            </div>
        </div>

    //HTML component that merged the two matrix in one component
    let TwoMatrix =
        <div style={{ display: 'flex', position: 'relative'}}>
            <div style={{ marginLeft: '20px'}}/>
            {FullMatrix}
            <hr style={{ border: '2px solid #ccc', margin: '20px ' }} />
            <div style={{ marginLeft: '20px', position: 'absolute', top: '0px', left: '750px', zIndex: '2' }}>
            {FullMatrix2}
            </div>
        </div>

    //HTML ccomponent which brings together the result of the alignment of the two sequences
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

    //HTML component that arranges and brings together the upper part of the page
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

        //Set of all the components in return for the final display on the page
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
