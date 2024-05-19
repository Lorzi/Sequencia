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
export default function HelpAndInfoPage() {

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
        <div>

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
                            <label  style={{ textAlign: 'center', fontSize: '27px', color: 'dimgrey'  }}>DOCUMENTATION</label>
                        </Grid>
                    </div>
                    <Grid item>

                        <img src={documentation1} alt="Sequencia" style={{ width: '1500px', height: 'auto', justifyContent: 'center'}}   />
                        <img src={documentation2} alt="Sequencia" style={{ width: '1500px', height: 'auto', justifyContent: 'center'}}   />
                        <img src={documentation3} alt="Sequencia" style={{ width: '1500px', height: 'auto', justifyContent: 'center'}}   />
                        <img src={documentation4} alt="Sequencia" style={{ width: '1500px', height: 'auto', justifyContent: 'center'}}   />
                        <img src={documentation5} alt="Sequencia" style={{ width: '1500px', height: 'auto', justifyContent: 'center'}}   />
                        <img src={documentation6} alt="Sequencia" style={{ width: '1500px', height: 'auto', justifyContent: 'center'}}   />
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}


