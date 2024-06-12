import React from 'react';
import {Box, Grid} from "@mui/material";
import {Case} from './components/Case';

/**
 * Helper function to add new paths to the queue based on arrow directions
 * This is a function made to avoid redundancy between two different .js file
 * that use the same logic.
 * Will push in the queue a new path that start with the pointed case by the arrow
 * @param {Array} queue - Queue to store paths.
 * @param {Array} path - Current path.
 * @param {number} y - Current y position.
 * @param {number} x - Current x position.
 * @param {string} arrows - Arrow directions string.
 */
export function addPathsToQueue(queue, path, y, x, arrows) {
    if (arrows.includes("↖")){
        queue.push([[y-1, x-1], ...path]);
    }
    if (arrows.includes("↑")) {
        queue.push([[y-1, x], ...path]);
    }
    if (arrows.includes("←")) {
        queue.push([[y, x-1], ...path]);
    }
}

/**
 * Allows to merge all the optimal paths into a single list of optimal paths
 * @param allPath
 * @returns {*}
 */
export const mergePaths = (allPath) => {
    let mergedPaths = [];
    for (let i = 0;i < allPath.length;i++) {
        let analysedPath = allPath[i];
        for (let j = 0;j < analysedPath.length;j++) {
            let analysedCoord = analysedPath[j];
            if (!mergedPaths.includes(analysedCoord)) {
                mergedPaths.push(analysedCoord);
            }
        }
    }
    return mergedPaths;
};
/**
 * Allows to compare two path coordinates by first looking at
 * the first element and comparing the second element if needed
 * @param path1
 * @param path2
 * @returns {number}
 */
export const comparePath = (path1,path2) => {
    let comp = path1[0] - path2[0];
    if(comp > 0){
        return 1;
    }
    else if(comp <0) {
        return -1;
    }
    else{
        return (path1[1] - path2[1]);
    }
}

/**
 * Allows to determine which color to assign to a box based on its position and the colored lists
 * Applies to the score matrix
 * @param rowIndex
 * @param colIndex
 * @param colorVariantCase
 * @param selectedVariant
 * @param chosenCase
 * @param optPath
 * @returns {string}
 */
const determineCaseColorMatrix = (rowIndex,colIndex, colorVariantCase, selectedVariant, chosenCase, optPath ) => {
    if((colorVariantCase.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) && selectedVariant === "LCS") {
        return('green');
    }
    else{
        if((chosenCase[0] === rowIndex && chosenCase[1] === colIndex)){
            return('darkred');
        }
        else{
            if(optPath.some(coord => coord[0] === rowIndex && coord[1] === colIndex)){
                return('dodgerblue');
            }
            else{
                return('white');
            }
        }
    }
}

/**
 * UI Component: display the letters of the Sequence 2 in the matrix
 * @param sequence2
 * @returns {React.JSX.Element}
 * @constructor
 */
export const DisplayedSeq = ({ sequence2 }) => (
    <Box>
        <Grid container spacing={0.5} sx={{ flexWrap: 'nowrap' }}>
            <Grid item>
                <Case key="first-case" value="-" color="light_blue" />
            </Grid>
            <Grid item>
                <Case key="second-case" value="-" color="light_blue" />
            </Grid>
            {sequence2.split('').map((item, index) => (
                <Grid item key={index}>
                    <Case key={index} value={item} color="light_blue" />
                </Grid>
            ))}
        </Grid>
    </Box>
);

/**
 * UI Component: display the letters of the Sequence 1 in the matrix
 * Split each element of the sequence 1 to put it independently inside a case
 * @param sequence1
 * @returns {React.JSX.Element}
 * @constructor
 */
export const DisplayedOtherSeq = ({ sequence1 }) => (
    <Box>
        <Grid container direction="column" spacing={0.5}>
            <Grid item>
                <Case key="first-case" value="-" color="light_blue" />
            </Grid>
            {sequence1.split('').map((item, index) => (
                <Grid item key={index}>
                    <Case key={index} value={item} color="light_blue" />
                </Grid>
            ))}
        </Grid>
    </Box>
);



/**
 * UI Component: final matrix that will be displayed on the screen
 * @param matrixFinal
 * @param colorVariantCase
 * @param selectedVariant
 * @param chosenCase
 * @param optPath
 * @returns {React.JSX.Element}
 * @constructor
 */
export const DisplayedMatrix = ({ matrixFinal, colorVariantCase, selectedVariant, chosenCase, optPath }) => (
    <Box>
        <Grid container spacing={0.5}>
            {matrixFinal.map((row, rowIndex) => (
                <Grid item xs={100} key={rowIndex}>
                    <Grid container spacing={0.5} sx={{ flexWrap: 'nowrap' }}>
                        {row.map((item, colIndex) => (
                            <Grid item key={colIndex}>
                                <Case
                                    key={[rowIndex, colIndex]}
                                    value={item}
                                    color={determineCaseColorMatrix(rowIndex,colIndex, colorVariantCase, selectedVariant, chosenCase, optPath )}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    </Box>
);
