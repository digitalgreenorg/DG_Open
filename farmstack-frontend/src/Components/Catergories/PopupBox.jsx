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

export default function PopupBox(props) {

    const { open, setopen, handleClickOpen, handleClose, input, setInput, boxType, ListOfMainCategory, setListMainCategory } = props

    console.log(boxType)

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Category</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <TextField
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        id="input-with-icon-textfield"
                        label="Category"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        handleClose()
                    }}>Cancel</Button>
                    <Button disabled={input ? false : true} onClick={() => {
                        setListMainCategory(input, 0)
                        setInput("")
                        handleClose()
                    }}>Add</Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}