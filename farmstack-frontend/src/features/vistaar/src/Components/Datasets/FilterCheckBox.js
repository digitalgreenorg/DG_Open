import { Checkbox, FormControlLabel } from '@mui/material'
import React from 'react'
import { Row } from 'react-bootstrap'

export default function FilterCheckBox(props) {
  return (
    <>
      <Row style={{"width":"100%","margin-left":"10px", "margin-right":"10px", "text-align": "left", "word-break": "break-word"}} className="fontweight400andfontsize14pxandcolor3D4A52">
        <FormControlLabel
            control={ 
                <Checkbox
                    checked={props.checked}
                    onChange={props.handleCheckListFilterChange}
                />
            }
            label={props.label}
        />
      </Row>
    </>
  )
}
