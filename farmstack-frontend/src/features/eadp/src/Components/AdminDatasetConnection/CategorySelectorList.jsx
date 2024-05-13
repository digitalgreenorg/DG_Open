import React from "react";
import { Select } from "antd";

const CategorySelectorList = (props) => {
  const { handler, list, newSelectedCategory } = props;
  const options = [];
  for (let i = 0; i < list.length; i++) {
    options.push({ label: list[i], value: list[i] });
  }

  const handleChange = (value = []) => {
    handler();
  };
  return (
    <div>
      <label htmlFor="">Categories</label>
      <Select
        mode="multiple"
        placeholder="Please select"
        // defaultValue={[]}
        value={newSelectedCategory}
        onChange={handler}
        style={{ width: "100%" }}
        options={options}
        maxTagCount="responsive"
      />
    </div>
  );
};

export default CategorySelectorList;
