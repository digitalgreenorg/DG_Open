import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelectCheckmarks(props) {
  const { handler, category, list, heading } = props;

  return (
    <div>
      <FormControl sx={{ m: 1, width: 250 }}>
        <InputLabel id="demo-multiple-checkbox-label">{heading}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="category_id"
          multiple
          value={category}
          onChange={handler}
          input={<OutlinedInput label={heading} />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {list.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={category.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
