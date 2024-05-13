import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./nodataavailable.module.css";
import FileUploaderDetailsAccordian from "./FileUploaderDetailsAccordian";
import AccordionForUploadedFileDetails from "./AccordionForUploadedFileDetails";

const ConnectionProgressGif = ({
  loader,
  mysqlFileList,

  postgresFileList,
  deleteFunc,
  datasetname,

  progress,
  setProgress,
  uploadFile,
  key,
  LiveApiFileList,
}) => {
  return (
    <div className={styles.nodatamainbox}>
      <Row
        className="rightSideIndicator"
        style={{ maxHeight: "400px", overflowY: "scroll" }}
      >
        {uploadFile.length > 0 ? (
          <Col style={{ minWidth: "500px" }} lg={12} sm={12}>
            <FileUploaderDetailsAccordian
              datasetname={datasetname}
              deleteFunc={deleteFunc}
              progress={progress}
              setProgress={setProgress}
              title={"Local files"}
              uploadFile={uploadFile}
              key={key}
              loader={loader}
              source={"file"}
            />
          </Col>
        ) : (
          ""
        )}
        {/* {(localUploaded.length > 0 ) ? <Col style={{ minWidth: "500px" }} lg={12} sm={12}>
                    <AccordionForUploadedFileDetails loader={loader} source={"file"} datasetname={datasetname} deleteFunc={deleteFunc} title={"Local files"} data={localUploaded}
               progress={progress} setProgress={setProgress} uploadFile={uploadFile} key={key} />
                </Col> : ""} */}

        {mysqlFileList.length > 0 ? (
          <Col style={{ minWidth: "500px" }} lg={12} sm={12}>
            <AccordionForUploadedFileDetails
              source={"mysql"}
              datasetname={datasetname}
              deleteFunc={deleteFunc}
              title={"Mysql"}
              data={mysqlFileList}
            />
          </Col>
        ) : (
          ""
        )}
        {postgresFileList.length > 0 ? (
          <Col style={{ minWidth: "500px" }} lg={12} sm={12}>
            <AccordionForUploadedFileDetails
              source={"postgresql"}
              datasetname={datasetname}
              deleteFunc={deleteFunc}
              title={"Postgres"}
              data={postgresFileList}
            />
          </Col>
        ) : (
          ""
        )}
        {LiveApiFileList.length > 0 ? (
          <Col style={{ minWidth: "500px" }} lg={12} sm={12}>
            <AccordionForUploadedFileDetails
              source={"live_api"}
              datasetname={datasetname}
              deleteFunc={deleteFunc}
              title={"liveapi"}
              data={LiveApiFileList}
            />
          </Col>
        ) : (
          ""
        )}
      </Row>
      <Row></Row>
    </div>
  );
};

export default ConnectionProgressGif;
