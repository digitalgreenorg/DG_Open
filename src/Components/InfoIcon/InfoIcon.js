import React from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InfoIcon1 from '@mui/icons-material/Info';
import { Tooltip } from '@mui/material';
import styles from "./info.module.css"


const InfoIcon = (props) => {

  return (
    <div className={styles.infoIcon}>
        <Tooltip followCursor placement='top-start' title={props.text}>
       
    <div>

        <InfoIcon1 sx={{fontSize:"18px"}}/>
    </div>

        </Tooltip>
        </div>
  )
}

export default InfoIcon