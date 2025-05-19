import React, { useEffect, useState } from 'react'
import styles from "./supportRequest.module.css"
import  "../../../Assets/CSS/common.css"
import CarouselSupportRequest from './CarouselSupportRequest'

const SupportRequest = ({supportRequestData}) => {
  // console.log(supportRequestData)
  const [data, setData] = useState(null)
  useEffect(()=>{
    if(supportRequestData){
      // console.log("AAAA",supportRequestData )
      setData({...supportRequestData})

    }else{
      return
    }
    // console.log(data)
  },[supportRequestData])
  return (
    <div style={{display:"flex", flexDirection:"column", padding:"20px", position:"relative"}} className="widht640andheight368pxandborderradius10andborder1pxsolidE4E4E4">
    
    <div className={styles.supportRequestHeadingDiv} style={{textAlign:"left", marginBottom:"15px", color:"#3D4A52", fontSize:"20px", fontWeight:"700"}} >Support request <div className={styles.yellowDot}></div></div>
    {supportRequestData ?<CarouselSupportRequest supportRequestData={data}/> : ""}
    
    </div>
  )
}

export default SupportRequest