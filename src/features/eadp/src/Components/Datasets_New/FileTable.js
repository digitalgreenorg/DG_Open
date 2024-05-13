import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import './FileTable.css'

const FileTable = ({ fileData }) => {
    return (
        <div
            style={{ overflow: "auto", maxHeight: '300px' }}
            className='mt-20 b-1'
        >
            <Table
                sx={{
                    "& .MuiTableCell-root": {
                        borderLeft: "1px solid rgba(224, 224, 224, 1)"
                    }
                }}
            >
                <TableHead sx={{ background: "#F8F8F8 !important" }}>
                    {fileData?.content?.map((itm2, i) => {
                        if (i === 0) {
                            return (
                                <TableRow>
                                    {Object.keys(itm2).map((itm3, i) => {
                                        return <TableCell className='file_table_column'> {itm3} </TableCell>;
                                    })}
                                </TableRow>
                            );
                        }
                    })}
                </TableHead>
                <TableBody>
                    {fileData?.content?.map((itm2) => {
                        return (
                            <TableRow>
                                {Object.values(itm2).map((itm3, i) => {
                                    console.log(itm3, "Values in view");
                                    return <TableCell className='file_table_row'> {`${itm3}`} </TableCell>;
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>

    )
}

export default FileTable