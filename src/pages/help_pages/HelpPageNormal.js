import React from 'react'
import {Box, Button, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import sequenciaImage from "../../components/sequencia10.png";
import documentation1 from "../documentation_images/documentation1.jpg"
import documentation2 from "../documentation_images/documentation2.jpg"
import documentation3 from "../documentation_images/documentation3.jpg"
import documentation4 from "../documentation_images/documentation4.jpg"
import documentation5 from "../documentation_images/documentation5.jpg"
import documentation6 from "../documentation_images/documentation6.jpg"
import {helpNormalText} from "../pagesUtils";
import {useAdjustedZoom} from "../pagesUtils";
import pages from '../pages.module.css';
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


