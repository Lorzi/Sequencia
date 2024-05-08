import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Sub-table which allows information to be given on each character and on the operations assimilated to it
 * @param uniquePath
 * @param modSequence1
 * @param modSequence2
 * @param transfMatrix
 * @param chooseCase
 * @param rawSequence1
 * @param rawSequence2
 * @returns {Element}
 * @constructor
 */
export default function SubTable({uniquePath,modSequence1,modSequence2, transfMatrix, chooseCase,rawSequence1,rawSequence2}) {

    let choosedId = 0;
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'coordinates', headerName: 'Coordinates', width: 100 },
        { field: 'type', headerName: 'Type', width: 100 },
        { field: 'score', headerName: 'Score', width: 100 },
        { field: 'seq1', headerName: 'Sequence 1', width: 100 },
        { field: 'seq2', headerName: 'Sequence 2', width: 100 },
        { field: 'operation1', headerName: 'Operation Sequence 1', width: 300 },
        { field: 'operation2', headerName: 'Operation Sequence 2', width: 300 }
    ];

    let rows = [];
    let type = "";
    let oldSeq1 = rawSequence1;
    let oldSeq2 = rawSequence2;
    let opeSeq1 ="";
    let opeSeq2 ="";
    rows.push({id: 0, coordinates: [0,0], type: "Init",seq1:"-",seq2:"-", score: 0})
//----------------------------------------------------------

    let counterSeq1 = rawSequence1.length - 1;
    let counterSeq2 = rawSequence2.length  - 1;
    let counterUniquePath = uniquePath.length - 1;


    while(counterUniquePath !== 0){


        if(uniquePath[counterUniquePath][0] !== uniquePath[counterUniquePath-1][0] && uniquePath[counterUniquePath][1] === uniquePath[counterUniquePath-1][1]){

            //Mouvement Vertical

            if(oldSeq2.length-1 === counterSeq2) {
                opeSeq2 = oldSeq2.substring(0, counterSeq2 + 1) + oldSeq1.substring(counterSeq1, counterSeq1 + 1)
                type = ("Delete");
            }
            else{
                opeSeq2 = oldSeq2.substring(0, counterSeq2 + 1) + oldSeq1.substring(counterSeq1, counterSeq1 + 1) + oldSeq2.substring(counterSeq2+1,oldSeq2.length+1);
                type = ("Delete");
            }

            if(oldSeq1.length-1 === counterSeq1){
                opeSeq1 = oldSeq1.substring(0,counterSeq1)
                type = ("Insertion");
            }
            else{

                opeSeq1 = oldSeq1.substring(0,counterSeq1) + oldSeq1.substring(counterSeq1+1,rawSequence1.length-1)
                type = ("Insertion");
            }



            counterSeq1--;
        }
        else if(uniquePath[counterUniquePath][0] === uniquePath[counterUniquePath-1][0] && uniquePath[counterUniquePath][1] !== uniquePath[counterUniquePath-1][1]){
            //Horizontal move

            if(oldSeq1.length-1 === counterSeq1) {
                opeSeq1 = oldSeq1.substring(0, counterSeq1 + 1) + oldSeq2.substring(counterSeq2, counterSeq2 + 1)
                type = ("Insertion");
            }
            else{
                opeSeq1 = oldSeq1.substring(0, counterSeq1 + 1) + oldSeq2.substring(counterSeq2, counterSeq2 + 1) + oldSeq1.substring(counterSeq1+1,oldSeq1.length+1);
                type = ("Insertion");
            }

            if(oldSeq2.length-1 === counterSeq2){
                opeSeq2 = oldSeq2.substring(0,counterSeq2)
                type = ("Delete");
            }
            else{
                opeSeq2 = oldSeq2.substring(0,counterSeq2) + oldSeq2.substring(counterSeq2+1,rawSequence2.length-1)
                type = ("Delete");

            }


            counterSeq2--;
        }
        else{
            //Diagonal move
            type = "Match/Pass";
            if(oldSeq1[counterSeq1] !== oldSeq2[counterSeq2]){
                type = "Substitution";
                opeSeq1 = oldSeq1.substring(0, counterSeq1) + oldSeq2.substring(counterSeq2,counterSeq2+1) + oldSeq1.substring(counterSeq1 +1, oldSeq1.length+1);
                opeSeq2 = oldSeq2.substring(0, counterSeq2) + oldSeq1.substring(counterSeq1,counterSeq1+1) + oldSeq2.substring(counterSeq2 +1, oldSeq2.length+1);
            }

            counterSeq1--;
            counterSeq2--;
        }
        rows.push({id: counterUniquePath, coordinates: uniquePath[counterUniquePath], type: type,seq1:modSequence1[counterUniquePath-1],seq2:modSequence2[counterUniquePath-1], score: transfMatrix[uniquePath[counterUniquePath][0]][uniquePath[counterUniquePath][1]], operation1: oldSeq1 + " -> " + opeSeq1, operation2: oldSeq2 + " -> " + opeSeq2});
        oldSeq1 = opeSeq1;
        oldSeq2 = opeSeq2;
        counterUniquePath--;

    }


//----------------------------------------------------------

    // let counter2 = uniquePath.length - 1
    // let longestSeq = rawSequence1;
    // let counterSeq1 = rawSequence1.length-1
    // let counterSeq2 = rawSequence2.length-1
    //
    // if(rawSequence2.length > rawSequence1.length){
    //     longestSeq = rawSequence2;
    // }
    // if(uniquePath.length < 2){
    //
    // }
    // else{
    //     while (counter2!== 1){
    //         if(longestSeq===rawSequence1){
    //             //Mouvement vertical
    //             if(uniquePath[counter2][0] !== uniquePath[counter2-1][0] && uniquePath[counter2][1] === uniquePath[counter2-1][1]){
    //                 type = "Delete "+ oldSeq1[counterSeq1];
    //                 opeSeq1 = oldSeq1.substring(0,counterSeq1-1) + oldSeq1.substring(counterSeq1+1,rawSequence1.length-1)
    //
    //
    //                 counterSeq1=counterSeq1-1;
    //
    //             }
    //             //Mouvement Horizontal
    //             else if(uniquePath[counter2][0] === uniquePath[counter2-1][0] && uniquePath[counter2][1] !== uniquePath[counter2-1][1]){
    //                 type = "Insert "+ oldSeq2[counterSeq2]
    //                 opeSeq1 = oldSeq1.substring(0,counterSeq1)+ rawSequence2[counterSeq2] + oldSeq1(counterSeq1+1,oldSeq1.length-1)
    //
    //                 counterSeq2=counterSeq2-1;
    //
    //             }
    //             //Mouvement Diagonal
    //             else{
    //                 type = "Pass (Match)"
    //
    //                 counterSeq1=counterSeq1-1;
    //                 counterSeq2=counterSeq2-1;
    //
    //             }
    //         }
    //         else{
    //             //Mouvement vertical
    //             if(uniquePath[counter2][0] !== uniquePath[counter2-1][0] && uniquePath[counter2][1] === uniquePath[counter2-1][1]){
    //                 type = "Insert "+ oldSeq1[counterSeq1]
    //                 opeSeq2 = oldSeq2.substring(0,counterSeq2)+ rawSequence1[counterSeq1] + oldSeq2(counterSeq2+1,oldSeq2.length-1)
    //
    //                 counterSeq1=counterSeq1-1;
    //
    //             }
    //             //Mouvement Horizontal
    //             else if(uniquePath[counter2][0] === uniquePath[counter2-1][0] && uniquePath[counter2][1] !== uniquePath[counter2-1][1]){
    //                 type = "Delete "+ oldSeq2[counterSeq2];
    //                 opeSeq2 = oldSeq2.substring(0,counterSeq2-1) + oldSeq2.substring(counterSeq2+1,rawSequence2.length-1)
    //
    //
    //                 counterSeq2=counterSeq2-1;
    //
    //             }
    //             //Mouvement Diagonal
    //             else{
    //                 type = "Pass (MatchIUE)"
    //
    //                 counterSeq1=counterSeq1-1;
    //                 counterSeq2=counterSeq2-1;
    //
    //             }
    //         }
    //
    //         rows.push({id: counter, coordinates: uniquePath[counter], type: type,seq1:modSequence1[counter-1],seq2:modSequence2[counter-1], score: transfMatrix[uniquePath[counter][0]][uniquePath[counter][1]], operation1: oldSeq1 + " -> " + opeSeq1, operation2: oldSeq2 + " -> " + opeSeq2});
    //         counter2=counter2-1;
    //         oldSeq1 = opeSeq1;
    //         oldSeq2 = opeSeq2;
    //     }
    // }



//---------------------------------------

    // while(counter !== uniquePath.length){
    //     if (modSequence1[counter-1]===modSequence2[counter-1]){
    //        type = "Match";
    //         opeSeq1 = oldSeq1.slice(0,counter-1) + modSequence1[counter-1] + oldSeq1.slice(counter,oldSeq1.length)
    //         opeSeq2 = oldSeq2.slice(0,counter-1) + modSequence2[counter-1] + oldSeq2.slice(counter,oldSeq2.length)
    //
    //     }
    //     else if(modSequence1[counter-1]=== "-" || modSequence2[counter-1] === "-"){
    //         type = "Gap";
    //         if(modSequence1[counter-1]=== "-"){
    //             opeSeq1 = oldSeq1.slice(0,counter-1) + modSequence1[counter-1] + oldSeq1.slice(counter-1,oldSeq1.length)
    //         }
    //         else{
    //             opeSeq2 = oldSeq2.slice(0,counter-1) + modSequence2[counter-1] + oldSeq2.slice(counter-1,oldSeq2.length)
    //         }
    //     }
    //     else{
    //         type = "Mismatch";
    //         opeSeq1 = oldSeq1.slice(0,counter-1) + modSequence1[counter-1] + oldSeq1.slice(counter,oldSeq1.length)
    //         opeSeq2 = oldSeq2.slice(0,counter-1) + modSequence2[counter-1] + oldSeq2.slice(counter,oldSeq2.length)
    //     }
    //
    //
    //     rows.push({id: counter, coordinates: uniquePath[counter], type: type,seq1:modSequence1[counter-1],seq2:modSequence2[counter-1], score: transfMatrix[uniquePath[counter][0]][uniquePath[counter][1]], operation1: oldSeq1 + " -> " + opeSeq1, operation2: oldSeq2 + " -> " + opeSeq2})
    //     counter++;
    //     oldSeq1 = opeSeq1;
    //     oldSeq2 = opeSeq2;
    // }
    /**
     * Allows you to select a box in the table to display it in a dark color on the matrix to better visualize which box it is
     * @param event
     * @param id
     */
    function handleClick(event, id) {

        choosedId = id;

        chooseCase(uniquePath[id]);
        //choosePathCounter(choosedId); Mettre ici la fonction qui va eclairer la case sur la matrice

    }

    return (
        <div style={{ height: 600, width: '40%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 20 },
                    },
                }}
                pageSizeOptions={[5, 10,20,50,100]}
                disableMultipleSelection //Disable multiple selection, we only want one boxe/case at a time
                onCellClick={(rows,event) => handleClick(event, rows.id)}
                rowHeight={30}
            />
        </div>
    );
}