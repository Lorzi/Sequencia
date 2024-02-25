import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function DataTable({allPath,choosePathCounter,allAlignedResult}) {

    let choosedId = 0;
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'path', headerName: 'Path', width: 130 },
        { field: 'result', headerName: 'Result of the alignment', width: 300 },
    ];

    let rows = [];
    let counter = 0;
    while(counter !== allPath.length){
        rows.push({id: counter, path: allPath[counter],result: allAlignedResult[counter][0] +" "+allAlignedResult[counter][1]})
        counter++;
    }
    function handleClick(event, id) {
        console.log(id);
        choosedId = id;
        choosePathCounter(choosedId);

    }

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                disableMultipleSelection //Désactive la séléction multiple, on ne veut qu'un chemin a la fois
                onCellClick={(rows,event) => handleClick(event, rows.id)}
            />
            <div>
                blablabla
            </div>
            <div>
                BLABLABLA
            </div>
        </div>
    );
}