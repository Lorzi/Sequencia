import React from 'react'
import sequenciaImage from "../components/sequencia10.png";
import {Box, Button, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAdjustedZoom} from "./pagesUtils";

export default function WelcomePage(){
    //Allows the resize of the windows and adapt the page with it
    useAdjustedZoom();

    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    const normalModeButton =
        <Button variant="outlined"
                onClick={() => handleNavigate('/app')}
                style ={{
            height: '80px', width: '450px', fontSize: '24px'
        }}>

            Normal mode
        </Button>

    const gameModeButton =
        <Button variant="outlined"
                onClick={() => handleNavigate('/game')}
                style ={{
            height: '80px', width: '450px' , fontSize: '24px'
        }}>
            Game mode
        </Button>

    const helpModeButton =
        <Button variant="outlined"
                onClick={() => handleNavigate('/help')}
                style ={{
            height: '80px', width: '450px', fontSize: '24px'
        }}>
            Help and information
        </Button>

    const blosumModeButton =
        <Button variant="outlined"
                onClick={() => handleNavigate('/blosum')}
                style ={{
                    height: '80px', width: '450px', fontSize: '24px'
                }}>
            BLOSUM MODE AND CUSTOM
        </Button>

    const buttonBox =
        <Box sx={{ width: '100%', margin: '0 auto' ,border: '4px solid  gredy' }}>
            <Grid container  spacing={6} direction="column" alignItems="center" >
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
        <Box sx={{ width: '60%', margin: '0 auto' ,border: '4px solid  grdey', marginTop: '20px', marginBottom:'20px' }}>
            <Grid container  spacing={0.5} direction="column" alignItems="center" >
                <Grid item>
                    <img src={sequenciaImage} alt="Sequencia" style={{ width: '600px', height: 'auto', justifyContent: 'center'}}   />
                </Grid>
                <Grid item style={{ marginTop: '15px' }}>
                    <label  style={{ textAlign: 'center', fontSize: '25px', color: 'dimgrey'  }}>Main menu</label>
                </Grid>
                <Grid item style={{ width: '80%' }}>
                    <hr style={{ borderTop: '1px solid #ccc', width: '100%' }} />
                </Grid>
                <Grid item>
                    <label style={{ textAlign: 'center' }}><strong>Sequence alignment visualization tool created by BOIVIN Lorentz as part of the Master 1 project supervised by Mr Tom Mens. at the University of Mons.</strong></label>
                </Grid>
                <Grid item>
                    <label style={{ textAlign: 'center' }}>One of the main functionalities of this tool is to align DNA and protein sequences in the field of biology and bioinformatics.
                    </label>
                </Grid>
                <Grid item>
                    <label style={{ textAlign: 'center' }}>For more information, click the “Help and Information” button.</label>
                </Grid>
                <Grid item style={{ width: '40%' }}>
                    <hr style={{ borderTop: '1px solid #ccc', width: '100%' }} />
                </Grid>
                <Grid item style={{ marginTop: '40px' }}>
                    {buttonBox}
                </Grid>
            </Grid>
        </Box>
    );
}