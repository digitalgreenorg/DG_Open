import React from 'react'
import { Checkbox, FormControlLabel } from '@mui/material'
import { Col, Container, Row } from 'react-bootstrap'
import styles from "./card_detail.module.css"
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
const CardDetail = (props) => {
    const { setIsAllConditionForSaveMet, temporaryDeletedCards, setTemporaryDeletedCards, generateData, setCompleteJoinData, completedJoinData, setTotalCounter, orgList, data, setCompleteData, index, completeData } = props

    const handleCheckColumns = (e, value) => {
        let arr = [...completeData]
        let present_card = { ...data }
        if (e.target.checked && !present_card.columnsSelected.includes(value) && present_card.availabeColumns.includes(value)) {
            present_card["columnsSelected"] = [...present_card.columnsSelected, value]
            arr[index] = { ...present_card }
            setCompleteData([...arr])
        }
        else if (!e.target.checked && present_card?.columnsSelected?.includes(value) && present_card.availabeColumns?.includes(value)) {
            let i = present_card.columnsSelected.indexOf(value)
            if (i > -1) {
                present_card.columnsSelected.splice(i, 1)
            }
            arr[index] = present_card
            setCompleteData([...arr])
        }
    }
    const handleSelectAll = (e) => {
        let arr = [...completeData]
        let present_card = { ...data }
        if (e.target.checked) {
            present_card["columnsSelected"] = [...present_card.availabeColumns]
        } else {
            present_card["columnsSelected"] = []
        }
        arr[index] = { ...present_card }
        setCompleteData([...arr])
    }

    const handleDeleteCard = () => {
        let arr = [...completeData]
        // generateData(index, "delete_map_card")

        if ((index == arr.length - 1) && arr.length > 2) {
            setIsAllConditionForSaveMet(true)
        } else {
            setIsAllConditionForSaveMet(false)
        }
        console.log(temporaryDeletedCards)
        // .then(()=>{
        let obj
        if (index != 0) {
            obj = arr[index - 1]
            obj["right_on"] = []
            obj["type"] = ""
            obj["next_left"] = []
            arr[index - 1] = obj
        }
        arr.splice(index, 1)

        let deleteArr = []
        let start = index == 0 ? index : index - 1
        for (let i = start; i < completeData.length; i++) {
            console.log(index, i, temporaryDeletedCards)
            if (!temporaryDeletedCards?.includes(completeData[i]["map_id"]) && completeData[i]["map_id"]) {
                deleteArr.push(completeData[i]["map_id"])
            }
        }
        setTemporaryDeletedCards([...temporaryDeletedCards, ...deleteArr])


        setCompleteData([...arr])
        setTotalCounter((prev) => prev - 1)
        // })
    }
    useEffect(() => {
    })
    return (
        <>
            <div className={styles.mainBox + " mainBoxInIntegration"}>
                <Row className={styles.topRowOfCard}>
                    <Col lg={4}>
                        <div>Organisation name</div>
                        <div className='d-inline-block text-truncate' style={{ maxWidth: "300px" }}>{data?.org_name ? data.org_name : ""}</div>
                    </Col>
                    <Col lg={3}>
                        <div>Dataset name</div>
                        <div className='d-inline-block text-truncate' style={{ maxWidth: "250px" }}>{data?.dataset_name ? decodeURI(data.dataset_name) : ""}</div></Col>
                    <Col lg={3}> <div>File name</div>
                        <div className='d-inline-block text-truncate' style={{ maxWidth: "250px" }}>{data?.file_name ? decodeURI(data.file_name.split("/")[data.file_name.split("/").length - 1]) : ""}</div></Col>
                    <Col lg={2}> <span style={{ borderRadius: "50%", minHeight: "34px", width: "34px", background: "white", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "auto" }}>  <DeleteIcon fontSize='small' id="deleteFileBtn" color='secondary' onClick={handleDeleteCard} className={styles.deleteicon + " deleteicon"} /> </span></Col>
                </Row>
                <Row className={styles.selectAllRow}>
                    <Col lg={12}>
                        <div id='selectAllCol'>Select columns</div>
                        <div> <FormControlLabel control={<Checkbox checkedIcon={<CloseIcon />} checked={data?.availabeColumns?.length == data?.columnsSelected?.length} onChange={(e) => handleSelectAll(e)} />} label={data?.availabeColumns?.length != data?.columnsSelected?.length ? "Select all" : "Clear"} /></div>
                    </Col>
                </Row>
                <Row className={styles.columnsRow}>
                    <Col lg={12} className={styles.selectColumns}>
                        {data?.availabeColumns?.length > 0 && data.availabeColumns.map((eachCol, in_) => {
                            return <FormControlLabel key={in_} id="eachCol" className={styles.eachCol + " text-truncate"} control={<Checkbox checked={data?.columnsSelected?.includes(eachCol)} onChange={(e) => handleCheckColumns(e, eachCol)} />} label={eachCol} />
                        })}
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default CardDetail