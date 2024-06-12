import React from 'react'
import {Box, Button, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import sequenciaImage from "../../components/sequencia10.png";
import {helpNormalText} from "../pagesUtils";
import {useAdjustedZoom} from "../pagesUtils";
import pages from '../pages.module.css';

/**
 * help Page for Normal mode
 * returns the elements needed for display
 * @returns {Element}
 * @constructor
 */
export default function HelpPageNormal() {

    //Allows the resize of the windows and adapt the page with it
    useAdjustedZoom();

    const navigate = useNavigate();

    const GoBackToModeButton =
        <Button
            className={pages.mainMenuButton}
            variant="outlined"
            onClick={() => navigate('/app')}>
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
                            <label className={pages.fontTitles}>HELP NORMAL</label>
                        </Grid>
                    </div>
                </Grid>
            </Box>
            {helpNormalText}
        </div>
    );
}


