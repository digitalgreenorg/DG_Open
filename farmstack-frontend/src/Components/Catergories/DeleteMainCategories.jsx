import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AccountCircle } from '@material-ui/icons';
import { InputAdornment } from '@mui/material';
import SelectorForCategories from './SelectorForCategories';
import { Row } from 'react-bootstrap';

export default function Deletecategories(props) {

    const { action, isRename, setIsRename, open, setopen, handleClickOpen, handleClose, input, setInput, boxType, handler, inputLabel, value, data, helperText, setListSubCategory, ListOfSubCategory } = props

    console.log(data)
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete category / Rename</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select a category to delete
                    </DialogContentText>
                    <Row>
                        <SelectorForCategories handler={handler} inputLabel={inputLabel} value={value} data={data} helperText={"Please select anyone category"} />
                    </Row>
                    <Row>

                        {/* <TextField
                            autoFocus
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            id="input-with-icon-textfield"
                            label="Add sub category"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                            variant="standard"
                        /> */}
                    </Row>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={value ? false : true} onClick={() => {
                        action(value)
                        handleClose()
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}