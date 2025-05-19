import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputAdornment, InputLabel, List, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import MenuItem from '@mui/material/MenuItem';
import SelectorForCategories from './SelectorForCategories';
import { AccountCircle } from '@material-ui/icons';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PropTypes from 'prop-types';
import PopupBox from './PopupBox';
import PopupBoxForSubCat from './PopupBoxForSubCat';
import TreeViewComponent from './TreeView';
import Deletecategories from './DeleteMainCategories';
import DeleteSubCat from './DeleteSubCat';
import HTTPService from '../../Services/HTTPService';
import UrlConstant from '../../Constants/UrlConstants';
import { GetErrorHandlingRoute, GetErrorKey } from '../../Utils/Common';
import { useHistory } from 'react-router-dom';
import Loader from '../Loader/Loader';
import AddingCategory from './AddingCategory';

const AdminCategorySetupAndEdit = () => {
    const [inputForMainCategory, setInputForMainCategory] = useState("")
    const [inputForSubCategory, setInputForSubCategory] = useState("")
    const [ListOfMainCategory, setListMainCategory] = useState([])
    const [ListOfSubCategory, setListSubCategory] = useState([])
    const [isLoader, setIsLoader] = useState(false)
    const [mainCategories, setMainCategory] = React.useState('');
    const [listOfSubCategoriesForSelected, setListForSubCatForSelected] = useState([])
    const handleChangeMainCategory = (event) => {
        setMainCategory(event.target.value);
    };
    const history = useHistory()


    //dialog box for main category
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };


    //dialog box for sub category
    const [openSubCat, setOpenSubCat] = React.useState(false);

    const handleClickOpenSubCategoryPopup = () => {
        setOpenSubCat(true);
    };

    const handleCloseSubCategoryPopup = (value) => {
        setOpenSubCat(false);
    };
    //dialog box for delete category
    const [openCatForDel, setopenCatForDel] = React.useState(false);

    const handleClickDeleCatOpen = () => {
        setopenCatForDel(true);
    };

    const handleClickDeleCatClose = (value) => {
        setopenCatForDel(false);
    };

    //dialog box for delete category
    const [openSubCatForDel, setopenSubCatForDel] = React.useState(false);

    const handleClickDeleSubCatOpen = () => {
        setopenSubCatForDel(true);
    };

    const handleClickDeleSUbCatClose = (value) => {
        setopenSubCatForDel(false);
    };


    const categoryCreator = (value, index) => {
        let obj = { "category": value, "category_index": index, children: [], status: false }
        setListMainCategory([...ListOfMainCategory, obj])
        localStorage.setItem("categories", JSON.stringify([...ListOfMainCategory, obj]))
    }
    const subCategoryCreator = (category, value, index) => {
        console.log(category, value, index)
        setListSubCategory([...ListOfSubCategory, value])
        for (let i = 0; i < ListOfMainCategory.length; i++) {
            if (ListOfMainCategory[i].category == category) {
                let obj = { "sub_category": value, "sub_category_index": index, status: false }
                ListOfMainCategory[i].children.push(obj)
            }
        }
        console.log(ListOfMainCategory)
        localStorage.setItem("categories", JSON.stringify(ListOfMainCategory))
    }

    const deleteCat = (value) => {
        let newArr = ListOfMainCategory.filter((item) => item.category != value)
        setListMainCategory([...newArr])
        localStorage.setItem("categories", JSON.stringify(newArr))
    }

    const generateSubCatList = (e) => {
        // console.log(cat_name)
        setMainCategory(e.target.value)
        let cat = ListOfMainCategory.filter((item) => item.category == e.target.value)
        console.log(cat)
        if (cat) setListForSubCatForSelected([...cat[0].children])
    }
    const [selectedSubCat, setSelectedSubCat] = useState("")

    const handleChangeSubCat = (e) => {
        setSelectedSubCat(e.target.value)
    }

    const deleteSubCat = (value, parent) => {
        console.log(value, parent)
        let newArr = [...ListOfMainCategory]
        for (let i = 0; i < newArr.length; i++) {
            if (newArr[i].category == parent) {
                let newArrChildren = newArr[i].children.filter((item) => item.sub_category != value)
                newArr[i].children = newArrChildren
                setListMainCategory([...newArr])
            }
        }
        localStorage.setItem("categories", JSON.stringify(newArr))
    }


    const [isRename, setIsRename] = useState(false)

    const getAllCatAndSubCat = () => {
        HTTPService(
            "GET",
            "https://datahubethdev.farmstack.co/be/datahub/dataset/v2/category/",
            "",
            true,
            true
        ).then((response) => {
            // categoryCreator(response.data)
            console.log(response.data)
            // setListMainCategory([...response.data])
            localStorage.setItem("categories", JSON.stringify(...response.data))
        }).catch((e) => {
            console.log(e)
        })
    }

    const handleSavingCategoryAndSubCat = () => {
        setIsLoader(true)
        let url = UrlConstant.base_url + UrlConstant.add_category_edit_category
        let method = "POST"
        let bodyFormData = JSON.stringify({ Rice: ["a", "b", "c"], Chilly: [1, 2, 3] })
        HTTPService(method, url, bodyFormData,
            false,
            true).then((res) => {
                setIsLoader(false)
                console.log(res)
            }).catch((e) => {
                setIsLoader(false);
                console.log(e);
                var returnValues = GetErrorKey(e, bodyFormData.keys())
                var errorKeys = returnValues[0]
                var errorMessages = returnValues[1]
                if (errorKeys.length > 0) {
                    for (var i = 0; i < errorKeys.length; i++) {
                        switch (errorKeys[i]) {
                            // case "first_name": setFirstNameErrorMessage(errorMessages[i]); break;
                            // case "last_name": setLastNameErrorMessage(errorMessages[i]); break;
                            // case "email": setEmailErrorMessage(errorMessages[i]); break;
                            // case "subject": setSubjectErrorMessage(errorMessages[i]); break;
                            // case "describe_query": setDescribeQueryErrorMessage(errorMessages[i]); break;
                            // case "contact_number": setContactNumberErrorMessage(errorMessages[i]); break;
                            default: history.push(GetErrorHandlingRoute(e)); break;
                        }
                    }
                }
                else {
                    history.push(GetErrorHandlingRoute(e))
                }
            })
    }

    useEffect(() => {
        getAllCatAndSubCat()
        // let allCatAndSubCat = JSON.parse(localStorage.getItem("categories"))
        // if (allCatAndSubCat) {
        //     setListMainCategory([...allCatAndSubCat])
        // }
    }, [])


    return (
        <>
            <Container id='categories-main-container'>
                {isLoader ? <Loader /> : ""}
                <Row style={{ border: "1px solid red" }}>
                    <Col lg={6} sm={12}>
                        <TreeViewComponent data={ListOfMainCategory} setData={setListMainCategory} />
                    </Col>
                </Row>
                <Row >
                    <Col lg={3} sm={12}>

                        <Fab variant="extended" onClick={handleClickOpen}>
                            <AddIcon sx={{ mr: 1 }} />
                            Add category
                        </Fab>
                        <PopupBox ListOfMainCategory={ListOfMainCategory} setListMainCategory={categoryCreator} boxType={"category"} open={open} handleClose={handleClose} input={inputForMainCategory} setInput={setInputForMainCategory} />

                    </Col>
                    <Col lg={3} sm={12}>

                        <Fab variant="extended" onClick={handleClickDeleCatOpen}>
                            <RemoveCircleOutlineIcon sx={{ mr: 1, color: "red" }} />
                            Delete category
                        </Fab>
                        <Deletecategories action={deleteCat} setIsRename={setIsRename} isRename={isRename} boxType={"subcategory"} open={openCatForDel} handleClose={handleClickDeleCatClose} input={inputForSubCategory} setInput={setInputForSubCategory} handler={handleChangeMainCategory} inputLabel={"Main categories"} value={mainCategories} data={ListOfMainCategory} helperText={"Please select anyone category"} setListSubCategory={subCategoryCreator} ListOfSubCategory={ListOfSubCategory} />

                    </Col>

                </Row>
                <Row>
                    <Col lg={3} sm={12}>
                        <Fab variant="extended" onClick={handleClickOpenSubCategoryPopup}>
                            <AddIcon sx={{ mr: 1 }} />
                            Add Sub category
                        </Fab>
                        <PopupBoxForSubCat boxType={"subcategory"} open={openSubCat} handleClose={handleCloseSubCategoryPopup} input={inputForSubCategory} setInput={setInputForSubCategory} handler={handleChangeMainCategory} inputLabel={"Main categories"} value={mainCategories} data={ListOfMainCategory} helperText={"Please select anyone category"} setListSubCategory={subCategoryCreator} ListOfSubCategory={ListOfSubCategory} />
                    </Col>

                    <Col lg={3} sm={12}>
                        <Fab variant="extended" onClick={handleClickDeleSubCatOpen}>
                            <RemoveCircleOutlineIcon sx={{ mr: 1 }} />
                            Delete Sub category
                        </Fab>
                        <DeleteSubCat sub_value={selectedSubCat} deleteSubCat={deleteSubCat} listOfSubCategoriesForSelected={listOfSubCategoriesForSelected} action={deleteSubCat} setIsRename={setIsRename} isRename={isRename} boxType={"subcategory"} open={openSubCatForDel} handleClose={handleClickDeleSUbCatClose} input={inputForSubCategory} setInput={setInputForSubCategory} handler={generateSubCatList} sub_cat_handler={handleChangeSubCat} inputLabel={"Main categories"} value={mainCategories} data={ListOfMainCategory} helperText={"Please select anyone category"} setListSubCategory={subCategoryCreator} ListOfSubCategory={ListOfSubCategory} />

                    </Col>
                </Row>
                <Row>
                    <Col lg={6} sm={12}>
                        <Button className='submitbtndept' onClick={handleSavingCategoryAndSubCat}>
                            Submit
                        </Button>
                    </Col>
                </Row>
                <AddingCategory />
            </Container>
        </>
    )
}

export default AdminCategorySetupAndEdit