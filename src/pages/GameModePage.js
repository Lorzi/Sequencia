import React from 'react'
import Gamemode from "../Gamemode";
import {Box, Button, Grid} from "@mui/material";
import sequenciaImage from "../components/sequencia10.png";
import {useNavigate} from "react-router-dom";
export default function GameModePage(){
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

        <Box sx={{ width: '100%', margin: '0 auto' ,border: '4px solid  grdey', marginTop: '30px' }}>
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
                        <label  style={{ textAlign: 'center', fontSize: '27px', color: 'dimgrey'  }}>MODE JEU</label>
                    </Grid>
                </div>
                <Grid item>
                    <Gamemode/>
                </Grid>
            </Grid>
        </Box>

    );
}