import { Button } from '@mui/material'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import data_transfer from "../../../Assets/Img/explore_dataset.svg"
import login_datahub from "../../../Assets/Img/login_datahub.svg"


import styles from "./guest_user_main_page.module.css"

const LeftRightDescription = (props) => {
    const { setIsExploreDatasetViewOn } = props
    const history = useHistory()
    function topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
    return (
        <Container>
            <Row style={{ borderTopLeftRadius: "50px" }} className={styles.desc_detail}>
                <Col lg={6} className={styles.imageCol}>
                    <img className={styles.image} style={{ borderRadius: "10px", overflow: "hidden" }} src={data_transfer} alt="data_transfer" />
                </Col>
                <Col style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }} lg={6}>
                    <p className={styles.paragraph} >
                        Cutting-edge data management platform for curation, distribution, and administration of datasets with a state-of-the-art data hub and comprehensive data sets for research and analysis.
                    </p>
                    <Button variant="outlined"
                        className={styles.explore_btn}
                        onClick={() => {
                            setIsExploreDatasetViewOn(true)
                            topFunction()
                        }
                        }>
                        Explore datasets
                    </Button>
                </Col>
            </Row>
            <Row style={{ borderBottomRightRadius: "50px" }} className={styles.desc_detail_rev}>
                <Col style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }} lg={6}>
                    <p className={styles.paragraph}>
                        Unlock valuable insights and informed decision-making! Register or login now to access our advanced data management platform with a state-of-the-art data hub and comprehensive datasets.
                    </p>
                    <span>
                        <Button variant="outlined"
                            onClick={() => history.push("/login")}
                            className={styles.explore_btn}>
                            Login now
                        </Button>
                        <Button variant="outlined"
                            onClick={() => history.push("/participantregistration")}
                            className={styles.explore_btn}>
                            Register now
                        </Button>
                    </span>
                </Col>
                <Col className={styles.imageCol} lg={6}>
                    <img className={styles.image} style={{ borderRadius: "10px", overflow: "hidden" }} src={login_datahub} alt="data_transfer" />
                </Col>
            </Row>
        </Container >
    )
}

export default LeftRightDescription