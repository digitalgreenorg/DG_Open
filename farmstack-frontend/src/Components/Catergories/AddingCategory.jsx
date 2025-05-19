import {
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  List,
  ListItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { useHistory } from "react-router-dom";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import { GetErrorHandlingRoute } from "../../Utils/Common";
import Loader from "../Loader/Loader";
import { Button, Divider, Input } from "antd";
import {
  DownOutlined,
  PlusOutlined,
  SubnodeOutlined,
  FrownFilled,
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { minHeight } from "@mui/system";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { message, Space } from "antd";
import { Tree } from "antd";
import { DataNode } from "antd/es/tree";
import Echarts from "./Echarts";
const AddingCategory = (props) => {
  const { isOnborading, showBrandingScreen, isaccesstoken } = props;
  const [catname, setCatName] = useState("");
  const [subCatname, setSubCatName] = useState("");
  const [allCat, setAllCat] = useState({});
  const [valueForEachCat, setValueForEachCat] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [selectCatForDelete, setSelectCatForDelete] = useState("");
  const [selectCatForDeleteSubCat, setSelectCatForDeleteSubCat] = useState("");
  const [selectSubCatForDelete, setSelectForSubCatForDelete] = useState("");

  //
  const [renamedCategoryName, setRanamedCategoryname] = useState("");

  const history = useHistory();
  const [loading, setLoading] = useState(false);

  //messages
  const [messageApi, contextHolder] = message.useMessage();
  const success = (text, type) => {
    messageApi.open({
      type: type,
      content: text,
      duration: 2,
    });
  };
  function addCategory() {
    let isAlreadyIncluded = Object.keys(allCat).includes(catname);
    if (!isAlreadyIncluded) {
      setAllCat({ ...allCat, [catname]: [] });
      setCatName("");
      success("Category added!", "success");
    } else {
      success("Category already exist!", "error");
    }
  }
  function addSubCategory() {
    console.log(selectedCat, subCatname, allCat[selectedCat]);
    if (!allCat[selectedCat]?.includes(subCatname)) {
      setAllCat({
        ...allCat,
        [selectedCat]: [...allCat[selectedCat], subCatname],
      });
      setCatName("");
      setSubCatName("");
      success("Sub category added!", "success");
    } else {
      success("Sub category already exist!", "error");
    }
  }

  const handleSavingCategoryAndSubCat = () => {
    setLoading(true);
    let url = UrlConstant.base_url + UrlConstant.add_category_edit_category;
    let method = "POST";
    let bodyFormData = JSON.stringify(allCat);
    HTTPService(method, url, bodyFormData, false, true, isaccesstoken)
      .then((res) => {
        setLoading(false);
        setSelectedCat("");
        setCatName("");
        setSubCatName("");
        setSelectForSubCatForDelete("");
        setSelectCatForDeleteSubCat("");
        localStorage.setItem("new_cat", bodyFormData);
        console.log(res);
        if (isOnborading) {
          showBrandingScreen();
        } else {
          success("Saved!", "success");
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  const getAllCategoryAndSubCategory = () => {
    setLoading(true);
    let url = UrlConstant.base_url + UrlConstant.add_category_edit_category;
    let method = "GET";
    HTTPService(
      method,
      url,
      "",
      false,
      true,
      isOnborading ? isaccesstoken : false
    )
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        let dataObj = Object.keys(res.data);
        if (dataObj && dataObj.length > 0) {
          setAllCat({ ...res.data });
        } else {
          setAllCat({});
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        setAllCat({});
        // history.push(GetErrorHandlingRoute(e))
      });
  };

  const deleteCategory = () => {
    //deleting the cat ==> selectCatForDelete
    let allCategory = { ...allCat };
    delete allCategory[selectCatForDelete];
    setSelectedCat("");
    setSelectCatForDelete("");
    setSelectCatForDeleteSubCat("");
    setSelectForSubCatForDelete("");
    setAllCat({ ...allCategory });
    success("Category deleted!", "success");
  };
  const deleteSubCategory = () => {
    //deleting the cat ==>   const [selectCatForDeleteSubCat, setSelectCatForDeleteSubCat] = useState("")
    // const [selectSubCatForDelete, setSelectForSubCatForDelete] = useState("")
    let arr = Object.keys(allCat);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == selectCatForDeleteSubCat) {
        //  [...allCat[selectCatForDeleteSubCat]]
        const index = allCat[selectCatForDeleteSubCat].indexOf(
          selectSubCatForDelete
        );
        if (index > -1) {
          // only splice array when item is found
          setSelectedCat("");
          setSelectCatForDelete("");
          allCat[selectCatForDeleteSubCat].splice(index, 1); // 2nd parameter means remove one item only
          setSelectForSubCatForDelete("");
          setSelectCatForDeleteSubCat("");
          setAllCat({ ...allCat });
          success("Sub category deleted!", "success");
        }
      }
    }
    console.log(arr);
  };

  const renameCategory = () => {
    if (!selectCatForDelete) return;
    let newObj = { ...allCat };
    newObj[renamedCategoryName] = newObj[selectCatForDelete]; // Assign new key
    delete newObj[selectCatForDelete];
    setCatName("");
    setSubCatName("");
    setSelectedCat("");
    setSelectCatForDeleteSubCat("");
    setSelectForSubCatForDelete("");
    setSelectCatForDelete("");
    setRanamedCategoryname("");
    console.log(newObj);
    setAllCat({ ...newObj });
    success(
      `Category ${selectCatForDelete} renamed to ${renamedCategoryName}`,
      "success"
    );
  };

  const treeData = [
    // {
    //     title: 'parent 1',
    //     key: '0-0',
    //     icon: <SmileOutlined />,
    //     children: [
    //         {
    //             title: 'leaf',
    //             key: '0-0-0',
    //             icon: <MehOutlined />,
    //         },
    //         {
    //             title: 'leaf',
    //             key: '0-0-1',
    //             icon: ({ selected }) => (selected ? <FrownFilled /> : <FrownOutlined />),
    //         },
    //     ],
    // },
  ];
  // let index = 0
  // for (const [key, value] of Object.entries(allCat)) {
  //     let obj = {}
  //     let subcat = []
  //     obj.title = key
  //     obj.key = index++
  //     console.log(value)
  //     for (let i = 0; i < value.length; i++) {
  //         let childObj = {}
  //         childObj.title = value[i]
  //         subcat.push(childObj)
  //     }
  //     obj.children = subcat
  //     console.log(obj)
  //     treeData.push(obj)
  // }
  useEffect(() => {
    console.log("isOnboradinsdsdas", isOnborading);
    if (!isOnborading) {
      getAllCategoryAndSubCategory();
    }
  }, []);
  return (
    <>
      <div style={{ width: "95%", margin: "auto" }}>
        {contextHolder}
        {loading ? <Loader /> : ""}
        <Row>
          <Col lg={3} sm={12} style={{ borderRight: "2px solid #c09507" }}>
            <div style={{ borderBottom: "2px solid #c09507" }}>
              {/* <Row style={{ margin: "10px 20px 10px 0px" }}>
                                <label htmlFor=""><Button style={{ background: "green", color: "white" }}>Add category</Button></label>
                                <Button style={{ background: "green", color: "white", marginLeft: "5px" }} shape="circle">
                                    +
                                </Button>
                            </Row> */}
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                <Input
                  label={"Category"}
                  placeholder="Category name"
                  variant="filled"
                  value={catname}
                  onChange={(e) => setCatName(e.target.value)}
                />
              </Row>
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                <Button
                  style={{
                    background: catname ? "#00a94f" : "none",
                    color: catname ? "white" : "",
                  }}
                  disabled={catname ? false : true}
                  onClick={addCategory}
                >
                  Add Category
                </Button>
              </Row>
            </div>
            <div style={{ borderBottom: "2px solid #c09507" }}>
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                {/* <label htmlFor="">Add sub category</label> */}
                {/* <Button style={{ background: "green", color: "white", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "5px" }} shape="circle">
                                    <SubnodeOutlined />
                                </Button> */}
              </Row>
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Category
                  </InputLabel>
                  <Select
                    label={"Category"}
                    name="cat"
                    id="cat"
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                  >
                    {/* <option value={""}>{""}</option> */}
                    {Object.keys(allCat).map((eachCategory) => {
                      return (
                        <MenuItem value={eachCategory}>{eachCategory}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Row>
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                <Input
                  label={"Sub category"}
                  placeholder="Sub category name"
                  variant="filled"
                  value={subCatname}
                  onChange={(e) => setSubCatName(e.target.value)}
                />
              </Row>
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                <Button
                  style={{
                    background: selectedCat && subCatname ? "#00a94f" : "none",
                    color: selectedCat && subCatname ? "white" : "",
                  }}
                  disabled={selectedCat && subCatname ? false : true}
                  onClick={addSubCategory}
                >
                  Add Sub Category
                </Button>
              </Row>
            </div>
            <div style={{ borderBottom: "2px solid #c09507" }}>
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                {/* <label htmlFor="">Delete category</label> */}
                {/* <Button style={{ background: "red", color: "white", marginLeft: "5px" }} shape="circle">
                                    -
                                </Button> */}
              </Row>
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Category
                  </InputLabel>
                  <Select
                    label={"Category"}
                    name="cat"
                    id="cat"
                    value={selectCatForDelete}
                    onChange={(e) => setSelectCatForDelete(e.target.value)}
                  >
                    {Object.keys(allCat).map((eachCategory) => {
                      return (
                        <MenuItem value={eachCategory}>{eachCategory}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Row>
              <Row
                id="rowForRenameCategory"
                style={{ margin: "10px 20px 10px 0px" }}
              >
                <Input
                  label={"Sub category"}
                  placeholder="New category name"
                  variant="filled"
                  value={renamedCategoryName}
                  onChange={(e) => setRanamedCategoryname(e.target.value)}
                />
              </Row>
              <Row
                style={{
                  margin: "10px 20px 10px 0px",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                {/* <Col > */}
                <Button
                  style={{
                    background: selectCatForDelete ? "red" : "none",
                    color: selectCatForDelete ? "white" : "",
                    width: "130px",
                  }}
                  disabled={selectCatForDelete ? false : true}
                  danger
                  onClick={deleteCategory}
                >
                  Delete category
                </Button>
                {/* </Col> */}
                {/* <Col  > */}
                <Button
                  style={{ width: "135px" }}
                  disabled={
                    selectCatForDelete && renamedCategoryName ? false : true
                  }
                  onClick={renameCategory}
                >
                  Rename category
                </Button>
                {/* </Col> */}
              </Row>
            </div>
            <div>
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                {/* <label htmlFor="">Delete sub category</label> */}
                {/* <Button style={{ background: "red", color: "white", marginLeft: "5px" }} shape="circle">
                                    -
                                </Button> */}
              </Row>
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Category
                  </InputLabel>
                  <Select
                    label={"Category"}
                    name="cat"
                    id="cat"
                    value={selectCatForDeleteSubCat}
                    onChange={(e) =>
                      setSelectCatForDeleteSubCat(e.target.value)
                    }
                  >
                    {/* <option value={""}>{""}</option> */}
                    {Object.keys(allCat).map((eachCategory) => {
                      return (
                        <MenuItem value={eachCategory}>{eachCategory}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Row>
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Sub category
                  </InputLabel>
                  <Select
                    label={"Category"}
                    name="cat"
                    id="cat"
                    value={selectSubCatForDelete}
                    onChange={(e) =>
                      setSelectForSubCatForDelete(e.target.value)
                    }
                  >
                    {selectCatForDeleteSubCat &&
                      allCat[selectCatForDeleteSubCat].map((eachSub) => {
                        return <MenuItem value={eachSub}>{eachSub}</MenuItem>;
                      })}
                  </Select>
                </FormControl>
              </Row>
              <Row style={{ margin: "10px 20px 10px 0px" }}>
                <Button
                  disabled={
                    selectCatForDeleteSubCat && selectSubCatForDelete
                      ? false
                      : true
                  }
                  danger
                  onClick={deleteSubCategory}
                >
                  Delete sub category
                </Button>
              </Row>
            </div>
            <Button
              id="save_category"
              style={{ width: "100%" }}
              onClick={handleSavingCategoryAndSubCat}
            >
              {(isOnborading && Object.keys(allCat).length) < 0
                ? "Skip"
                : (isOnborading && Object.keys(allCat).length) > 0
                ? "Save changes and proceed"
                : "Save changes"}
            </Button>
          </Col>
          {/* <Col lg={1} sm={12}>

                    </Col> */}
          <Col lg={9} sm={12} sty>
            <label htmlFor="">All categories</label>
            {/* <Tree
                            showIcon
                            defaultExpandAll
                            defaultSelectedKeys={['0-0-0']}
                            switcherIcon={<DownOutlined />}
                            treeData={treeData}
                        /> */}
            <Echarts allCat={allCat} />
            {/* <label htmlFor="">Sub category list</label>
                        <List sx={{
                            width: '100%',
                            maxWidth: 360,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 300,

                            '& ul': { padding: 0 },
                        }} >
                            {selectedCat && allCat[selectedCat].map((eachSub) => {
                                return <ListItem>
                                    {eachSub}
                                </ListItem>
                            })}
                        </List> */}
          </Col>
        </Row>
        {/* <Row>
                    <Col lg={3} sm={12}>

                    </Col>
                    <Col lg={3} sm={12}>

                    </Col>
                    <Col lg={3} sm={12}>
                    </Col>
                </Row> */}
      </div>
    </>
  );
};

export default AddingCategory;
