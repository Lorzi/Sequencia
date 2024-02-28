import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function SubTable({uniquePath,modSequence1,modSequence2, transfMatrix, chooseCase}) {

    let choosedId = 0;
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'coordinates', headerName: 'Coordinates', width: 100 },
        { field: 'type', headerName: 'Type', width: 100 },
        { field: 'score', headerName: 'Score', width: 100 },
        { field: 'seq1', headerName: 'Sequence 1', width: 300 },
        { field: 'seq2', headerName: 'Sequence 2', width: 300 },
    ];

    let rows = [];
    let counter = 1;
    let type = "";
    rows.push({id: 0, coordinates: [0,0], type: "Init",seq1:"-",seq2:"-", score: 0})

    while(counter !== uniquePath.length){
        if (modSequence1[counter-1]===modSequence2[counter-1]){
           type = "Match";
        }
        else if(modSequence1[counter-1]=== "-" || modSequence2[counter-1] === "-"){
            type = "Gap";
        }
        else{
            type = "Mismatch";
        }

        rows.push({id: counter, coordinates: uniquePath[counter], type: type,seq1:modSequence1[counter-1],seq2:modSequence2[counter-1], score: transfMatrix[uniquePath[counter][0]][uniquePath[counter][1]]})
        counter++;
    }
    function handleClick(event, id) {
        console.log(id);
        choosedId = id;

        chooseCase(uniquePath[id]);
        //choosePathCounter(choosedId); Mettre ici la fonction qui va eclairer la case sur la matrice

    }

    return (
        <div style={{ height: 800, width: '50%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 20 },
                    },
                }}
                pageSizeOptions={[20]}
                disableMultipleSelection //Désactive la séléction multiple, on ne veut qu'un chemin a la fois
                onCellClick={(rows,event) => handleClick(event, rows.id)}
                rowHeight={30}
            />
        </div>
    );
}