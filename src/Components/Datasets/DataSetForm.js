import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./DataSetForm.css";
import labels from "../../Constants/labels";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { FileUploader } from "react-drag-drop-files";
import UploadDataset from "../../Components/Datasets/UploadDataset";
import { Container } from "react-bootstrap";
import { width } from "@mui/system";

export default function DataSetForm(props) {
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const privateFileTypes = ["csv", "xls", "xlsx"];
  const publicFileTypes = privateFileTypes.concat([
    "jpg",
    "jpeg",
    "pdf",
    "png",
  ]);

  return (
    <Container className="datasetform">
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <span className="AddDatasetmainheading">{props.title}</span>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} className="recordradiobtns">
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={props.isPublic}
            onChange={props.handleChangeIsPublic}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label={screenlabels.dataset.public}
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label={screenlabels.dataset.private}
              className="private"
            />
          </RadioGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={6} lg={6}>
          <TextField
            // style={useStyles.inputwidth}
            className="name"
            id="filled-basic"
            variant="filled"
            required
            width="100%"
            value={props.datasetname}
            onKeyDown={props.handledatasetnameKeydown}
            onChange={props.handleChangedatasetname}
            label={screenlabels.dataset.name}
            error={props.nameErrorMessage ? true : false}
            helperText={props.nameErrorMessage}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <TextField
            className="description"
            label={screenlabels.dataset.description}
            multiline
            rows={4}
            variant="filled"
            value={props.reply}
            maxLength={500}
            onKeyDown={props.handledescriptionKeydown}
            onChange={props.handleChangedescription}
            error={props.descriptionErrorMessage ? true : false}
            helperText={props.descriptionErrorMessage}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <span className="AddDatasetsecondaryheading">
            {screenlabels.dataset.Data_Category}
          </span>
        </Col>
      </Row>
      <Row>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Crop_data}
                onChange={props.handleChangeCropData}
              />
            }
            label={screenlabels.dataset.Crop_data}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Practice_data}
                onChange={props.handleChangePracticeData}
              />
            }
            label={screenlabels.dataset.Practice_data}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Farmer_profile}
                onChange={props.handleChangeFarmer_profile}
              />
            }
            label={screenlabels.dataset.Farmer_profile}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Land_records}
                onChange={props.handleChangeLand_records}
              />
            }
            label={screenlabels.dataset.Land_records}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Cultivation_data}
                onChange={props.handleChangeCultivationData}
              />
            }
            label={screenlabels.dataset.Cultivation_data}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Soil_data}
                onChange={props.handleChangeSoilData}
              />
            }
            label={screenlabels.dataset.Soil_data}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Weather_data}
                onChange={props.handleChangeWeatherData}
              />
            }
            label={screenlabels.dataset.Weather_data}
            className="weather"
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Research_data}
                onChange={props.handleChangeResearchData}
              />
            }
            label={screenlabels.dataset.Research_data}
            className="weather"
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Livestock}
                onChange={props.handleChangeLivestock}
              />
            }
            label={screenlabels.dataset.Livestock}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Diary}
                onChange={props.handleChangeDiary}
              />
            }
            label={screenlabels.dataset.Diary}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Poultry}
                onChange={props.handleChangePoultry}
              />
            }
            label={screenlabels.dataset.Poultry}
            className="weather"
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={3} sm={3} md={3} lg={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.Other}
                onChange={props.handleChangeOther}
              />
            }
            label={screenlabels.dataset.Other}
            className="weather"
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <span className="AddDatasetsecondaryheading">
                {screenlabels.dataset.Geography}
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} className="recordradiobtns">
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                required
                value={props.Geography}
                onChange={props.handleChangeGeography}
                error={props.geographyErrorMessage ? true : false}
                helperText={props.geographyErrorMessage}
              >
                <FormControlLabel
                  value="ETHIOPIA"
                  control={<Radio />}
                  label="Ethiopia"
                  className="record1"
                />
                <FormControlLabel
                  value="INDIA"
                  control={<Radio />}
                  label="India"
                  className="record2"
                />
                <FormControlLabel
                  value="KENYA"
                  control={<Radio />}
                  label="Kenya"
                  className="record3"
                />
              </RadioGroup>
            </Col>
          </Row>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <TextField
            // style={useStyles.inputwidth}
            className="crop"
            id="filled-basic"
            variant="filled"
            width="100%"
            value={props.cropdetail}
            onKeyDown={props.handleCropKeydown}
            onChange={props.handleChangecropdetail}
            label={screenlabels.dataset.Crop_Detail}
            error={props.cropDetailErrorMessage ? true : false}
            helperText={props.cropDetailErrorMessage}
          />
        </Col>
      </Row>
      <Row>
        {/* <Col xs={12} sm={12} md={9} lg={9}>
          <span className="AddDatasetageheading">
            {screenlabels.dataset.data}
          </span>
        </Col> */}
        {/* <Col xs={12} sm={12} md={3} lg={3}>
          <FormControlLabel
            value="start"
            control={
              <Switch
                checked={props.Switchchecked}
                onChange={props.handleChangeSwitch}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={screenlabels.dataset.Constantly_updating}
            labelPlacement="start"
            className="constantswitch"
          />
        </Col> */}
      </Row>
      {/* <Row>
        <Col xs={12} sm={12} md={12} lg={12} className="radiobtns">
          {props.Switchchecked ? (
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              //   value={value}
              //   onChange={handleChange}
            >
              <FormControlLabel
                disabled
                value="3 months"
                control={<Radio />}
                label={screenlabels.dataset.three}
              />
              <FormControlLabel
                disabled
                value="6 months"
                control={<Radio />}
                label={screenlabels.dataset.six}
                className="sixmonth"
              />
              <FormControlLabel
                disabled
                value="9 months"
                control={<Radio />}
                label={screenlabels.dataset.nine}
                className="ninemonth"
              />
              <FormControlLabel
                disabled
                value="12 months"
                control={<Radio />}
                label={screenlabels.dataset.twelve}
                className="twelvemonth"
              />
            </RadioGroup>
          ) : (
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={props.value}
              onChange={props.handleChange}
            >
              <FormControlLabel
                value="3 months"
                control={<Radio />}
                label={screenlabels.dataset.three}
              />
              <FormControlLabel
                value="6 months"
                control={<Radio />}
                label={screenlabels.dataset.six}
                className="sixmonth"
              />
              <FormControlLabel
                value="9 months"
                control={<Radio />}
                label={screenlabels.dataset.nine}
                className="ninemonth"
              />
              <FormControlLabel
                value="12 months"
                control={<Radio />}
                label={screenlabels.dataset.twelve}
                className="twelvemonth"
              />
            </RadioGroup>
          )}
        </Col>
      </Row> */}
      <Row>
        <Col xs={12} sm={12} md={6} lg={6}>
          <span className="AddDatasetsecondaryheading">
            {screenlabels.dataset.Interval}
          </span>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <FormControlLabel
            value="start"
            control={
              <Switch
                checked={props.Switchchecked}
                onChange={props.handleChangeSwitch}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={screenlabels.dataset.Constantly_updating}
            labelPlacement="start"
            className="constantswitch"
          />
        </Col>
      </Row>
      {props.Switchchecked ? (
        <Row>
          <Col xs={12} sm={12} md={6} lg={6} className="FromDate">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                inputFormat="dd/MM/yyyy"
                disabled
                value={props.fromdate}
                onChange={props.handleChangeFromDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="filled-basic"
                    variant="filled"
                    className="fromtextfield"
                  />
                )}
                error={props.dataCaptureStartErrorMessage ? true : false}
                helperText={props.dataCaptureStartErrorMessage}
              />
            </LocalizationProvider>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} className="toDate">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disabled
                value={props.todate}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="filled-basic"
                    variant="filled"
                    className="totextfield"
                    disabled
                  />
                )}
                error={props.dataCaptureEndErrorMessage ? true : false}
                helperText={props.dataCaptureEndErrorMessage}
              />
            </LocalizationProvider>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col
            xs={12}
            sm={12}
            md={6}
            lg={6}
            className="FromDate addDatasetFromdate"
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                inputFormat="dd/MM/yyyy"
                disableFuture
                label={screenlabels.dataset.Start_Date}
                value={props.fromdate}
                onChange={props.handleChangeFromDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="filled-basic"
                    variant="filled"
                    className="fromtextfield"
                    aria-readonly
                  />
                )}
              />
            </LocalizationProvider>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={6}
            lg={6}
            className="toDate addDatasetTodate"
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                inputFormat="dd/MM/yyyy"
                disabled={props.fromdate ? false : true}
                disableFuture
                label={screenlabels.dataset.End_Date}
                minDate={props.fromdate}
                value={props.todate}
                onChange={props.handleChangeToDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="filled-basic"
                    variant="filled"
                    className="totextfield"
                  />
                )}
              />
            </LocalizationProvider>
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <span className="AddDatasetsecondaryheading">
            {/* {props.first_heading} */}
            {screenlabels.dataset.Records}
          </span>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} className="recordradiobtns">
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={props.recordsvalue}
            onChange={props.handleChangeRecords}
          >
            <FormControlLabel value="<100k" control={<Radio />} label="<100k" />
            <FormControlLabel
              value="100k-300k"
              control={<Radio />}
              label="100k-300k"
              className="record2"
            />
            <FormControlLabel
              value="300k-500k"
              control={<Radio />}
              label="300k-500k"
              className="record3"
            />
            <FormControlLabel
              value="+500k"
              control={<Radio />}
              label="+500k"
              className="record4"
            />
          </RadioGroup>
        </Col>
      </Row>

      <div style={{ display: props.isPublic ? "none" : "" }}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <span className="AddDatasetsecondaryheading">
              {screenlabels.dataset.Availablity}
            </span>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} className="recordradiobtns">
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={props.availablevalue}
              onChange={props.handleChangeAvailable}
            >
              <FormControlLabel
                value="Available"
                control={<Radio />}
                label={screenlabels.dataset.Available}
              />
              <FormControlLabel
                value="Not Available"
                control={<Radio />}
                label="Not Available"
                className="notavaiable"
              />
            </RadioGroup>
          </Col>
        </Row>
      </div>

      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <span className="AddDatasetsecondaryheading">
            {props.isPublic
              ? screenlabels.dataset.upload_public_dataset
              : screenlabels.dataset.Upload_dataset}
          </span>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <FileUploader
            handleChange={props.handleFileChange}
            name="file"
            types={props.isPublic ? publicFileTypes : privateFileTypes}
            children={
              <UploadDataset
                uploaddes={`Supports ${
                  props.isPublic
                    ? "CSV, PDF, JPG, JPEG, PNG, XLS and XLSX file formats upto 50 MB"
                    : "CSV and XLSX file formats upto 2 MB "
                }`}
                uploadtitle="Upload Dataset"
              />
            }
            classes="fileUpload"
          />
        </Col>
      </Row>

      <Row xs={12} sm={12} md={12} lg={12}>
        <p className="uploaddatasetname">
          {props.file
            ? props.file.size
              ? `File name: ${props.file.name}`
              : ""
            : ""}
        </p>
        <p className="oversizemb-uploadimglogo">
          {props.file != null &&
          props.file.size > (props.isPublic ? 52428800 : 2097152)
            ? `File uploaded is more than ${props.isPublic ? 50 : 2} MB!`
            : ""}
          {props.fileValid}
        </p>
      </Row>
    </Container>
  );
}
