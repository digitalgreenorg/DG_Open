import React, { useEffect, useState } from 'react'
import styles from "./connectorStatistics.module.css"
import  "../../../Assets/CSS/common.css"
import { Tooltip } from '@mui/material'
import { Zoom } from '@material-ui/core'
import { dateTimeFormat } from '../../../Utils/Common'
import NoDataAvailable from '../NoDataAvailable/NoDataAvailable'

const ConnectorStatistics = ({additionalConnectorData}) => {
  const [connectorData, setConnectorData] = useState([])
  useEffect(()=>{
    console.log(additionalConnectorData)
    if(additionalConnectorData){

      setConnectorData([...additionalConnectorData.results])
    }else{
      return
    }
  },[additionalConnectorData])
  return (
    <div className={styles.connectorStatisticsMainBox}>

      <div className={styles.connectorStatisticsHeading}>Dataset connector statistics</div>
      
        <table className={styles.tableConnector}>
{connectorData.length <= 0 ?<div className={styles.nodatacenter}> <NoDataAvailable/> </div>: <div>

          <thead className={styles.thead}>

          <tr className={styles.tableConnectortrth}>
            <th>Dataset name</th>
            <th>Connectors</th>
            <th>Activity</th>
            <th>Date</th>
          </tr>
          </thead>
            <tbody>

          { additionalConnectorData ? connectorData.map((eachConnector)=>(<tr className={styles.tableConnectortrtd}>
            {/* <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={eachConnector.connector_name}> */}
               <td >{eachConnector.name}</td>
            {/* </Tooltip> */}
            {/* <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={eachConnector.dataset_count}>  */}
            <td>{eachConnector.connector_count}</td>
            {/* </Tooltip> */}
            {/* <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={eachConnector.activity}> */}
              <td >{eachConnector.activity}</td>
              {/* </Tooltip> */}
            {/* <Tooltip placement='bottom-start'  TransitionComponent={Zoom} title={eachConnector.updated_at}>  */}
            <td >{dateTimeFormat(eachConnector.updated_at, false)}</td>
            {/* </Tooltip> */}
           
           
            
           
          </tr> 

)

)  : ""}
</tbody> </div> }
          
        </table>
      
    </div>
  )
}

export default ConnectorStatistics