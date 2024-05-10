import {Box, Grid} from "@mui/material";
import {Case} from "../Case";
import * as React from "react";

export const displaySeq2 = (sequence2) => (
    <Box sx={{ width: '100%', margin: '0' }}>
        <Grid container spacing={0.5} style={{ flexWrap: 'nowrap' }}>
            <Grid item>
                <Case key={["first-case"]} value={"-"} color={'light_blue'} />
            </Grid>
            <Grid item>
                <Case key={["second-case"]} value={"-"} color={'light_blue'} />
            </Grid>
            {sequence2.split('').map((item, index) => (
                <Grid item key={index}>
                    <Case key={[index]} value={item} color={'light_blue'} />
                </Grid>
            ))}
        </Grid>
    </Box>
);

export const displaySeq1 = (sequence1) => (
    <Box sx={{ width: '100%', margin: '0' }}>
        <Grid container direction="column" spacing={0.5}>
            <Grid item>
                <Case key={["first-case"]} value={"-"} color={'light_blue'} />
            </Grid>
            {sequence1.split('').map((item, index) => (
                <Grid item key={index}>
                    <Case key={[index]} value={item} color={'light_blue'} />
                </Grid>
            ))}
        </Grid>
    </Box>
);
