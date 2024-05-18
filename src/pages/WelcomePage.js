import React from 'react'
import sequenciaImage from "../components/sequencia10.png";
import {Box, Button, Grid} from "@mui/material";

export default function WelcomePage(){

    const normalModeButton =
        <Button variant="outlined" style ={{
            height: '100px', width: '450px', fontSize: '24px'
        }}>
            Mode normal
        </Button>

    const gameModeButton =
        <Button variant="outlined" style ={{
            height: '100px', width: '450px' , fontSize: '24px'
        }}>
            Mode jeu
        </Button>

    const helpModeButton =
        <Button variant="outlined" style ={{
            height: '100px', width: '450px', fontSize: '24px'
        }}>
            Aide et informations
        </Button>

    const buttonBox =
        <Box sx={{ width: '100%', margin: '0 auto' ,border: '4px solid  gredy' }}>
            <Grid container  spacing={7} direction="column" alignItems="center" >
                <Grid item>
                    {normalModeButton}
                </Grid>
                <Grid item>
                    {gameModeButton}
                </Grid>
                <Grid item>
                    {helpModeButton}
                </Grid>
            </Grid>
        </Box>

    return(
        <Box sx={{ width: '60%', margin: '0 auto' ,border: '4px solid  grdey', marginTop: '30px' }}>
            <Grid container  spacing={0.5} direction="column" alignItems="center" >
                <Grid item>
                    <img src={sequenciaImage} alt="Sequencia" style={{ width: '600px', height: 'auto', justifyContent: 'center'}}   />
                </Grid>
                <Grid item style={{ marginTop: '15px' }}>
                    <label  style={{ textAlign: 'center', fontSize: '25px', color: 'dimgrey'  }}>Menu principal</label>
                </Grid>
                <Grid item style={{ width: '80%' }}>
                    <hr style={{ borderTop: '1px solid #ccc', width: '100%' }} />
                </Grid>
                <Grid item>
                    <label style={{ textAlign: 'center' }}><strong>Outil de visualisation d'alignement de séquences réalisé par BOIVIN Lorentz dans le cadre du projet de Master 1 à l'Université de Mons.</strong></label>
                </Grid>
                <Grid item>
                    <label style={{ textAlign: 'center' }}>Une des fonctionnalités principales de cet outil est d'aligner des séquences d'ADN et protéines dans le domaine de la biologie et de la bio-informatique.</label>
                </Grid>
                <Grid item>
                    <label style={{ textAlign: 'center' }}>Pour plus d'informations, cliquez sur le bouton "Aide et informations".</label>
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