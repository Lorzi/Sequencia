import React, {useEffect, useState} from 'react';
import {NeedleManWunschScript} from "./algorithms/NeedleManWunschScript";
import {determineArrowedMatrix, findPaths} from "./algorithms/NeedleManOptimalPath_V2";
import {
    Box,
    Grid,
    Input,
    TextField
} from "@mui/material";
import {blosum62} from "./components/variants/blosum62";
import {DisplayedMatrix, DisplayedOtherSeq, DisplayedSeq} from "./utils";
import mainstyles from "./main.module.css";
/**
 * Heart of the application,
 * allows you to launch the program, takes care of the display and placement of the different elements on the page.
 * It returns different HTML elements in the same page
 * @returns {Element}
 * @constructor
 */
export default function Blosum(){

    //INITIALISATION AREA START -------------------------------------------------------------------
    let [sequence1 ,setSequence1] = useState('')
    let [sequence2 ,setSequence2] = useState('')
    const match = 1;
    const missmatch= -1;
    let [gap,setGap]=useState(-2)
    let [pathCounter, setPathCounter] = useState(0); //Counter that indicate which path in the allpath list we choose in the visualisation
    const [selectedAlgorithm] = useState("Needleman-Wunsch");
    const [selectedVariant] = useState("default");
    const [operationMm] = useState(0); //Allows to change if we use a Max or Min in other class (Needleman-Wunsch or Smith-Waterman)
    const [computeLimit,] = useState(10000); //Maximum bound for the computation of result, help to avoid infinite generation and thus crash
    const [blosumCheck] = useState(true); //Check blosum option is activated
    const [blosumCustom,setBlosumCustom] = useState(blosum62); //Custom matrix, by default blosum62
    let matrixTestData = NeedleManWunschScript(sequence1,sequence2,match,missmatch,gap,operationMm,blosumCheck,blosumCustom)//list that countain subsitution matrix and scoreMatrix
    let matrixFinal = matrixTestData[1]; //Score Matrix, also knowned as transfMatrix in other class
    let arrowedMatrix = determineArrowedMatrix(sequence1,sequence2,matrixTestData[0],matrixFinal,match,gap,missmatch) //Matrix that contains the arrows and direction, important to generate paths
    let allPath = findPaths(arrowedMatrix,computeLimit); //list that contains every possible path/alignement on this session
    let optPath = allPath[pathCounter]; //one Path from allPath that as been chosen with the PathCounter
    const [chosenCase, setChosenCase] = useState([]);
    const [colorVariantCase] = useState([]); //Coloring or not for a variant (example green for the LCS)

    /**
     * Handle the custom matrix blosum file in .JSON input by the user
     * This function has been created and inspired on base of the FileRead documentation and javascript.info : https://developer.mozilla.org/en-US/docs/Web/API/FileReader/load_event
     * https://javascript.info/file
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
                    console.error("File is not in a JSON format");
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
        // eslint-disable-next-line
    }, [pathCounter,chosenCase,gap,colorVariantCase,selectedAlgorithm,blosumCheck,blosumCustom]);

    //Matrix displayed as button matrix in html
    const [displayed_matrix,setDisplayedMatrix] = useState();
    //Display component SEQUENCE WORD 2
    const [displayedSeq,setDisplayedSeq] = useState();
    //Display component SEQUENCE WORD 1
    const [displayedOtherSeq,setDisplayedOtherSeq] = useState();

    /**
     * Allows you to update the displayed matrix with new information and the optimal path.
     * Display of the matrix and update of it each time this function is called.
     */
    const onDisplayPath = () => {

        //Updating the score matrix
        setDisplayedMatrix(
            <DisplayedMatrix
                matrixFinal={matrixFinal}
                colorVariantCase={colorVariantCase}
                selectedVariant={selectedVariant}
                chosenCase={chosenCase}
                optPath={optPath}
            />
        );

        //Updating the Sequence 2 display
        setDisplayedSeq(<DisplayedSeq sequence2={sequence2} />);
        //Updating the Sequence 1 display
        setDisplayedOtherSeq(<DisplayedOtherSeq sequence1={sequence1} />);
    }
    /**
     * UI component : representing the score matrix as well as its column and its sequence line aligned to it
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

    let paramButton =
        <div>
            <TextField
                className = {mainstyles.paramBox}
                label = "Gap"
                variant="outlined"
                type="number"
                id="gap"
                value={gap}

                onChange={(e) => {
                    setPathCounter(0);
                    const newGap = e.target.value
                    setGap(+newGap)
                    onDisplayPath()
                }}
                onKeyUp={() => {
                    onDisplayPath()
                }}


            />
        </div>

    let elementFirstLine =
        <Box  >
            <Grid container spacing={1}>
                <Grid item>
                    <TextField
                        className={mainstyles.sequenceBox}
                        id="sequence1"
                        label="Sequence 1"
                        variant="outlined"
                        type="text"
                        value={sequence1}
                        inputProps={{maxLength: 1000}} //Limit the length of the input text (here size of 1000 characters)
                        onChange={(e) => {
                            setPathCounter(0)
                            setSequence1(e.target.value)
                            onDisplayPath()
                        }}
                        onKeyUp={() => {
                            onDisplayPath()
                        }}/>
                </Grid>
                <Grid item>
                    <TextField
                        className={mainstyles.sequenceBox}
                        id="sequence2"
                        label="Sequence 2"
                        variant="outlined"
                        type="text"
                        value={sequence2}
                        inputProps={{maxLength: 1000}} //Limit the length of the input text (here size of 15 characters)
                        onChange={(e) => {
                            setPathCounter(0)
                            setSequence2(e.target.value)
                            onDisplayPath()
                        }}
                        onKeyUp={() => {
                            onDisplayPath()
                        }}
                    />
                </Grid>
                <Grid item>
                    {paramButton}
                </Grid>

                <Grid item>
                    <Input
                        className={mainstyles.inputFile}
                        type="file"
                        onChange={(e) =>{
                        handleFileBlosumLoad(e)
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    /**
     * UI Component : component representing the score matrix as well as its column and its sequence line aligned to it
     * @type {React.JSX.Element}
     */
    let upElement =
        <div>
            {elementFirstLine}
            <div style = {{ margin: '20px'}}/>
        </div>

    //Set of all the components in return for the final display on the page
    return (
        <div className={mainstyles.returnOrganization}>
            <div>
                {upElement}
            </div>
            <hr className={mainstyles.horizontalBorder} />
            <div className={mainstyles.centeredElem}>
                <Box className={mainstyles.blosumMatrixBorderBox} sx={{p: 2}}>
                    {FullMatrix}
                </Box>
            </div>
        </div>

    );
}