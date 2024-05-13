import { Alert, Checkbox, FormControlLabel, Switch } from "@mui/material";
import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";

import FormControl from "@mui/material/FormControl";
import { useEffect } from "react";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import labels from "../../Constants/labels";
import CategorySelectorList from "./CategorySelectorList";
import { Select } from "antd";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "./admin-add-dataset.css";
const { RangePicker } = DatePicker;

const AddMetadata = (props) => {
  const {
    handleChangeCategory,
    category,
    categoryNameList,

    geography,
    handleChangeGeography,
    conscent,
    setConscent,
    handleAddDatasetSubmit,
    isSubmitted,
    selectedCat,

    handleChangeSubCatList,
    newSelectedCategory,
    newSelectedSubCategory,
    setNewSelectedSubCategory,
    allCatFetched,
    finalJson,
  } = props;
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  let sublist = [];
  let catList = Object.keys(finalJson);

  //finalJosn, allCatfecthed,
  console.log(finalJson);
  for (let i = 0; i < catList.length; i++) {
    console.log(catList[i]);
    for (let j = 0; j < finalJson[catList[i]]?.length; j++) {
      console.log(finalJson[catList[i]][j]);
      if (allCatFetched[catList[i]]?.includes(finalJson[catList[i]][j])) {
        sublist.push(catList[i] + "-" + finalJson[catList[i]][j]);
      } else {
        sublist.push(finalJson[catList[i]][j]);
      }
    }
    // sublist = [...sublist, ...]
  }
  console.log(sublist, props.fromdate, props.todate, props.Switchchecked);

  const options = [];

  for (let i = 0; i < catList.length; i++) {
    console.log(allCatFetched);
    for (let j = 0; j < allCatFetched[catList[i]]?.length; j++) {
      let obj = {
        label: allCatFetched[catList[i]][j],
        value: catList[i] + "-" + allCatFetched[catList[i]][j],
      };
      options.push(obj);
    }
  }

  const onChange = (date, dateString) => {
    props.handleChangeFromDate(new Date(dateString[0]));
    props.handleChangeToDate(new Date(dateString[1]));
  };
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  };
  console.log("OPTIONS", options);

  // for (let i = 0; i < allCatFetched.length; i++) {
  //     options.push({ label: subCategoryNameList[i], value: subCategoryNameList[i]  })
  // }

  // const handleChange = (value = []) => {
  //     handleChangeSubCatList()
  // };
  useEffect(() => {
    console.log("SUBLIST", sublist);
    setNewSelectedSubCategory([...sublist]);
  }, [newSelectedCategory]);
  return (
    <>
      <Row style={{}}>
        <Col xs="12" sm="6" md="6" lg="4">
          {/* <CategorySelector selectedCat={selectedCat} heading={"Category"} handler={handleChangeCategory} category={category} list={categoryNameList} /> */}
          <CategorySelectorList
            newSelectedCategory={newSelectedCategory}
            selectedCat={selectedCat}
            heading={"Category"}
            handler={handleChangeCategory}
            category={category}
            list={categoryNameList}
          />
        </Col>
        <Col xs="12" sm="6" md="6" lg="4">
          <label htmlFor="">Sub categories</label>
          <Select
            mode="multiple"
            placeholder="Please select"
            // defaultValue={[]}
            value={newSelectedSubCategory}
            onChange={handleChangeSubCatList}
            style={{ width: "100%" }}
            options={options}
            maxTagCount="responsive"
          />

          <FormControl sx={{ m: 1, width: 250 }}>
            {/* <InputLabel id="demo-multiple-checkbox-label">{"Sub categories"}</InputLabel> */}

            {/* <Select name="sub_category" id="sub_cat" >
                            {Object.keys(selectedCat).map((key) => {
                                return allCatFetched[key].map((sub) => {
                                    return <span style={{ display: "flex", justifyContent: "space-evenly" }}><Checkbox checked={sublist.includes(sub)} onClick={(e) => handleSubCategoryListForFinal(e.target.checked, sub, key)} />
                                        <MenuItem value={sub}>{sub}</MenuItem>
                                    </span>
                                })

                            })} */}

            {/* {Object.keys(allCatFetched).map((key) => {
                                if (category.includes(key)) {
                                    console.log(allCatFetched[key], key)
                                    allCatFetched[key].map((sub_cat) => {
                                        
                                    })
                                }
                            })} */}
            {/* {category.map(()=>{
                                allCatFetched
                            })} */}
            {/* {Object.keys(selectedCat).map((key)=>{

                            })} */}
            {/* </Select> */}
          </FormControl>
          {/* <CategorySelector heading={"Sub category"} handler={handleSubCategory} category={subCategory} list={subCategoryNameList} /> */}
        </Col>
        <Col xs="12" sm="6" md="6" lg="4">
          {/* <FormControl sx={{ m: 1, width: "250px" }}> */}
          {/* <InputLabel id="demo-simple-select-standard-label">Geography</InputLabel> */}
          <label htmlFor="">Geography</label>
          <Select
            // mode="tags"
            placeholder="Please select geography"
            style={{ width: "100%" }}
            maxTagCount="responsive"
            // labelId="demo-simple-select-standard-label"
            // id="demo-simple-select-standard"
            value={geography}
            onChange={handleChangeGeography}
            options={[
              { value: "India", label: "India" },
              { value: "Ethiopia", label: "Ethiopia" },
              { value: "Kenya", label: "Kenya" },
            ]}
            // label="Geography"
          >
            {/* <MenuItem value="">
                                <em>None</em>
                            </MenuItem> */}
            {/* <MenuItem value={"India"}>India</MenuItem>
                        <MenuItem value={"Ethiopia"}>Ethiopia</MenuItem>
                        <MenuItem value={"Kenya"}>Kenya</MenuItem> */}
          </Select>
          {/* </FormControl> */}
        </Col>

        {/* <Col xs="12" sm="6" md="6" lg="3">
                    

                    <label htmlFor="">Selected Category list</label>
                    <List sx={{
                        width: '100%',
                        maxWidth: 360,
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 150,

                        '& ul': { padding: 0 },
                    }} >
                        {Object.keys(finalJson).map((key) => finalJson[key].map((eachSub) => {
                            return <ListItem>
                                <span>{`${eachSub} from ${key} category`}</span> {" "}
                            </ListItem>
                        }))}
                    </List>
                </Col> */}
      </Row>
      <Row>
        <Col xs={12} sm={12} md={6} lg={3}></Col>
        <Col
          xs={12}
          sm={12}
          md={6}
          lg={6}
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Row style={{ textAlign: "center", display: "inline-block" }}>
            {/* <span className=""> */}
            {screenlabels.dataset.Interval}
            {/* </span> */}
          </Row>
          <Row style={{ textAlign: "center", display: "inline-block" }}>
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
              className=""
            />
          </Row>
          <Row style={{ textAlign: "center", display: "inline-block" }}>
            <RangePicker
              disabledDate={disabledDate}
              allowClear={false}
              inputReadOnly
              value={
                props.fromdate && props.todate
                  ? [dayjs(props.fromdate), dayjs(props.todate)]
                  : ""
              }
              disabled={props.Switchchecked ? true : false}
              onChange={onChange}
            />
          </Row>
        </Col>
        <Col xs={12} sm={12} md={6} lg={3}></Col>
      </Row>
      {/* {props.Switchchecked ? ( */}
      {/* <Row> */}
      {/* <Col xs={12} sm={12} md={6} lg={12} className="FromDate"> */}
      {/* <RangePicker disabled onChange={onChange} /> */}
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                        </LocalizationProvider> */}
      {/* </Col> */}
      {/* <Col xs={12} sm={12} md={6} lg={6} className="toDate"> */}
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                        </LocalizationProvider> */}
      {/* </Col> */}
      {/* </Row> */}
      {/* ) : ( */}
      {/* <Row>
                <Col
                    xs={12}
                    sm={12}
                    md={6}
                    lg={12}
                    className="FromDate addDatasetFromdate"
                >
                    <RangePicker onChange={onChange} /> */}
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
      {/* <DatePicker
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
                            /> */}
      {/* </LocalizationProvider> */}
      {/* </Col> */}
      {/* <Col
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    className="toDate addDatasetTodate"
                > */}
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                        </LocalizationProvider> */}
      {/* </Col>
            </Row> */}
      {/* )} */}
      <Row style={{ marginTop: "20px" }}>
        <Col lg={1}>
          {/* <Stack sx={{ width: "100%", textAlign: "left" }} spacing={2}> */}
          <Checkbox
            checked={conscent}
            onChange={(e) => setConscent(e.target.checked)}
          />
          {/* </Stack> */}
        </Col>
        <Col lg={11}>
          <Alert severity="warning">
            {/* <AlertTitle style={{ textAlign: "left" }}>Warning</AlertTitle> */}
            {/* This is a warning alert —{" "} */}
            <strong>
              This table's sample dataset is solely meant to be used as a source
              of information. Despite the fact that accuracy is a goal, the
              steward is not accountable for the information. Please let the
              admin know if you come across any information that you think is
              inaccurate.
            </strong>
          </Alert>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            onClick={handleAddDatasetSubmit}
            variant="contained"
            className="submit_btn"
            type="submit"
            disabled={
              conscent &&
              geography != "" &&
              (!props.Switchchecked
                ? props.fromdate && props.todate
                : props.Switchchecked) &&
              !isSubmitted
                ? false
                : true
            }
          >
            {screenlabels.common.submit}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default AddMetadata;
