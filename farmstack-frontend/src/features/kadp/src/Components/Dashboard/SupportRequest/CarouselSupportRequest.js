import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import NoDataAvailable from "../NoDataAvailable/NoDataAvailable";
import SliderCard from "./SliderCard";
import styles from "./supportRequest.module.css";
function CarouselSupportRequest({ supportRequestData }) {
  // console.log(first)
  const [ticketDetails, setTicketDetails] = useState(null);
  const [supportRequestDatafinal, setSupportRequestData] = useState([]);

  useEffect(() => {
    if (supportRequestData) {
      console.log("ASASASA", supportRequestData);
      setTicketDetails({
        closed_requests: supportRequestData.closed_requests,
        hold_requests: supportRequestData.hold_requests,
        open_requests: supportRequestData.open_requests,
      });

      setSupportRequestData([...supportRequestData.recent_tickets]);
    } else {
      return;
    }
    // console.log("Caroisel",supportRequestData)
  }, [supportRequestData]);
  return (
    <div className={styles.my__carousel_main}>
      {supportRequestDatafinal.length > 0 ? (
        <Carousel controls={true} indicators={true}>
          {supportRequestDatafinal
            ? supportRequestDatafinal.map((supportRequestDataEach) => (
                <Carousel.Item>
                  <SliderCard
                    ticketDetails={ticketDetails}
                    supportRequestData={supportRequestDataEach}
                  />
                  <Carousel.Caption>
                    {/* <h3>First slide label</h3>
        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p> */}
                  </Carousel.Caption>
                </Carousel.Item>
              ))
            : ""}
        </Carousel>
      ) : (
        <NoDataAvailable />
      )}
    </div>
  );
}

export default CarouselSupportRequest;
