import React, { Component } from "react";
import { Container, Row } from "react-bootstrap";
import Slider from "react-slick";
import EachCardForDetails from "./EachCardForDetails";
import icon from "../../../Assets/Img/bellboy.gif"
import GuestUserDatasetCard from "../GuestUserDatasetCard";
import styles from "./guest_user_main_page.module.css"
import { useHistory } from "react-router-dom";

export default function GuestMainPageCarousel(props) {
    const { heading, costewardData, participant, datasets, setIsViewDetails, setViewDetailData } = props
    // render(props) {
    const history = useHistory()
    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 3,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000
    };
    const datasetsetting = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "10px",
        slidesToShow: 3,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 6000
    };
    let data = ["1", "@", "3", 4, 5, 6, 7, 8]
    return (
        <>
            <Container className="carousel_in_guest_user_main_page">
                {/* <Row> */}

                <h2 style={{ margin: "10px 0px 50px 0px" }} >{"Co-Stewards"}</h2>
                <Slider {...settings}>
                    {costewardData.map((each, i) => {
                        return <div>
                            <EachCardForDetails setViewDetailData={setViewDetailData} setIsViewDetails={setIsViewDetails} eachData={each} heading="Participant" icon={icon} />
                        </div>
                    })}
                </Slider>
                <h2 className={styles.margintopbtm} >{"Datasets"}</h2>
                <Slider {...datasetsetting}>
                    {datasets.map((dataset, i) => {
                        return <div>
                            <GuestUserDatasetCard
                                key={dataset.id}
                                // isMemberTab={props.isMemberTab}
                                title={dataset.name}
                                orgName={dataset.organization.name}
                                visiblity={dataset.is_public}
                                publishedon={dataset.updated_at}
                                constantly_update={dataset.constantly_update}
                                // cropDetail={dataset.crop_detail}
                                geography={dataset.geography}
                                orgLogo={dataset.organization.logo}
                                description={dataset.description}
                                id={dataset.id}
                                viewCardDetails={() => history.push("/home/viewdataset/" + dataset.id)}
                                margingtop={"supportcard supportcardmargintop20px"}
                            />
                        </div>
                    })}
                </Slider>
                {/* </Row>
                <Row> */}
                <h2 className={styles.margintopbtm} >{"Participants"}</h2>
                <Slider {...settings}>
                    {participant.map((each, i) => {
                        return <div>
                            <EachCardForDetails setViewDetailData={setViewDetailData} setIsViewDetails={setIsViewDetails} eachData={each} heading="Participant" icon={icon} />
                        </div>
                    })}
                </Slider>



                {/* </Row> */}
            </Container>
        </>
    );
    // }
}