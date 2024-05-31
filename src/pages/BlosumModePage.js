import {useNavigate} from "react-router-dom";
import {Box, Button, Grid} from "@mui/material";
import sequenciaImage from "../components/sequencia10.png";
import React from "react";
import Blosum from "../Blosum";
import {useAdjustedZoom} from "./pagesUtils";
import pages from "./pages.module.css";


export default function BlosumModePage(){
    //Allows the resize of the windows and adapt the page with it
    useAdjustedZoom();

    const navigate = useNavigate();

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
            onClick={() => navigate('/helpBlosum')}>
            Help
        </Button>

    return(
        <Box className={pages.pageMargin}>
            {GoBackToMenuButton}
            {helpButton}
            <Grid container direction="column" alignItems="center">
                <div className={pages.logoAndTitle}>
                    <Grid item>
                        <img className={pages.topLogo} src={sequenciaImage} alt="Sequencia" />
                    </Grid>
                    <Grid item>
                        <hr className={pages.verticalLine}/>
                    </Grid>
                    <Grid item className={pages.titlePosition}>
                        <label className={pages.fontTitles}>BLOSUM</label>
                    </Grid>
                </div>
                <Grid item>
                    <Blosum/>
                </Grid>
            </Grid>
        </Box>

    );
}