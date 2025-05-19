import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Button from "@mui/material/Button";
import ConnectorCard from '../../Components/Connectors/ConnectorCard';
import NoConnectorCard from '../../Components/Connectors/NoConnectorCard';
import ConfigureConnectorCard from '../../Components/Connectors/ConfigureConnectorCard';
import { useHistory } from 'react-router-dom';
import {useLocation } from "react-router-dom";
import { isRoleName } from '../../Utils/Common'
export default function ConnectorListing(props) {
  const history = useHistory()
  const location = useLocation()
  return (
    <div>
      <Row style={{"margin-left":"-20px","margin-top":"-20px"}}>
        <ConfigureConnectorCard addevent={() => history.push(isRoleName(location.pathname)+"connectors/add")}/>
        {
          (!props.connectorList || props.connectorList.length ==0) &&
          <NoConnectorCard/>
        }
        {
          props.connectorList && props.connectorList.length > 0 && props.connectorList.map((connector)=>(
            <ConnectorCard
              margingtop={'supportcard supportcardmargintop20px'}
              connectorName={connector.connector_name}
              connectorType={connector.connector_type}
              projectName={connector['project_details']?connector['project_details']['project_name']:''}
              departmentName={connector['department_details']?connector['department_details']['department_name']:""}
              status={props.getStatusDisplayName(connector.connector_status)}
              statusImageName={props.getImageName(connector.connector_status)}
              viewCardDetails={()=>props.viewCardDetails(connector.id)}
            />
          ))
        }
        {/* <ConnectorCard
          margingtop={'supportcard supportcardmargintop20px'}
          getImageName={props.getImageName}
        />
        <ConnectorCard
          margingtop={'supportcard supportcardmargintop20px'}
          getImageName={props.getImageName}
        /> */}
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={3}></Col>
          {props.showLoadMore ? (
              <Col xs={12} sm={12} md={6} lg={6}>
                  <Button
                      onClick={() => props.getConnectorList(true)}
                      variant="outlined"
                      className="cancelbtn"
                      style={{"text-transform":"none"}}>
                      Load more
                  </Button>
              </Col>
          ) : (
              <></>
          )}
        </Row>
    </div>
  )
}
