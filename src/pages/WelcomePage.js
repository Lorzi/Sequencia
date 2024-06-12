import React from 'react'
import sequenciaImage from "../components/sequencia10.png";
import {Box, Button, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAdjustedZoom} from "./pagesUtils";
import pages from "./pages.module.css";

/**
 * Welcome page
 * returns the elements needed for display
 * @returns {Element}
 * @constructor
 */
export default function WelcomePage(){
    //Allows the resize of the windows and adapt the page with it
    useAdjustedZoom();
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };

    const normalModeButton =
        <Button
            className = {pages.welcomeButtons}
            variant="outlined"
            onClick={() => handleNavigate('/app')}>
            Normal mode
        </Button>

    const gameModeButton =
        <Button
            className = {pages.welcomeButtons}
            variant="outlined"
            onClick={() => handleNavigate('/game')}>
            Game mode
        </Button>

    const helpModeButton =
        <Button
            className = {pages.welcomeButtons}
            variant="outlined"
            onClick={() => handleNavigate('/help')}>
            Help and information
        </Button>

    const blosumModeButton =
        <Button
            className = {pages.welcomeButtons}
            variant="outlined"
            onClick={() => handleNavigate('/blosum')}>
            BLOSUM MODE AND CUSTOM
        </Button>

    const buttonBox =
        <Box>
            <Grid container spacing={6} direction="column" >
                <Grid item>
                    {normalModeButton}
                </Grid>
                <Grid item>
                    {gameModeButton}
                </Grid>
                <Grid item>
                    {blosumModeButton}
                </Grid>
                <Grid item>
                    {helpModeButton}
                </Grid>
            </Grid>
        </Box>

    return(
        <Box className={pages.welcomeBox}>
            <Grid container spacing={0.5} direction="column" alignItems="center" >
                <Grid item>
                    <img src={sequenciaImage} alt="Sequencia" style={{ width: '600px'}}   />
                </Grid>
                <Grid item sx={{ marginTop: '15px' }}>
                    <label className={pages.fontTitles}>Main menu</label>
                </Grid>
                <Grid item sx={{ width: '80%' }}>
                    <hr className={pages.horizontalLine} />
                </Grid>
                <Grid item>
                    <label className={pages.fontNormalText}><strong>Sequence alignment visualization tool created by BOIVIN Lorentz as part of the Master 1 project supervised by Mr Tom Mens. at the University of Mons.</strong></label>
                </Grid>
                <Grid item>
                    <label className={pages.fontNormalText}>One of the main functionalities of this tool is to align DNA and protein sequences in the field of biology and bioinformatics.
                    </label>
                </Grid>
                <Grid item>
                    <label className={pages.fontNormalText}>For more information, click the “Help and Information” button.</label>
                </Grid>
                <Grid item sx={{ width: '40%' }}>
                    <hr className={pages.horizontalLine} />
                </Grid>
                <Grid item sx={{ marginTop: '40px' }}>
                    {buttonBox}
                </Grid>
            </Grid>
        </Box>
    );
}