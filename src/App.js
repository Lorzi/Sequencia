import { useState } from 'react';
import {Case} from "./Case";
import {Line} from "./Line";
import {NeedleManWunschScript} from "./NeedleManWunschScript";
export default function App(){
    let [caseId,setCaseId] = useState();
    const optimalPath = [(6, 6), (5, 5), (5, 4), (4, 4), (3, 3), (3, 2), (2, 2), (1, 1), (1, 0)];
    const test_matrix = [
        [0, -1, -2, -3, -4, -5, -6, -7, -8, -9],
            [-1, -1, -2, -3, -4, -3, -4, -5, -6, -7],
            [-2, -2, 0, -1, -2, -3, -4, -3, -4, -5],
            [-3, -1, -1, 1, 0, -1, -2, -3, -4, -5],
            [-4, -2, -2, 0, 0, -1, -2, -3, -2, -3],
            [-5, -3, -3, -1, -1, 1, 0, -1, -2, -1],
            [-6, -4, -4, -2, -2, 0, 0, -1, 0, -1],
            [-7, -5, -5, -3, -3, -1, -1, -1, -1, 1],
    ];
    const S1 = "cacaaaa"
    const S2 = "cacaaaa"
    const matrixTestData = NeedleManWunschScript(S1,S2,1,-1,-1)

    const [displayed_matrix,setDisplayedMatrix] = useState(

        <div className="matrix-row">
            {matrixTestData.map((x,xIndex)=> (
                <div className="matrix-line">
                    {Line(x,xIndex)}
                </div>
            ))}
        </div>
    );
    const onDisplayPath = () => {
        const keytab =[[7, 9], [6, 8], [5, 7], [5, 6], [5, 5], [4, 4], [3, 3], [2, 2], [1, 1], [0, 0], [0, 0]];
        const keychain = [0,6]
        console.log(displayed_matrix)
        console.log(displayed_matrix.props)
        setDisplayedMatrix(displayed_matrix =>
            <div className="matrix-row">
                {matrixTestData.map((x,xIndex)=> (
                    <div className="matrix-line">
                        <div>
                            {x.map ((y,yIndex) => (
                                <Case
                                    key = {[xIndex,yIndex]}
                                    value = {y}
                                    color={keytab.some(coord => coord[0] === xIndex && coord[1] === yIndex) ? 'red' : 'white'}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    const displayPathButton =
        <button onClick={() => onDisplayPath() }>Display optimal path</button>

    return (
          <>
              {displayed_matrix}
              {displayPathButton}

          </>
  );
}




