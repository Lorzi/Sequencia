import {Case} from "./Case";

/**
 * Line component
 * @param x
 * @param xIndex
 * @returns {JSX.Element}
 * @constructor
 */
export function Line(x,xIndex){
    return(
        <div>
            {x.map ((y,yIndex) => (
                <Case
                    key = {[xIndex,yIndex]}
                    value = {y}
                    color = {'light_blue'}
                />
                ))}
        </div>
    )
}