import * as React from "react";
import {NeedleManWunschScript} from "./algorithms/NeedleManWunschScript";
import {useEffect, useState} from "react";
import {Box, Button, Grid, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {Case} from "./components/Case";
import {determineArrowedMatrix, findPaths} from "./algorithms/NeedleManOptimalPath_V2";
import {DisplayedOtherSeq, DisplayedSeq, mergePaths} from "./utils";
import mainstyles from "./main.module.css";

export default function Gamemode(){
    let [sequence1,setSequence1] = useState("");
    let [sequence2,setSequence2] = useState("");
    let [match,setMatch] = useState(1);
    let [mismatch,setMismatch] = useState(-1) ;
    let [gap,setGap] = useState(-2);
    let matrix = NeedleManWunschScript(sequence1,sequence2,match,mismatch,gap,0,false);
    const [answeredValue,setAnsweredValue] = useState(0);
    let [xPoint,setXPoint] = useState(0);
    let [yPoint,setYPoint] = useState(0);
    let [goodAnswerCounter,setGoodAnswerCounter]=useState(0);
    let [badAnswerCounter,setBadAnswerCounter]=useState(0);
    let [goodAnswerCoord,setGoodAnswerCoord] = useState([]);
    let [badAnswerCoord,setBadAnswerCoord] = useState([]);
    const [numberOfCase, setNumberOfCase] = useState(0);
    const [visibleCase, setVisibleCase] = useState([]);
    let finalMatrix = matrix[1];
    let [gameModeActivation,setGameModeActivation] = useState(true);
    const [gamemode,setGamemode] = useState(false);
    let [greenCasesList,setGreenCasesList] = useState([]);
    let [redCasesList,setRedCasesList] = useState([]);
    let [optimizedCasesList,setOptimizedCasesList] = useState([]);
    let arrowedMatrix = determineArrowedMatrix(sequence1,sequence2, matrix[0],matrix[1],match,gap,mismatch);
    let allPath = findPaths(arrowedMatrix,10000);
    let [gameMode2Coord,setGameMode2Coord] = useState([0,0])
    let[clickableCases, setClickableCases] = useState([[sequence1.length,sequence2.length]])
    let[helpSeq1, setHelpSeq1] = useState("");
    let[helpSeq2,setHelpSeq2] = useState("");
    let[helpMatrixCoord,setHelpMatrixCoord] = useState([]);
    const [displayedSeq,setDisplayedSeq] = useState();   //Display component SEQUENCE WORD 2
    const [displayedOtherSeq,setDisplayedOtherSeq] = useState();  //Display component SEQUENCE WORD 1
    const [displayed_matrix,setDisplayedMatrix] = useState();
    const [displayedHelpMatrix,setDisplayedHelpMatrix] = useState();

    /**
     * useEffect allowing you to create the optimal list of all paths
     */
    // eslint-disable-next-line
    useEffect(() => {
        const mergedAllPath = mergePaths(allPath); // //Merge every unique path for allPath in one list, very useful for displaying everypath on the arrowedmatrix (orange case)
        setOptimizedCasesList(mergedAllPath);
        // eslint-disable-next-line
    }, [gamemode,greenCasesList]);



    /**
     * UI component: Display of sequence 2 fraction useful for displaying the help matrix
     * The help sequence will be split into boxes to allow it to be displayed as matrix
     * @type {React.JSX.Element}
     */
    const displayedHelpSeq2 =
        <Box>
            <Grid container spacing={0.5}>
                <Grid item>
                    <Case key={["first-case"]} value={"-"} color={'light_blue'} />
                </Grid>
                <Grid item>
                    <Case key={["second-case"]} value={"-"} color={'light_blue'} />
                </Grid>
                {helpSeq2.split('').map((item, index) => (
                    <Grid item key={index}>
                        <Case key={[index]} value={item} color={'light_blue'} />
                    </Grid>
                ))}
            </Grid>
        </Box>

    /**
     * UI component: Display of sequence 1 fraction useful for displaying the help matrix
     * The help sequence will be split into boxes to allow it to be displayed as matrix
     * @type {React.JSX.Element}
     */
    const displayedHelpSeq1 =
        <Box>
            <Grid container direction="column" spacing={0.5}>
                <Grid item>
                    <Case key={["first-case"]} value={"-"} color={'light_blue'} />
                </Grid>
                {helpSeq1.split('').map((item, index) => (
                    <Grid item key={index}>
                        <Case key={[index]} value={item} color={'light_blue'} />
                    </Grid>
                ))}
            </Grid>
        </Box>


    /**
     * Function that manages clicking a case during game mode number 2
     * Check if the case that the user chose (y,x) is in the optimal path list. If yes, then this position is added to the greenCaseList.
     * If not this position is added to the red Case list
     * @param y
     * @param x
     */
    const handlePaperAnswerButtonClick = (y,x) =>{

        setGoodAnswerCounter(greenCasesList.length)
        setBadAnswerCounter(redCasesList.length)

        if (optimizedCasesList.some(optimizedCases => optimizedCases[0] === y && optimizedCases[1] === x)) {
            setGreenCasesList([...greenCasesList, [y, x]]);
            setGameMode2Coord([y,x]);
            if(y === 0 && x === 0){
                setClickableCases([[]])
                setGreenCasesList([...greenCasesList, [0, 0]]);
                setGameMode2Coord([y,x]);
            }
            else if(y === 0 && x > 0){
                setClickableCases([[y,x-1]])
            }
            else if(y > 0 && x === 0){
                setClickableCases([[y-1,x]])
            }
            else{
                setClickableCases([[y-1,x],[y-1,x-1],[y,x-1]])
            }
        }
        else if (optimizedCasesList.length === 0) {
            setGreenCasesList([...greenCasesList, [y, x]]);
            setGameMode2Coord([y,x]);
        }
        else {
            if (y !== sequence1.length || x !== sequence2.length){
                setRedCasesList([...redCasesList, [y, x]]);
            }
        }
        setVisibleCase([...visibleCase, [yPoint, xPoint]]);
    };

    /**
     * Reset the goods and bads answers to start a new game.
     */
    const resetCommonParam = () =>{
        setGoodAnswerCounter(0);
        setBadAnswerCounter(0);
    }

    /**
     * Generates the help matrix for the game mode
     * Since the help matrix is a matrix of 2*2 values, it set the value for the TOP, LEFT and DIAGONAL case and display a "?" for the searched value
     * It will display differently if the position of the researched case is on an edge or not.
     */
    const generateHelpMatrix = () =>{
        if(sequence1[yPoint-1] === undefined){
            setHelpSeq1("-")
        }
        else{
            setHelpSeq1(sequence1[yPoint-1])
        }
        if(sequence2[xPoint-1]===undefined){
            setHelpSeq2("-")
        }
        else{
            setHelpSeq2(sequence2[xPoint-1])
        }
        if(yPoint ===0 && xPoint !== 0 && xPoint !== sequence2.length){
            setHelpMatrixCoord([[[""],[""]],[[finalMatrix[yPoint+1][xPoint]],["?"]]])
        }
        else if(yPoint ===0 && xPoint === sequence2.length){
            setHelpMatrixCoord([[[""],[finalMatrix[yPoint][0]]],[[""],["?"]]])
        }
        else if(yPoint !==0 && xPoint === sequence2.length){
            setHelpMatrixCoord([[[""],[finalMatrix[yPoint][0]]],[[""],["?"]]])
        }
        else if (yPoint ===0 && xPoint === 0){
            setHelpMatrixCoord([[[""],[""]],[["0"],["?"]]])
        }
        else{
            setHelpMatrixCoord([[[finalMatrix[yPoint-1][xPoint]],[finalMatrix[yPoint-1][xPoint+1]]],[[finalMatrix[yPoint][xPoint]],["?"]]])
        }
    }


    /**
     * Reset parameters for Game mode 1
     */
    const resetGamemode1Param = () =>{
        setClickableCases([]);
        setGoodAnswerCoord([]);
        setBadAnswerCoord([]);
        setNumberOfCase(0);
        setXPoint(0);
        setYPoint(0);
        setVisibleCase([]);
        resetCommonParam();
    }
    /**
     * Reset parameters for Game mode 2
     */
    const resetGamemode2Param = () =>{
        setGreenCasesList([[sequence1.length,sequence2.length]]);
        setRedCasesList([]);
        setClickableCases([[sequence1.length,sequence2.length]]);
        resetCommonParam();
    }
    /**
     * Reset the parameters of every gamemode by clicking on the associate button.
     */
    const handleResetButton = () =>{
        resetGamemode1Param();
        resetGamemode2Param();
    }

    /**
     * Manage user entries by clicking on the button.
     * This function manages the entire game mode number 1 and compares the input answers
     * with the real answers and continues the game accordingly.
     */
    const handleSubmitAnswerButtonClick = () =>{
        setVisibleCase([...visibleCase, [yPoint, xPoint]]);

        //If it's the right answer, then add it to the goodAnswer list and increment the good score
        if(answeredValue === finalMatrix[yPoint][xPoint]){
            let newGoodAnswerCounter= goodAnswerCounter;
            newGoodAnswerCounter +=1 ;
            setGoodAnswerCounter(newGoodAnswerCounter)
            setGoodAnswerCoord([...goodAnswerCoord, [yPoint, xPoint]]);
            let newNumberOfCase = numberOfCase +1;
            setNumberOfCase(newNumberOfCase);

        }
        //If answer is wrong, then add the case to the badAnswer list and increment the bad score
        else {
            if(xPoint >= finalMatrix[0].length-1 && yPoint >= finalMatrix.length-1){
                //This condition prevents a misuse where a bad answer can be chosen multiple time at the end of the game
            }
            else{
                let newBadAnswerCounter=badAnswerCounter;
                newBadAnswerCounter += 1;
                setBadAnswerCounter(newBadAnswerCounter)
                setBadAnswerCoord([...badAnswerCoord, [yPoint, xPoint]]);
                let newNumberOfCase = numberOfCase +1;
                setNumberOfCase(newNumberOfCase);

            }
        }
        //If it's the end of the line
        if(xPoint >= finalMatrix[0].length-1){
            //If it's the end of the game
            if (yPoint >= finalMatrix.length-1)
            {
                if(xPoint === finalMatrix[0].length-1 && yPoint ===finalMatrix.length-1){
                    if(answeredValue === finalMatrix[yPoint][xPoint]){
                        let newGoodAnswerCounter= goodAnswerCounter;
                        newGoodAnswerCounter +=1 ;
                        setGoodAnswerCounter(newGoodAnswerCounter)
                        setGoodAnswerCoord([...goodAnswerCoord, [yPoint, xPoint]]);
                        let newNumberOfCase = numberOfCase +1;
                        setNumberOfCase(newNumberOfCase);
                    }
                    else{
                        let newBadAnswerCounter=badAnswerCounter;
                        newBadAnswerCounter += 1;
                        setBadAnswerCounter(newBadAnswerCounter)
                        setBadAnswerCoord([...badAnswerCoord, [yPoint, xPoint]]);
                        let newNumberOfCase = numberOfCase +1;
                        setNumberOfCase(newNumberOfCase);
                    }
                }
                if(xPoint !== finalMatrix[0].length){
                    let newX = xPoint +1;
                    setXPoint(newX)
                }
            }
            //End of the line and return to next line
            else{
                setXPoint(0);
                let newY =yPoint +1;
                setYPoint(newY)
            }
        }
        else{
            let newX = xPoint +1;
            setXPoint(newX)
        }
    }

    /**
     * useEffect that allows the update (call change()) if one of the dependencies value changes.
     */
    useEffect(() => {
        // eslint-disable-next-line
        change()
        // eslint-disable-next-line
    }, [visibleCase,gamemode,sequence1,sequence2]);

    /**
     * useEffect that reset the whole parameters of the gameMode in case of change in the dependencies (to avoid unexpected behaviour)
     */
    useEffect(() => {
        resetGamemode2Param()
        resetGamemode1Param()
        setClickableCases([[sequence1.length,sequence2.length]])
        setGreenCasesList([[sequence1.length,sequence2.length]]);
        setRedCasesList([]);
        if(sequence2.length === 0 || sequence1.length === 0){
            setGameModeActivation(true);
        }
        else{
            // eslint-disable-next-line
            setGameModeActivation(false);
        }
        // eslint-disable-next-line
    }, [sequence1,sequence2,match,mismatch,gap]);

    /**
     * Check in the matrix if there is value on the left, on upper left and on top
     * and return a list of the coordinates of the clickable cases
     * @param gameMode2Coord
     * @returns {(*|number)[]|number[]|*[]|(number|*)[]}
     */
    function leftDiagUpCheck(gameMode2Coord){
        let y = gameMode2Coord[0];
        let x = gameMode2Coord[1];
        if(finalMatrix === undefined || finalMatrix[y] === undefined || finalMatrix[y-1] === undefined ){
            return([0,0,0,0])
        }
        else{
        if(y === 0 && x !== 0){
            return([finalMatrix[y][x-1],0,0,finalMatrix[y][x]]);
        }
        else if(y !== 0 && x === 0){
            return([0,0,finalMatrix[y-1][x],finalMatrix[y][x]]);
        }
        else if(y===0 && x===0){
            return([0,0,0,finalMatrix[y][x]]);
        }
        else{
            return([finalMatrix[y][x-1],finalMatrix[y-1][x-1],finalMatrix[y-1][x],finalMatrix[y][x]])
        }
        }

    }

    /**
     * Checks if the box chosen by the user is clickable before taking an action.
     * @param rowIndex
     * @param colIndex
     */
    const handleClickableCase = (rowIndex,colIndex) => {
        if (gamemode && clickableCases.some(cases => cases[0] === rowIndex && cases[1] === colIndex)) {
            handlePaperAnswerButtonClick(rowIndex, colIndex);
        }
    }

    /**
     * Determines the value displayed by the box depending on its game mode.
     * @param item
     * @param rowIndex
     * @param colIndex
     * @returns {*|string}
     */
    const determineValue = (item,rowIndex,colIndex) => {
        if(gamemode) {
            return(item);
        }
        else{
            if (yPoint === rowIndex && xPoint === colIndex) {
                return('?');
            }
            else {
                if ( visibleCase.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) {
                    return(item);
                }
                else {
                    return('');
                }
            }
        }
    }

    /**
     * Determines and return the color that the case should display depending on its game mode.
     * Return a red color if the user made a mistake, or green/white if the user made the right choice
     * Return a light blue color when the answer must be guessed.
     * @param rowIndex
     * @param colIndex
     * @returns {string}
     */
    const determineCaseColor = (rowIndex,colIndex) => {
        //Game mode Optimal Path Discovery
        if(gamemode) {
            if(redCasesList.some(coord => coord[0] === rowIndex && coord[1] === colIndex)){
                return('red');
            }
            else{
                if(clickableCases.some(coord => coord[0] === rowIndex && coord[1] === colIndex)){
                    return('lightblue');
                }
                else{
                    if(greenCasesList.some(coord => coord[0] === rowIndex && coord[1] === colIndex)){
                        return('green');
                    }
                    else{
                        return('white');
                    }
                }
            }
        }
        //Game mode Scores matrix filling
        else{
            if(yPoint === rowIndex && xPoint === colIndex){
                return('lightblue');
            }
            else{
                if(badAnswerCoord.some(coord => coord[0] === rowIndex && coord[1] === colIndex)){
                    return('red');
                }
                else{
                    return('white');
                }
            }
        }
    }

    /**
     * Return the color of the cases from the Help Matrix
     * @param rowIndex
     * @param colIndex
     * @returns {string}
     */
    const determineHelpCaseColor = (rowIndex,colIndex) => {
        if(rowIndex === 0 && colIndex === 0){
            return('aqua');
        }
        else if(rowIndex === 1 && colIndex === 0 ){
            return('fuchsia');
        }
        else if(rowIndex === 0 && colIndex === 1){
            return ('lime');
        }
        else{
            return('white');
        }
    }

    /**
     * Will return the information about match or mismatch for the help of the first game mode
     * @returns {Element}
     */
    const helpMatchMismatchDisplayer = () => {
        if(sequence1[yPoint-1] === sequence2[xPoint-1]){
            return(<span style={{color: 'green'}}>{match + " (match)"}  <span style={{color: 'black'}}> =
                {finalMatrix[yPoint-1][xPoint-1] + match}</span> </span>)
        }
        else{
            return(<span style={{color: 'red'}}>{mismatch + " (mismatch) "} <span style={{color: 'black'}}> =
                { finalMatrix[yPoint-1][xPoint-1] + mismatch}</span></span>)
        }
    }

    /**
     * Will return the information about match or mismatch for the help of the second game mode
     * @returns {string}
     */
    const help2MatchMismatchDisplayer = () => {
        if (leftDiagUpCheck(gameMode2Coord)[3] - leftDiagUpCheck(gameMode2Coord)[1] === match && sequence1[gameMode2Coord[0]-1] === sequence2[gameMode2Coord[1]-1]){
            return('   <- accepted (= match)');
        }
        else {
            if(leftDiagUpCheck(gameMode2Coord)[3] - leftDiagUpCheck(gameMode2Coord)[1] === mismatch && sequence1[gameMode2Coord[0]-1] !== sequence2[gameMode2Coord[1]-1]){
                return('   <- accepted (= mismatch)');
            }
            else{
                return('');
            }
        }
    }



    /**
     * This functions updates the components everytime there is an action or that one of the dependance of the
     * useEffect has changed.
     */
    const change =() =>{
        generateHelpMatrix();
        setDisplayedMatrix(() =>
            <Box>
                <Grid container spacing={0.5}>
                    {matrix[1].map((row, rowIndex) => (
                        <Grid item xs={100} key={rowIndex}>
                            <Grid container spacing={0.5} style={{ flexWrap: 'nowrap' }}>
                                {row.map((item, colIndex) => (
                                    <Grid item
                                        key={colIndex}
                                        onClick={() => handleClickableCase(rowIndex, colIndex)}>
                                        <Case
                                            key={[rowIndex, colIndex]}
                                            value={determineValue(item,rowIndex,colIndex)}
                                            color={determineCaseColor(rowIndex,colIndex)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
        //Updating the Sequence 2 display
        setDisplayedSeq(<DisplayedSeq sequence2={sequence2} />);
        //Updating the Sequence 1 display
        setDisplayedOtherSeq(<DisplayedOtherSeq sequence1={sequence1} />);

        setDisplayedHelpMatrix(() => (
            <Box>
                <Grid container spacing={0.5}>
                    {helpMatrixCoord.map((row, rowIndex) => (
                        <Grid item xs={100} key={rowIndex}>
                            <Grid container spacing={0.5}>
                                {row.map((item, colIndex) => (
                                    <Grid item  key={colIndex}>
                                        <Case
                                            key={[rowIndex, colIndex]}
                                            value={determineValue(item,rowIndex,colIndex)}
                                            color={determineHelpCaseColor(rowIndex,colIndex)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        ));
    }

    /**
     * UI component: Complete displayed matrix made up of other elements
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
     * UI component: Help of the game mode 2
     * @type {React.JSX.Element}
     */
    let fullHelp2 = () =>{
        let currentValue = leftDiagUpCheck(gameMode2Coord)[3];
        let leftValue = leftDiagUpCheck(gameMode2Coord)[0];
        let topValue = leftDiagUpCheck(gameMode2Coord)[2];
        let diagValue = leftDiagUpCheck(gameMode2Coord)[1];
        return(
            <div className={mainstyles.game2HelpFont}>
            <div>
                <span style={{color: 'green'}}>Current case</span> :  <span style={{color: 'green'}}>{currentValue}</span>
                <div/>
                <span style={{color: 'blue'}}>Upper case</span> :  <span style={{color: 'green'}}>{currentValue}</span> - <span style={{color: 'blue'}}> ({topValue})</span>  = {currentValue - topValue}
                {(currentValue - topValue) === gap ? '   <- accepted (= gap)' : ''}
                <div/>
                <span style={{color: 'blueviolet'}}>Diagonal case</span> :  <span style={{color: 'green'}}>{currentValue}</span> - <span style={{color: 'blueviolet'}}>({diagValue})</span>
                <span> = {currentValue - diagValue} {help2MatchMismatchDisplayer()}</span>
                <div/>
                <span style={{color: 'cornflowerblue'}}>Left case</span> :  <span style={{color: 'green'}}>{currentValue}</span> - <span style={{color: 'cornflowerblue'}}>({leftValue})</span>  = {currentValue-leftValue}
                {(currentValue - leftValue) === gap ? '   <- accepted (= gap)' : ''}
            </div>
        </div>)
    }

    /**
     * UI component: Help matrix of the game mode 1
     * @type {React.JSX.Element}
     */
    let fullHelpMatrix = (
        <div>
            <div className={mainstyles.fullMatrixVert}>
                {displayedHelpSeq2}
            </div>
            <div className={mainstyles.fullMatrixHoriz}>
                <React.Fragment>
                    <Grid item >
                        {displayedHelpSeq1}
                    </Grid>
                    <Grid item>
                        {displayedHelpMatrix}
                    </Grid>
                </React.Fragment>
            </div>
        </div>
    );

    /**
     * UI component: Help text of the game mode 1
     * @type {React.JSX.Element}
     */
    let helpText1 =
        <div className={mainstyles.game1HelpFont}>
            {xPoint === 0 && (
                <div>
                    <span style={{color: 'lime'}}>TOP VALUE</span> =
                    <span style={{color: 'lime'}}>{yPoint === 0 ? "0" : finalMatrix[yPoint-1][xPoint]}</span> +
                    <span style={{color: 'orange'}}>{gap + " (gap) "}</span> = ?
                </div>
            )}
            {yPoint === 0 && (
                <div>
                    <span style={{color: 'fuchsia'}}>LEFT VALUE</span> =
                    <span style={{color: 'fuchsia'}}>{yPoint === 0 ? "0" : finalMatrix[yPoint][xPoint-1]}</span> +
                    <span style={{color: 'orange'}}>{gap + " (gap) "}</span> = ?
                </div>
            )}
            {(xPoint !== 0 && yPoint !== 0) && (
                <div>
                    <span style={{color: 'lime'}}>TOP VALUE</span> =
                    <span style={{color: 'lime'}}>{yPoint === 0 ? "0" : finalMatrix[yPoint-1][xPoint]}</span> +
                    <span style={{color: 'orange'}}>{gap + " (gap) "}</span> =
                    <span> {finalMatrix[yPoint-1][xPoint] + gap} </span>
                <div/>
                    <span style={{color: 'aqua'}}>DIAGONAL VALUE</span> =
                    <span style={{color: 'aqua'}}>{(yPoint === 0 || xPoint===0) ? "0" : finalMatrix[yPoint-1][xPoint-1]}</span> +
                    {helpMatchMismatchDisplayer()}
                        <div/>
                    <span style={{color: 'fuchsia'}}>LEFT VALUE</span> =
                    <span style={{color: 'fuchsia'}}>{yPoint === 0 ? "0" : finalMatrix[yPoint][xPoint-1]}</span> +
                    <span style={{color: 'orange'}}>{gap + " (gap) "}</span> =
                    <span> {finalMatrix[yPoint][xPoint-1] + gap} </span>
                </div>
                )}
            </div>

    /**
     * UI component: Complete help of gamemode 1 (matrix + text)
     * @type {React.JSX.Element}
     */
    let helperElem1 =
        <Box
            className={mainstyles.gameHelpBorderBox}
            sx={{p: 2}}>
            <div className={mainstyles.rowDisposition}>
                {fullHelpMatrix}
                {helpText1}
            </div>
        </Box>


    /**
     * UI component: Complete help of the game mode 2
     * @type {React.JSX.Element}
     */
    let helperElem2 =
        <Box
            className={mainstyles.gameHelpBorderBox}
            sx={{ p: 2}}>
            <div>
                {fullHelp2()}
            </div>
        </Box>

    /**
     * UI component: Input for the user guess the answer
     * @type {React.JSX.Element}
     */
    let inputAnswer =
        <TextField
            className={mainstyles.paramBox}
            label = "Your answer"
            variant="outlined"
            type="number"
            id="answer"
            value={answeredValue}
            onChange={(e) => {
                const newAnsweredValue = e.target.value
                setAnsweredValue(+newAnsweredValue)
            }}
            disabled={gamemode}
        />

    /**
     * UI component: Submit answer button
     * @type {React.JSX.Element}
     */
    const submitAnswerButton =
        <Button variant="outlined" style ={{
            height: '55px'
        }}
                disabled={!gamemode ? gameModeActivation : true}
                onClick={() =>
            handleSubmitAnswerButtonClick()
        }>Submit Answer</Button>

    /**
     * UI component: Reset game parameters button
     * @type {React.JSX.Element}
     */
    const resetGameButton =
        <Button variant="outlined" style ={{
            height: '55px',
            width: '80px'
        }} onClick={() =>
            handleResetButton()
        }>Restart</Button>

    /**
     * UI component: Display component of the sequences input
     * @type {React.JSX.Element}
     */
    const sequenceBox =
        <div className={mainstyles.spaceInterInput}>
                <TextField
                    className={mainstyles.sequenceBox}
                    id="sequence1"
                    label="Sequence 1"
                    variant="outlined"
                    type="text"
                    value={sequence1}
                    inputProps={{maxLength: 1000}} //Limit the length of the input text (here size of 1000 characters)
                    onChange={(e) => {
                        setSequence1(e.target.value)
                    }}
                />
                <TextField
                    className={mainstyles.sequenceBox}
                    id="sequence2"
                    label="Sequence 2"
                    variant="outlined"
                    type="text"
                    value={sequence2}
                    inputProps={{maxLength: 1000}} //Limit the length of the input text (here size of 1000 characters)
                    onChange={(e) => {
                        setSequence2(e.target.value)
                    }}
                />
        </div>

    /**
     * UI component: Parameters textfield input for changing the value of the Match, Mismatch and Gap
     * @type {React.JSX.Element}
     */
    let paramButton =
        <div className={mainstyles.spaceInputParam}>
            <TextField
                className={mainstyles.paramBox}
                type="number"
                id="match"
                label = "Match"
                variant="outlined"
                value={match}
                   onChange={(e) => {
                       const newMatch = e.target.value
                       setMatch(+newMatch)
                   }}
            />

            <TextField
                className={mainstyles.paramBox}
                type="number"
                id="mismatch"
                label = "Mismatch"
                variant="outlined"
                value={mismatch}
                onChange={(e) => {
                    const newMismatch = e.target.value
                    setMismatch(+newMismatch)
                }}
            />
            <TextField
                className={mainstyles.paramBox}
                label = "Gap"
                variant="outlined"
                type="number"
                id="gap"
                value={gap}
                onChange={(e) => {
                    const newGap = e.target.value
                    setGap(+newGap)
                }}
            />
        </div>

    /**
     * UI component: Game mode title
     * @type {React.JSX.Element}
     */
    const gameModeTitle =
        <div className={mainstyles.gameModeTitleFont}>
            {gamemode ? "Optimal path discovery" : "Score matrix filling"}
        </div>

    /**
     * UI component: Buttons that allows to change when being clicked on the gamemode
     * @type {React.JSX.Element}
     */
    let gameModeButtons =
        <div className={mainstyles.rowDisposition}>
            <ToggleButtonGroup
                className={mainstyles.inputFile}
                value={gamemode}
                exclusive
                onChange={() => {
                    setGamemode(!gamemode);
                    handleResetButton();
                }}
            >
                <ToggleButton value={false} >
                    Mode 1
                </ToggleButton>
                <ToggleButton value={true} >
                    Mode 2
                </ToggleButton>
            </ToggleButtonGroup>
        </div>

    /**
     * UI component: Right part of the game component
     * @type {React.JSX.Element}
     */
    const rightElement =
        <Box >
            <Grid container direction="column"  spacing={3}>
                <Grid item>
                    {gameModeTitle}
                </Grid>
                <Grid item>
                    <div className={mainstyles.rowDisposition} style={{gap: '15px'}}>
                        {gameModeButtons}
                        {resetGameButton}
                    </div>
                </Grid>
                <Grid item>
                    {sequenceBox}
                </Grid>
                <Grid item>
                    {paramButton}
                </Grid>
                <Grid item>
                    <hr className={mainstyles.horizontalBorder} />
                </Grid>
                <Grid item>
                    <div className={mainstyles.rowDisposition} style={{gap: '5px'}}>
                    {inputAnswer}
                    {submitAnswerButton}
                    </div>
                </Grid>
                <Grid item>
                    <div className={mainstyles.gameResultFont}>
                        Good answers : {goodAnswerCounter}
                        <div className={mainstyles.smallSpaceUp}/>
                        Wrong answers : {badAnswerCounter}
                        <div className={mainstyles.smallSpaceUp}/>
                        Accuracy : {badAnswerCounter === 0 ? 100 : ((goodAnswerCounter) / (goodAnswerCounter + badAnswerCounter ) * 100).toFixed(2)}%
                    </div>
                </Grid>


            </Grid>
        </Box>

    return (
        <div>
            <div style={{marginTop: '30px'}}>
                <Box
                    className={mainstyles.blosumBorderBox}
                    sx={{p: 2}}>
                    <div className={mainstyles.spaceBetweenGameAndParam}>
                        <Box
                            className={mainstyles.matrixBorderBox}
                            sx={{ p: 2}}
                        >
                            {FullMatrix}
                        </Box>
                        {rightElement}
                    </div>
                </Box>
            </div>
            <div
                className={mainstyles.centeredElem}
                style={{marginTop: '20px',marginBottom: '20px'}}>
                <Box>
                    <Grid container direction="column" alignItems="center">
                        <Grid item sx={{ width: '80%' }}>
                            <hr className={mainstyles.horizontalBorder} />
                        </Grid>
                        <Grid item>
                            <label className={mainstyles.fontHelpTitle}>HELP</label>
                        </Grid>
                        <Grid item sx={{ width: '40%' }}>
                            <hr className={mainstyles.horizontalBorder} />
                        </Grid>
                        <Grid item sx={{marginTop:'10px'}}>
                            {gamemode ? helperElem2 : helperElem1}
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div>
    );
}