import React from 'react'
import {Box, Button, Grid} from "@mui/material";
import App from "../App";
import {useNavigate} from "react-router-dom";
import sequenciaImage from "../components/sequencia10.png";
export default function NormalModePage() {
    const navigate = useNavigate();

    const GoBackToMenuButton =
        <Button variant="outlined"
                onClick={() => navigate('/')}
                style ={{
                    height: '60px', width: '200px' , fontSize: '18px', position: 'absolute',marginLeft: '30px'
                }}>
            Menu principal
        </Button>

    return(
        <Box sx={{ width: '100%', margin: '0 auto' , marginTop: '30px' }}>
            {GoBackToMenuButton}
            <Grid container  spacing={0.5} direction="column" alignItems="center" >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Grid item>
                        <img src={sequenciaImage} alt="Sequencia" style={{ width: '300px', height: 'auto', justifyContent: 'center'}}   />
                    </Grid>
                    <Grid item>
                        <hr style={{ borderTop: '1px solid #ccc', height: '80%' }} />
                    </Grid>
                    <Grid item style={{marginTop:'25.5px', marginLeft: '10px'}}>
                        <label  style={{ textAlign: 'center', fontSize: '27px', color: 'dimgrey'  }}>MODE CLASSIC</label>
                    </Grid>
                </div>
                <Grid item>
                    <App/>
                </Grid>
            </Grid>
        </Box>
    );
}