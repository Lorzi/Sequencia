import * as React from "react";
import {NeedleManWunschScript} from "./NeedleManWunschScript";
import {useEffect, useState} from "react";
import {Box, Button, Grid, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {Case} from "./Case";
import {determineArrowedMatrix, findPaths} from "./NeedleManOptimalPath_V2";
import {DisplayedOtherSeq, DisplayedSeq, mergePaths} from "./utils";

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
     * @type {React.JSX.Element}
     */
    const displayedHelpSeq2 =
        <Box sx={{ width: '100%', margin: '0' }}>
            <Grid container spacing={0.5} style={{ flexWrap: 'nowrap' }}>
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
     * @type {React.JSX.Element}
     */
    const displayedHelpSeq1 =
        <Box sx={{ width: '100%', margin: '0' }}>
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
     * This function manages the entire game mode number 1 and compares the entered answers
     * with the real answers and continues the game accordingly.
     */
    const handleSubmitAnswerButtonClick = () =>{
        setVisibleCase([...visibleCase, [yPoint, xPoint]]);
        if(answeredValue === finalMatrix[yPoint][xPoint]){
            let newGoodAnswerCounter= goodAnswerCounter;
            newGoodAnswerCounter +=1 ;
            setGoodAnswerCounter(newGoodAnswerCounter)
            setGoodAnswerCoord([...goodAnswerCoord, [yPoint, xPoint]]);
            let newNumberOfCase = numberOfCase +1;
            setNumberOfCase(newNumberOfCase);

        }
        else {
            if(xPoint >= finalMatrix[0].length-1 && yPoint >= finalMatrix.length-1){ //If it's the end of the game
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
        if(xPoint >= finalMatrix[0].length-1){
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
     * useEffect that allows the update (call change()) if one of the dependances value changes.
     */
    useEffect(() => {
        // eslint-disable-next-line
        change()
        // eslint-disable-next-line
    }, [visibleCase,gamemode,sequence1,sequence2]);

    /**
     * useEffect that reset the whole parameters of the gameMode in case of changement in the dependances (to avoid unexpected behaviour)
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
     *
     * @param gameMode2Coord
     * @returns {(*|number)[]|number[]|*[]|(number|*)[]}
     */
    function leftDiagUpCheck(gameMode2Coord){
        let y = gameMode2Coord[0];
        let x = gameMode2Coord[1];
        if(finalMatrix === undefined || finalMatrix[y] === undefined || finalMatrix[y-1] === undefined ){
            console.log("undefined")
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
     * This functions updates the components everytime there is an action or that one of the dependance of the
     * useEffect has changed.
     */
    const change =() =>{

        generateHelpMatrix();
        setDisplayedMatrix(() =>
            <Box sx={{ width: '100%', margin: '0' }}>

                <Grid container spacing={0.5}>
                    {matrix[1].map((row, rowIndex) => (
                        <Grid item xs={100} key={rowIndex}>
                            <Grid container spacing={0.5} style={{ flexWrap: 'nowrap' }}>
                                {row.map((item, colIndex) => (

                                    <Grid item  key={colIndex} onClick={(gamemode && clickableCases.some(cases => cases[0] === rowIndex && cases[1] === colIndex)) ? () => handlePaperAnswerButtonClick(rowIndex, colIndex) : () => console.log("yes")}>
                                        <Case
                                            key={[rowIndex, colIndex]}
                                            value={(gamemode) ? item : (yPoint === rowIndex && xPoint === colIndex) ? '?' :
                                                visibleCase.some(coord => coord[0] === rowIndex && coord[1] === colIndex) ? item : ""}
                                            color={(gamemode) ? (redCasesList.some(coord => coord[0] === rowIndex && coord[1] === colIndex) ? 'red'  :
                                                (clickableCases.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) ? 'lightblue':
                                                (greenCasesList.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) ? 'green' : 'white') :
                                                (yPoint === rowIndex && xPoint === colIndex) ? 'lightblue' :
                                                    (badAnswerCoord.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) ? 'coral' : 'white'}
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
            <Box sx={{ width: '100%', margin: '0' }}>
                <Grid container spacing={0.5}>
                    {helpMatrixCoord.map((row, rowIndex) => (
                        <Grid item xs={100} key={rowIndex}>
                            <Grid container spacing={0.5} style={{ flexWrap: 'nowrap' }}>
                                {row.map((item, colIndex) => (

                                    <Grid item  key={colIndex} onClick={(gamemode && clickableCases.some(cases => cases[0] === rowIndex && cases[1] === colIndex)) ? () => handlePaperAnswerButtonClick(rowIndex, colIndex) : () => console.log("yes")}>
                                        <Case
                                            key={[rowIndex, colIndex]}
                                            value={(gamemode) ? item : (yPoint === rowIndex && xPoint === colIndex) ? "" :
                                                visibleCase.some(coord => coord[0] === rowIndex && coord[1] === colIndex) ? item : ""}
                                            color={rowIndex === 0 && colIndex === 0 ? 'aqua' : rowIndex === 1 && colIndex === 0 ? 'fuchsia' : rowIndex === 0 && colIndex === 1 ? 'lime' : 'white'}
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
    /**
     * UI component: Help of the game mode 2
     * @type {React.JSX.Element}
     */
    let fullHelp2 = (
        <div style={{fontSize: '1.5rem', marginTop: '9px'}}>
            <div>
                <span style={{color: 'green'}}>Case actuelle</span> :  <span style={{color: 'green'}}>{leftDiagUpCheck(gameMode2Coord)[3]}</span>
                <div/>
                <span style={{color: 'blue'}}>Case du haut</span> :  <span style={{color: 'green'}}>{leftDiagUpCheck(gameMode2Coord)[3]}</span> -  <span style={{color: 'blue'}}> ({leftDiagUpCheck(gameMode2Coord)[2]})</span>  = {leftDiagUpCheck(gameMode2Coord)[3]-leftDiagUpCheck(gameMode2Coord)[2]} {leftDiagUpCheck(gameMode2Coord)[3] - leftDiagUpCheck(gameMode2Coord)[2] === gap ? '   <- acceptée car = gap' : ''}
                <div/>
                <span style={{color: 'blueviolet'}}>Case diagonale</span> :  <span style={{color: 'green'}}>{leftDiagUpCheck(gameMode2Coord)[3]}</span> - <span style={{color: 'blueviolet'}}> ({leftDiagUpCheck(gameMode2Coord)[1]})</span>  = {leftDiagUpCheck(gameMode2Coord)[3] - leftDiagUpCheck(gameMode2Coord)[1]} {(leftDiagUpCheck(gameMode2Coord)[3] - leftDiagUpCheck(gameMode2Coord)[1] === match && sequence1[gameMode2Coord[0]-1] === sequence2[gameMode2Coord[1]-1]) ? '   <- acceptée car = match' : leftDiagUpCheck(gameMode2Coord)[3] - leftDiagUpCheck(gameMode2Coord)[1] === mismatch && sequence1[gameMode2Coord[0]-1] !== sequence2[gameMode2Coord[1]-1] ? '   <- acceptée car = mismatch' : ''}
                <div/>
                <span style={{color: 'cornflowerblue'}}>Case de gauche</span> :  <span style={{color: 'green'}}>{leftDiagUpCheck(gameMode2Coord)[3]}</span> - <span style={{color: 'cornflowerblue'}}>({leftDiagUpCheck(gameMode2Coord)[0]})</span>  = {leftDiagUpCheck(gameMode2Coord)[3]-leftDiagUpCheck(gameMode2Coord)[0]} {leftDiagUpCheck(gameMode2Coord)[3] - leftDiagUpCheck(gameMode2Coord)[0] === gap ? '   <- acceptée car = gap' : ''}
            </div>
        </div>
    );

    /**
     * UI component: Help matrix of the game mode 1
     * @type {React.JSX.Element}
     */
    let fullHelpMatrix = (
        <div>
            <div style={{ marginBottom: '0.25rem' }}>
                {displayedHelpSeq2}
            </div>
            <div className="horizontal-matrix" style={{ display: 'flex', flexDirection: 'row', gap: '0.25rem' }}>
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
        <div style={{fontSize: '1.3rem', marginTop: '25px'}}>
            {xPoint === 0 && (
                <div>
                    <span style={{color: 'lime'}}>TOP VALUE</span> = <span style={{color: 'lime'}}>{yPoint === 0 ? "0" : finalMatrix[yPoint-1][xPoint]}</span> + <span style={{color: 'orange'}}>{gap + " (gap) "}</span> = ?
                </div>
            )}
            {yPoint === 0 && (
                <div>
                    <span style={{color: 'fuchsia'}}>LEFT VALUE</span> = <span style={{color: 'fuchsia'}}>{yPoint === 0 ? "0" : finalMatrix[yPoint][xPoint-1]}</span> + <span style={{color: 'orange'}}>{gap + " (gap) "}</span> = ?
                </div>
            )}
            {(xPoint !== 0 && yPoint !== 0) && (
                <div>
                <span style={{color: 'lime'}}>TOP VALUE</span> = <span style={{color: 'lime'}}>{yPoint === 0 ? "0" : finalMatrix[yPoint-1][xPoint]}</span> + <span style={{color: 'orange'}}>{gap + " (gap) "}</span> = <span> {finalMatrix[yPoint-1][xPoint] + gap} </span>
                <div/>
                    <span style={{color: 'aqua'}}>DIAGONAL VALUE</span> = <span style={{color: 'aqua'}}>{(yPoint === 0 || xPoint===0) ? "0" : finalMatrix[yPoint-1][xPoint-1]}</span> + {sequence1[yPoint-1] === sequence2[xPoint-1] ? <span style={{color: 'green'}}>{match + " (match)"}  <span style={{color: 'black'}}>= { finalMatrix[yPoint-1][xPoint-1] + match}</span> </span>  : <span style={{color: 'red'}}>{mismatch + " (mismatch) "} <span style={{color: 'black'}}>= { finalMatrix[yPoint-1][xPoint-1] + mismatch}</span></span>}
                        <div/>
                        <span style={{color: 'fuchsia'}}>LEFT VALUE</span> = <span style={{color: 'fuchsia'}}>{yPoint === 0 ? "0" : finalMatrix[yPoint][xPoint-1]}</span> + <span style={{color: 'orange'}}>{gap + " (gap) "}</span> = <span> {finalMatrix[yPoint][xPoint-1] + gap} </span>
                </div>
                )}
            </div>

    /**
     * UI component: Complete help of gamemode 1 (matrix + text)
     * @type {React.JSX.Element}
     */
    let helperElem1 =
        <Grid container direction="column"  spacing={4}>
            <Grid item>
                <div style={{
                    fontSize: '1.4rem',
                    position: 'relative',
                    top: '20px', // Positionne l'élément au milieu de la hauteur de l'écran
                    left: '00px', // Positionne l'élément juste à droite de upElement avec un espacement de 20px

                    fontFamily: 'Arial',
                }}>
                </div>
            </Grid>
            <Grid item>
                <Box
                    component="section"
                    sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 650 ,height: 150, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
                <div style={{ display: 'flex', flexDirection: 'row', gap:'0px'}}>
                    {fullHelpMatrix}
                    {helpText1}
                </div>
                    </Box>
            </Grid>

        </Grid>

    /**
     * UI component: Complete help of the game mode 2
     * @type {React.JSX.Element}
     */
    let helperElem2 =
        <Grid container direction="column"  spacing={4}>
            <Grid item>
                <div style={{
                    fontSize: '1.4rem',
                    position: 'relative',
                    top: '20px', // Positionne l'élément au milieu de la hauteur de l'écran
                    left: '00px', // Positionne l'élément juste à droite de upElement avec un espacement de 20px

                    fontFamily: 'Arial',
                }}>
                </div>
            </Grid>
            <Grid item>
                <Box
                    component="section"
                    sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 650 ,height: 150, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap:'0px'}}>
                        {fullHelp2}
                    </div>
                </Box>
            </Grid>

        </Grid>

    /**
     * UI component: Input for the user guess the answer
     * @type {React.JSX.Element}
     */
    let inputAnswer =
        <TextField
            label = "Votre réponse"
            variant="outlined"
            type="number"
            id="answer"
            value={answeredValue}
            onChange={(e) => {

                const newAnsweredValue = e.target.value
                setAnsweredValue(+newAnsweredValue)
            }
            }
            disabled={gamemode}
            style={{
                width: '100px',
                height: '55px',
                outline: 'none',
                transition: 'box-shadow 0.3s',
            }}
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
        }>Soumettre réponse</Button>

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
        <div style={{ display: 'flex', flexDirection: 'COLUMN', gap:'5px'}}>
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

                    inputProps={{maxLength: 1000}} //Limit the length of the input text (here size of 1000 characters)
                    onChange={(e) => {
                        setSequence1(e.target.value)
                    }}
                />
            <div style={{marginLeft: '0px', margin: '0px'}}/>
                    <TextField id="sequence2" label="Sequence 2" variant="outlined"
                               type="text"
                               value={sequence2}
                               style={{
                                   width: '300px',
                                   outline: 'none',
                                   transition: 'box-shadow 0.3s',
                               }}
                               inputProps={{maxLength: 1000}} //Limit the length of the input text (here size of 15 characters)
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
        <div style = {{ display: 'flex', flexDirection: 'row', margin: '0px', gap: '5px'}}>
            <div style={{ position: 'relative' }}>
                <TextField
                    type="number"
                    id="match"
                    label = "Match"
                    variant="outlined"
                    value={match}
                    onChange={(e) => {
                        const newMatch = e.target.value
                        setMatch(+newMatch)
                    }
                }
                    style={{
                        width: '100px',
                        height: '55px',
                        outline: 'none',
                        transition: 'box-shadow 0.3s',
                    }}
                />
            </div>
            <div style={{ position: 'relative' }}>
                <TextField
                    type="number"
                    id="mismatch"
                    label = "Mismatch"
                    variant="outlined"
                    value={mismatch}
                    onChange={(e) => {
                        const newMismatch = e.target.value
                        setMismatch(+newMismatch)
                    }
                }
                    style={{
                        width: '100px',
                        height: '55px',
                        outline: 'none',
                        transition: 'box-shadow 0.3s',
                    }}
                />
            </div>

            <div style={{ position: 'relative' }}>
                <TextField
                    label = "Gap"
                    variant="outlined"
                    type="number"
                    id="gap"
                    value={gap}
                    onChange={(e) => {
                        const newGap = e.target.value
                        setGap(+newGap)
                    }
                    }
                    style={{
                        width: '100px',
                        height: '55px',
                        outline: 'none',
                        transition: 'box-shadow 0.3s',
                    }}
                />
            </div>
        </div>

    /**
     * UI component: Game mode title
     * @type {React.JSX.Element}
     */
    const gameModeTitle =
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '20px',
            position: 'relative',
            top: '0px', // Positionne l'élément au milieu de la hauteur de l'écran
            left: '00px', // Positionne l'élément juste à droite de upElement avec un espacement de 20px

            fontFamily: 'Arial',
        }}>
            {gamemode ? "Découverte chemin optimal" : "Remplissage matrice score"}
        </div>

    /**
     * UI component: Buttons that allows to change when being clicked on the gamemode
     * @type {React.JSX.Element}
     */
    let gameModeButtons =

        <div style = {{ display: 'flex', flexDirection: 'row', gap: '0px'}}>
            <ToggleButtonGroup
                value={gamemode}
                exclusive
                style={{
                    width: '200px',
                    height: '55px',
                    outline: 'none',
                    transition: 'box-shadow 0.3s',
                }}
                onChange={() => {
                    setGamemode(!gamemode);
                    handleResetButton();
                }}
                aria-label="toggle-button-group"
            >
                <ToggleButton value={false} aria-label="activated">
                    Mode 1
                </ToggleButton>
                <ToggleButton value={true} aria-label="deactivated">
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
            <Grid container direction="column"  spacing={4}>
                <Grid item>
                    {gameModeTitle}
                </Grid>
                <Grid item>
                    <div style = {{ display: 'flex', flexDirection: 'row', margin: '0px', gap: '15px'}}>
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
                    <hr style={{ borderTop: '1px solid #ccc' }} />
                </Grid>
                <Grid item>
                    <div style = {{ display: 'flex', flexDirection: 'row', margin: '0px', gap: '5px'}}>
                    {inputAnswer}
                    {submitAnswerButton}
                    </div>
                </Grid>
                <Grid item>
                    <div style={{
                        fontSize: '23px',
                        position: 'relative',
                        top: '20px', // Positionne l'élément au milieu de la hauteur de l'écran
                        left: '00px', // Positionne l'élément juste à droite de upElement avec un espacement de 20px
                        color: 'dimgrey',
                        fontFamily: 'Arial',
                    }}>
                        Bonnes réponses : {goodAnswerCounter}
                        <div style={{marginTop:'15px'}}/>
                        Mauvaises réponses : {badAnswerCounter}
                        <div style={{marginTop:'15px'}}/>
                        Precision : {badAnswerCounter === 0 ? 100 : ((goodAnswerCounter) / (goodAnswerCounter + badAnswerCounter ) * 100).toFixed(2)}%
                    </div>
                </Grid>


            </Grid>
        </Box>


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' , gap: '10Vh',marginTop: '30px'  }}>
            <Box
                component="section"
                sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 1200, height: 700, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}
            >
            <div style={{ display: 'flex', justifyContent: 'center' , gap: '10Vh',marginTop: '30px'  }}>
            <Box
                component="section"
                sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 600, height: 600, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}
            >
                {FullMatrix}
            </Box>
                {rightElement}

            </div>
            </Box>

            </div>
            <div style={{ display: 'flex', justifyContent: 'center' , gap: '20Vh',marginTop: '20px'  }}>
            <Box component="section"
                 sx={{ p: 2,justifyContent: 'center',borderRadius: '16px', overflowX: 'auto' }}>
                <Grid container direction="column"  spacing={0} alignItems="center">
                    <Grid item style={{ width: '80%' }}>
                        <hr style={{ borderTop: '1px solid #ccc', width: '100%' }} />
                    </Grid>
                    <Grid item>
                        <label  style={{ textAlign: 'center', fontSize: '25px', color: 'dimgrey'  }}>AIDE</label>
                    </Grid>
                    <Grid item style={{ width: '80%' }}>
                        <hr style={{ borderTop: '1px solid #ccc', width: '40%' }} />
                    </Grid>
                    <Grid item>
                        {gamemode ? helperElem2 : helperElem1}
                    </Grid>

                </Grid>
            </Box>
            </div>
        </div>
    );
}