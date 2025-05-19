import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ControlledAccordion from "../../Accordion/Accordion";
import CheckBoxWithText from "./CheckBoxWithText";
import { getTokenLocal } from "../../../Utils/Common";
import HTTPService from "../../../Services/HTTPService";
import UrlConstant from "../../../Constants/UrlConstants";
import { Country, State, City } from "country-state-city";
import GlobalStyle from "../../../Assets/CSS/global.module.css";
import CheckBoxWithTypo from "./CheckBoxWithTypo";

const Categorise = (props) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [allCategories, setAllCategories] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const { hasThemesKey, setHasThemesKey } = props;
  const [themesCategories, setThemesCategories] = useState([]);

  const handleCheckBox = (categoryId, subCategoryId) => {
    props.setSubCategoryIds((prevIds) => {
      // Check if the subCategoryId is already in the array
      if (prevIds.includes(subCategoryId)) {
        // Remove the subCategoryId
        return prevIds.filter((id) => id !== subCategoryId);
      } else {
        // Add the subCategoryId
        return [...prevIds, subCategoryId];
      }
    });
  };
  const getAllCategoryAndSubCategory = () => {
    let checkforAccess = getTokenLocal() ?? false;
    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.list_category,
      "",
      true,
      true,
      checkforAccess
    )
      .then((response) => {
        setListCategories(response?.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getAllCategoryAndSubCategory();
  }, []);

  useEffect(() => {
    setCountries(Country.getAllCountries());
    if (props.geography?.country) {
      setStates(State?.getStatesOfCountry(props.geography?.country?.isoCode));
    }
    if (props.geography?.country && props.geography?.state?.name) {
      setCities(
        City.getCitiesOfState(
          props.geography?.state?.countryCode,
          props.geography?.state?.isoCode
        )
      );
    }
  }, [props.geography]);
  useEffect(() => {
    const updateCheckBox = () => {
      let tempCategories = [];
      let temp = listCategories?.forEach((data, index) => {
        let prepareCheckbox = [];
        prepareCheckbox = data?.subcategories?.map((subCategory, ind) => {
          // Find if the subcategory exists in the categories array and its subcategories
          const isPresent = props.subCategoryIds.includes(subCategory.id);
          return (
            <CheckBoxWithTypo
              key={ind}
              text={subCategory?.name}
              keyIndex={ind}
              categoryId={data?.id}
              subCategoryId={subCategory?.id}
              checked={isPresent}
              categoryKeyName={data?.name}
              keyName={subCategory?.name}
              handleCheckBox={handleCheckBox}
              fontSize={"12px"}
              customStyle={{
                width: "auto",
                maxWidth: "350px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          );
        });
        let obj = {
          panel: index + 1,
          title: data.name,
          details: prepareCheckbox ? prepareCheckbox : [],
        };
        tempCategories = tempCategories.concat(obj);
      });
      setAllCategories(tempCategories);
    };
    updateCheckBox();
  }, [listCategories, props.subCategoryIds]);

  return (
    <div className="mt-20">
      <Typography
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "600",
          fontSize: "32px",
          lineHeight: "40px",
          color: "#000000",
          textAlign: "left",
        }}
      >
        Categories
      </Typography>
      <Typography
        className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
      >
        {" "}
        Organize and classify your dataset into relevant categories.{" "}
      </Typography>
      <div className="mt-30">
        <ControlledAccordion
          data={allCategories}
          customBorder={true}
          customPadding={true}
          isCustomStyle={true}
          titleStyle={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "900px",
          }}
          isCustomDetailStyle={true}
          customDetailsStyle={{ display: "inline-block", width: "30%" }}
          addHeaderBackground={true}
          headerBackground={"#eafbf3"}
        />
      </div>
      {hasThemesKey && (
        <Box className="mt-50">
          <Typography
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "600",
              fontSize: "32px",
              lineHeight: "40px",
              color: "#000000",
              textAlign: "left",
            }}
          >
            Themes <span style={{ fontSize: "24px", color: "red" }}>*</span>
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              border: "1px solid #00A94F",
              borderRadius: "9px",
              maxHeight: "145px",
              minHeight: "100px",
              overflow: "auto",
              marginTop: "20px",
            }}
          >
            {themesCategories?.map((item, index) => {
              return <Box key={index}>{item}</Box>;
            })}
          </Box>
        </Box>
      )}
      <Box className="d-flex mt-50">
        <Box className="w-100">
          <Typography
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "600",
              fontSize: "32px",
              lineHeight: "40px",
              color: "#000000",
              textAlign: "left",
            }}
          >
            Geography
            <Typography
              className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
            >
              {" "}
              Organize and classify your dataset to respective geography.{" "}
            </Typography>
          </Typography>
          <Box
            className={mobile ? "mt-50" : "d-flex justify-content-left"}
            style={{ gap: "20px" }}
          >
            <FormControl
              fullWidth
              sx={{
                width: "330px",
              }}
              className="mt-30"
            >
              <InputLabel id="test-select-label">Select Country</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="geography-select-country"
                value={props.geography?.country?.name}
                renderValue={() => props.geography?.country?.name}
                onChange={(e) =>
                  props.setGeography((prev) => ({
                    ...prev,
                    country: e.target.value,
                    state: "",
                    city: "",
                  }))
                }
                sx={{
                  textAlign: "left",
                  color: "rgb(0, 171, 85)",
                  "&.MuiInputBase-root": {
                    height: "56px",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#919EAB",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#919EAB",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#919EAB",
                  },
                }}
                label="Select Country"
                placeholder="Select Country"
              >
                {countries?.map((item) => (
                  <MenuItem
                    id={`geography-select-country${item?.name}`}
                    key={item}
                    value={item}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ width: "330px" }} className="mt-30">
              <InputLabel id="test-select-label">Select State</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="geography-select-state"
                value={props.geography?.state?.name}
                onChange={(e) =>
                  props.setGeography((prev) => ({
                    ...prev,
                    state: e.target.value,
                    city: "",
                  }))
                }
                renderValue={() => props.geography?.state?.name}
                sx={{
                  textAlign: "left",
                  color: "rgb(0, 171, 85)",
                  "&.MuiInputBase-root": {
                    height: "56px",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#919EAB",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#919EAB",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#919EAB",
                  },
                }}
                label="Select State"
                placeholder="Select State"
              >
                {states?.map((item) => (
                  <MenuItem
                    id={`geography-select-state${item?.name}`}
                    key={item}
                    value={item}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ width: "330px" }} className="mt-30">
              <InputLabel id="test-select-label">Select City</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id={`geography-select-city`}
                value={props.geography?.city?.name}
                onChange={(e) =>
                  props.setGeography((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                renderValue={() => props.geography?.city?.name}
                sx={{
                  textAlign: "left",
                  color: "rgb(0, 171, 85)",
                  "&.MuiInputBase-root": {
                    height: "56px",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#919EAB",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#919EAB",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#919EAB",
                  },
                }}
                label="Select City"
                placeholder="Select City"
              >
                {cities?.map((item) => (
                  <MenuItem
                    id={`geography-select-city${item?.name}`}
                    key={item}
                    value={item}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Categorise;
