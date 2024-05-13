import delete_icon from '../../Assets/Img/delete_icon.svg';
import React, { useContext, useEffect, useState } from "react";
import styles from "./onboarding.module.css";
import { Col, Row } from "react-bootstrap";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import global_style from "../../Assets/CSS/global.module.css";
import ControlledAccordions from "../Catergories/ControlledAccordions";
import add_icon from "../../Assets/Img/Farmstack V2.0/add_icon.svg";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HTTPService from "common/services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import { FarmStackContext } from "common/components/context/EadpContext/FarmStackProvider";
import { GetErrorHandlingRoute, goToTop } from "common/utils/utils";
import { ClickAwayListener } from "@mui/base";
import { useHistory } from "react-router-dom";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import LocalStyle from "../DeletePopper/CustomDeletePopper.module.css";
import { Popconfirm } from "antd";

const CategoryDetails = (props) => {
  const { callLoader, callToast } = useContext(FarmStackContext);

  const { setActiveStep } = props;
  const [allCategories, setAllCategories] = useState([
    // { category_name: "", description: "", sub_categories: [] },
  ]);
  const [categoryNamesList, setCategoryNameList] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [enableSaveButton, setEnableSaveButton] = useState(false);
  const [editHeadName, setEditHeadName] = useState("");
  const [categoryNameError, setCategoryNameError] = useState("");
  const [headingEdit, setHeadingEdit] = useState({
    status: false,
    index: -1,
  });
  const [uploadedCategory, setUploadedCategory] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const history = useHistory();
  const [key, setKey] = useState(0);
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [popoverOpen, setPopoverOpen] = React.useState({
    state: false,
    index: "",
  });

  // const handleDeletePopper = (event) => {
  //   let ele = document.getElementById("delete-button-category");
  //   console.log("event", event.currentTarget, event);
  //   setAnchorEl(ele);
  //   setOpen(true);
  // };
  // const closePopper = () => {
  //   setOpen(false);
  // };

  // const handleUploadCategory = (file) => {
  //   setUploadedCategory(file);
  //   setKey(key + 1);
  // };
  // const handleDeleteCategory = (index) => {
  //   setUploadedCategory(null);
  //   setPreview(null);
  //   setKey(key + 1);
  // };
  // create a preview as a side effect, whenever selected file is changed
  // useEffect(() => {
  //   console.log(uploadedCategory);
  //   if (!uploadedCategory) {
  //     setPreview(undefined);
  //     return;
  //   }
  //   const objectUrl = URL.createObjectURL(uploadedCategory);
  //   setPreview(objectUrl);

  //   // free memory when ever this component is unmounted
  //   return () => URL.revokeObjectURL(objectUrl);
  // }, [uploadedCategory]);

  // const [subCategoryName, setSubCategoryName] = useState("")
  const createCategory = () => {
    if (categoryNamesList.includes(categoryName)) {
      setCategoryNameError("This category already exist");
      return;
    } else {
      setEnableSave(true);
      setCategoryNameList([...categoryNamesList, categoryName]);
      setCategoryName("");
      setDescription("");
      setCategoryNameError("");
      callToast("Please submit to save the changes!", "info", true);
    }
    setAllCategories([
      ...allCategories,
      {
        category_name: categoryName,
        description: description,
        sub_categories: [],
      },
    ]);
  };

  useEffect(() => {
    getAllCategory();
    goToTop(0);
  }, []);
  const getAllCategory = () => {
    console.log("Getting under cat");
    let method = "GET";
    let url = UrlConstant.base_url + UrlConstant.add_category_edit_category;
    callLoader(true);
    HTTPService(method, url, "", false, true, false, false)
      .then((response) => {
        callLoader(false);
        let categories = [];
        let categoryNames = [];
        for (var key in response.data) {
          let obj = {
            category_name: key,
            description: "",
            sub_categories: response.data[key],
          };
          categoryNames.push(key);
          categories.push(obj);
        }
        setCategoryNameList([...categoryNames]);
        setAllCategories([...categories]);
      })
      .catch(async (e) => {
        callLoader(false);
        // GetErrorHandlingRoute(e).then((errorObject) => {
        //   console.log(errorObject);
        //   callToast(
        //     errorObject?.message,
        //     errorObject?.status === 200 ? "success" : "error",
        //     true
        //   );
        // });
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  //accordionDelete
  const accordionDelete = (e, index) => {
    e.stopPropagation();
    let arr = [...allCategories];
    let ind = categoryNamesList.indexOf(arr[index].category_name);
    if (ind > -1) {
      let catList = [...categoryNamesList];
      catList.splice(ind, 1);
      setCategoryNameList([...catList]);
      callToast("Please submit to save the changes!", "info", true);
    }
    arr.splice(index, 1);
    setAllCategories([...arr]);
    setEnableSave(true);
  };

  let categoryNames = [];
  for (let i = 0; i < allCategories.length; i++) {
    categoryNames.push(allCategories[i].category_name);
  }

  //handleSubmitCategories
  const handleSubmitCategories = () => {
    //build the payload
    console.log(allCategories);
    let payload = {};
    for (let i = 0; i < allCategories.length; i++) {
      payload[allCategories[i].category_name] = allCategories[i].sub_categories;
    }
    console.log(payload);
    let url = UrlConstant.base_url + UrlConstant.add_category_edit_category;
    let method = "POST";
    callLoader(true);
    HTTPService(method, url, payload, false, true, false, true)
      .then((response) => {
        callLoader(false);
        console.log(response);
        if (!props.isCategorySetting) {
          setActiveStep((prev) => prev + 1);
        }

        if (props.isCategorySetting && response.status === 201) {
          callToast("Category settings updated successfully", "success", true);
        }
      })
      .catch(async (e) => {
        callLoader(false);
        // GetErrorHandlingRoute(e).then((errorObject) => {
        //   console.log(errorObject);
        //   callToast(
        //     errorObject?.message,
        //     errorObject?.status === 200 ? "success" : "error",
        //     true
        //   );
        // });
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };
  const [enableSave, setEnableSave] = useState(false);

  const [editedHeaderNameError, setEditedHeaderError] = useState("");
  const handleEditHeading = (action, e, index, doPropagation) => {
    if (!doPropagation) {
      e.stopPropagation();
    }
    if (editedHeaderNameError) return;
    setHeadingEdit({
      status: action,
      index: action ? index : -1,
    });
  };
  const handleChangeHeadName = (e, index) => {
    if (categoryNames.includes(e.target.value)) {
      setEnableSave(false);
      setEditedHeaderError("This category already exist");
    } else {
      // console.log(e.target.value);
      if (e.target.value.trimStart()) {
        setEditedHeaderError("");
        setEnableSave(true);
      } else {
        setEnableSave(false);
        setEditedHeaderError("Category name cannot be empty");
      }
    }
    let arr = [...allCategories];
    arr[index]["category_name"] = e.target.value.trimStart();
    setAllCategories([...arr]);
  };

  //component to be passed into the body of the accordion
  function ParentCompoent(props) {
    const { data, index } = props;
    const [subCategoryName, setSubCategoryName] = useState("");
    const [editedValue, setEditedValue] = useState("");
    const [subCatError, setsubCatError] = useState("");
    const handleChangeSubCategories = (e) => {
      if (data["sub_categories"]?.includes(e.target.value)) {
        setsubCatError("This sub catgory already exist");
      } else {
        setsubCatError("");
      }
      setSubCategoryName(e.target.value.trimStart());
    };

    const handleAddSubcategory = () => {
      if (!subCategoryName) return;
      let arr = [...allCategories];
      let obj = { ...data };
      if (
        data["sub_categories"]?.includes(subCategoryName) ||
        !subCategoryName
      ) {
        setsubCatError("This sub catgory already exist");
        return;
      }

      data["sub_categories"].push(subCategoryName);
      arr[index] = { ...data };
      setAllCategories([...arr]);
      setEnableSave(true);
      setsubCatError("");
    };

    const handleDeleteSubCategory = (ind, sub_cat_name) => {
      let arr = [...allCategories];
      // let obj = { ...data };
      data["sub_categories"].splice(ind, 1);
      console.log(data["sub_categories"], 'data["sub_categories"]');
      arr[index] = { ...data };
      setAllCategories([...arr]);
      console.log(arr, "arr");

      setEnableSave(true);
    };

    // const handleEditSubcategory = (e, ind) => {
    //   setEnableSave(true);
    //   setEditedValue(e.target.value);
    //   console.log(editedValue);
    //   // console.log(e.target.value);
    //   // let arr = [...allCategories];
    //   // console.log(data["sub_categories"][ind]);
    //   // data["sub_categories"][ind] = e.target.value;
    //   // arr[index] = data;
    //   // setAllCategories([...arr]);
    // };

    useEffect(() => {
      // console.log("calling");
    }, []);

    return (
      <span>
        <div
          style={{ textAlign: "left" }}
          className={global_style.bold600 + " " + global_style.size20}
        >
          Add sub categories
        </div>
        <Row style={{ height: "80px" }}>
          <Col lg={6} sm={12} className={styles.margintopbottom10}>
            <TextField
              required
              fullWidth
              placeholder="Sub-category"
              label="Sub-category"
              variant="outlined"
              inputProps={{ maxLength: 50 }}
              id="each_subcategory"
              name="each_subcategory"
              value={subCategoryName}
              onChange={(e) => handleChangeSubCategories(e)}
              error={subCatError ? true : false}
              helperText={subCatError}
            />
          </Col>
          <Col lg={6} sm={12} style={{ textAlign: "left", display: "flex" }}>
            <img
              id="add-sub-category-button"
              disabled={!subCatError ? false : true}
              style={{ alignSelf: "center", cursor: "pointer" }}
              src={add_icon}
              alt="Add icon"
              onClick={() => handleAddSubcategory()}
            />
          </Col>
        </Row>
        <hr style={{ margin: "10px 0px" }} />
        <Row>
          {data?.sub_categories?.length > 0 &&
            data?.sub_categories?.map((each_sub_category, index) => {
              return (
                <Col lg={6} sm={12} className={styles.margintopbottom10}>
                  <TextField
                    disabled
                    required
                    fullWidth
                    placeholder="Sub-category"
                    label="Sub-category"
                    variant="outlined"
                    id={`${index}each_subcategory`}
                    name="each_subcategory"
                    value={each_sub_category}
                    // onChange={(e) => handleEditSubcategory(e, index)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {/* {
                            <SaveAsIcon
                              onClick={(e) =>
                                editInputMode(each_sub_category, index, e)
                              }
                              sx={{ marginRight: "10px", cursor: "pointer" }}
                            />
                          }
                          {
                            <SaveIcon
                              onClick={() => saveChange(index)}
                              sx={{ marginRight: "10px", cursor: "pointer" }}
                            />
                          } */}
                          <DeleteOutlineIcon
                            onClick={() =>
                              handleDeleteSubCategory(index, each_sub_category)
                            }
                            style={{ color: "#212b36", cursor: "pointer" }}
                            id={`delete${index}-sub-category`}
                          />
                        </InputAdornment>
                      ),
                    }}
                    // error={policyNameError ? true : false}
                    // helperText={policyNameError}
                  />
                </Col>
              );
            })}
        </Row>
        <Row>
          <Col style={{ textAlign: "right", margin: "20px" }}>
            <>
              <Popconfirm
                style={{ padding: "0px" }}
                overlayClassName={styles.popConfirmClass}
                okButtonProps={{ style: { display: "none" } }}
                cancelButtonProps={{ style: { display: "none" } }}
                open={popoverOpen.index == index ? popoverOpen.state : false}
                overlayStyle={{ padding: 0 }}
                icon={
                  <Box
                    className={LocalStyle.popperContainer}
                    sx={{ border: 1, p: 1, bgcolor: "background.paper" }}
                  >
                    <div className={`${LocalStyle.popperTitleContainer}`}>
                      <img  src={delete_icon}  />
                      <Typography
                        className={`${GlobalStyle.bold700} ${GlobalStyle.size18} ${GlobalStyle.highlighted_text}`}
                        variant="h4"
                      >
                        {" "}
                        Delete
                      </Typography>
                    </div>
                    <Typography
                      variant="subtitle1"
                      className={`${GlobalStyle.bold400} ${GlobalStyle.size16} ${GlobalStyle.light_text} ${LocalStyle.popperMessage}`}
                    >
                      Are you sure want to delete?
                    </Typography>
                    <div className={LocalStyle.popperButtonContainer}>
                      <Button
                        variant="outlined"
                        className={`${GlobalStyle.outlined_button} ${LocalStyle.cancelButtonOnDelete}`}
                        onClick={() =>
                          setPopoverOpen({ state: false, index: index })
                        }
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outlined"
                        className={`${GlobalStyle.primary_button} ${LocalStyle.deleteButton}`}
                        onClick={(e) => {
                          accordionDelete(e, index);
                          setPopoverOpen({ state: false, index: index });
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </Box>
                }
              >
                <Button
                  id={`delete-${index}-button-category`}
                  variant="outlined"
                  style={{ margin: "20px" }}
                  className={
                    global_style.secondary_button_error +
                    " " +
                    styles.delete_button_policy
                  }
                  onClick={(e) => setPopoverOpen({ state: true, index: index })}
                >
                  Delete
                </Button>
              </Popconfirm>
            </>
            <Button
              id={`edit-${index}-button-category`}
              variant="outlined"
              style={{ margin: "20px" }}
              className={global_style.primary_button + " " + styles.edit_button}
              onClick={(e) => {
                // this funtion will allow user to edit title
                if (headingEdit.index == index) {
                  handleEditHeading(false, e, index);
                  callToast("Please submit to save the changes!", "info", true);
                } else {
                  handleEditHeading(true, e, index);
                }
              }}
            >
              {headingEdit.index == index ? "Update" : "Edit"}
            </Button>
          </Col>
        </Row>
      </span>
    );
  }

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedSetCategoryName = debounce((value) => {
    setCategoryName(value);
  }, 300);

  const debouncedSetDescription = debounce((value) => {
    setDescription(value.trimStart());
  }, 500); // Adjust the delay as needed

  const handleCategoryNameChange = (e) => {
    const value = e.target.value;
    debouncedSetCategoryName(value);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    debouncedSetDescription(value);
  };

  return (
    <div className={styles.main_box + " category_detail_main_box"}>
      {!props.isCategorySetting ? (
        <>
          <div className={styles.main_label} style={{ display: "none" }}>
            Category details
          </div>

          <div className={styles.sub_label} style={{ display: "none" }}>
            Upload your categories
          </div>
        </>
      ) : (
        <Row className={styles.main_label}>
          <Col xs={12} sm={6} md={6} xl={6}>
            Category Settings
            <Typography
              className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
            >
              {props.isCategorySetting
                ? "Create and update categories to organize datasets."
                : ""}
            </Typography>
          </Col>
          <Col xs={12} sm={6} md={6} xl={6} style={{ textAlign: "right" }}>
            <Button
              id="addnew-category-button"
              onClick={() => setIsFormVisible(true)}
              className={
                global_style.primary_button + " " + styles.add_category_button
              }
              style={{ width: "200px !important" }}
            >
              Add New Category
            </Button>
          </Col>
        </Row>
      )}
      {/* {!props.isCategorySetting ? (
        <div className={styles.all_inputs} style={{ display: "none" }}>
          <Row>
            {false && (
              <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
                <FileUploaderMain
                  key={key}
                  isMultiple={false}
                  handleChange={handleUploadCategory}
                  disabled
                  texts={`Drop files here or click browse thorough your machine
                Supports: XLX, CSV files`}
                  maxSize={2}
                  id="upload-category-file"
                />
              </Col>
            )}
            {false ? (
              <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
                <div
                  className={
                    global_style.bold600 +
                    " " +
                    global_style.font20 +
                    " " +
                    styles.text_left
                  }
                >
                  Uploaded file
                </div>
                {uploadedCategory && (
                  <div className={styles.text_left + " " + styles.preview_box}>
                    {uploadedCategory && (
                      <div className={styles.each_preview_policy}>
                        <div>
                          <img
                            height={"52px"}
                            width={"42px"}
                            className={styles.document_upload_logo}
                            src={document_upload}
                          />
                          <span>
                            {uploadedCategory.name +
                              " " +
                              (uploadedCategory.size / 1024).toFixed(2)}
                          </span>
                        </div>
                        <CancelIcon
                          onClick={() => handleDeleteCategory()}
                          style={{ cursor: "pointer" }}
                          fontSize="small"
                          id="cancel-category-file"
                        />
                      </div>
                    )}
                  </div>
                )}
              </Col>
            ) : (
              <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    color: "red",
                    opacity: 0.3,
                  }}
                >
                  Currently disabled
                </div>
              </Col>
            )}
          </Row>
        </div>
      ) : (
        ""
      )} */}
      <hr />
      {!props.isCategorySetting ? (
        <>
          <div className={styles.main_label}>Category details</div>
          <div className={styles.sub_label}>
            Enter the categories and sub-categories, we will show to others!
          </div>
        </>
      ) : (
        ""
      )}
      {!props.isCategorySetting ? (
        <>
          <div className={styles.all_inputs}>
            <Row>
              <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
                <TextField
                  fullWidth
                  required
                  placeholder="Category name"
                  label="Category name"
                  variant="outlined"
                  id="categoryName"
                  name="categoryName"
                  inputProps={{ maxLength: 50 }}
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value.trimStart())}
                  error={categoryNameError ? true : false}
                  helperText={categoryNameError}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
                <TextField
                  id="category_description"
                  label="Category Description"
                  multiline
                  fullWidth
                  inputProps={{ maxLength: 150 }}
                  rows={4}
                  placeholder="Category Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.trimStart())}
                />
              </Col>
            </Row>
          </div>
          <div className={styles.button_grp}>
            <Button
              id="add-category-button"
              data-testid="add-button-not-in-category"
              disabled={categoryName ? false : true}
              onClick={() => createCategory()}
              className={global_style.primary_button + " " + styles.next_button}
            >
              {" "}
              Add
            </Button>
          </div>
        </>
      ) : (
        <>
          {isFormVisible && (
            <>
              <div className={styles.all_inputs}>
                <Row>
                  <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
                    <TextField
                      fullWidth
                      required
                      placeholder="Category name"
                      label="Category name"
                      variant="outlined"
                      id="categoryName"
                      inputProps={{ maxLength: 50 }}
                      name="categoryName"
                      // value={categoryName}
                      onChange={handleCategoryNameChange}
                      error={categoryNameError ? true : false}
                      helperText={categoryNameError}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
                    <TextField
                      id="category_description"
                      label="Category Description"
                      multiline
                      fullWidth
                      inputProps={{ maxLength: 150 }}
                      rows={4}
                      placeholder="Category Description"
                      // value={description}
                      onChange={handleDescriptionChange}
                    />
                  </Col>
                </Row>
              </div>
              <div className={styles.button_grp}>
                <Button
                  id="add-category-button"
                  data-testid="add-button-in-category"
                  disabled={categoryName ? false : true}
                  onClick={() => createCategory()}
                  className={
                    global_style.primary_button + " " + styles.next_button
                  }
                >
                  {" "}
                  Add
                </Button>
              </div>
            </>
          )}
        </>
      )}
      {!props.isCategorySetting ? (
        <div className={styles.main_label}>Categories</div>
      ) : (
        ""
      )}
      {allCategories.map((category, index) => {
        //accprdion in which I want to render my ParentComponent
        return (
          <ControlledAccordions
            Component={ParentCompoent}
            key={index}
            data={category}
            index={index}
            heading={
              headingEdit.status && headingEdit.index == index ? (
                <ClickAwayListener
                  onClickAway={() => {
                    if (!editedHeaderNameError) {
                      setHeadingEdit({ status: false, index: -1 });
                    }
                  }}
                >
                  <div style={{ height: "80px" }}>
                    <TextField
                      className="edit_head_name_accordion"
                      style={{ height: "30px", width: "100%" }}
                      value={category.category_name}
                      onChange={(e) => handleChangeHeadName(e, index)}
                      onClick={(e) => e.stopPropagation()}
                      inputProps={{ maxLength: 50 }}
                      id={`edit-${index}-head-accordian-name`}
                      data-testid="heading-in-edit"
                      // sx={{
                      //   "&.MuiTextField-root": {
                      //     display: "flex",
                      //     flexDirection: "inherit",
                      //     width: "500px",
                      //   },
                      // }}
                      variant="outlined"
                      label="Category name"
                      // InputProps={{
                      //   endAdornment: (
                      //     <InputAdornment position="end">
                      //       {" "}
                      //       {category.category_name && (
                      //         <Button
                      //           onClick={() =>
                      //             setHeadingEdit({ status: false, index: -1 })
                      //           }
                      //           className={
                      //             global_style.primary_button + " " + styles.save
                      //           }
                      //           style={{ height: "100%" }}
                      //         >
                      //           Save
                      //         </Button>
                      //       )}
                      //     </InputAdornment>
                      //   ),
                      // }}
                      error={editedHeaderNameError}
                      helperText={editedHeaderNameError}
                    />
                  </div>
                </ClickAwayListener>
              ) : (
                category.category_name
              )
            }
            accordionDelete={accordionDelete}
            isHeadEditing={headingEdit.index !== index ? true : false}
            handleEditHeading={handleEditHeading}
          />
        );
      })}
      {!props.isCategorySetting ? (
        <div className={`${styles.button_grp} ${styles.mt50}`}>
          <Button
            onClick={() => setActiveStep((prev) => prev + 1)}
            className={global_style.secondary_button}
            id="finishlater-button-category"
            style={{ paddingRight: "25px" }}
          >
            {" "}
            Finish later
          </Button>
          <Button
            disabled={
              uploadedCategory || enableSave
                ? // (categoryName && description && categoryNamesList.length > 0)
                  false
                : true
            }
            onClick={() => handleSubmitCategories()}
            className={global_style.primary_button + " " + styles.next_button}
            id="next-button-category"
          >
            {" "}
            Next
          </Button>
        </div>
      ) : (
        <div className={`${styles.button_grp} ${styles.mt50}`}>
          <Button
            onClick={() => history.push("/datahub/new_datasets")}
            className={global_style.secondary_button}
            id="cancel-button-category"
          >
            {" "}
            Cancel
          </Button>
          <Button
            disabled={
              uploadedCategory || enableSave
                ? // (categoryName && description && categoryNamesList.length > 0)
                  false
                : true
            }
            onClick={() => handleSubmitCategories()}
            className={global_style.primary_button + " " + styles.next_button}
            id="submit-button-category"
          >
            {" "}
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
