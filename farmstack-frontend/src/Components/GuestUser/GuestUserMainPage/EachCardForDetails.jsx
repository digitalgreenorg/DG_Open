import { Avatar } from '@mui/material'
import React from 'react'
import { Button } from 'react-bootstrap'
import styles from "./guest_user_main_page.module.css"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import StorageIcon from '@mui/icons-material/Storage';
import GroupsIcon from '@mui/icons-material/Groups';
import UrlConstant from '../../../Constants/UrlConstants';
const EachCardForDetails = (props) => {
    const { heading, no, address, icon, eachData, setIsViewDetails, setViewDetailData } = props
    return (
        <span className={styles.main_card} >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
                <div style={{ background: "rgba(228, 228, 228,0.2)", width: "300px", display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "10px", padding: "5px" }}>
                    {/* <img height={"80px"} width={"80px"} src={eachData?.organization?.logo} alt="" style={{ borderRadius: "50%", border: "2px solid white" }} /> */}
                    {eachData?.organization?.logo ? <Avatar alt="Remy Sharp" src={UrlConstant.base_url_without_slash + eachData?.organization?.logo} sx={{ width: 80, height: 80 }} /> :
                        <Avatar sx={{ bgcolor: "#c09507", width: 80, height: 80 }} aria-label="recipe">{eachData?.organization?.name?.charAt(0)}</Avatar>}
                    <h4>{eachData?.organization.name}</h4>
                    <p style={{ display: "flex", justifyContent: "center", alignItems: "center" }} > <LocationOnIcon fontSize='small' />
                        <span>
                            {eachData?.organization?.address?.country ? eachData.organization.address.country : "Bangalore, India"}
                        </span>
                    </p>
                    <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: "10px" }}>
                        <span style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "end" }}>
                            <span style={{ display: "flex", flexDirection: "column", textAlign: "left", padding: "0px 10px" }}>
                                <span style={{ fontWeight: "600", fontSize: "20px" }}>
                                    <StorageIcon style={{ height: "40px", width: "30px", marginRight: "10px" }} />
                                    {+eachData?.dataset_count > 9 ? eachData?.dataset_count : "0" + eachData?.dataset_count}
                                </span>
                                <span>
                                    Datasets
                                </span>
                            </span>
                        </span>
                        <span style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "end" }}>
                            <span style={{ display: "flex", flexDirection: "column", textAlign: "left", padding: "0px 10px" }}>
                                <span style={{ fontWeight: "600", fontSize: "20px" }}>
                                    <GroupsIcon style={{ height: "40px", width: "30px", marginRight: "10px" }} />
                                    {+eachData?.users_count > 9 ? eachData?.users_count : "0" + eachData?.users_count}
                                </span>
                                <span>
                                    Pariticipants
                                </span>
                            </span>
                        </span>
                    </span>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setViewDetailData(eachData)
                            setIsViewDetails(true)
                        }
                        }
                        className={styles.btncolor} >View details</Button>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
            </div>

        </span >
    )
}

export default EachCardForDetails