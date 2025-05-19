import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { findType } from "../../Utils/Common";
import localstyle from "./table_with_filtering_for_api.module.css";
export default function CustomSeparator(props) {
  const history = useHistory();
  function handleClick(event, page) {
    event.preventDefault();
    if (page == "current") {
      return;
    }
    history.goBack();
  }
  function goBackTwice() {
    history.goBack();
    history.goBack();
  }
  const breadcrumbs = [
    <Link
      underline="hover"
      className={localstyle.link}
      key="1"
      color="inherit"
      // href={``}
      onClick={() => goBackTwice()}
    >
      Dataset
    </Link>,
    <Link
      className={localstyle.link}
      underline="hover"
      key="2"
      color="inherit"
      // href="/material-ui/getting-started/installation/"
      onClick={(e) => handleClick(e, "last")}
    >
      {props.lastToggle}
    </Link>,
    <Link
      className={localstyle.link}
      underline="hover"
      key="3"
      color="inherit"
      // href="/material-ui/getting-started/installation/"
      onClick={(e) => handleClick(e, "current")}
    >
      {props.currentToggle}
    </Link>,
  ];

  return (
    <Stack spacing={props.mobile ? 0.5 : 2}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}
