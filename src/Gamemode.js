import * as React from "react";
import {NeedleManWunschScript} from "./NeedleManWunschScript";
import {useEffect, useState} from "react";
import {Box, Button, Grid, TextField} from "@mui/material";
import {Case} from "./Case";
import {LetterLine} from "./LetterLine";
import {determineArrowedMatrix, findPaths} from "./NeedleManOptimalPath_V2";

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
    const [gamemode,setGamemode] = useState(true);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const mergedAllPath = allPath.reduce((merged, current) => {
            current.forEach(path => {
                if (!merged.includes(path)) {
                    merged.push(path);
                }
            });
            return merged;
        }, []);
        setOptimizedCasesList(mergedAllPath);
    }, [gamemode,greenCasesList]);

    const [displayed_matrix,setDisplayedMatrix] = useState(
        <Box>
        </Box>
    );
    const [displayedHelpMatrix,setDisplayedHelpMatrix] = useState(
        <Box>
        </Box>
    );

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

    const handlePaperAnswerButtonClick = (y,x) =>{
        console.log(optimizedCasesList)
        console.log(y,x)
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

    const resetCommonParam = () =>{
        setGoodAnswerCounter(0);
        setBadAnswerCounter(0);
    }

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
    const resetGamemode2Param = () =>{
        setGreenCasesList([[sequence1.length,sequence2.length]]);
        setRedCasesList([]);
        setClickableCases([[sequence1.length,sequence2.length]]);
        resetCommonParam();
    }

    const handleSwitchGamemodeButton = () =>{
        if(gamemode){
            resetGamemode1Param();
        }
        else{
            resetGamemode2Param();
        }


        setGamemode(!gamemode);
    }
    const handleResetButton = () =>{
        resetGamemode1Param();
        resetGamemode2Param();
    }

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

    useEffect(() => {
        change()
    }, [visibleCase,gamemode,sequence1,sequence2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            setGameModeActivation(false);
        }
    }, [sequence1,sequence2,match,mismatch,gap]);

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
                    Remplissage matrice score : Aide
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
            <Grid item>
                <Box
                    component="section"
                    sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 650, height: 700, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
                    <div style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '20px' }}>
                        Explications :
                    </div>
                    <div style={{fontSize: '1.2em', textAlign: 'left' }}>
                        <div style={{ marginTop: '10px' }}>
                            Pour le remplissage des matrice,
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            La première étape est de remplir la première ligne. Celle-ci est la somme cumulative des gaps à chaque itérations.
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            Ensuite, on calcule 3 valeurs : "TOP VALUE","DIAGONAL VALUE" et "LEFT VALUE" selon la position de la case.
                            <div/>
                            - TOP VALUE est la valeur au dessus de notre case recherchée + la valeur du gap.
                            <div/>
                            - HORIZONTAL VALUE est la valeur qui se situe en diagonal par rapport à notre case recherchée + la valeur du match si les 2 caractères associé des séquences sont égaux ou la valeur du mismatch sinon.
                            <div/>
                            - LEFT VALUE est la valeur à gauche de notre case recherchée + la valeur du gap.
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            La dernière étape s'agit de prendre la valeur maximale parmis ces 3 valeurs.
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            Un petit outil visuel a été élaboré au dessus de ces explications afin de mieux comprendre d'où viennent les valeurs. L'aide commence à partir de la deuxième ligne dans la matrice.
                        </div>
                    </div>
                </Box>
            </Grid>

        </Grid>
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
                    Découverte chemin optimal : Aide
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
            <Grid item>
                <Box
                    component="section"
                    sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 650, height: 700, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
                    <div style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '20px' }}>
                        Explications :
                    </div>
                    <div style={{fontSize: '1.2em', textAlign: 'left' }}>
                        <div style={{ marginTop: '10px' }}>
                            Pour trouver un chemin optimal,
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            La méthode consiste à soustraire la valeur de la case actuelle pour chaque case possible :
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            Soustraire à la case du haut, pour que l'on accepte cette case du haut comme solution, il faut que le résultat de la soustraction (case actuelle - case du haut) soit égal au gap
                            <div/>
                            <div style={{ marginTop: '10px' }}>
                            Soustraire à la case diagonale (haut a gauche), pour que l'on accepte cette case diagonale comme solution, il faut que le résultat de la soustraction (case actuelle - case diagonale) soit égal au match (et qu'il y ait un match) ou au mismatch (et qu'il y ait un mismatch).
                            <div/></div>
                                <div style={{ marginTop: '10px' }}>
                                    Soustraire à la case de gauche, pour que l'on accepte cette case de gauche comme solution, il faut que le résultat de la soustraction (case actuelle - case de gauche) soit égal au gap.
                            <div/></div>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            La dernière étape s'agit de cliquer sur une case qui est "acceptée" après nos calculs.
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            Un petit calculateur a été élaboré au dessus de ces explications afin de mieux visualiser le calcul qui permet de déterminer quel case est acceptée ou pas.
                        </div>
                    </div>
                </Box>
            </Grid>

        </Grid>

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
    const submitAnswerButton =
        <Button variant="outlined" style ={{
            height: '55px'
        }}
                disabled={!gamemode ? gameModeActivation : true}
                onClick={() =>
            handleSubmitAnswerButtonClick()
        }>Soumettre réponse</Button>

    const switchGamemode =
        <Button variant="outlined" style ={{
            height: '55px'
        }} onClick={() =>
            handleSwitchGamemodeButton()
        }>Changer mode de jeu</Button>

    const resetGameButton =
        <Button variant="outlined" style ={{
            height: '55px',
            width: '80px'
        }} onClick={() =>
            handleResetButton()
        }>Restart</Button>

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
                    }
                    }
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

                               }
                               }
                    />
        </div>
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

    const rightElement =
        <Box >
            <Grid container direction="column"  spacing={4}>
                <Grid item>
                    <div style = {{ display: 'flex', flexDirection: 'row', margin: '0px', gap: '15px'}}>
                    {switchGamemode}
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
                        fontSize: '2.1rem',
                        position: 'relative',
                        top: '20px', // Positionne l'élément au milieu de la hauteur de l'écran
                        left: '00px', // Positionne l'élément juste à droite de upElement avec un espacement de 20px

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

    const gameModeTitle =
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '2.5rem',
            position: 'relative',
            top: '20px', // Positionne l'élément au milieu de la hauteur de l'écran
            left: '00px', // Positionne l'élément juste à droite de upElement avec un espacement de 20px

            fontFamily: 'Arial',
        }}>
            {gamemode ? "Découverte chemin optimal" : "Remplissage matrice score"}
        </div>

    return (
        <div>
            {gameModeTitle}
            <div style={{ display: 'flex', justifyContent: 'center' , gap: '10Vh',marginTop: '60px'  }}>
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
                <Box
                    component="section"
                    sx={{ p: 2, border: '4px solid  grey',borderRadius: '16px', overflowX: 'auto' ,width: 500, height: 700, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
                    <div style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '20px' }}>
                        Explications :
                    </div>
                    <div style={{fontSize: '1.2em', textAlign: 'left' }}>
                        <div style={{ marginTop: '10px' }}>
                            Bienvenue dans le mode jeu.
                        </div>
                        <div style={{ marginTop: '10px' }}>
                        Dans ce mode, vous trouverez deux modes de jeu différents basés sur l'algorithme de Needleman-Wunsch :
                        </div>
                        <div style={{ marginTop: '10px' }}>
                        - Un mode de jeu "Remplissage matrice score" où le but est de comprendre comment on crée la matrice de score.
                        <div/>
                        - Et un mode de jeu "Découverte chemin optimal" où le but est de trouver un chemin optimal (effectuer le traceback) en se trompant le moins possible.
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            Il suffit de remplir les champs de séquence 1 et séquence 2 pour commencer à jouer.
                        </div>
                        <div style={{ marginTop: '10px' }}>
                        Des indications et explications sur la manière d'obtenir les résultats afin de vous aider se trouvent en bas de la page.
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            Pour jouer au mode "Remplissage matrice score", il suffit d'entrer sa réponse dans le champs prévu à cet effet et soumettre la réponse à chaque itération en appuyant sur le bouton. Si une erreur a été faite, la case deviendra colorée, sinon elle restera blanche.
                        </div>
                        <div style={{ marginTop: '10px' }}>
                             Pour jouer au mode "Découverte chemin optimal", il suffit de cliquer directement sur les cases bleues dans la matrice. Si vous avez trouvé la bonne case, elle deviendra verte, sinon, elle deviendra rouge.
                        </div>
                        <div style={{ marginTop: '20px' }}>
                        Bon amusement !
                        </div>
                    </div>
                </Box>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' , gap: '20Vh',marginTop: '20px'  }}>
            <Box component="section"
                 sx={{ p: 2,justifyContent: 'center',borderRadius: '16px', overflowX: 'auto' }}>
                <Grid container direction="row"  spacing={30}>
                    <Grid item>
                        {helperElem1}
                    </Grid>
                    <Grid item>
                        {helperElem2}
                    </Grid>
                </Grid>
            </Box>
            </div>
        </div>
    );
}