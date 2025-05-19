import React, { useContext, useEffect, useState } from "react";
import styles from "./onboarding.module.css";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import global_style from "../../Assets/CSS/global.module.css";
import ControlledAccordions from "../Catergories/ControlledAccordions";
import add_icon from "../../Assets/Img/Farmstack V2.0/add_icon.svg";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import {
  GetErrorHandlingRoute,
  getTokenLocal,
  goToTop,
} from "../../Utils/Common";
import { ClickAwayListener } from "@mui/base";
import { useHistory } from "react-router-dom";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import Category_v2 from "../Catergories/Category_v2";

const CategoryDetails = (props) => {
  const { callLoader, callToast } = useContext(FarmStackContext);

  const { setActiveStep } = props;
  const [allCategories, setAllCategories] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryNameError, setCategoryNameError] = useState("");
  const [headingEdit, setHeadingEdit] = useState({
    status: false,
    index: -1,
  });
  const [uploadedCategory, setUploadedCategory] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const history = useHistory();

  const createCategory = () => {
    let accessToken = getTokenLocal() ?? false;
    let url = UrlConstant.base_url + UrlConstant.add_category;
    callLoader(true);
    let obj = {
      name: categoryName.trim(),
      description: description.trim(),
    };
    HTTPService("POST", url, obj, false, true, accessToken)
      .then((response) => {
        callLoader(false);
        callToast(
          `${categoryName} Category added successfully!`,
          "success",
          true
        );
        setCategoryName("");
        setDescription("");
        getAllCategory();
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong while adding Category!",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  useEffect(() => {
    getAllCategory();
    goToTop(0);
  }, []);
  const getAllCategory = () => {
    console.log("Getting under cat");
    let method = "GET";
    let url = UrlConstant.base_url + UrlConstant.list_category;
    callLoader(true);
    HTTPService(method, url, "", false, true, false, false)
      .then((response) => {
        callLoader(false);
        setAllCategories(response.data);
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
  const accordionDelete = (id, name) => {
    let accessToken = getTokenLocal() ?? false;
    let url = UrlConstant.base_url + UrlConstant.delete_category + id + "/";
    callLoader(true);
    HTTPService("DELETE", url, "", false, true, accessToken)
      .then((response) => {
        callLoader(false);
        callToast(`Category ${name} deleted successfully!`, "success", true);
        getAllCategory();
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong while deleting Category!",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  const handleUpdateCategory = (id, name) => {
    let accessToken = getTokenLocal() ?? false;
    let url = UrlConstant.base_url + UrlConstant.update_category + id + "/";
    callLoader(true);
    let obj = {
      name: name.trim(),
    };
    HTTPService("PUT", url, obj, false, true, accessToken)
      .then((response) => {
        callLoader(false);
        callToast(`Category updated successfully!`, "success", true);
        getAllCategory();
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong while updating Category!",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

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
  const handleChangeHeadName = (e, index, id) => {
    if (e.target.value.trimStart()) {
      setEditedHeaderError("");
      setEnableSave(true);
    } else {
      setEnableSave(false);
      setEditedHeaderError("Category name cannot be empty");
    }

    let arr = [...allCategories];
    arr[index]["name"] = e.target.value.trimStart();
    setAllCategories([...arr]);
  };

  //component to be passed into the body of the accordion
  function ParentCompoent(props) {
    const { data, index } = props;
    const [subCategoryName, setSubCategoryName] = useState("");
    const [subCatError, setsubCatError] = useState("");
    const [isEditSubCategory, setIsEditSubCategory] = useState(-1);
    const [editSubCategoryName, setEditSubCategoryName] = useState("");

    const handleAddSubcategory = (id) => {
      let accessToken = getTokenLocal() ?? false;
      let url = UrlConstant.base_url + UrlConstant.add_subcategory;
      callLoader(true);
      let obj = {
        category: id,
        name: subCategoryName.trim(),
      };
      HTTPService("POST", url, obj, false, true, accessToken)
        .then((response) => {
          callLoader(false);
          callToast(`Sub Category added successfully!`, "success", true);
          getAllCategory();
        })
        .catch(async (e) => {
          callLoader(false);
          let error = await GetErrorHandlingRoute(e);
          console.log("Error obj", error);
          console.log(e);
          if (error.toast) {
            callToast(
              error?.message ||
                "Something went wrong while adding Sub-Category!",
              error?.status === 200 ? "success" : "error",
              true
            );
          }
          if (error.path) {
            history.push(error.path);
          }
        });
    };

    const handleDeleteSubCategory = (id, name) => {
      let accessToken = getTokenLocal() ?? false;
      let url =
        UrlConstant.base_url + UrlConstant.delete_subcategory + id + "/";
      callLoader(true);
      HTTPService("DELETE", url, "", false, true, accessToken)
        .then((response) => {
          callLoader(false);
          callToast(
            `Sub Category ${name} deleted successfully!`,
            "success",
            true
          );
          getAllCategory();
        })
        .catch(async (e) => {
          callLoader(false);
          let error = await GetErrorHandlingRoute(e);
          console.log("Error obj", error);
          console.log(e);
          if (error.toast) {
            callToast(
              error?.message ||
                "Something went wrong while deleting Sub-Category!",
              error?.status === 200 ? "success" : "error",
              true
            );
          }
          if (error.path) {
            history.push(error.path);
          }
        });
    };

    const handleUpdateSubCategory = (
      categoryId,
      subCategoryId,
      subCategoryname
    ) => {
      let accessToken = getTokenLocal() ?? false;
      let url =
        UrlConstant.base_url +
        UrlConstant.update_subcategory +
        subCategoryId +
        "/";
      callLoader(true);
      let obj = {
        category: categoryId,
        name: subCategoryname.trim(),
      };
      HTTPService("PUT", url, obj, false, true, accessToken)
        .then((response) => {
          callLoader(false);
          callToast(`Sub Category updated successfully!`, "success", true);
          setIsEditSubCategory(-1);
          getAllCategory();
        })
        .catch(async (e) => {
          callLoader(false);
          let error = await GetErrorHandlingRoute(e);
          console.log("Error obj", error);
          console.log(e);
          if (error.toast) {
            callToast(
              error?.message ||
                "Something went wrong while updating Sub-Category!",
              error?.status === 200 ? "success" : "error",
              true
            );
          }
          if (error.path) {
            history.push(error.path);
          }
        });
    };

    const handleSubCategoryChange = (e, index) => {
      setEditSubCategoryName(e.target.value);
    };

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
              onChange={(e) => setSubCategoryName(e.target.value.trimStart())}
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
              onClick={() => handleAddSubcategory(data?.id)}
            />
          </Col>
        </Row>
        <hr style={{ margin: "10px 0px" }} />
        <Row>
          {data?.subcategories?.length > 0 &&
            data?.subcategories?.map((each_sub_category, index) => {
              const isEditing = isEditSubCategory === index;
              return (
                <Col
                  key={each_sub_category.id}
                  lg={6}
                  sm={12}
                  className={styles.margintopbottom10}
                >
                  <TextField
                    disabled={!isEditing}
                    key={each_sub_category.id}
                    required
                    fullWidth
                    placeholder="Sub-category"
                    label="Sub-category"
                    variant="outlined"
                    id={`${index}each_subcategory`}
                    name="each_subcategory"
                    value={
                      isEditing ? editSubCategoryName : each_sub_category?.name
                    }
                    onChange={(e) => handleSubCategoryChange(e, index)}
                    // onBlur={() => saveSubCategoryName(index)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {isEditSubCategory == index ? (
                            <CheckCircleIcon
                              className="mr-1 cursor-pointer"
                              onClick={() => {
                                handleUpdateSubCategory(
                                  data?.id,
                                  each_sub_category?.id,
                                  editSubCategoryName
                                );
                              }}
                            />
                          ) : (
                            <EditIcon
                              className="mr-1 cursor-pointer"
                              onClick={() => {
                                setIsEditSubCategory(index);
                                setEditSubCategoryName(each_sub_category?.name);
                              }}
                            />
                          )}
                          <DeleteOutlineIcon
                            onClick={() =>
                              handleDeleteSubCategory(
                                each_sub_category?.id,
                                each_sub_category?.name
                              )
                            }
                            style={{ color: "#212b36", cursor: "pointer" }}
                            id={`delete${index}-sub-category`}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
              );
            })}
        </Row>
      </span>
    );
  }

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
              // className={
              //   global_style.primary_button + " " + styles.add_category_button
              // }
              // style={{ width: "200px !important" }}
              className={`custom_button`}
            >
              + Add New Category
            </Button>
          </Col>
        </Row>
      )}
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
                      value={categoryName}
                      onChange={(e) =>
                        setCategoryName(e.target.value.trimStart())
                      }
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
                      onChange={(e) =>
                        setDescription(e.target.value.trimStart())
                      }
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
      {/* <Category_v2 /> */}
      {allCategories.map((category, index) => {
        return (
          <ControlledAccordions
            Component={ParentCompoent}
            key={index}
            data={category}
            index={index}
            handleDeleteWithoutPopper={true}
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
                      value={category.name}
                      onChange={(e) =>
                        handleChangeHeadName(e, index, category?.id)
                      }
                      onClick={(e) => e.stopPropagation()}
                      inputProps={{
                        maxLength: 50,
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end">
                              {
                                <CheckCircleIcon
                                  onClick={() =>
                                    handleUpdateCategory(
                                      category?.id,
                                      category?.name
                                    )
                                  }
                                />
                              }
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      id={`edit-${index}-head-accordian-name`}
                      data-testid="heading-in-edit"
                      variant="outlined"
                      label="Category name"
                      error={editedHeaderNameError}
                      helperText={editedHeaderNameError}
                    />
                  </div>
                </ClickAwayListener>
              ) : (
                category.name
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
            disabled={uploadedCategory || enableSave ? false : true}
            onClick={() => handleSubmitCategories()}
            className={global_style.primary_button + " " + styles.next_button}
            id="next-button-category"
          >
            {" "}
            Next
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CategoryDetails;
