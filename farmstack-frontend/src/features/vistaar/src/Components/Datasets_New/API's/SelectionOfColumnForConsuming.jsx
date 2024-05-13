import React, { useEffect, useMemo, useState } from "react";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
// import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import List from "rc-virtual-list";
import { Input } from "antd";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
const { Search } = Input;
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

const SelectionOfColumnForConsuming = (props) => {
  const all = useMemo(() => {
    let all_columns = Object.keys(props.columns);
    return all_columns;
  }, [props.columns]);
  const [isFilteringOn, setIsFilteringOn] = useState(false);
  const [filterData, setFilterData] = useState([]);

  const handleChange = (value) => {
    // const {
    //   target: { value },
    // } = event;
    console.log(value, "value");
    if (value == "1") {
      props.setColumnName(all);
      return;
    } else if (value == "0") {
      props.setColumnName([]);
      return;
    }
    let index = props.columnName?.indexOf(value);
    if (index > -1) {
      let arr = [...props.columnName];
      arr.splice(index, 1);
      props.setColumnName(arr);
    } else {
      props.setColumnName([...props.columnName, value]);
    }
  };

  const filterChange = (value) => {
    setIsFilteringOn(true);
    const filteredData = all.filter((each) => {
      return each.toLocaleLowerCase().includes(value.toLocaleLowerCase());
    });
    setFilterData(filteredData);
    setIsFilteringOn(false);
  };

  useEffect(() => {
    setFilterData([...all]);
  }, [all]);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        {/* <InputLabel id="demo-multiple-checkbox-label">
          Select columns to Consume
        </InputLabel> */}
        {/* <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={props.columnName}
          onChange={handleChange}
          input={<OutlinedInput label="Select columns to Consume" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          <MenuItem
            key={"select_all"}
            value={
              props.columnName?.length !== all?.length
                ? "All-selected"
                : "Deselect-all"
            }
          >
            <ListItemText
              primary={
                props.columnName?.length !== all?.length
                  ? "Select All"
                  : "Deselect All"
              }
            />
          </MenuItem> */}
        <Input
          placeholder="Search columns"
          onChange={(e) => filterChange(e.target.value)}
          iconRender={<SearchOutlinedIcon fontSize="small" />}
          allowClear
        />

        {all?.length === filterData?.length && (
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              gap: "20px",
              height: "30px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              background: "#00A94F",
              // marginTop: "5px",
              textAlign: "left",
              color: "white",
            }}
          >
            <Checkbox
              className="select_all_in_api_consume"
              onClick={() =>
                handleChange(
                  props.columnName?.length === all?.length ? "0" : "1"
                )
              }
              checked={props.columnName?.length === all?.length}
            />{" "}
            <ListItemText
              primary={
                props.columnName?.length === all?.length
                  ? "Deselect All"
                  : "Select All"
              }
            />
          </div>
        )}
        <List data={filterData} height={250} itemHeight={30} itemKey={"id"}>
          {(name, index) => (
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                gap: "20px",
                height: "25px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                // marginTop: "5px",
                textAlign: "left",
              }}
              key={name}
              value={name}
            >
              <Checkbox
                onClick={() => handleChange(name)}
                checked={props.columnName.indexOf(name) > -1}
              />{" "}
              <ListItemText primary={name} />
            </div>
          )}
        </List>

        {/* {all.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={props.columnName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))} */}
        {/* </Select> */}
      </FormControl>
    </div>
  );
};

export default SelectionOfColumnForConsuming;
