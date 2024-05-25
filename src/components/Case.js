import {Paper} from "@mui/material";

/**
 * Box/case component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function Case(props){

    return(
        //<Grow in={true} timeout={2000} >
        <Paper
            sx={{
                backgroundColor: props.color,
                padding: '8px',
                textAlign: 'center',
                color: 'text.secondary',
                width: '24px',
                height: '24px',
            }}
        >
            {props.value}
        </Paper>

    )
}