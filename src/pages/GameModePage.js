import React from 'react'
import Gamemode from "../Gamemode";
import {Box, Button, Grid} from "@mui/material";
import sequenciaImage from "../components/sequencia10.png";
import {useNavigate} from "react-router-dom";
import {useAdjustedZoom} from "./pagesUtils";
import pages from "./pages.module.css";
export default function GameModePage(){
    const navigate = useNavigate();

    //Allows the resize of the windows and adapt the page with it
    useAdjustedZoom();

    const GoBackToMenuButton =
        <Button
            className={pages.mainMenuButton}
            variant="outlined"
            onClick={() => navigate('/')}>
            Main menu
        </Button>

    const helpButton =
        <Button
            className={pages.helpButton}
            variant="outlined"
            onClick={() => navigate('/helpGame')}>
            Help
        </Button>

    return(
        <Box className={pages.pageMargin}>
            {GoBackToMenuButton}
            {helpButton}
            <Grid container direction="column" alignItems="center" >
                <div className={pages.logoAndTitle}>
                    <Grid item>
                        <img className={pages.topLogo} src={sequenciaImage} alt="Sequencia" />
                    </Grid>
                    <Grid item>
                        <hr className={pages.verticalLine}/>
                    </Grid>
                    <Grid item className={pages.titlePosition}>
                        <label className={pages.fontTitles}>GAME MODE</label>
                    </Grid>
                </div>
                <Grid item>
                    <Gamemode/>
                </Grid>
            </Grid>
        </Box>

    );
}