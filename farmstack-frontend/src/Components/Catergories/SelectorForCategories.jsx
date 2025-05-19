import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material'
import React from 'react'
import MenuItem from '@mui/material/MenuItem';
const SelectorForCategories = (props) => {
    const { handler, inputLabel, value, data, helperText } = props
    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">{inputLabel}</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={value}
                    label={inputLabel}
                    onChange={handler}
                >
                    {/* <MenuItem value="">
                        <em>None</em>
                    </MenuItem > */}
                    {data.map((each, index) => {
                        return <MenuItem key={index} value={each.category ? each.category : each.sub_category}>{each.category ? each.category : each.sub_category}</MenuItem>
                    })}


                </Select>
                <FormHelperText>{helperText ? helperText : ""}</FormHelperText>
            </FormControl></>
    )
}

export default SelectorForCategories