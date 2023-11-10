import {Case} from "./Case";

export function Line(x,xIndex){
    return(
        <div>
            {x.map ((y,yIndex) => (
                <Case
                    key = {[xIndex,yIndex]}
                    value = {y}
                    color = {'white'}
                />
                ))}
        </div>
    )
}