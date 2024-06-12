import React from 'react'

import {Box, Button, Grid} from "@mui/material";
import App from "../App";
import {useNavigate} from "react-router-dom";
import sequenciaImage from "../components/sequencia10.png";
import {useAdjustedZoom} from "./pagesUtils";
import pages from "./pages.module.css";

/**
 * Page for normal mode
 * returns the elements needed for display
 * @returns {Element}
 * @constructor
 */
export default function NormalModePage() {
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
            onClick={() => navigate('/helpNormal')}>
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
                        <label className={pages.fontTitles}>NORMAL</label>
                    </Grid>
                </div>
                <Grid item>
                    <App/>
                </Grid>
            </Grid>
        </Box>
    );
}
