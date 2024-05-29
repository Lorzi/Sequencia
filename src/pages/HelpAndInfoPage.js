import React from 'react'
import {Box, Button, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import sequenciaImage from "../components/sequencia10.png";
import documentation1 from "./documentation_images/documentation1.jpg"
import documentation2 from "./documentation_images/documentation2.jpg"
import documentation3 from "./documentation_images/documentation3.jpg"
import documentation4 from "./documentation_images/documentation4.jpg"
import documentation5 from "./documentation_images/documentation5.jpg"
import documentation6 from "./documentation_images/documentation6.jpg"
import {useAdjustedZoom} from "./pagesUtils";
import pages from './pages.module.css';
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
                    <Grid item>
                        <img src={documentation1} alt="Sequencia" style={{ width: '100%'}}/>
                        <img src={documentation2} alt="Sequencia" style={{ width: '100%'}}/>
                        <img src={documentation3} alt="Sequencia" style={{ width: '100%'}}/>
                        <img src={documentation4} alt="Sequencia" style={{ width: '100%'}}/>
                        <img src={documentation5} alt="Sequencia" style={{ width: '100%'}}/>
                        <img src={documentation6} alt="Sequencia" style={{ width: '100%'}}/>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}


