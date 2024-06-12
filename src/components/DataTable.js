import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Data table which gives information on all the optimal paths
 * @param allPath
 * @param choosePathCounter
 * @param allAlignedResult
 * @returns {Element}
 * @constructor
 */
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

    /**
     * Allows you to select an optimal path in the table to display it in the matrix
     * @param event
     * @param id
     */
    function handleClick(event, id) {
        choosedId = id;
        choosePathCounter(choosedId);
    }

    return (
        /**
         * This data grid has been created on base of the MUI DataGrid documentation : https://mui.com/x/react-data-grid/
         */
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
                disableMultipleSelection //We only want one path at a time
                onCellClick={(rows,event) => handleClick(event, rows.id)}
                rowHeight={30}
            />
        </div>
    );
}