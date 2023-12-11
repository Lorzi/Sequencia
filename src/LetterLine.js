import {Case} from "./Case";

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