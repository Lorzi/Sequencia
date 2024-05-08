import React, {useEffect, useState} from 'react';
import {Case} from "./Case";
import {Line} from "./Line";
import {NeedleManWunschScript} from "./NeedleManWunschScript";
import {LetterLine} from "./LetterLine";
import sequenciaImage from "./components/sequencia3.PNG"
import {determineArrowedMatrix, findPaths} from "./NeedleManOptimalPath_V2";
import DataTable from "./components/DataTable"
import SubTable from "./components/SubTable";
import {
    Box,
    Button,
    FormControl,
    Grid,
    Input,
    InputLabel,
    MenuItem,

    Select,

    TextField, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import NeedlemanExtra from "./components/NeedlemanExtra";
import SmithWaterManExtra from "./components/SmithWaterManExtra";
import {SmithWatermanScript} from "./SmithWatermanScript";
import {findPathsSW} from "./SmithWatermanOptimalPath_V2";
import {blosum62} from "./components/variants/blosum62";
import Gamemode from "./Gamemode";



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
    const [gameModeCheck , setgameModeCheck] = useState(false);
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
    const [helpWindow, setHelpWindow] = useState(false);
    const [helpIndex,setHelpIndex]=useState([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]) // Help for the index of the help windows
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
    //New Test era _____________________________________________________________________________________________________





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

    const handleMouseOver = () => {
        setHelpWindow(true);
    };

    const handleMouseOut = () => {
        setHelpWindow(false);
    };



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
            <Box sx={{ width: '100%', margin: '0' }}>

                <Grid container spacing={0.5}>
                    {matrixFinal.map((row, rowIndex) => (
                        <Grid item xs={100} key={rowIndex}>
                            <Grid container spacing={0.5} style={{ flexWrap: 'nowrap' }}>
                                {row.map((item, colIndex) => (

                                    <Grid item  key={colIndex}>
                                        <Case
                                            key = {[rowIndex,colIndex]}
                                            value = {item}
                                            color={
                                                (colorVariantCase.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) && selectedVariant === "LCS" ? 'green' :
                                                    ((chosenCase[0] === rowIndex && chosenCase[1] === colIndex)) ? 'darkred' :
                                                        (optPath.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) ? 'red' : 'white'
                                            }
                                            //If it is true that we find coord =  indexes in optPath then we color it red
                                            //Changes color to red if this box "case" is found in the optimal path
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );


        //Updating the arrow matrix
        setDisplayedArrowedMatrix(() => (
            <Box sx={{ width: '100%', margin: '0' }}>
                <Grid container spacing={0.5} >
                    {arrowedMatrix.map((row, rowIndex) => (
                        <Grid item xs={12} key={rowIndex}>
                            <Grid container spacing={0.5} style={{ flexWrap: 'nowrap' }}>
                                {row.map((item, colIndex) => (
                                    <Grid item key={colIndex}>
                                        <Case
                                            key={[rowIndex, colIndex]}
                                            value={item}
                                            color={mergedAllPath.some(coord => coord[0] === rowIndex && coord[1] === colIndex) ? 'orange' : 'white'}
                                            // Change la couleur en orange si la case est retrouvée dans le chemin optimal
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        ));

        //Updating the Sequence 2 display
        setDisplayedSeq(() => (
            <Box sx={{ width: '100%', margin: '0' }}>
                <Grid container spacing={0.5} style={{ flexWrap: 'nowrap' }}>
                    <Grid item>
                        <Case key={["first-case"]} value={"-"} color={'light_blue'} />
                    </Grid>
                    <Grid item>
                        <Case key={["second-case"]} value={"-"} color={'light_blue'} />
                    </Grid>
                    {sequence2.split('').map((item, index) => (
                        <Grid item key={index}>
                            <Case key={[index]} value={item} color={'light_blue'} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        ));
        //Updating the Sequence 1 display
        setDisplayedOtherSeq(() => (
            <Box sx={{ width: '100%', margin: '0' }}>
                <Grid container direction="column" spacing={0.5}>
                    <Grid item>
                        <Case key={["first-case"]} value={"-"} color={'light_blue'} />
                    </Grid>
                    {sequence1.split('').map((item, index) => (
                        <Grid item key={index}>
                            <Case key={[index]} value={item} color={'light_blue'} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        ));
    }

    //Button that call onDisplayPath() in case the matrix don't update itself
    const displayPathButton =
        <Button id={"displayed_button"} variant="outlined" style={{
            width: '200px',
            height: '55px',
            outline: 'none',
            transition: 'box-shadow 0.3s',
        }} onClick={() => {
            onDisplayPath();

        }}>Force update</Button>

    //Button that decrement the PathCounter
    const leftOnPath =
        <Button variant="outlined" color="secondary" style ={{
            height: '55px'
        }} onClick={() => handleLeftButtonClick()}>←</Button>
    //Button that increment the PathCounter
    const rightOnPath =
        <Button variant="outlined" color="secondary" style ={{
            height: '55px'
        }} onClick={() => handleRightButtonClick()}>→</Button>
    //Button that reset the value by default
    const resetValueButton =
        <div style={{ position: 'relative' }}>
        <Button
            variant="outlined"
            style ={{
                height: '55px',
                width: "310px"
            }}
            disabled = {gapDisabled}
            onClick={() => handleResetValueButtonClick()}
            onMouseOver={() => {
                handleMouseOver()
                setHelpIndex([false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false])
            }}
            onMouseOut={() => {
                handleMouseOut()
                setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
            }}
        >Reset value</Button>
            {helpWindow && helpIndex[7] && (
                <div style={{ position: 'absolute', top: '55px', left: '0px', padding: '15px', border: '2px solid black', backgroundColor: 'white' }}>
                    Remet les valeur de match, mismatch et gap aux valeurs par défaut (respectivement : 1 ,-1 ,-2). Ces valeurs sont généralement les plus couramment utilisées
                </div>
            )}
        </div>

    //Component containing the graphic boxes which allow information to be entered as an input (Sequence 1/Sequence 2)*/
    const sequenceBox =
        <div style={{ display: 'flex', flexDirection: 'COLUMN', gap:'5px'}}>
            <Box
                sx={{'& > :not(style)': { m: 1},}} //Make the alignment better
            >
                <TextField
                    id="sequence1"
                    label="Sequence 1"
                    variant="outlined"
                    type="text"
                    value={sequence1}
                    style={{
                        width: '300px',


                        outline: 'none',
                        transition: 'box-shadow 0.3s',
                }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.5)'}
                    inputProps={{maxLength: 1000}} //Limit the length of the input text (here size of 1000 characters)
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
            <div style={{marginLeft: '0px', margin: '0px'}}/>
            <Box
                sx={{'& > :not(style)': { m: 1},}} //Make the alignment better
            >
                <div style={{ position: 'relative' }}>
                <TextField id="sequence2" label="Sequence 2" variant="outlined"
                           type="text"
                           value={sequence2}
                           style={{
                               width: '300px',

                               outline: 'none',
                               transition: 'box-shadow 0.3s',
                           }}
                           onMouseOver={() => {
                               handleMouseOver()
                               setHelpIndex([true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                           }}
                           onMouseOut={() => {
                               handleMouseOut()
                               setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                           }}
                           onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.5)'}
                           inputProps={{maxLength: 1000}} //Limit the length of the input text (here size of 15 characters)
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
                    {helpWindow && helpIndex[0] && (
                        <div style={{ position: 'absolute', top: '55px', left: '0px', padding: '15px', border: '2px solid black', backgroundColor: 'white' }}>
                            Ceci est l'espace reservé aux séquences. Il est possible de choisir les deux séquences que l'on va aligner. La séquence 1 et la séquence 2. La plupart du temps on met des séquence d'ADN ou de protéines mais cet outil permet plus de possibilités comme le travail sur les chaines de caractères, etc... Alors n'hésitez pas à tester avec ce que vous voulez !
                        </div>
                    )}
                </div>
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


        </div>
    //HTML component which allows you to select the algorithm used
    const selector =
        <div style={{ display: 'flex', flexDirection: 'COLUMN',gap:'10px' }}>
            <Box
                sx={{'& > :not(style)': { m: 1}}}
            >
            <div>
                <FormControl fullWidth>
                    <div style={{ position: 'relative' }}>
                    <InputLabel id="algorithm-choice">Algorithme</InputLabel>
                    <Select

                        value ={selectedAlgorithm}
                        label = "Algorithm"
                        variant="outlined"
                        style={{

                            width: '300px',
                            height: '56px',
                            outline: 'none',
                            transition: 'box-shadow 0.3s',
                        }}
                        onMouseOver={() => {
                            handleMouseOver()
                            setHelpIndex([false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                        }}
                        onMouseOut={() => {
                            handleMouseOut()
                            setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                        }}
                        //onClick={() =>{setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])}}
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
                        <MenuItem  value = "Needleman-Wunsch">Needleman-Wunsch</MenuItem >
                        <MenuItem  value = "Smith-Waterman">Smith-Waterman</MenuItem >
                    </Select>
                        {helpWindow && helpIndex[1] && (
                            <div style={{ position: 'absolute', top: '55px', left: '0px', padding: '15px', border: '2px solid black', backgroundColor: 'white' }}>
                                Permet de choisir l'algorithme que l'on va utiliser pour notre alignement. On a deux choix : un algorithme d'alignement global maximal (Needleman-Wunsch), donc ici on va traiter toute les données d'un coup. Ou alors on a un algorithme d'alignement local minimal (Smith-Waterman), donc ici on va plutot s'interesser a de petits fragments similaires au lieu de tout traiter d'un coup.
                            </div>
                        )}
                    </div>
                </FormControl>
            </div>
            </Box>
                <Box sx={{'& > :not(style)': { m: 1 }}}>
            {extraParameters}
                </Box>

        </div>

    let blosumDisplay =
        <Box
            sx={{'& > :not(style)': { m: 1}}}
        >
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
        </Box>
    //HTML component representing the score matrix as well as its column and its sequence line aligned to it
    let FullMatrix = (
        <div>
            <div style={{ marginBottom: '0.25rem' }}>
                {displayedSeq}
            </div>
            <div className="horizontal-matrix" style={{ display: 'flex', flexDirection: 'row', gap: '0.25rem' }}>
                <React.Fragment>
                    <Grid item >
                        {displayedOtherSeq}
                    </Grid>
                    <Grid item>
                        {displayed_matrix}
                    </Grid>

                </React.Fragment>
            </div>
        </div>
    );

    //HTML component representing the arrowed matrix as well as its column and its sequence line aligned to it
    let FullMatrix2 =(
        <div>
            <div style={{ marginBottom: '0.25rem', flexWrap: 'nowrap' }}>
                {displayedSeq}
            </div>
            <div className="fullMatrix2" style={{ display: 'flex', flexDirection: 'row', gap: '0.25rem' }}>
                <React.Fragment>
                    <Grid item>
                        {displayedOtherSeq}
                    </Grid>
                    <Grid item>
                        {displayedArrowed_matrix}
                    </Grid>

                </React.Fragment>
            </div>
        </div>
    );

    //HTML component that merged the two matrix in one component
    let TwoMatrix =
        <div style={{ display: 'flex', position: 'relative'}}>
            <div style={{ marginLeft: '20px'}}/>
            <div style={{ position: 'relative' }}>
            <Box
                component="section"
                sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 600, height: 600, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}
                onMouseOver={() => {
                    handleMouseOver()
                    setHelpIndex([false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false])
                }}
                onMouseOut={() => {
                    handleMouseOut()
                    setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                }}
            >
                {FullMatrix}
            </Box>
                {helpWindow && helpIndex[9] && (
                    <div style={{opacity: 1, width: '300px', position: 'absolute', top: '-250px', left: '-150px', padding: '15px', border: '2px solid black', backgroundColor: 'white' }}>
                        La première matrice est la matrice des scores, elle indique chaque score à chaque étape pour enfin arriver au score final. On voit également un affichage en rouge d'un chemin optimal (un alignement optimal qui donne le meilleur score). La deuxième matrice à droite est la matrice qui représente l'ensemble de tout les chemins optimaux et leur directions sous forme de flèches. C'est grâce à cette matrice qu'on peut observer l'ensemble des alignement optimaux (cases oranges).
                    </div>
                )}
            </div>
            <div style={{ marginLeft: '850px', position: 'absolute', top: '0px', zIndex: '2' }}>
                <Box component="section" sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 600, height: 600, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'  }}   >
                    {FullMatrix2}
                </Box>
            </div>
        </div>




    //HTML ccomponent which brings together the result of the alignment of the two sequences
    let resultDisplayElement =
        <Box component="section" sx={{ p: 2, border: '5px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 500, height: 100, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'  }}  >
            <div style={{
                display: 'flex',
            }}>
                {[...allAlignedResult[pathCounter][0]].map((char, index) => (
                    <div key={index} style={{
                        fontSize: '2.5rem',
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
                        fontSize: '2.5rem',
                        fontFamily: 'monospace',
                        marginRight: '10px', // Espacement entre les caractères
                    }}>{char}</div>
                ))}
            </div>
        </Box>


//TEST ZONE---------------------------------------------------------------

    let blosumComp =

        <div style={{ position: 'relative' }}>
            <div style = {{ display: 'flex', flexDirection: 'column', margin: '8px', gap: '27px'}}>
                <ToggleButtonGroup
                    value={blosumCheck}
                    exclusive
                    style={{
                        width: '200px',
                        height: '55px',
                        outline: 'none',
                        transition: 'box-shadow 0.3s',
                    }}
                    onMouseOver={() => {
                        handleMouseOver()
                        setHelpIndex([false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                    }}
                    onMouseOut={() => {
                        handleMouseOut()
                        setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                    }}
                    onChange={() => {
                        setPathCounter(0);
                        setBlosumCheck(!blosumCheck);
                    }}

                    aria-label="toggle-button-group"
                >
                    <ToggleButton value={true} aria-label="activated">
                        BLOSUM CUSTOM
                    </ToggleButton>
                    <ToggleButton value={false} aria-label="deactivated">
                        Désactivé
                    </ToggleButton>
                </ToggleButtonGroup>

                <Input type="file" style={{
                    width: '200px',
                    height: '55px',
                    outline: 'none',
                    transition: 'box-shadow 0.3s',
                }} onChange={(e) =>{
                    handleFileBlosumLoad(e)
                }
                } />
            </div>
            {helpWindow && helpIndex[3] && (
                <div style={{width: '400px', position: 'absolute', top: '140px', left: '0px', padding: '15px', border: '2px solid black', backgroundColor: 'white' }}>
                    Le BLOSUM CUSTOM est une option permettant soit d'utiliser une matrice blosum62 pré-enregistrée dans l'outil, ou soit upload sa propre matrice de score customisée. Le principe est que par exemple, si on a un "R" qui est aligné avec un "A", on aimerait que cet alignement spécifique ait un score de 2 et avec les matrices custom c'est tout a fait possible. On peut personnaliser le score de chaque alignement spécifique. Néanmoins, il faut que le fichier ait une extension en .JSON et qu'il soit représenté sous forme de dictionnaire javascript.
                </div>
            )}
        </div>

    let modeComp =
        <Box
            sx={{'& > :not(style)': { m: 1},}} //Make the alignment better
        >
        <ToggleButtonGroup
            value={true}
            exclusive

            onChange={() => {
                console.log("Mode blabla")
            }}

            aria-label="toggle-button-group"
        >
            <div style = {{ display: 'flex', flexDirection: 'column', margin: '0px', gap: '27px'}}>
                <ToggleButton value={!gameModeCheck} aria-label="activated"
                              onChange={() => {
                                  setgameModeCheck(false)
                              }}
                              style={{
                                  width: '100px',
                                  height: '55px',
                                  outline: 'none',
                                  transition: 'box-shadow 0.3s',
                              }}>
                    Normal
                </ToggleButton>
                <ToggleButton value={gameModeCheck} aria-label="deactivated"
                              onChange={() => {
                                  setgameModeCheck(true)
                              }}
                              style={{
                                  width: '100px',
                                  height: '55px',
                                  outline: 'none',
                                  transition: 'box-shadow 0.3s',
                              }}>
                    Mode Jeu
                </ToggleButton>
            </div>
        </ToggleButtonGroup>
            </Box>

    let computeLimitComp =
        <div style={{ position: 'relative' }}>
        <TextField
            label={ "Compute limit"}
            type="number"
            id="computeLimit"
            value={computeLimit}
            onMouseOver={() => {
                handleMouseOver()
                setHelpIndex([false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
            }}
            onMouseOut={() => {
                handleMouseOut()
                setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
            }}
            onChange={(e) => {
                setPathCounter(0);
                const newComputeLimit = e.target.value
                if (newComputeLimit <= 0) {
                    setComputeLimit(1)
                    onDisplayPath()
                }
                else{
                    setComputeLimit(+newComputeLimit)
                    onDisplayPath()
                }

            }
            }
            onKeyUp={() => {
                onDisplayPath()
            }
            }
            style={ { width: "200px" }}
        />
            {helpWindow && helpIndex[2] && (
                <div style={{width: '400px', position: 'absolute', top: '140px', left: '0px', padding: '15px', border: '2px solid black', backgroundColor: 'white' }}>
                     La valeur "Compute limit" est une limite empechant le calcul des chemins optimaux au delà de cette limite. Il se peut que l'alignement que vous faites contiennent un nombre de chemins optimaux beaucoup trop élévée pour le navigateur. Cette limite intervient pour éviter les crash en cas de génération trop élévée. Vous pouvez adapter cette limite selon vos besoin mais attention aux pertes de performances. Le bouton Force Update permet de forcer l'actualisation des matrices si il existe un cas exceptionnel ou l'affichage plante.
                </div>
            )}
        </div>
    let changePathButton =

        <Box
            sx={{'& > :not(style)': { m: 1},}} //Make the alignment better
        >
            <div style={{ display: 'flex', flexDirection: 'COLUMN', gap:'26px' }}>
                {computeLimitComp}
                <div style = {{ display: 'flex', flexDirection: 'row', margin: '0px', gap: '5px'}}>
                    {displayPathButton}
                </div>
            </div>
        </Box>

    let paramButton =
        <Box
            sx={{'& > :not(style)': { m: 1},}} //Make the alignment better
        >
        <div style={{ display: 'flex', flexDirection: 'COLUMN', gap:'27px' }}>

        <div style = {{ display: 'flex', flexDirection: 'row', margin: '0px', gap: '5px'}}>
            <div style={{ position: 'relative' }}>
            <TextField
                type="number"
                id="match"
                label = "Match"
                variant="outlined"
                value={match}
                onMouseOver={() => {
                    handleMouseOver()
                    setHelpIndex([false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                }}
                onMouseOut={() => {
                    handleMouseOut()
                    setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                }}

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
                style={{
                    width: '100px',
                    height: '55px',
                    outline: 'none',
                    transition: 'box-shadow 0.3s',
                }}
            />
                {helpWindow && helpIndex[4] && (
                    <div style={{  position: 'absolute', top: '55px', left: '0px', padding: '15px', border: '2px solid black', backgroundColor: 'white' }}>
                        Valeur du Match. Cette valeur est ajouté au score final à chaque fois que l'on aligne deux caractère qui sont égaux dans l'alignement.
                    </div>
                )}
            </div>
            <div style={{ position: 'relative' }}>
            <TextField
                type="number"
                id="missmatch"
                label = "Mismatch"
                variant="outlined"
                value={missmatch}
                onMouseOver={() => {
                    handleMouseOver()
                    setHelpIndex([false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                }}
                onMouseOut={() => {
                    handleMouseOut()
                    setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                }}
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
                style={{
                    width: '100px',
                    height: '55px',
                    outline: 'none',
                    transition: 'box-shadow 0.3s',
                }}
            />
                {helpWindow && helpIndex[5] && (
                    <div style={{ position: 'absolute', top: '55px', left: '0px', padding: '15px', border: '2px solid black', backgroundColor: 'white' }}>
                        Valeur du Mismatch. Cette valeur est ajouté au score final à chaque fois que l'on aligne deux caractère différent dans l'alignement.
                    </div>
                )}
            </div>

            <div style={{ position: 'relative' }}>
                <TextField
                    label = "Gap"
                    variant="outlined"
                    type="number"
                    id="gap"
                    value={gap}
                    onMouseOver={() => {
                        handleMouseOver()
                        setHelpIndex([false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false])
                    }}
                    onMouseOut={() => {
                        handleMouseOut()
                        setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                    }}
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
                    style={{
                        width: '100px',
                        height: '55px',
                        outline: 'none',
                        transition: 'box-shadow 0.3s',
                    }}
                />
                {helpWindow && helpIndex[6] && (
                    <div style={{ position: 'absolute', top: '55px', left: '0px', padding: '15px', border: '2px solid black', backgroundColor: 'white' }}>
                        Valeur de l'écart. Cette valeur est ajouté au score final à chaque fois que l'on introduit un écart dans l'alignement.
                    </div>
                )}
            </div>



        </div>
            {resetValueButton}

        </div>
</Box>
    let paramPathComp =
        <div style={{ position: 'relative' }}>
        <Box component="section"
             onMouseOver={() => {
                 handleMouseOver()
                 setHelpIndex([false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false])
             }}
             onMouseOut={() => {
                 handleMouseOut()
                 setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
             }}
             sx={{ p: 2, border: '1px solid',borderRadius: '16px',borderColor: 'secondary.main' , overflowX: 'false' ,width: 350, height: 108, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}  >
            <div style = {{ display: 'flex', flexDirection: 'row'}}>
                {leftOnPath}
                <div style={{marginLeft: '5px'}}/>
                {rightOnPath}
            </div>
            <div style = {{ margin: '3px'}} />
            <label>Nombre de chemins optimaux existants : </label> {allPath.length}
            <div style = {{ margin: '10px'}} />
            <label>Index du chemin actuel : </label> {pathCounter}

        </Box >
            {helpWindow && helpIndex[10] && (
                <div style={{width: '300px', position: 'absolute', top: '-80px', left: '0px', padding: '15px', border: '2px solid black', backgroundColor: 'white' }}>
                Permet de naviguer entre les chemins optimaux.
                </div>
            )}
        </div>
    let elementFirstLine =
        <Box  >
            <Grid container spacing={1}>
                <Grid item>
                    {sequenceBox}
                </Grid>
                <Grid item>
                    {selector}
                </Grid>
                <Grid item>
                    {paramButton}
                </Grid>
                <Grid item>
                    {changePathButton}
                </Grid>
                <Grid item>
                    {blosumComp}
                </Grid>
                <Grid item>
                    {modeComp}
                </Grid>
            </Grid>
        </Box>

    let elementSecondLine =
        <Box >
            <Grid container spacing={5}>
                <Grid item>
                    {paramPathComp}

                </Grid>
                <Grid item>
                    {resultDisplayElement}
                </Grid>
                <Grid item>
                    <div>
                    <div style={{
                        fontSize: '2.1rem',
                        position: 'relative',
                        top: '20px', // Positionne l'élément au milieu de la hauteur de l'écran
                        left: '00px', // Positionne l'élément juste à droite de upElement avec un espacement de 20px

                        fontFamily: 'monospace',
                    }}>
                        Score :
                        {finalScore}
                    </div>
                    <div style={{
                        fontSize: '2.1rem',
                        position: 'relative',
                        top: '20px', // Positionne l'élément au milieu de la hauteur de l'écran
                        left: '00px', // Positionne l'élément juste à droite de upElement avec un espacement de 20px
                        fontFamily: 'monospace',
                    }}>
                        {matchString}
                    </div>
                    </div>
                </Grid>
            </Grid>
        </Box>

//HTML component that arranges and brings together the upper part of the page
    let upElement =
        <div>
            <img src={sequenciaImage} alt="Sequencia"   />
            <div style = {{ margin: '20px'}} />

            <label><strong>Outil de visualisation d'alignement de séquences réalisé par BOIVIN Lorentz dans le cadre du projet de Master 1 à l'Université de Mons.</strong> Une des fonctionnalités principales de cet outil est d'aligner des séquences d'ADN et protéines dans le domaine de la biologie et de la bio-informatique. Néanmoins il permet également de travailler sur des chaines de caractères. Celui-ci a pour objectif de rendre l'alignement de séquence plus compréhensible et visuel. Vous pouvez rentrez 2 séquences, choisir l'algorithme d'alignement que vous voulez, certaines de ses variantes et aussi modifier les paramètres. Un mode jeu est également disponible en appuyant sur le bouton à droite "Mode jeu". L'alignement de séquence a pour but de comparer les similarités mais aussi d'organiser les éléments des séquences d'une telle manière à maximiser leur ressemblance.</label>
            <div style = {{ margin: '20px'}} />
            {elementFirstLine}

            <div style = {{ margin: '20px'}} />


        </div>
    let downElement = <div></div>
    if(gameModeCheck){
        downElement = <Gamemode></Gamemode>
    }
    else{
        downElement =
            <div>
                <div style={{ display: 'flex', justifyContent: 'center' , gap: '100vh',marginTop: '60px'  }}>
                    {elementSecondLine}
                </div>
                <div style = {{ marginLeft: '130px',marginTop: '60px'}} >
                    {TwoMatrix}
                </div>
                <div style = {{ margin: '20px'}} />
                <div style = {{ margin: '20px'}} />
                <div style={{ display: 'flex', justifyContent: 'center' , gap: '100px',marginTop: '60px' }}>
                    <DataTable allPath = {allPath} choosePathCounter = {choosePathCounter} allAlignedResult = {allAlignedResult}/>
                    <SubTable uniquePath = {optPath} modSequence1 = {allAlignedResult[pathCounter][0]} modSequence2 = {allAlignedResult[pathCounter][1]} transfMatrix = {matrixFinal} chooseCase = {chooseCase} rawSequence1={sequence1} rawSequence2={sequence2}/>
                </div>
            </div>
    }



//end TEST ZONE---------------------------------------------------------------
        //Set of all the components in return for the final display on the page
        return (
        <div style={{ marginLeft: '20px',marginTop: "20px",marginBottom: '50px',marginRight:"20px" }}>
            <div style={{ position: 'relative'}}>
                {upElement}
            </div>
            <hr style={{ borderTop: '1px solid #ccc' }} />
            {downElement}
        </div>
    );
}
