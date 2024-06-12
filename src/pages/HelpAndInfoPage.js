import React from 'react'
import {Box, Button, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import sequenciaImage from "../components/sequencia10.png";
import {helpBlosumText, helpGameText, helpNormalText, introductionText, useAdjustedZoom} from "./pagesUtils";
import pages from './pages.module.css';

/**
 * Page for Help and Info mode
 * returns the elements needed for display
 * @returns {Element}
 * @constructor
 */
export default function HelpAndInfoPage() {

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

    return(
        <div>
            <Box className={pages.pageMargin}>
                {GoBackToMenuButton}
                <Grid container direction="column" alignItems="center">
                    <div className={pages.logoAndTitle}>
                        <Grid item>
                            <img className={pages.topLogo} src={sequenciaImage} alt="Sequencia" />
                        </Grid>
                        <Grid item>
                            <hr className={pages.verticalLine}/>
                        </Grid>
                        <Grid item className={pages.titlePosition}>
                            <label className={pages.fontTitles}>DOCUMENTATION</label>
                        </Grid>
                    </div>
                </Grid>
            </Box>
            {introductionText}
            {helpNormalText}
            {helpGameText}
            {helpBlosumText}

        </div>
    );
}


