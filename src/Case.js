export function Case(props){

    return(

        <button
            className="box"
            style={{backgroundColor: props.color , width: '40px', height: '40px',}}>
            {props.value}
        </button>

    )
    //console.log(props.key);
}