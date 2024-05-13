import React, { useEffect, useState } from 'react'
import styles from "./datasets.module.css"



const PieChartsSideMenu = ({data,COLORS}) => {

const [sideMenuDetailsWithColorAndData, setSideMenuDetailsWithColorAndData] = useState([])


function percentage(partialValue, totalValue) {
    console.log(partialValue, totalValue)
    return (100 * partialValue) / totalValue;
 } 
 useEffect(()=>{
     let total=0
     let colorDataArray = []
         for(let i=0; i<data.length; i++){
             total += data[i].value;
         }  
    
         for(let i=0;i<data.length;i++){
             let percentValue = Math.round(percentage(+data[i].value, +total));
             let color = COLORS[i];
             let titleOfDataSetforChart = data[i].name
             colorDataArray.push({percentValue, color,titleOfDataSetforChart});
             console.log(colorDataArray)
         }
    setSideMenuDetailsWithColorAndData([...colorDataArray])
    

},[])
// console.log(data,COLORS)
  return (
    <div className={styles.datasetSideMenu}>
        {sideMenuDetailsWithColorAndData.map((eachDataSetEntry)=>  <div className={styles.datasetSideMenuEachData}>
                <div style={{width:"20px", height:"20px", background:`${eachDataSetEntry.color}`, marginRight:"14px"}}></div>
                <span className={styles.datasetSideMenuTextWithPercent}>{eachDataSetEntry.percentValue }% {eachDataSetEntry.titleOfDataSetforChart}</span>
            </div>
        )}
    </div>
  )
}

export default PieChartsSideMenu