import {Case} from "./Case";

/**
 * Letter line component
 * @param sequence
 * @returns {JSX.Element}
 * @constructor
 */
export function LetterLine(sequence){
    return(
        <div>
            {sequence.split('').map ((y,yIndex) => (
                <Case
                    key = {[yIndex]}
                    value = {y}
                    color = {'white'}
                />
            ))}
        </div>
    )
}