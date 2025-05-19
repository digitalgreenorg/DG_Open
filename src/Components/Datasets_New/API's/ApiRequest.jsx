import React, { useContext, useEffect, useState } from "react";
import ControlledTabs from "../../Generic/ControlledTabs";
import TableWithFilteringForApi from "../../Table/TableWithFilteringForApi";
import RequestForKey from "./RequestForKey";
import { useHistory } from "react-router-dom";
import UrlConstant from "../../../Constants/UrlConstants";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import HTTPService from "../../../Services/HTTPService";
import { FarmStackContext } from "../../Contexts/FarmStackContext";

const ApiRequest = (props) => {
  const { datasetid } = useParams();
  const [refetchAllRequest, setRefetchAllRequest] = useState(false);
  props = { setRefetchAllRequest, refetchAllRequest, ...props };
  const { callLoader, setAllDatasetFilesAvailableInsideTheDatasetViewed } =
    useContext(FarmStackContext);
  const history = useHistory();
  const [tabRenderer, setTabRenderer] = useState([]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setRefetchAllRequest(!refetchAllRequest);
  };

  const getAllDatasetFiles = () => {
    console.log("calling get1");
    callLoader(true);
    let url =
      UrlConstant.base_url + UrlConstant.datasetview + datasetid + "/?type=api";
    let method = "GET";
    HTTPService(method, url, "", false, true)
      .then((response) => {
        callLoader(false);
        //setting all the files for files
        let arrayForFileToHandle = [];
        for (let i = 0; i < response.data.datasets.length; i++) {
          let eachFile = response.data.datasets[i];
          if (
            eachFile?.file.endsWith("xls") ||
            eachFile?.file.endsWith("xlsx") ||
            eachFile?.file.endsWith("csv")
          ) {
            arrayForFileToHandle.push(eachFile);
          }
        }
        setAllDatasetFilesAvailableInsideTheDatasetViewed([
          ...arrayForFileToHandle,
        ]);
      })
      .catch((error) => {
        callLoader(false);
        console.log(error);
      });
  };
  useEffect(() => {
    if (history.location?.state?.value !== "my_organisation") {
      return;
    }
    getAllDatasetFiles();
  }, [refetchAllRequest]);
  useEffect(() => {
    if (history.location?.state?.value === "my_organisation") {
      setTabRenderer([
        {
          label: "List of request",
          value: 0,
          component: TableWithFilteringForApi,
        },
        {
          label: "Generate API",
          value: 1,
          component: RequestForKey,
        },
      ]);
    } else {
      setTabRenderer([
        {
          label: "Generate API",
          value: 0,
          component: RequestForKey,
        },
      ]);
    }
  }, []);

  return (
    <div style={{ padding: "0px 40px" }}>
      <ControlledTabs
        tabRenderer={tabRenderer}
        value={value}
        handleChange={handleChange}
      />
      {tabRenderer[value] && (
        <>{React.createElement(tabRenderer[value]?.component, props)}</>
      )}
    </div>
  );
};

export default ApiRequest;
