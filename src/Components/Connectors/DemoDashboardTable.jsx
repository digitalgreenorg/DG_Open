import React, { useState } from "react";
import { useEffect } from "react";
import HTTPService from "../../Services/HTTPService";
import { DataGrid } from "@mui/x-data-grid";
import NoDataAvailable from "../Dashboard/NoDataAvailable/NoDataAvailable";
import downloadIcon from "../../Assets/Img/downloadsvgicon.svg";
import Loader from "../Loader/Loader";
const converter = require("json-2-csv");

const DemoDashboardTable = () => {
  const [col, setCol] = useState([]);
  const [row, setRow] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoader] = useState(false);
  let urlToHit = JSON.parse(localStorage.getItem("show_data"));

  const getData = () => {
    console.log("Hello");
    setLoader(true);
    HTTPService("GET", urlToHit, "", false, false)
      .then((response) => {
        setData(response.data);
        // localStorage.removeItem("show_data")
        // console.log(response)
        let val = [];

        for (let key in response.data[0]) {
          let obj = { field: key, headerName: key, width: 300 };
          val.push(obj);
        }
        let rowArr = [];
        for (let i = 0; i < response.data.length; i++) {
          let masked_phone_number = response.data[i]
            ? response.data[i].phone_number.split("")
            : "9999999999";
          masked_phone_number.splice(3, 5, "X", "X", "X", "X", "X");
          let obj1 = {
            id: i,
            ...response.data[i],
            phone_number: masked_phone_number.join(""),
          };

          rowArr.push(obj1);
        }

        setLoader(false);
        setCol([...val]);
        // let rowArr = [];

        // { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        setRow([...rowArr]);
        console.log("Row data", response.data);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
        //   history.push(GetErrorHandlingRoute(err))
        // setError(true)
      });
  };

  const downloadDocument = () => {
    converter.json2csv(row, async (err, csv) => {
      if (err) {
        throw err;
      }
      // print CSV string
      console.log(csv);
      download(csv);
    });
  };

  const download = (data) => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "Dataset.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div style={{ height: 800, width: "100%", padding: "50px 50px" }}>
          {row.length <= 0 ? (
            <div style={{ margin: "auto", width: "fit-content" }}>
              <NoDataAvailable />
            </div>
          ) : (
            <DataGrid
              rows={row}
              columns={col}
              pageSize={25}
              rowsPerPageOptions={[25]}
            />
          )}
          {row.length > 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
              }}
            >
              {" "}
              <a
                className="downloadDataset"
                // href={`data:text/csv;charset=utf-8,${escape(data)}`}
                // download="dataset.csv"
                onClick={() => downloadDocument()}
              >
                Download Dataset{" "}
              </a>
              <img
                style={{
                  width: "16px",
                  height: "16px",
                  marginLeft: "14px",
                }}
                src={downloadIcon}
                alt={"Download"}
              />{" "}
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default DemoDashboardTable;
