import React from 'react';
import { Box, Grid } from "@mui/material";
import {Case} from './components/Case';

/**
 * Helper function to add new paths to the queue based on arrow directions
 * This is a function made to avoid redundancy between two different .js file
 * that use the same logic.
 * @param {Array} queue - Queue to store paths.
 * @param {Array} path - Current path.
 * @param {number} y - Current y position.
 * @param {number} x - Current x position.
 * @param {string} arrows - Arrow directions string.
 */
export function addPathsToQueue(queue, path, y, x, arrows) {
    if (arrows.includes("↖")) queue.push([[y - 1, x - 1], ...path]); // Diagonal movement
    if (arrows.includes("↑")) queue.push([[y - 1, x], ...path]); // Move up
    if (arrows.includes("←")) queue.push([[y, x - 1], ...path]); // Move left
}

/**
 * Allows to merge all the optimal paths into a single list of optimal paths
 * @param allPath
 * @returns {*}
 */
export const mergePaths = (allPath) => {
    return allPath.reduce((merged, current) => {
        current.forEach(path => {
            if (!merged.includes(path)) {
                merged.push(path);
            }
        });
        return merged;
    }, []);
};

/**
 * UI Component: display the letters of the Sequence 2 in the matrix
 * @param sequence2
 * @returns {React.JSX.Element}
 * @constructor
 */
export const DisplayedSeq = ({ sequence2 }) => (
    <Box sx={{ width: '100%', margin: '0' }}>
        <Grid container spacing={0.5} style={{ flexWrap: 'nowrap' }}>
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
 * @param sequence1
 * @returns {React.JSX.Element}
 * @constructor
 */
export const DisplayedOtherSeq = ({ sequence1 }) => (
    <Box sx={{ width: '100%', margin: '0' }}>
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
    <Box sx={{ width: '100%', margin: '0' }}>
        <Grid container spacing={0.5}>
            {matrixFinal.map((row, rowIndex) => (
                <Grid item xs={100} key={rowIndex}>
                    <Grid container spacing={0.5} style={{ flexWrap: 'nowrap' }}>
                        {row.map((item, colIndex) => (
                            <Grid item key={colIndex}>
                                <Case
                                    key={[rowIndex, colIndex]}
                                    value={item}
                                    color={
                                        (colorVariantCase.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) && selectedVariant === "LCS" ? 'green' :
                                            ((chosenCase[0] === rowIndex && chosenCase[1] === colIndex)) ? 'darkred' :
                                                (optPath.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) ? 'dodgerblue' : 'white'
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    </Box>
);
