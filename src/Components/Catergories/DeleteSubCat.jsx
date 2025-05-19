import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AccountCircle } from '@material-ui/icons';
import { FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select } from '@mui/material';
import SelectorForCategories from './SelectorForCategories';
import { Row } from 'react-bootstrap';
import { useState } from 'react';

export default function DeleteSubCat(props) {

    const { deleteSubCat, sub_cat_handler, action, sub_value, isRename, setIsRename, open, setopen, handleClickOpen, handleClose, input, setInput, boxType, handler, inputLabel, value, data, helperText, setListSubCategory, ListOfSubCategory, listOfSubCategoriesForSelected } = props

    const [selected, setSelected] = useState("")
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete sub category </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select a category and sub categories to delete
                    </DialogContentText>
                    <Row>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-helper-label">{inputLabel}</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={value}
                                label={"inputLabel"}
                                onChange={handler}
                            >

                                {data.map((each, index) => {
                                    return <MenuItem key={index} value={each.category ? each.category : each.sub_category}>{each.category ? each.category : each.sub_category}</MenuItem>
                                })}
                            </Select>
                            <FormHelperText>{helperText ? helperText : ""}</FormHelperText>
                        </FormControl>
                        {/* <SelectorForCategories handler={handler} inputLabel={inputLabel} value={value} data={data} helperText={"Please select anyone category"} /> */}
                    </Row>
                    <Row>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-helper-label">Sub category</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={sub_value}
                                label={"inputLabel"}
                                onChange={sub_cat_handler}
                            >

                                {listOfSubCategoriesForSelected.map((each, index) => {
                                    return <MenuItem key={index} value={each.category ? each.category : each.sub_category}>{each.category ? each.category : each.sub_category}</MenuItem>
                                })}
                            </Select>
                            <FormHelperText>{helperText ? "Please select anyone sub category" : ""}</FormHelperText>
                        </FormControl>
                        {/* <SelectorForCategories handler={handler} inputLabel={inputLabel} value={value} data={data} helperText={"Please select anyone category"} /> */}
                    </Row>
                    <Row>

                    </Row>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={sub_value ? false : true} onClick={() => {
                        action(sub_value, value)
                        handleClose()
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}