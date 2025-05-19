import {
  Box,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";
import React from "react";
import globalStyle from "../../Assets/CSS/global.module.css";
import style from "./connector.module.css";
import CustomDeletePopper from "../../Components/DeletePopper/CustomDeletePopper";
const CardDetail = (props) => {
  const {
    setIsAllConditionForSaveMet,
    temporaryDeletedCards,
    setTemporaryDeletedCards,
    generateData,
    setCompleteJoinData,
    completedJoinData,
    setTotalCounter,
    orgList,
    data,
    setCompleteData,
    index,
    completeData,
    anchorEl,
    setAnchorEl,
    open,
    setOpen,
    id,
  } = props;

  const handleDeletePopper = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const closePopper = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleSelectAll = (e) => {
    let arr = [...completeData];
    let present_card = { ...data };
    if (index >= 1) {
      let cardBeforePresent = arr[index - 1];
      cardBeforePresent["right_on"] = [];
      arr[index - 1] = { ...cardBeforePresent };
    }
    if (e.target.checked) {
      present_card["columnsSelected"] = [...present_card.availabeColumns];
    } else {
      present_card["columnsSelected"] = [];
    }
    present_card["left_on"] = [];

    arr[index] = { ...present_card };
    setCompleteData([...arr]);
  };
  const handleColumnCheck = (e, value) => {
    let arr = [...completeData];
    let present_card = { ...data };
    if (index >= 1) {
      let cardBeforePresent = arr[index - 1];
      cardBeforePresent["right_on"] = [];
      arr[index - 1] = { ...cardBeforePresent };
    }
    if (
      e.target.checked &&
      !present_card.columnsSelected.includes(value) &&
      present_card.availabeColumns.includes(value)
    ) {
      present_card["columnsSelected"] = [
        ...present_card.columnsSelected,
        value,
      ];
      present_card["left_on"] = [];
      arr[index] = { ...present_card };
      setCompleteData([...arr]);
    } else if (
      !e.target.checked &&
      present_card?.columnsSelected?.includes(value) &&
      present_card.availabeColumns?.includes(value)
    ) {
      let i = present_card.columnsSelected.indexOf(value);
      if (i > -1) {
        present_card.columnsSelected.splice(i, 1);
      }
      present_card["left_on"] = [];
      arr[index] = present_card;
      setCompleteData([...arr]);
    }
  };

  const handleDelete = () => {
    let arr = [...completeData];
    if (index == arr.length - 1 && arr.length > 2) {
      setIsAllConditionForSaveMet(true);
    } else {
      setIsAllConditionForSaveMet(false);
    }
    let obj;
    if (index != 0) {
      obj = arr[index - 1];
      obj["right_on"] = [];
      obj["type"] = "";
      obj["next_left"] = [];
      arr[index - 1] = obj;
    }
    arr.splice(index, 1);
    let deleteArr = [];
    let start = index == 0 ? index : index - 1;
    for (let i = start; i < completeData.length; i++) {
      // console.log(index, i, temporaryDeletedCards);
      if (
        !temporaryDeletedCards?.includes(completeData[i]["map_id"]) &&
        completeData[i]["map_id"]
      ) {
        deleteArr.push(completeData[i]["map_id"]);
      }
    }
    setTemporaryDeletedCards([...temporaryDeletedCards, ...deleteArr]);
    setCompleteData([...arr]);
    setTotalCounter((prev) => prev - 1);
    setAnchorEl(null); // Reset anchorEl to null
    setOpen(false); // Reset open to false
  };

  return (
    <Card className={`${style.card_style} w-100`} data-testid="connector_card">
      <Box
        className={`${style.backgroundLightGreen} d-flex justify-content-between align-items-center pt-20 pb-20`}
      >
        <Box className="d-flex">
          <div className="text-left ml-20">
            <Typography
              className={`${globalStyle.bold400} ${globalStyle.size16}  ${globalStyle.dark_color}`}
              sx={{
                fontFamily: "Montserrat !important",
                lineHeight: "40px",
              }}
            >
              Organisation name
            </Typography>
            <Typography
              className={`${globalStyle.bold700} ${globalStyle.size16}  ${globalStyle.dark_color} ${globalStyle.ellipses}`}
              sx={{
                fontFamily: "Montserrat !important",
                lineHeight: "24px",
                maxWidth: "250px",
              }}
            >
              {data?.org_name}
            </Typography>
          </div>
          <div className={`${style.ml80} text-left`}>
            <Typography
              className={`${globalStyle.bold400} ${globalStyle.size16}  ${globalStyle.dark_color} `}
              sx={{
                fontFamily: "Montserrat !important",
                lineHeight: "40px",
              }}
            >
              Dataset name
            </Typography>
            <Typography
              className={`${globalStyle.bold700} ${globalStyle.size16}  ${globalStyle.dark_color} ${globalStyle.ellipses}`}
              sx={{
                fontFamily: "Montserrat !important",
                lineHeight: "24px",
                maxWidth: "250px",
              }}
            >
              {data?.dataset_name ? decodeURI(data.dataset_name) : ""}
            </Typography>
          </div>
          <div className={`${style.ml84} text-left`}>
            <Typography
              className={`${globalStyle.bold400} ${globalStyle.size16}  ${globalStyle.dark_color} `}
              sx={{
                fontFamily: "Montserrat !important",
                lineHeight: "40px",
              }}
            >
              File name
            </Typography>
            <Typography
              className={`${globalStyle.bold700} ${globalStyle.size16}  ${globalStyle.dark_color} ${globalStyle.ellipses}`}
              sx={{
                fontFamily: "Montserrat !important",
                lineHeight: "24px",
                maxWidth: "250px",
              }}
            >
              {data?.file_name
                ? decodeURI(
                    data.file_name.split("/")[
                      data.file_name.split("/").length - 1
                    ]
                  )
                : ""}
            </Typography>
          </div>
        </Box>
        <Box className="mr-20">
          <CustomDeletePopper
            DeleteItem={"card"}
            anchorEl={anchorEl}
            handleDelete={handleDelete}
            id={id}
            open={open}
            closePopper={closePopper}
          />
          <img
            onClick={(event) => handleDeletePopper(event)}
            className="cursor-pointer"
            src={require("../../Assets/Img/delete_black_unfill.svg")}
            id={`delete-integration-card${index}`}
          />
        </Box>
      </Box>
      <Box className={`${style.ml10} text-left`}>
        <Typography
          className={`${globalStyle.bold600} ${globalStyle.size20}  ${globalStyle.dark_color} ${style.mt10} `}
          sx={{
            fontFamily: "Montserrat !important",
            lineHeight: "24.38px",
          }}
        >
          Select columns
        </Typography>
        <Box className={`${style.mb7} d-flex align-items-center mt-20`}>
          <Checkbox
            sx={{ padding: 0, marginLeft: "-2px" }}
            checkedIcon={
              <img src={require("../../Assets/Img/checked_icon.svg")} />
            }
            icon={<img src={require("../../Assets/Img/unchecked_icon.svg")} />}
            onChange={(e) => handleSelectAll(e)}
            checked={
              data?.availabeColumns?.length == data?.columnsSelected?.length
            }
            id={`select-all-${index}-columns`}
            data-testid={`select-all-${index}-columns`}
          />
          <Typography
            className={`${globalStyle.bold700} ${globalStyle.size16}  ${globalStyle.dark_color} ${style.ml9}`}
            sx={{
              fontFamily: "Montserrat !important",
              lineHeight: "22px",
            }}
          >
            Select all
          </Typography>
        </Box>
      </Box>
      <Box className="text-left">
        <Divider />
        <Box className={`${style.gridStyle} ${style.mb13} ${style.ml10}`}>
          {/* {console.log(data, "data")} */}
          {data?.availabeColumns?.length > 0 &&
            data.availabeColumns?.map((col, index) => (
              <Box
                className={`${style.mt23} ${style.ml7} ${style.mr34} d-flex`}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ padding: 0, marginRight: "9px" }}
                      checkedIcon={
                        <img
                          src={require("../../Assets/Img/checked_icon.svg")}
                        />
                      }
                      icon={
                        <img
                          src={require("../../Assets/Img/unchecked_icon.svg")}
                        />
                      }
                      onChange={(e) => handleColumnCheck(e, col)}
                      checked={data?.columnsSelected?.includes(col)}
                      id={`select-columns${index}-files`}
                      data-testid={`select-columns${index}-files`}
                    />
                  }
                  label={col}
                />
                {/* {console.log(col, "some1")} */}
                {/* <Checkbox
                  sx={{ padding: 0 }}
                  checkedIcon={
                    <img src={require("../../Assets/Img/checked_icon.svg")} />
                  }
                  icon={
                    <img src={require("../../Assets/Img/unchecked_icon.svg")} />
                  }
                  onChange={(e) => handleColumnCheck(e, col)}
                  checked={data?.columnsSelected?.includes(col)}
                  id={`select-columns${index}-files`}
                  data-testid={`select-columns${index}-files`}
                /> */}
                {/* <Typography
                  className={`${globalStyle.bold400} ${globalStyle.size16}  ${style.lightText} ${style.ml9} ${globalStyle.ellipses}`}
                  sx={{
                    fontFamily: "Montserrat !important",
                    lineHeight: "22px",
                    maxWidth: "200px",
                  }}
                >
                  {col}
                </Typography> */}
              </Box>
            ))}
        </Box>
      </Box>
    </Card>
  );
};

export default CardDetail;
