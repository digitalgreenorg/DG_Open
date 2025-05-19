import React, { useState } from 'react'
import styles from "./dataExchange.module.css"
// import styles from "./connectorStatistics.module.css"
import  "../../../Assets/CSS/common.css"
import LineChartGraph from './LineChartGraph'
import SelectComponent from './SelectComponent'
import labels from '../../../Constants/labels'
import NoDataAvailable from '../NoDataAvailable/NoDataAvailable'
import InfoIcon from '../../InfoIcon/InfoIcon'


const DataExchangeTrends = ({dataForThePieChart}) => {
  const [filterPeriod, setFilterPeriod] = useState(24)
  
  return (
    <div style={{padding:"20px"}} className="widht640andheight368pxandborderradius10andborder1pxsolidE4E4E4">
      <div style={{display:"flex"}}>

    <div style={{flex:"3"}} className={styles.dataExchangeHeading}>{labels.en.dashboard.data_exchange_trends} <InfoIcon text={labels.en.dashboard.dataset_exchange_trend}/></div>
   <div style={{flex:"1", width:"640px"}}>
    
   {dataForThePieChart.length >0 ? <SelectComponent filterPeriod={filterPeriod} setFilterPeriod={setFilterPeriod}/> : ""}
    </div>
      </div>
    <div>
     {dataForThePieChart.length >0 ? <LineChartGraph filterPeriod={filterPeriod}/> : <NoDataAvailable/>} 
    </div>
    </div>
  )
}

export default DataExchangeTrends