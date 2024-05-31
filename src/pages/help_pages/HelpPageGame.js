import React from 'react'
import {Box, Button, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import sequenciaImage from "../../components/sequencia10.png";

import {helpGameText} from "../pagesUtils";
import {useAdjustedZoom} from "../pagesUtils";
import pages from '../pages.module.css';
export default function HelpPageGame() {

    //Allows the resize of the windows and adapt the page with it
    useAdjustedZoom();

    const navigate = useNavigate();

    const GoBackToModeButton =
        <Button
            className={pages.mainMenuButton}
            variant="outlined"
            onClick={() => navigate('/game')}>
            Back
        </Button>

    return(
        <div>
            <Box className={pages.pageMargin}>
                {GoBackToModeButton}
                <Grid container direction="column" alignItems="center">
                    <div className={pages.logoAndTitle}>
                        <Grid item>
                            <img className={pages.topLogo} src={sequenciaImage} alt="Sequencia" />
                        </Grid>
                        <Grid item>
                            <hr className={pages.verticalLine}/>
                        </Grid>
                        <Grid item className={pages.titlePosition}>
                            <label className={pages.fontTitles}>HELP GAME</label>
                        </Grid>
                    </div>
                </Grid>
            </Box>
            {helpGameText}
        </div>
    );
}


