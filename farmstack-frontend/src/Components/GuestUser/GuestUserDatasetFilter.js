import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import labels from "../../Constants/labels";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import $ from "jquery";
import FilterCheckBox from "../../Components/Datasets/FilterCheckBox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Search from "../Datasets/Search";
import Select from "react-select";

export default function GuestUserDatasetFilter(props) {
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  useEffect(() => {
    setTimeout(() => {
      $(".supportcardfromdate input.MuiInputBase-input").attr(
        "disabled",
        "disabled"
      );
      $(".supportcardtodate input.MuiInputBase-input").attr(
        "disabled",
        "disabled"
      );
    }, 100);
  }, []);

  return (
    <div>
      <Row className="supportfilterfirstrow">
        <Col className="supportfiltertext">
          <div style={{ "margin-left": "-100px", "font-weight": "600" }}>
            <span className="datasetfiltertext">
              {screenlabels.dataset.filter}
            </span>
            {/* <span style={{"font-weight": "600","font-size": "14px","color": "#3a3a3a","left":"10px"}}>{screenlabels.dataset.filter}</span> */}
          </div>
        </Col>

        <Col className="supportfiltertext">
          <div style={{ "margin-left": "55px" }}>
            <span className="filterClearAll">
              <Button
                style={{
                  "font-style": "Open Sans",
                  "font-weight": "500",
                  "font-size": "14px",
                  bottom: "5px",
                  right: "-10px",
                  "text-transform": "none",
                }}
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
      {props.isShowAll ? (
        // <Row onClick={() => props.filterRow('all', false, 'all')} className="supportfiltersecondrow">
        <Row
          onClick={() => props.getAllDataSets()}
          className="supportfiltersecondrow"
        >
          <span className="supportallicon">
            <img src={require("../../Assets/Img/filter.svg")} alt="new" />
          </span>
          <span className="fontweight600andfontsize14pxandcolorFFFFFF supportalltexticon">
            {screenlabels.support.all}
          </span>
        </Row>
      ) : (
        // <Row onClick={() => props.filterRow('all', true, 'all')} className="supportfiltersecondrowbold">
        <Row
          onClick={() => props.getAllDataSets()}
          className="supportfiltersecondrowbold"
        >
          <span className="supportallicon">
            <img src={require("../../Assets/Img/filter_bold.svg")} alt="new" />
          </span>
          <span className="fontweight600andfontsize14pxandcolor3D4A52 supportalltexticon">
            {screenlabels.support.all}
          </span>
        </Row>
      )}
      <Row>
        {props.isMemberTab ? (
          <Search
            checkForRegex={props.checkForRegex}
            setSearchValOtherOrg={props.setSearchValOtherOrg}
            setSearchDatasetVar={props.setSearchDatasetVar}
            searchDatasetVar={props.searchValOtherOrg}
            debounceOnChange={props.debounceOnChange}
            isLoadmore={false}
            isMemberTab={props.isMemberTab}
          />
        ) : (
          <Search
            checkForRegex={props.checkForRegex}
            setSearchDatasetVar={props.setSearchDatasetVar}
            searchDatasetVar={props.searchValMyOrg}
            debounceOnChange={props.debounceOnChange}
            setSearchValMyOrg={props.setSearchValMyOrg}
            isLoadmore={false}
            isMemberTab={props.isMemberTab}
          />
        )}

        {/* <Search checkForRegex={props.checkForRegex} setSearchDatasetVar={props.setSearchDatasetVar} searchDatasetVar={props.searchDatasetVar} debounceOnChange={props.debounceOnChange} isLoadmore={false} isMemberTab={props.isMemberTab}/> */}
      </Row>
      <Row
        className={
          props.secondrow
            ? "supportfilterthirdrowhighlight"
            : "supportfilterthirdrow"
        }
      >
        <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterthirdrowheadingtext">
          {screenlabels.support.date}
        </span>
        <span className="supportcardfromdate">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              inputFormat="dd/MM/yyyy"
              disableFuture
              label="From date *"
              value={props.fromdate}
              onChange={(newValue) => {
                console.log('date value on change', newValue)
                props.settodate(null);
                props.setfromdate(newValue);
                //   props.setIsShowAll(false)
                props.resetFilterState(screenlabels.dataset.geography);
                props.resetFilterState(screenlabels.dataset.age);
                // props.resetFilterState(screenlabels.dataset.crop);
                props.resetFilterState(screenlabels.dataset.status);
                props.resetFilterState(screenlabels.dataset.enabled);
                setTimeout(() => {
                  $(".supportcardtodate input.MuiInputBase-input").attr(
                    "disabled",
                    "disabled"
                  );
                }, 100);
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
              label="To date *"
              minDate={props.fromdate}
              value={props.todate}
              onChange={(newValue) => {
                console.log('end date value on change', newValue)
                props.settodate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </span>
        {props.fromdate && props.todate && props.fromdate <= props.todate ? (
          <span className="supportsubmitbrn">
            <Button
              onClick={() => props.filterByDates()}
              variant="contained"
              className="enabledatesubmitbtn"
            >
              Submit
            </Button>
          </span>
        ) : (
          <span className="supportsubmitbrn">
            <Button variant="outlined" className="disbaledatesubmitbtn">
              Submit
            </Button>
          </span>
        )}
      </Row>
      {props.showMemberFilters && (
        <Row className="supportfiltersecondrowbold">
          <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
            <img src={require("../../Assets/Img/status.svg")} alt="new" />
            &nbsp;&nbsp;{screenlabels.dataset.status}
          </span>
        </Row>
      )}
      {props.showMemberFilters &&
        props.statusFilter &&
        props.statusFilter.map((status) => (
          <FilterCheckBox
            label={status.name}
            checked={status.isChecked}
            handleCheckListFilterChange={() =>
              props.handleFilterChange(
                status.index,
                screenlabels.dataset.status
              )
            }
          />
        ))}
      {props.showMemberFilters && (
        <Row className="supportfiltersecondrowbold">
          <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
            <img src={require("../../Assets/Img/dataset_bold.svg")} alt="new" />
            &nbsp;&nbsp;{screenlabels.dataset.datasets}
          </span>
        </Row>
      )}
      {props.showMemberFilters &&
        props.enableStatusFilter.map((filter) => (
          <FilterCheckBox
            label={filter.name}
            checked={filter.isChecked}
            handleCheckListFilterChange={() =>
              props.handleFilterChange(
                filter.index,
                screenlabels.dataset.enabled
              )
            }
          />
        ))}
      {/* {props.showMemberFilters &&
        
            <FilterCheckBox
                label={screenlabels.dataset.enabled}
                checked={props.isEnabledFilter}
                handleCheckListFilterChange={() => props.handleEnableStatusFilter(screenlabels.dataset.enabled)}
            />
        }
        {props.showMemberFilters &&
        
            <FilterCheckBox
                label={screenlabels.dataset.disbaled}
                checked={props.isDisabledFilter}
                handleCheckListFilterChange={() => props.handleEnableStatusFilter(screenlabels.dataset.disbaled)}
            />
        } */}
      {/* <Row className="supportfiltersecondrowbold">
        <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
          {"Data Visiblity"}
        </span>
      </Row> */}
      {/* {props.dataAccessFilterDisplay
        ? props.dataAccessFilterDisplay.map((datavisiblity) => (
          <FilterCheckBox
            label={datavisiblity.name}
            checked={datavisiblity.isChecked}
            handleCheckListFilterChange={() =>
              props.handleFilterChange(datavisiblity.index, "datavisiblity")
            }
          />
        ))
        : ""} */}
      <Row className="supportfiltersecondrowbold">
        <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
          <img src={require("../../Assets/Img/category.svg")} alt="new" />
          &nbsp;&nbsp;
          {screenlabels.dataset.category}
        </span>
      </Row>
      <Select
        isMulti
        name="Categories"
        options={props.categoryFilterOptions ? props.categoryFilterOptions : []}
        onChange={props.handleCategoryFilterChange}
        className="basic-multi-select"
        classNamePrefix="select"
        value={props.categoryFilterValue}
      />
      <Row className="supportfiltersecondrowbold">
        <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
          <img src={require("../../Assets/Img/subcategory.svg")} alt="new" />
          &nbsp;&nbsp;
          {screenlabels.dataset.subcategory}
        </span>
      </Row>
      <Select
        isMulti
        name="Subcategories"
        options={
          props.subcategoryFilterOptions ? props.subcategoryFilterOptions : []
        }
        onChange={props.handleCategoryFilterChange}
        className="basic-multi-select"
        classNamePrefix="select"
        value={props.subcategoryFilterValue}
        noOptionsMessage={() => "Select a category first"}
      />
      <Row>
        {props.categoryFilterValue.length &&
        props.subcategoryFilterValue.length ? (
          <span className="supportsubmitbrn" style={{ marginTop: "15px" }}>
            <Button
              onClick={() => props.filterByCategory()}
              variant="contained"
              className="enabledatesubmitbtn"
            >
              Submit
            </Button>
          </span>
        ) : (
          <span className="supportsubmitbrn">
            <Button
              variant="outlined"
              className="disbaledatesubmitbtn"
              style={{ marginTop: "15px" }}
            >
              Submit
            </Button>
          </span>
        )}
      </Row>
      <Row className="supportfiltersecondrowbold">
        <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
          <img src={require("../../Assets/Img/geography.svg")} alt="new" />
          &nbsp;&nbsp;
          {screenlabels.dataset.geography}
        </span>
      </Row>
      <Row className="supportfiltersecondrowbold">
        <TextField
          style={{
            width: "100%",
            "margin-left": "10px",
            "margin-right": "10px",
            "text-align": "left",
            color: "#3D4A52",
          }}
          id="filled-basic"
          variant="filled"
          label={screenlabels.dataset.search}
          value={props.geoSearchState}
          onChange={(e) => props.handleGeoSearch(e)}
          error={!props.isGeoSearchFound}
          helperText={!props.isGeoSearchFound ? "Not found" : ""}
        />
      </Row>
      {props.geoFilterDisplay &&
        props.geoFilterDisplay.map(
          (geoFilter) =>
            geoFilter.isDisplayed && (
              <FilterCheckBox
                label={geoFilter.name}
                checked={geoFilter.isChecked}
                handleCheckListFilterChange={() =>
                  props.handleFilterChange(
                    geoFilter.index,
                    screenlabels.dataset.geography
                  )
                }
              />
            )
        )}
      {/* <Row>
        {props.geographyList && props.geographyList.map((geography) => (
            <FilterCheckBox
                label={geography}
                checked={props.geoCheckStateList[props.geoMasterList.findIndex((geo)=> geo == geography)]}
                handleCheckListFilterChange={() => props.handleCheckListFilterChange("geography",props.geoMasterList.findIndex((geo)=> geo == geography))}
            />
        ))}  
      </Row>
       */}
      <Row className="supportfiltersecondrowbold">
        <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
          <img src={require("../../Assets/Img/calendar.svg")} alt="new" />
          &nbsp;&nbsp;{screenlabels.dataset.age}
        </span>
      </Row>
      <Row style={{ "margin-left": "-3px", "margin-top": "10px" }}>
        <FormControlLabel
          value="start"
          control={
            <Switch
              checked={props.constantyUpdateSwitch}
              onChange={(e) => props.handleConstantyUpdateSwitch(e)}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label={screenlabels.dataset.Constantly_updating}
          labelPlacement="start"
          className="constantswitch"
        />
      </Row>
      {/* <Row> */}
      {/* {props.ageFilterDisplay &&
        props.ageFilterDisplay.map((ageFilter) => (
          <FilterCheckBox
            label={ageFilter.name}
            checked={ageFilter.isChecked}
            handleCheckListFilterChange={() =>
              props.handleFilterChange(
                ageFilter.index,
                screenlabels.dataset.age
              )
            }
          />
        ))} */}
      {/* </Row> */}
      {/* <Row>
        {props.ageList && props.ageList.map((age) => (
            <FilterCheckBox
                label={age}
                checked={props.ageCheckStateList[props.ageMasterList.findIndex((a)=> a == age)]}
                handleCheckListFilterChange={() => props.handleCheckListFilterChange("age",props.ageMasterList.findIndex((a)=> a == age))}
            />
        ))}  
      </Row> */}
      {/* <Row className="supportfiltersecondrowbold">
        <span className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
          <img src={require("../../Assets/Img/crop.svg")} alt="new" />
          &nbsp;&nbsp;{screenlabels.dataset.Value_Chain}
        </span>
      </Row>
      <Row className="supportfiltersecondrowbold">
        <TextField
          style={{
            width: "100%",
            "margin-left": "10px",
            "margin-right": "10px",
            "text-align": "left",
            color: "#3D4A52",
          }}
          id="filled-basic"
          variant="filled"
          label={screenlabels.dataset.search}
          value={props.cropSearchState}
          // onChange={(e) => props.handleCropSearch(e)}
          // error={!props.isCropSearchFound}
          // helperText={!props.isCropSearchFound ? "Not found" : ""}
        /> */}
      {/* </Row> */}
      {/* <Row> */}
      {/* {props.cropFilterDisplay &&
        props.cropFilterDisplay.map(
          (cropFilter) =>
            cropFilter.isDisplayed && (
              <FilterCheckBox
                label={cropFilter.name}
                checked={cropFilter.isChecked}
                handleCheckListFilterChange={() =>
                  props.handleFilterChange(
                    cropFilter.index,
                    screenlabels.dataset.crop
                  )
                }
              />
            )
        )} */}
      {/* </Row> */}
      {/* <Row>
        {props.cropList && props.cropList.map((crop) => (
            <FilterCheckBox
                label={crop}
                checked={props.cropCheckStateList[props.cropMasterList.findIndex((c)=> c == crop)]}
                handleCheckListFilterChange={() => props.handleCheckListFilterChange("crop",props.cropMasterList.findIndex((c)=> c == crop))}
            />
        ))}  
      </Row> */}
    </div>
  );
}
