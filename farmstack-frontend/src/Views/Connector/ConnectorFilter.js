import React, { useState } from 'react'
import labels from '../../Constants/labels';
import { Col, Row } from 'react-bootstrap'
import Button from "@mui/material/Button"
import TextField from '@mui/material/TextField';import FilterCheckBox from '../../Components/Datasets/FilterCheckBox';
;

export default function ConnectorFilter(props) {

    const [screenlabels, setscreenlabels] = useState(labels['en']);

  return (
    <div>
        <Row className="supportfilterfirstrow">
            <Col className='supportfiltertext'>
                <div style={{"margin-left":"-100px","font-weight":"600"}}>
                <span className="datasetfiltertext">{screenlabels.connector.filter}</span>
                </div>
            </Col> 
            <Col className='supportfiltertext'>
                <div style={{"margin-left":"55px"}}>
                    <span className="filterClearAll">
                        <Button
                            style={{"font-style":"Open Sans","font-weight": "500","font-size": "14px","bottom":"5px","right":"-10px","text-transform":"none"}}
                            onClick={() => props.clearAllFilters()}
                            // variant="outlined"
                            // className="cancelbtn"
                            >
                            Clear all
                        </Button>
                    </span>
                </div>
            </Col>
        </Row>
        {props.isShowAll ? 
        <Row onClick={() => props.clearAllFilters()} className="supportfiltersecondrow">
            <span className="supportallicon">
                <img
                    src={require('../../Assets/Img/filter.svg')}
                    alt="new"
                />
            </span>
            <span className="fontweight600andfontsize14pxandcolorFFFFFF supportalltexticon">{screenlabels.support.all}</span>
        </Row> :
        <Row onClick={() => props.clearAllFilters()} className="supportfiltersecondrowbold">
            <span className="supportallicon">
                <img
                    src={require('../../Assets/Img/filter_bold.svg')}
                    alt="new"
                />
            </span>
            <span className="fontweight600andfontsize14pxandcolor3D4A52 supportalltexticon">{screenlabels.support.all}</span>
        </Row>}
        {/* <Row className={props.secondrow ? 'supportfilterthirdrowhighlight' : "supportfilterthirdrow"}>
          <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterthirdrowheadingtext">{screenlabels.support.date}</span>
          <span className="supportcardfromdate">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                      inputFormat="dd/MM/yyyy"
                      disableFuture
                      label="From Date *"
                      value={props.fromdate}
                      onChange={(newValue) => {
                          props.settodate(null)
                          props.setfromdate(newValue);
                        //   props.setIsShowAll(false)
                          props.resetFilterState(screenlabels.dataset.geography)
                          props.resetFilterState(screenlabels.dataset.age)
                          props.resetFilterState(screenlabels.dataset.crop)
                          props.resetFilterState(screenlabels.dataset.status)
                          props.resetFilterState(screenlabels.dataset.enabled)
                          setTimeout(() => {
                              $(".supportcardtodate input.MuiInputBase-input").attr("disabled", "disabled");
                          }, 100)
                      }}
                      renderInput={(params) => <TextField {...params} />}
                  />
              </LocalizationProvider>
          </span>
          <span className="supportcardtodate">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                      inputFormat="dd/MM/yyyy"
                      disabled={props.fromdate ? false : true}
                      disableFuture
                      label="To Date *"
                      minDate={props.fromdate}
                      value={props.todate}
                      onChange={(newValue) => {
                          props.settodate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                  />
              </LocalizationProvider>
          </span>
          {props.fromdate && props.todate ? <span className="supportsubmitbrn">
              <Button onClick={() => props.filterByDates()} variant="contained" className="enabledatesubmitbtn">
                  Submit
          </Button>
          </span> :
              <span className="supportsubmitbrn">
                  <Button variant="outlined" className="disbaledatesubmitbtn">
                      Submit
                  </Button>
              </span>}
      </Row> */}
    <Row className="supportfiltersecondrowbold">
        <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">  
            <img
            src={require("../../Assets/Img/department_icon.svg")}
            alt="new"
        />
        &nbsp;&nbsp;{screenlabels.connector.department}</span>
    </Row>
    { 
        props.departmentFilter && props.departmentFilter.length!==0 &&
        <Row className="supportfiltersecondrowbold">
            <TextField 
                style={{ "width":"100%", "margin-left":"10px","margin-right":"10px","text-align": "left", color: '#3D4A52'}}
                id="filled-basic"
                variant="filled"
                label={screenlabels.connector.search}
                value={props.deptSearchState}
                onChange={(e) => props.handleDeptSearch(e)}
                error={!props.isDeptSearchFound}
                helperText={!props.isDeptSearchFound ? "Not found" : ""}
            />
        </Row>
    }
    {
        props.departmentFilter && props.departmentFilter.map((filter) => (
            filter.isDisplayed &&
            <FilterCheckBox
                label={filter.name}
                checked={filter.isChecked}
                handleCheckListFilterChange={() => props.handleFilterChange(filter.index,screenlabels.connector.department)}
            />
        ))
    }

    <Row className="supportfiltersecondrowbold">
        <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext"> 
        <img
            src={require("../../Assets/Img/project_icon.svg")}
            alt="new"
        />
        &nbsp;&nbsp;{screenlabels.connector.projects}</span>
    </Row>
    { 
        props.projectFilter && props.projectFilter.length !==0 &&
        <Row className="supportfiltersecondrowbold">
            <TextField 
                style={{ "width":"100%", "margin-left":"10px","margin-right":"10px","text-align": "left", color: '#3D4A52'}}
                id="filled-basic"
                variant="filled"
                label={screenlabels.connector.search}
                value={props.projectSearchState}
                onChange={(e) => props.handleProjectSearch(e)}
                error={!props.isProjectSearchFound}
                helperText={!props.isProjectSearchFound ? "Not found" : ""}
            />
        </Row>
    }
    {
        props.projectFilter && props.projectFilter.map((filter)=> (
            filter.isDisplayed &&
            <FilterCheckBox
            label={filter.name}
            checked={filter.isChecked}
            handleCheckListFilterChange={() => props.handleFilterChange(filter.index,screenlabels.connector.projects)}
            />
        ))
    }

      <Row className="supportfiltersecondrowbold">
          <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
          <img
              src={require("../../Assets/Img/connector_icon.svg")}
              alt="new"
            />
            &nbsp;&nbsp;
              {screenlabels.connector.connector_type}
              </span>
      </Row>
      
          {props.connectorTypeFilter && props.connectorTypeFilter.map((filter) => (
              <FilterCheckBox
                label={filter.name}
                checked={filter.isChecked}
                handleCheckListFilterChange={() => props.handleFilterChange(filter.index,screenlabels.connector.connector_type)}
              />
              ))}
     
      <Row className="supportfiltersecondrowbold">
          <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
          <img
              src={require("../../Assets/Img/connector_status_icon.svg")}
              alt="new"
            />
            &nbsp;&nbsp;{screenlabels.connector.connector_status}</span>
      </Row>
          {props.statusFilter && props.statusFilter.map((filter) => (
              <FilterCheckBox
                label={filter.name}
                checked={filter.isChecked}
                handleCheckListFilterChange={() => props.handleFilterChange(filter.index,screenlabels.connector.connector_status)}
              />
          ))}
    </div>
  )
}
