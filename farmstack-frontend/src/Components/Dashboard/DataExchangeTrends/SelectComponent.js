import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import labels from '../../../Constants/labels'

const SelectComponent = ({filterPeriod, setFilterPeriod}) => {

  return (<FormControl fullWidth>
    <InputLabel variant="standard" htmlFor="uncontrolled-native">
     <span style={{fontSize:"12px", lineHeight:"16px"}}>
        {labels.en.dashboard.period}
        </span> 
    </InputLabel>
    <NativeSelect
    style={{fontSize:"14px"}}
      defaultValue={24}
      inputProps={{
        name: 'Period',
        id: 'uncontrolled-native',
      }}
      onChange={(e)=> {
        console.log(filterPeriod)
        setFilterPeriod(e.target.value)}}
    >
      
      {/* <option value={24 * 7}>{labels.en.dashboard.week}</option> */}
      <option value={24 * 30}>{labels.en.dashboard.month}</option>
      {/* <option value={365 * 24}>{labels.en.dashboard.yearly}</option> */}
      <option value={24}>{labels.en.dashboard.day}</option>
    </NativeSelect>
  </FormControl>
  )
}

export default SelectComponent