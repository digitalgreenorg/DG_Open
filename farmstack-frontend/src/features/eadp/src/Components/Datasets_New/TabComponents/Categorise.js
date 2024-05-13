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
import { getTokenLocal } from "common/utils/utils";
import HTTPService from "common/services/HTTPService";
import UrlConstant from "../../../Constants/UrlConstants";
import { Country, State, City } from "country-state-city";
import GlobalStyle from "../../../Assets/CSS/global.module.css";

const Categorise = (props) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [allCategories, setAllCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const { hasThemesKey, setHasThemesKey } = props;
  const [themesCategories, setThemesCategories] = useState([]);

  const handleCheckBox = (keyName, value) => {
    let tempCategories = { ...props.categorises };
    let tempJson = Object.keys(props.categorises);

    if (tempJson.includes(keyName)) {
      if (tempCategories[keyName].includes(value)) {
        if (tempCategories[keyName]?.length === 1) {
          delete tempCategories[keyName];
        } else {
          let index = tempCategories[keyName].indexOf(value);
          tempCategories[keyName].splice(index, 1);
        }
      } else {
        tempCategories[keyName].push(value);
      }
      props.setCategorises({ ...tempCategories });
    } else {
      props.setCategorises((currentState) => {
        return { ...currentState, [keyName]: [value] };
      });
    }
  };
  const getAllCategoryAndSubCategory = () => {
    let checkforAccess = getTokenLocal() ?? false;
    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.add_category_edit_category,
      "",
      true,
      true,
      checkforAccess
    )
      .then((response) => {
        let tmpThemeKey =
          "Themes" in response?.data && response?.data["Themes"].length > 0;
        setHasThemesKey(tmpThemeKey);

        if (tmpThemeKey) {
          let prepArrForThemes = [];
          let obj = {};
          obj["Themes"] = response?.data["Themes"];
          prepArrForThemes.push(obj);

          prepArrForThemes.forEach((item, index) => {
            let keys = Object.keys(item);
            let tCategory = props?.categorises?.[keys];
            let tempThemesCategories = item?.[keys[0]]?.map((res, ind) => {
              return (
                <CheckBoxWithText
                  key={ind}
                  text={res}
                  keyIndex={index}
                  checked={tCategory?.includes(res)}
                  categoryKeyName={keys[0]}
                  keyName={res}
                  handleCheckBox={handleCheckBox}
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
            setThemesCategories(tempThemesCategories);
          });
        }

        let prepareArr = [];
        for (const [key, value] of Object.entries(response.data)) {
          if (key !== "Themes") {
            let obj = {};
            obj[key] = value;
            prepareArr.push(obj);
          }
        }
        let tempCategories = [];
        prepareArr.forEach((item, index) => {
          let keys = Object.keys(item);
          let tCategory = props?.categorises?.[keys];
          let prepareCheckbox = item?.[keys[0]]?.map((res, ind) => {
            return (
              <CheckBoxWithText
                key={ind}
                text={res}
                keyIndex={index}
                checked={tCategory?.includes(res)}
                categoryKeyName={keys[0]}
                keyName={res}
                handleCheckBox={handleCheckBox}
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
            title: keys[0],
            details: prepareCheckbox ? prepareCheckbox : [],
          };
          tempCategories.push(obj);
        });
        setAllCategories(tempCategories);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getAllCategoryAndSubCategory();
  }, [props.categorises]);

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
                visibility: "show",
                // position: "absolute",
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
              <InputLabel id="test-select-label">Select County</InputLabel>
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
                label="Select County"
                placeholder="Select County"
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
              <InputLabel id="test-select-label">Select Sub County</InputLabel>
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
                label="Select Sub County"
                placeholder="Select Sub County"
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
