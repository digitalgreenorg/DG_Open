import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import { Delete, Edit } from "@material-ui/icons";
import styles from "./categories.module.css"; // Import the CSS file
import { getTokenLocal } from "../../Utils/Common";

const CategoriesComponent = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const token = getTokenLocal();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://platform.farmer.chat/be/datahub/categories/",
          {
            method: "GET",
            headers: {
              Accept: "application/json, text/plain, */*",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCategories(data);
        handleSelectCategory(data[0]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [token]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setEditCategory(category.name);
  };

  const handleEditCategoryName = () => {
    setCategories(
      categories.map((category) =>
        category.id === selectedCategory.id
          ? { ...category, name: editCategory }
          : category
      )
    );
    setSelectedCategory({ ...selectedCategory, name: editCategory });
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
    setSelectedCategory(null);
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.trim()) {
      const updatedCategory = {
        ...selectedCategory,
        subcategories: [
          ...selectedCategory.subcategories,
          { id: Date.now().toString(), name: newSubcategory },
        ],
      };
      setCategories(
        categories.map((category) =>
          category.id === selectedCategory.id ? updatedCategory : category
        )
      );
      setSelectedCategory(updatedCategory);
      setNewSubcategory("");
    }
  };

  const handleDeleteSubcategory = (subcategoryId) => {
    const updatedCategory = {
      ...selectedCategory,
      subcategories: selectedCategory.subcategories.filter(
        (subcat) => subcat.id !== subcategoryId
      ),
    };
    setCategories(
      categories.map((category) =>
        category.id === selectedCategory.id ? updatedCategory : category
      )
    );
    setSelectedCategory(updatedCategory);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Typography variant="h5" gutterBottom>
          Main Categories
        </Typography>
        <List>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              button
              onClick={() => handleSelectCategory(category)}
              className={styles.category}
            >
              <ListItemText primary={category.name} />
              <IconButton
                onClick={() => handleDeleteCategory(category.id)}
                className={styles.deleteButton}
              >
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
      <Paper className={styles.mainContent} elevation={3}>
        {selectedCategory ? (
          <>
            <div className={styles.categoryHeader}>
              <TextField
                label="Category Name"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
              />
              <Button
                onClick={handleEditCategoryName}
                className={styles.addButton}
              >
                Save
              </Button>
            </div>
            <div className={styles.addSubcategoryForm}>
              <TextField
                label="Add Subcategory"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
              />
              <Button
                onClick={handleAddSubcategory}
                className={styles.addButton}
              >
                Add
              </Button>
            </div>
            <div className={styles.subcategoryList}>
              <Typography variant="h6" gutterBottom>
                Subcategories
              </Typography>
              <List>
                {selectedCategory.subcategories.map((subcat) => (
                  <ListItem key={subcat.id}>
                    <ListItemText primary={subcat.name} />
                    <IconButton
                      onClick={() => handleDeleteSubcategory(subcat.id)}
                      className={styles.deleteButton}
                    >
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </div>
          </>
        ) : (
          <Typography variant="h6">
            Select a category to view and manage its subcategories.
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default CategoriesComponent;
