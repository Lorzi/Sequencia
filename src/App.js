import React, {useEffect, useState} from 'react';
import {Case} from "./components/Case";
import {NeedleManWunschScript} from "./algorithms/NeedleManWunschScript";
import {determineArrowedMatrix, findPaths} from "./algorithms/NeedleManOptimalPath_V2";
import DataTable from "./components/DataTable"
import SubTable from "./components/SubTable";
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Alert,
    Select,
    TextField
}
from "@mui/material";
import NeedlemanExtra from "./components/NeedlemanExtra";
import SmithWaterManExtra from "./components/SmithWaterManExtra";
import {SmithWatermanScript} from "./algorithms/SmithWatermanScript";
import {findPathsSW} from "./algorithms/SmithWatermanOptimalPath_V2";
import {blosum62} from "./components/variants/blosum62";
import {DisplayedMatrix, DisplayedOtherSeq, DisplayedSeq, mergePaths} from "./utils";
import mainstyles from "./main.module.css";


/**
 * Heart of the application, also known as the normal mode
 * allows you to launch normal mode, takes care of the display and placement of the different elements on the page.
 * It returns different HTML elements in the same page
 * @returns {Element}
 * @constructor
 */
export default function App(){

    //INITIALISATION AREA START -------------------------------------------------------------------
    let [sequence1 ,setSequence1] = useState('')
    let [sequence2 ,setSequence2] = useState('')
    let [match,setMatch] = useState(1)
    let [mismatch ,setMismatch] = useState(-1)
    let [gap,setGap]=useState(-2)
    let [pathCounter, setPathCounter] = useState(0); //Counter that indicate which path in the allpath list we choose in the visualisation
    let [matchString, setMatchString] = useState(""); //Useful for the LCS function, make a string of every character that match for the LCS
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("Needleman-Wunsch");
    const [selectedVariant,setSelectedVariant] = useState("default");
    const [operationMm,setOperationMm] = useState(0); //Allows to change if we use a Max or Min in other class (Needleman-Wunsch or Smith-Waterman)
    const [computeLimit, setComputeLimit] = useState(10000); //Maximum bound for the computation of result, help to avoid infinite generation and thus crash
    //eslint-disable-next-line
    const [blosumCheck, setBlosumCheck] = useState(false); //Check blosum option is activated
    //eslint-disable-next-line
    const [blosumCustom,setBlosumCustom] = useState(blosum62); //Custom matrix, by default blosum62
    let matrixTestData = NeedleManWunschScript(sequence1,sequence2,match,mismatch,gap,operationMm,blosumCheck,blosumCustom)//list that countain subsitution matrix and scoreMatrix
    let matrixFinal = matrixTestData[1]; //Score Matrix, also knowned as transfMatrix in other class
    let arrowedMatrix = determineArrowedMatrix(sequence1,sequence2,matrixTestData[0],matrixFinal,match,gap,mismatch) //Matrix that contains the arrows and direction, important to generate paths
    let allPath = findPaths(arrowedMatrix,computeLimit); //list that contains every possible path/alignement on this session
    let optPath = allPath[pathCounter]; //one Path from allPath that as been chosen with the PathCounter
    const [finalScore, setFinalScore] = useState(0);
    const [chosenCase, setChosenCase] = useState([]);
    const [extraParameters,setExtraParameters]= useState(); //Parameters that change with the aglorithm chosen. Make appearing choice of variants
    const [mismatchDisabled , setMismatchDisabled] = useState(false) //Allows to know if we have to disable or not the mismatch button, same for the next one
    const [matchDisabled , setMatchDisabled] = useState(false)
    const [gapDisabled , setGapDisabled] = useState(false)
    const [helpWindow, setHelpWindow] = useState(false);
    const [helpIndex,setHelpIndex]=useState([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]) // Help for the index of the help windows
    const [colorVariantCase,setColorVariantCase] = useState([]); //Coloring or not for a variant (example green for the LCS)
    let mergedAllPath = mergePaths(allPath); // //Merge every unique path for allPath in one list, very useful for displaying everypath on the arrowedmatrix (orange case)
    if(selectedAlgorithm === "Smith-Waterman"){
        matrixTestData = SmithWatermanScript(sequence1,sequence2,match,mismatch,gap)
        matrixFinal = matrixTestData[1];
        arrowedMatrix = determineArrowedMatrix(sequence1,sequence2,matrixTestData[0], matrixTestData[1],match,gap,mismatch);
        allPath = findPathsSW(arrowedMatrix,matrixTestData[2],matrixFinal,computeLimit);
        optPath = allPath[pathCounter];
        mergedAllPath = mergePaths(allPath);
    }
    //Matrix displayed as button matrix in html
    const [displayed_matrix,setDisplayedMatrix] = useState();
    //Arrow matrix as button matrix in html
    const [displayedArrowed_matrix,setDisplayedArrowedMatrix] = useState();
    //Display component SEQUENCE WORD 2
    const [displayedSeq,setDisplayedSeq] = useState();
    //Display component SEQUENCE WORD 1
    const [displayedOtherSeq,setDisplayedOtherSeq] = useState();

    //INITIALISATION AREA END -------------------------------------------------------------------

    /**
     * Return the 2 strings sequences with the gaps "-" in a list of 2 elements
     * It's useful to display the results and see where are the gaps.
     * @param actualPath
     * @returns {[string,string]}
     */
    const alignmentResultResolver =(actualPath) => {
        let alignedSeq1 ="", alignedSeq2="";

        if(selectedAlgorithm === "Smith-Waterman"){
            for(let i=1,j1=0,j2=0;i<actualPath.length;i++){
                if(actualPath[i-1][0] !== actualPath[i][0] && actualPath[i-1][1]!==actualPath[i][1]){
                    alignedSeq1+=sequence1[actualPath[j1][0]];
                    alignedSeq2+=sequence2[actualPath[j2][1]];
                    j1++;
                    j2++;
                }
                if(actualPath[i-1][0] === actualPath[i][0] && actualPath[i-1][1] < actualPath[i][1]){
                    alignedSeq2+=sequence2[actualPath[j2][1]];
                    j2++;
                    alignedSeq1+="-";
                }
                if(actualPath[i-1][0] < actualPath[i][0] && actualPath[i-1][1] === actualPath[i][1]){
                    alignedSeq1+=sequence1[actualPath[j1][0]];
                    j1++;
                    alignedSeq2+="-";
                }
            }
        }
        else{
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
                coloredGreenCase.push(actualPath[count+1]); //Push into a list the coordinates of the boxes that must be colored to highlight the LCS
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
        setMismatch(-1);
        setGap(-2);
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
        onDisplayPath(); // Run onDisplayPath() when pathCounter is updated
        // eslint-disable-next-line
    }, [pathCounter,chosenCase,gap,colorVariantCase,selectedAlgorithm,blosumCheck,blosumCustom]);

    useEffect(() => {
        // eslint-disable-next-line
        checkVariant(); // Run onDisplayPath() when pathCounter is updated
        // eslint-disable-next-line
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
            setMismatchDisabled(false);
            setMatchDisabled(false);
            setMatch(0);
            setMismatch(0);
        }

        else{
            setMismatchDisabled(true);
            setMatchDisabled(true);
        }

        if(selectedVariant === "default"){
            setMismatchDisabled(false);
            setMatchDisabled(false);
            setGapDisabled(false);
            setMatchString("");
            setOperationMm(0);
        }

        else if(selectedVariant === "LCS"){
            setMismatchDisabled(true);
            setMismatch(0);
            setMatchDisabled(true);
            setMatch(1);
            setGapDisabled(true);
            setGap(0);
            setOperationMm(0);
            matchStringResolver(optPath);
        }

        else if(selectedVariant === "wagnerf"){
            setMatch(0);
            setMismatchDisabled(true);
            setMismatch(1);
            setMatchDisabled(true);
            setGap(1);
            setGapDisabled(true);
            setOperationMm(1);
        }

        else if(selectedVariant === "blosum"){
            setMismatch(0);
            setMismatchDisabled(true);
            setMatch(0);
            setGapDisabled(false);
            setMatchDisabled(true);
        }
    }



    /**
     * Allows you to update the displayed matrix with new information and the optimal path.
     * Display of the matrix and update of it each time this function is called.
     */
    const onDisplayPath = () => {
        setExtraParameters(<NeedlemanExtra chooseSelectedVariant = {chooseSelectedVariant} />); //ALLOWS you to set the default variant otherwise it only appears after clicking twice on needleman
        checkVariant();

        //Updating the score matrix
        setDisplayedMatrix(
            <DisplayedMatrix
                matrixFinal={matrixFinal}
                colorVariantCase={colorVariantCase}
                selectedVariant={selectedVariant}
                chosenCase={chosenCase}
                optPath={optPath}
        />);


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
                                            // change the color of the case in orange if the path is in the allPath
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
        setDisplayedSeq(<DisplayedSeq sequence2={sequence2} />);
        //Updating the Sequence 1 display
        setDisplayedOtherSeq(<DisplayedOtherSeq sequence1={sequence1} />);
    }

    /**
     * UI Component: Button that call onDisplayPath() in case the matrix don't update itself
     * @type {React.JSX.Element}
     */
    const displayPathButton =
        <Button
            className = {mainstyles.displayButton}
            id={"displayed_button"}
            variant="contained"
            onClick={() => {
                onDisplayPath();
            }}>Force update
        </Button>

    /**
     * UI Component: Button that decrement the PathCounter
     * @type {React.JSX.Element}
     */
    const leftOnPath =
        <Button
            className ={mainstyles.directionButton}
            variant="contained"
            onClick={() => handleLeftButtonClick()}>←
        </Button>

    /**
     * UI Component: Button that increment the PathCounter
     * @type {React.JSX.Element}
     */
    const rightOnPath =
        <Button
            className ={mainstyles.directionButton}
            variant="contained"
            onClick={() => handleRightButtonClick()}>→
        </Button>

    /**
     * UI Component: Button that reset the value by default
     * @type {React.JSX.Element}
     */
    const resetValueButton =
        <div style={{ position: 'relative' }}>
        <Button
            className = {mainstyles.resetButton}
            variant="contained"
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
                <div className={mainstyles.helpWindow}>
                    <Alert  severity="info">
                        Resets the match, mismatch and gap values to the default values (respectively: 1,-1,-2). These values are generally the most commonly used
                    </Alert>
                </div>
            )}
        </div>

    /**
     * UI Component: Component containing the graphic boxes which allow information to be entered as an input (Sequence 1/Sequence 2)
     * @type {React.JSX.Element}
     */
    const sequenceBox =
        <div className={mainstyles.spaceInterInput}>
            <Box
                sx={{m: 1}} //Make the alignment better
            >
                <TextField
                    className = {mainstyles.sequenceBox}
                    id="sequence1"
                    label="Sequence 1"
                    variant="outlined"
                    type="text"
                    value={sequence1}
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

            <Box
                sx={{m: 1}} //Make the alignment better
            >
                <div style={{ position: 'relative' }}>
                <TextField
                    className = {mainstyles.sequenceBox}
                    id="sequence2"
                    label="Sequence 2"
                    variant="outlined"
                    type="text"
                    value={sequence2}
                    onMouseOver={() => {
                        handleMouseOver()
                        setHelpIndex([true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                    }}
                    onMouseOut={() => {
                        handleMouseOut()
                        setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                    }}
                    inputProps={{maxLength: 1000}} //Limit the length of the input text (here size of 1000 characters)
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
                        <div className={mainstyles.helpWindow}>
                            <Alert severity="info">
                                This is the space reserved for sequences. It is possible to choose the two sequences that are going to be aligned : the Sequence 1 and sequence 2. Most of the time, we put DNA or protein sequences but this tool allows more possibilities such as working on character strings, etc... So don't hesitate to test with whatever you want !
                            </Alert>
                        </div>
                    )}
                </div>
            </Box>
        </div>



    /**
     *
     * @type {React.JSX.Element}
     */
    const selector =
        <div className={mainstyles.spaceInterInput}>
            <Box
                sx={{m: 1}}
            >
            <div>
                <FormControl fullWidth>
                    <div style={{ position: 'relative' }}>
                    <InputLabel id="algorithm-choice">Algorithm</InputLabel>
                    <Select
                        className = {mainstyles.selectorComp}
                        value ={selectedAlgorithm}
                        label = "Algorithm"
                        variant="outlined"
                        onMouseOver={() => {
                            handleMouseOver()
                            setHelpIndex([false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                        }}
                        onMouseOut={() => {
                            handleMouseOut()
                            setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
                        }}
                        onChange = {(e) => {
                            setPathCounter(0);
                            setSelectedAlgorithm(e.target.value)
                            const selectedValue = e.target.value
                            if(selectedValue === "Needleman-Wunsch"){
                                setExtraParameters(<NeedlemanExtra chooseSelectedVariant = {chooseSelectedVariant}/>);
                                matrixTestData = NeedleManWunschScript(sequence1,sequence2,match,mismatch,gap,operationMm);
                                matrixFinal = matrixTestData[1]; //Score matrix
                                setSelectedVariant("default")

                            }
                            if(selectedValue === "Smith-Waterman"){
                                setExtraParameters(<SmithWaterManExtra chooseSelectedVariant ={chooseSelectedVariant}/>);
                                matrixTestData = SmithWatermanScript(sequence1,sequence2,match,mismatch,gap,operationMm);
                                matrixFinal = matrixTestData[1]; //Score matrix
                                setSelectedVariant("default")
                            }

                        }
                        }
                    >
                        <MenuItem  value = "Needleman-Wunsch">Needleman-Wunsch</MenuItem >
                        <MenuItem  value = "Smith-Waterman">Smith-Waterman</MenuItem >
                    </Select>
                        {helpWindow && helpIndex[1] && (

                            <div className={mainstyles.helpWindow}>
                                <Alert severity="info">
                                    Allows you to choose the algorithm that we will use for the alignment. We have two choices: a maximum global alignment algorithm (Needleman-Wunsch), so here we will process all the data at once. Or we have a minimal local alignment algorithm (Smith-Waterman), so here we will focus on small similar fragments instead of processing the whole sequences at once.
                                </Alert>
                            </div>
                        )}
                    </div>
                </FormControl>
            </div>
            </Box>
                <Box sx={{ m: 1 }}>
            {extraParameters}
                </Box>

        </div>

    /**
     * UI Component: HTML component representing the score matrix as well as its column and its sequence line aligned to it
     * @type {React.JSX.Element}
     */
    let FullMatrix = (
        <div>
            <div className={mainstyles.fullMatrixVert}>
                {displayedSeq}
            </div>
            <div className={mainstyles.fullMatrixHoriz}>
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

    /**
     * UI Component: HTML component representing the arrowed matrix as well as its column and its sequence line aligned to it
     * @type {React.JSX.Element}
     */
    let FullMatrix2 =(
        <div>
            <div className={mainstyles.fullMatrixVert}>
                {displayedSeq}
            </div>
            <div className={mainstyles.fullMatrixHoriz}>
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

    /**
     * UI component: HTML component that merged the two matrix in one component
     * @type {React.JSX.Element}
     */
    let TwoMatrix =
        <Box className={mainstyles.matrixGap}>
            <Grid container
                  direction="row"
                  columnSpacing={20}
                  alignItems="center">
                <Grid item>
                    <Box
                        className={mainstyles.matrixBorderBox}
                        sx={{p: 2}}
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
                    <div className={mainstyles.matrixHelpWindow}>
                        <Alert severity="info">
                            The first matrix is the score matrix, it indicates each score at each stage to finally arrive at the final score. We also see a red display of an optimal path (an optimal alignment that gives the best score). The second matrix on the right is the matrix which represents the set of all optimal paths and their directions in the form of arrows. It is thanks to this matrix that we can observe all of the optimal alignments (orange boxes).
                        </Alert>
                    </div>
                )}
                </Grid>
                <Grid item>
                    <Box
                        className={mainstyles.matrixBorderBox}
                        sx={{p: 2}}>
                        {FullMatrix2}
                    </Box>
                </Grid>
            </Grid>
        </Box>


    /**
     * UI Component: HTML component which brings together the result of the alignment of the two sequences
     * @type {React.JSX.Element}
     */
    let resultDisplayElement =
        <Box
            className={mainstyles.resultDisplayPanel}
            sx={{p: 2}}>

            <div style={{display: 'flex'}}>
                {[...allAlignedResult[pathCounter][0]].map((char, index) => (
                    <div className={mainstyles.resultFont} key={index}>{char}</div>
                ))}
            </div>
            <div style={{display: 'flex'}}>
                {[...allAlignedResult[pathCounter][1]].map((char, index) => (
                    <div className={mainstyles.resultFont} key={index}>{char}</div>
                ))}
            </div>
        </Box>

    /**
     * UI Component: Compute limit input
     * @type {React.JSX.Element}
     */
    let computeLimitComp =
        <div style={{ position: 'relative' }}>
        <TextField
            className={mainstyles.computeLimitElem}
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
            }}
            onKeyUp={() => {
                onDisplayPath()
            }}
        />
            {helpWindow && helpIndex[2] && (
                <div className={mainstyles.computeHelpWindow}>
                    <Alert severity="info">
                        The "Compute limit" value is a limit preventing the calculation of optimal paths beyond this limit. It is possible that the alignment you make contains too many optimal paths for the browser. This limit intervenes to avoid crashes in the event of too high a generation. You can adapt this limit according to your needs but be careful of performance losses. The Force Update button allows you to force the updating of the matrices if there is an exceptional case where the display crashes.
                    </Alert>
                </div>
            )}
        </div>

    /**
     * UI Component: regroup two component that allows to change the number of compute limit and update the matrix
     * @type {React.JSX.Element}
     */
    let changeComputeElem =
        <Box
            sx={{ m: 1}} //Make the alignment better
        >
            <div className={mainstyles.spaceInputButton}>
                {computeLimitComp}
                {displayPathButton}
            </div>
        </Box>

    /**
     * UI component: Parameters textfield input for changing the value of the Match, Mismatch and Gap
     * @type {React.JSX.Element}
     */
    let paramButton =
        <Box
            sx={{ m: 1}} //Make the alignment better
        >
        <div className={mainstyles.spaceInputButton}>
            <div className={mainstyles.spaceInputParam}>
            <TextField
                className = {mainstyles.paramBox}
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
            />
                {helpWindow && helpIndex[4] && (
                    <div className={mainstyles.helpWindowParam}>
                        <Alert severity="info">
                            Match Value. This value is added to the final score each time we align two characters that are equal in alignment.
                        </Alert>
                    </div>
                )}

            <TextField
                className = {mainstyles.paramBox}
                type="number"
                id="mismatch"
                label = "Mismatch"
                variant="outlined"
                value={mismatch}
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
                    const newMismatch = e.target.value
                    setMismatch(+newMismatch)
                    onDisplayPath()
                    setChosenCase([])
                }
                }
                onKeyUp={() => {
                    onDisplayPath()
                    setChosenCase([])
                }
                }
                disabled={mismatchDisabled}
            />
                {helpWindow && helpIndex[5] && (
                    <div className={mainstyles.helpWindowParam}>
                        <Alert severity="info">
                            Value of Mismatch. This value is added to the final score each time two different characters are aligned in the alignment.
                        </Alert>
                    </div>
                )}

                <TextField
                    className = {mainstyles.paramBox}
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
                />
                {helpWindow && helpIndex[6] && (
                    <div className={mainstyles.helpWindowParam}>
                        <Alert severity="info">
                            Gap value. This value is added to the final score each time we introduce a gap in the alignment.
                        </Alert>
                    </div>
                )}

        </div>
            {resetValueButton}

        </div>
</Box>
    let paramPathComp =
        <div style={{ position: 'relative' }}>
        <Box
            className = {mainstyles.pathsPanel}
             onMouseOver={() => {
                 handleMouseOver()
                 setHelpIndex([false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false])
             }}
             onMouseOut={() => {
                 handleMouseOut()
                 setHelpIndex([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false])
             }}
             sx={{ p: 2}}>
        <Grid container>
            <Grid item>
                <div style = {{ display: 'flex', flexDirection: 'row'}}>
                    {leftOnPath}
                    <div style={{marginLeft: '5px'}}/>
                    {rightOnPath}
                </div>
            </Grid>
            <Grid item sx={{marginTop : '10px'}}>
            <label className={mainstyles.pathFont}>Number of existing optimal paths :  {allPath.length} </label>
            </Grid>
            <Grid item sx={{marginTop : '2px'}}>
            <label className={mainstyles.pathFont}>Current path index : {pathCounter} </label>
            </Grid>
        </Grid>
        </Box >
            {helpWindow && helpIndex[10] && (
                <div className={mainstyles.pathHelpWindow}>
                    <Alert severity="info">
                        Allows you to navigate between the optimal paths.
                    </Alert>
                </div>
            )}
        </div>

    /**
     * UI Component: first line element
     * @type {React.JSX.Element}
     */
    let elementFirstLine =
        <Box>
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
                    {changeComputeElem}
                </Grid>


            </Grid>
        </Box>
    /**
     * UI component: Second line component
     * @type {React.JSX.Element}
     */
    let elementSecondLine =
        <Box>
            <Grid container spacing={5}>
                <Grid item>
                    {paramPathComp}

                </Grid>
                <Grid item>
                    {resultDisplayElement}
                </Grid>
                <Grid item>
                    <div>
                    <div className={mainstyles.scoreFont}>
                        Score:
                        {finalScore}
                    </div>
                    <div className={mainstyles.scoreFont}>
                        {matchString}
                    </div>
                    </div>
                </Grid>
            </Grid>
        </Box>

    /**
     * UI Component: HTML component that arranges and brings together the upper part of the page
     * @type {React.JSX.Element}
     */
    let upElement =
        <Grid container  spacing={0.5} direction="column" alignItems="center" >
            {elementFirstLine}
        </Grid>
    /**
     * UI Component: HTML component that arranges and brings together the bottom part of the page
     * @type {React.JSX.Element}
     */
    let downElement =
        <Box className={mainstyles.matrixGap}>
            <Grid container  spacing={0.5} direction="column" alignItems="center" >
                <Grid item>
                    {elementSecondLine}
                </Grid>
                <Grid item>
                    {TwoMatrix}
                </Grid>
                <Grid item>
                    <div className={mainstyles.tableOrganization}>
                        <DataTable allPath = {allPath} choosePathCounter = {choosePathCounter} allAlignedResult = {allAlignedResult}/>
                        <SubTable uniquePath = {optPath} modSequence1 = {allAlignedResult[pathCounter][0]} modSequence2 = {allAlignedResult[pathCounter][1]} transfMatrix = {matrixFinal} chooseCase = {chooseCase} rawSequence1={sequence1} rawSequence2={sequence2}/>
                    </div>
                </Grid>
            </Grid>
        </Box>

        //Set of all the components in return for the final display on the page
        return (
        <div className={mainstyles.returnOrganization}>
            <div style={{ position: 'relative'}}>
                {upElement}
            </div>
            <hr className={mainstyles.horizontalBorder} />
            {downElement}
        </div>
    );
}
