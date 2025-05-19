import React from "react";
import { Button, Modal } from "antd";
import globalStyle from "../../Assets/CSS/global.module.css";
import local_style from "./controller_modal.module.css";
const ControllerModal = (props) => {
  const {
    statusOfModal,
    handleOk,
    handleCancel,
    modalBody,
    handleOkForSecondButton,
    isEditModeOn,
  } = props;
  console.log(modalBody, "modalBody");
  return (
    <Modal
      className={
        globalStyle.size24 +
        " " +
        globalStyle.primary_fontStyle +
        " " +
        globalStyle.bold700
      }
      title="Rename columns"
      width={800}
      open={statusOfModal}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button
          data-testid="connector_data_cancel"
          className={
            globalStyle.secondary_button + " " + local_style.marginleftright
          }
          style={{ height: "40px" }}
          key="back"
          onClick={handleCancel}
        >
          Cancel
        </Button>,
        <Button
          className={
            globalStyle.primary_button + " " + local_style.marginleftright
          }
          style={{ height: "40px", margin: "10px 20px" }}
          key="1"
          type="primary"
          //   loading={loading}
          onClick={handleOk}
          data-testid="download_connector_data_refracted"
        >
          {isEditModeOn
            ? "Apply and download refractored file"
            : "Download refractored file"}
        </Button>,
        <Button
          data-testid="download_connector_data_normal"
          className={
            globalStyle.primary_button + " " + local_style.marginleftright
          }
          style={{ height: "40px", margin: "10px 20px !important" }}
          //   key="submit"
          type="2"
          //   loading={loading}
          onClick={handleOkForSecondButton}
        >
          Download original file
        </Button>,
      ]}
    >
      {modalBody}
    </Modal>
  );
};

export default ControllerModal;
