import React, { useState } from "react";

const categories = {
  "Category 1": ["Subcate 1", "Subcate 2"],
  "Category 2": ["Subcate 3", "Subcate 4"],
  // Add more categories and subcategories
};

const Tile = ({ subCategory, onClick }) => (
  <div className="tile" onClick={() => onClick(subCategory)}>
    {subCategory}
  </div>
);

const TileContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="tile-container">
      {selectedCategory &&
        categories[selectedCategory].map((subCategory, index) => (
          <Tile
            key={index}
            subCategory={subCategory}
            onClick={() => console.log(subCategory)}
          />
        ))}
      {Object.keys(categories).map((category, index) => (
        <div
          key={index}
          className="category-tile"
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </div>
      ))}
    </div>
  );
};

export default TileContainer;
