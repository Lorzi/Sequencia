import * as React from "react";
import {NeedleManWunschScript} from "./NeedleManWunschScript";
import {useEffect, useState} from "react";
import {Box, Button, Grid, TextField} from "@mui/material";
import {Case} from "./Case";
import {LetterLine} from "./LetterLine";

export default function Gamemode(){

    let sequence1 = "ACT"
    let sequence2 = "ACGG"
    let match = 1
    let mismatch = -1
    let gap = -2
    let matrix = NeedleManWunschScript(sequence1,sequence2,match,mismatch,gap,0,false);
    const [answeredValue,setAnsweredValue] = useState(0);

    let [xPoint,setXPoint] = useState(0);
    let [yPoint,setYPoint] = useState(0);
    let [goodAnswerCounter,setGoodAnswerCounter]=useState(0);
    let [badAnswerCounter,setBadAnswerCounter]=useState(0);
    let [goodAnswerCoord,setGoodAnswerCoord] = useState([]);
    let [badAnswerCoord,setBadAnswerCoord] = useState([]);
    const [visibleCase, setVisibleCase] = useState([]);
    let finalMatrix = matrix[1];


    const [displayed_matrix,setDisplayedMatrix] = useState(
        <Box>
        </Box>
    );
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


    const handleSubmitAnswerButtonClick = () =>{

        setVisibleCase([...visibleCase, [yPoint, xPoint]]);
        console.log(visibleCase)
        if(answeredValue === finalMatrix[yPoint][xPoint]){
            let newGoodAnswerCounter= goodAnswerCounter;
            newGoodAnswerCounter +=1 ;
            setGoodAnswerCounter(newGoodAnswerCounter)
            setGoodAnswerCoord([...goodAnswerCoord, [yPoint, xPoint]]);
        }
        else {
            if(xPoint >= finalMatrix[0].length-1 && yPoint >= finalMatrix.length-1){ //If it's the end of the game

            }
            else{
                let newBadAnswerCounter=badAnswerCounter;
                newBadAnswerCounter += 1;
                setBadAnswerCounter(newBadAnswerCounter)
                setBadAnswerCoord([...badAnswerCoord, [yPoint, xPoint]]);
            }

        }

        console.log("y point long : "+ yPoint)
        console.log("x point long : "+ xPoint)
        console.log("finalmat : "+ finalMatrix[0].length)
        console.log("finalmat : "+ finalMatrix.length)

        if(xPoint >= finalMatrix[0].length-1){
            if (yPoint >= finalMatrix.length-1)
            {
                console.log('Fini')
                console.log("Bonnes réponses : "+goodAnswerCounter)
                console.log("Mauvaises réponses : "+badAnswerCounter)
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
    }, [visibleCase]);

    const change =() =>{
        setDisplayedMatrix(() =>
            <Box sx={{ width: '100%', margin: '0' }}>

                <Grid container spacing={0.5}>
                    {matrix[1].map((row, rowIndex) => (
                        <Grid item xs={100} key={rowIndex}>
                            <Grid container spacing={0.5} style={{ flexWrap: 'nowrap' }}>
                                {row.map((item, colIndex) => (

                                    <Grid item  key={colIndex}>
                                        <Case

                                            key = {[rowIndex,colIndex]}
                                            value={(yPoint === rowIndex && xPoint === colIndex) ? '?' :
                                            visibleCase.some(coord => coord[0] === rowIndex && coord[1] === colIndex) ? item : ""}
                                            color={(yPoint === rowIndex && xPoint === colIndex) ? 'lightblue' :
                                                (badAnswerCoord.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) ? 'coral' : 'white'
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
        }} onClick={() =>
            handleSubmitAnswerButtonClick()
        }>Soumettre réponse</Button>


    return (
        <div>

            {FullMatrix}
            {inputAnswer}
            {submitAnswerButton}
        </div>
    );
}