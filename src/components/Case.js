import {Paper} from "@mui/material";
/**
 * Box/case component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function Case(props){

    let fontSize = '17px'
    if (props.value <= -100 || props.value >= 1000){
        fontSize = '12px'
    }
    if (props.value <= -10000 || props.value >= 100000){
        fontSize = '10px'
    }

    return(
        <Paper
            sx={{
                backgroundColor: props.color,
                padding: '8px',
                fontSize: {fontSize},
                textAlign: 'center',
                width: '24px',
                height: '24px',
            }}
        >
            <label>{props.value}</label>
        </Paper>

    )
}