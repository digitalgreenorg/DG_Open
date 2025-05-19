import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ConnectorStatistics from '../../Components/Dashboard/ConnectorStatistics/ConnectorStatistics'
import DataExchangeTrends from '../../Components/Dashboard/DataExchangeTrends/DataExchangeTrends'
import Datasets from '../../Components/Dashboard/Datasets/Datasets'
import DatasetsCategory from '../../Components/Dashboard/DatasetsCategory/DatasetsCategory'
import SupportRequest from '../../Components/Dashboard/SupportRequest/SupportRequest'
import TodoList from '../../Components/Dashboard/TodoList/TodoList'
import Loader from '../../Components/Loader/Loader'
import Navbar from '../../Components/Navbar/Navbar'
import UrlConstant from '../../Constants/UrlConstants'
import HTTPService from '../../Services/HTTPService'
import { GetErrorHandlingRoute, toTitleCase } from '../../Utils/Common'
import styles from "./dashboard.module.css"
const Dashboard = () => {
  const [allDashboardDetails, setAllDashboardDetails] = useState([]);
  const [dataForThePieChart, setDataForThePieChart] = useState([])
  const [colors, setColors] = useState([])
  const [supportRequestData, setSupportRequestData] = useState(null)
  const [connectorData, setConnectorData]= useState({results :[]})
  const [additionalConnectorData, setAdditionalConnectorData]= useState(null)
  const [isLoader, setIsLoader] = useState(false);
  const history = useHistory();


  
   function getData(){
    setIsLoader(true)
    let method = "GET";
    let url = UrlConstant.base_url + UrlConstant.datahub_dashboard ;
    let data = "";
    HTTPService(
      method,
      url,
      data,
      false,
      true,
    )
    .then((res)=>{
      // console.log(res.data, "RESPONSE")
      let data = []
       for(var key in res.data.categories){
        // console.log(key)
        let obj = {name : toTitleCase(key.split("_").join(" ")) , value : res.data.categories[key]};
        if(res.data.categories[key]){

          data.push(obj)
        }
      } 
      
      // for(var key in ){
        //   // console.log(key)
        //   // let obj ={id : res.data.support_tickets.recent_tickets[id] ,
        //   //           value : res.data.categories[key]
        //   //               };
        //   // data.push(obj)
        
        // }
        setSupportRequestData({...res.data.support_tickets})
        // console.log(res.data.support_tickets)
        const COLORS = [
          "#E7B100",
          "#402769",
          "#FD7B25",
          "#836400",
          "#34568B",
          "#F7CAC9",
          "#92A8D1",
          "#096D0D",
          "#3BBFCC",
          "#B565A7",
        ];
        setColors([...COLORS])
        
        
        
        setDataForThePieChart([...data])
        setAdditionalConnectorData({...res.data.datasets})
        setConnectorData([...res.data.datasets.results])
        
        setIsLoader(false)
      })
    .catch((e)=>{
      setIsLoader(false)
      // console.log(e)
      history.push(GetErrorHandlingRoute(e));
    })
  }
  

  useEffect(()=>{
    if(!supportRequestData){
      getData()
    }else{
      return
    }

  },[supportRequestData])
  
  return (
    <>
     {isLoader ? <Loader /> : ""}
    <TodoList />
    <div className={styles.fourChartParent}>
    <Datasets colors={colors} dataForThePieChart={dataForThePieChart}/>
    <DatasetsCategory dataForThePieChart={dataForThePieChart}/>
    <DataExchangeTrends dataForThePieChart={dataForThePieChart} allDashboardDetails={allDashboardDetails}/>
    <SupportRequest supportRequestData={supportRequestData}/>
    </div>
     <ConnectorStatistics additionalConnectorData={additionalConnectorData} /> 
    </>
  )
}

export default Dashboard