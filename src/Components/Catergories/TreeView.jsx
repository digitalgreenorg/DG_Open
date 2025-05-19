import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import DeleteIcon from '@mui/icons-material/Delete';
import { Checkbox, FormControl, InputLabel, ListSubheader, Menu, MenuItem, Select } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useState } from 'react';
export default function TreeViewComponent(props) {
    const { data, setData } = props
    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState([]);
    const [originalValue, setOriginalValue] = useState("")
    const [arr, setArr] = useState([])
    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
    };

    const handleExpandClick = () => {
        setExpanded((oldExpanded) =>
            oldExpanded.length === 0 ? ['1', '5', '6', '7'] : [],
        );
    };

    const handleSelectClick = () => {
        setSelected((oldSelected) =>
            oldSelected.length === 0 ? ['1', '2', '3', '4', '5', '6', '7', '8', '9'] : [],
        );
    };
    const handleEdit = (e, value) => {
        // console.log(e.target.value, value)
        setOriginalValue(value)
    }
    const handleCheckForCategory = (e, value) => {
        // if (e.target.checked){
        //     // arr
        // } 

        // // setArr([...arr, value])



        // else {
        //     const index = arr.indexOf(value);
        //     if (index > -1) { // only splice array when item is found
        //         let newArray = [...arr]
        //         newArray.splice(index, 1); // 2nd parameter means remove one item only
        //         setArr([...newArray])
        //     }
        // }
        // console.log(arr)
    }
    const handleCheck = (e, value, parent) => {
        let newArr = [...arr]
        if (e.target.checked) {
            for (let i = 0; i < newArr.length; i++) {
                if (newArr[i].parent == parent) {
                    newArr[i].sub_cat.push(value)
                    setArr([...newArr])
                    return
                }
            }
            let obj = { parent: parent, sub_cat: [value] }
            newArr.push(obj)
            setArr([...newArr])
            return
        }
        else {
            let newArr = arr.filter((item) => item.value != value)
            setArr([...newArr])
        }
        console.log(arr)
    }
    const [select, setSelect] = useState("")

    const handleDeleteCategories = () => {
        // for(let i=0; i<data.length; i++){
        //     if(data[i].category)
        // }
    }
    return (
        // <Box sx={{ height: 270, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}>
        <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel htmlFor="grouped-select">Categories preview</InputLabel>
            <Select value={select} onChange={(e) => setSelect(e.target.value)} defaultValue="" id="grouped-select" label="Preview">


                {data.map((eachCat, index) => {
                    let count = 0
                    return <>
                        <span style={{ display: "flex", background: "#c09507", color: "white" }}>
                            <ListSubheader sx={{ background: "#c09507", color: "white" }} ><span style={{ fontWeight: "500", fontSize: "16px", background: "#c09507" }}> {eachCat.category}</span></ListSubheader>
                        </span>
                        {eachCat.children.length > 0 && eachCat.children.map((eachSubCat, sub_index) => {
                            return <span style={{ display: "flex" }}>
                                <MenuItem style={{ flex: "2", textAlign: "center" }} value={eachSubCat.sub_category}>
                                    {eachSubCat.sub_category}
                                </MenuItem>

                            </span>
                        })}
                    </>
                })}
            </Select>
        </FormControl>



    );
}