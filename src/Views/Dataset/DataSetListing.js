import React, { useState } from "react";
import DataSetCard from "../../Components/Datasets/DataSetCard";
import { Col, Row } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import {
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import AddDatasetCard from "../../Components/Datasets/AddDatasetCard";
import labels from "../../Constants/labels";
import NoDatasetCard from "../../Components/Datasets/NoDatasetCard";
import { getUserMapId } from "../../Utils/Common";

export default function DataSetListing(props) {
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const history = useHistory();
  const [isLoader, setIsLoader] = useState(false);
  // const viewCardDetails = (id) => {
  //     setIsLoader(true);
  //     HTTPService(
  //     "GET",
  //     UrlConstant.base_url + UrlConstant.dataset+id+"/",
  //     "",
  //     false,
  //     true
  //     )
  //     .then((response) => {
  //         setIsLoader(false);
  //         console.log("filter response:", response);

  //     })
  //     .catch((e) => {
  //         setIsLoader(false);
  //         history.push(GetErrorHandlingRoute(e));
  //     });
  // }
  const getAddUrl = () => {
    // if (getUserMapId() && isLoggedInUserAdmin()) {
    //   return "/datahub/datasets/add";
    // } else if (getUserMapId() && isLoggedInUserParticipant()) {
    //   return "/participant/datasets/add";
    // } else if (getUserMapId() == null && isLoggedInUserAdmin()) {

    // } else if (getUserMapId() == null && isLoggedInUserParticipant()) {

    // }
    if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      return "/datahub/datasets/add";
    } else if (isLoggedInUserParticipant()) {
      return "/participant/datasets/add";
    }
  };

  return (
    <div>
      <Row style={{ "margin-left": "-44px", width: "150%" }}>
        {
          !props.isMemberTab && (
            <AddDatasetCard
              firstText={screenlabels.dataset.add_dataset}
              secondText={screenlabels.dataset.add_dataset_text}
              addevent={() => history.push(getAddUrl())}
            ></AddDatasetCard>
          )
          // <AddCard firstText={screenlabels.addparticipants.firstText} secondText={screenlabels.addparticipants.secondText} addevent={() => history.push('/datahub/participants/add')}></AddCard>
        }
        {(!props.datasetList || props.datasetList.length === 0) && (
          <NoDatasetCard
            firstText={screenlabels.dataset.no_dataset_text1}
            secondText={screenlabels.dataset.no_dataset_text2}
          ></NoDatasetCard>
        )}
        {props.datasetList &&
          props.datasetList.map((dataset) => (
            <DataSetCard
              isMemberTab={props.isMemberTab}
              title={dataset.name}
              constantly_update={dataset.constantly_update}
              orgName={dataset.organization.name}
              visiblity={dataset.is_public}
              publishedon={dataset.created_at}
              cropDetail={"N/A"}
              geography={dataset.geography}
              orgLogo={dataset.organization.logo}
              description={dataset.description}
              id={dataset.id}
              viewCardDetails={() => props.viewCardDetails(dataset.id)}
              margingtop={"supportcard supportcardmargintop20px"}
            />
          ))}
        {/* <DataSetCard
                margingtop={'supportcard supportcardmargintop20px'}
            />
            <DataSetCard
                margingtop={'supportcard supportcardmargintop20px'}
            />
            <DataSetCard
                margingtop={'supportcard supportcardmargintop20px'}
            />
            <DataSetCard
                margingtop={'supportcard supportcardmargintop20px'}
            />
            <DataSetCard
                margingtop={'supportcard supportcardmargintop20px'}
            />
            <DataSetCard
                margingtop={'supportcard supportcardmargintop20px'}
            />
            <DataSetCard
                margingtop={'supportcard supportcardmargintop20px'}
            />
            <DataSetCard
                margingtop={'supportcard supportcardmargintop20px'}
            />
            <DataSetCard
                margingtop={'supportcard supportcardmargintop20px'}
            />
            <DataSetCard
                margingtop={'supportcard supportcardmargintop20px'}
            /> */}
      </Row>
      <Row style={{ "margin-left": "40px", "margin-top": "20px" }}>
        <Col xs={12} sm={12} md={6} lg={3}></Col>
        {props.isShowLoadMoreButton ? (
          <Col xs={12} sm={12} md={6} lg={6}>
            <Button
              onClick={() => props.getDatasetList(true)}
              variant="outlined"
              className="cancelbtn"
              style={{ "text-transform": "none" }}
            >
              Load more
            </Button>
          </Col>
        ) : (
          <></>
        )}
      </Row>
    </div>
  );
}
