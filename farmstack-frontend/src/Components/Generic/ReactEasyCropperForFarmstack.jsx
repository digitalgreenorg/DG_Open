import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { Button, Tooltip } from "@mui/material";
import global_style from "../../Assets/CSS/global.module.css";
import InfoIcon from "@mui/icons-material/Info";
const styles = (theme) => ({
  cropContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    background: "#333",
    [theme.breakpoints.up("sm")]: {
      height: 400,
    },
  },
  cropButton: {
    flexShrink: 0,
    marginLeft: 16,
  },
  controls: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
    },
  },
  sliderContainer: {
    display: "flex",
    flex: "1",
    alignItems: "center",
  },
  sliderLabel: {
    [theme.breakpoints.down("xs")]: {
      minWidth: 65,
    },
  },
  slider: {
    padding: "22px 0px",
    marginLeft: 32,
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
      margin: "0 16px",
    },
  },
});

const label = { inputProps: { "aria-label": "Switch demo" } };

export default function ReactEasyCropperForFarmstack(props) {
  //default value of rectangular crop is on/enabled
  const [isRectangularCropModeOn, setIsRectangularCropModeOn] = useState(true);
  const [isCustomModeOn, setIsCustomModeOn] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [customRatio, setCustomRatio] = useState({
    width: 1,
    height: 1,
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
  }, []);

  const handleChangeCustomRatio = (e) => {
    if (e.target.value >= 1) {
      setCustomRatio({ ...customRatio, [e.target.name]: e.target.value });
    }
  };
  const handleCropTypeChange = (status, type) => {
    if (type == "custom") {
      setIsCustomModeOn(status);
      // setIsRectangularCropModeOn(false);
    } else {
      setIsRectangularCropModeOn(status);
      setIsCustomModeOn(false);
    }
  };

  //   const handleCropComplete = () => {
  //     const canvas = canvasRef.current;
  //     const blob = new Promise((resolve) => {
  //       canvas.toBlob((blob) => {
  //         resolve(blob);
  //       });
  //     });

  //     // Handle the cropped file blob (e.g., send it to the server)
  //     blob.then((croppedFile) => {
  //       console.log("Cropped file:", croppedFile);
  //       // Perform further processing or send the file to the server
  //     });
  //   };
  return (
    <>
      <Cropper
        image={props.file}
        crop={crop}
        zoom={zoom}
        aspect={
          isCustomModeOn
            ? customRatio.width && customRatio.height
              ? customRatio.width / customRatio.height
              : 1
            : isRectangularCropModeOn
            ? 3.17
            : 1
        }
        onCropChange={setCrop}
        onCropComplete={props.handleCropComplete}
        onZoomChange={setZoom}
      />
      <div
        className={styles.sliderContainer}
        style={{
          borderRadius: "10px",
          backgroundColor: "white",
          zIndex: 10,
          position: "absolute",
          width: "386px",
          bottom: "10px",
          right: "10px",
          padding: "25px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="crop-type"
          style={{
            display: "flex",
            margin: "auto",
            justifyContent: "space-evenly",
            width: "100%",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "2px",
              border: "1px solid #00A94F",
              borderRadius: "2px",
            }}
          >
            <div
              onClick={() => handleCropTypeChange(true)}
              style={{
                height: "30px",
                width: "70px",
                border: "1px dashed #00A94F",
                borderRadius: "2px",
                background:
                  isRectangularCropModeOn && !isCustomModeOn
                    ? "#00A94F"
                    : "white",
                cursor: "pointer",
              }}
            ></div>
          </div>
          <div
            style={{
              padding: "2px",
              border: "1px solid #00A94F",
              borderRadius: "2px",
            }}
          >
            <div
              onClick={() => handleCropTypeChange(false)}
              style={{
                cursor: "pointer",
                height: "30px",
                width: "30px",
                border: "1px dashed #00A94F",
                borderRadius: "2px",
                background:
                  !isRectangularCropModeOn && !isCustomModeOn
                    ? "#00A94F"
                    : "white",
              }}
            ></div>
          </div>
          <div
            style={{
              padding: "2px",
              border: "1px solid #00A94F",
              borderRadius: "2px",
            }}
          >
            <div
              onClick={() => handleCropTypeChange(true, "custom")}
              style={{
                height: "30px",
                width: "120px",
                // border: "0.5px dashed #00A94F",
                borderRadius: "2px",
                background: isCustomModeOn ? "white" : "white",
              }}
            >
              {isCustomModeOn ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    background: isCustomModeOn ? "white" : "white",
                  }}
                >
                  <div>
                    {" "}
                    <input
                      onChange={handleChangeCustomRatio}
                      name="width"
                      style={{
                        display: "block",
                        width: "50px",
                      }}
                      type="number"
                      min={1}
                      step={0.01}
                      onKeyPress={(e) => {
                        if (e.key <= "0") e.preventDefault();
                      }}
                    />{" "}
                  </div>
                  <div>X</div>
                  <div>
                    {" "}
                    <input
                      onChange={handleChangeCustomRatio}
                      name="height"
                      style={{
                        display: "block",
                        width: "50px",
                      }}
                      type="number"
                      min={1}
                      step={0.01}
                      onKeyPress={(e) => {
                        if (e.key <= "0") e.preventDefault();
                      }}
                    />{" "}
                  </div>
                </div>
              ) : (
                "Custom"
              )}
            </div>
          </div>
          <Tooltip title="We recommend maintaining an aspect ratio of 3.17 or 1 for uploaded image">
            <InfoIcon />
          </Tooltip>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Typography variant="overline">Aspect : </Typography>
          <Typography variant="overline">
            Width :{" "}
            {isCustomModeOn
              ? customRatio.width
              : isRectangularCropModeOn
              ? 3.17
              : 1}
          </Typography>
          /
          <Typography variant="overline">
            Height :
            {isCustomModeOn
              ? customRatio.height
              : isRectangularCropModeOn
              ? 1
              : 1}
          </Typography>
        </div>
        <Typography variant="overline">Zoom</Typography>
        <Slider
          value={zoom}
          min={-1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          //   classes={{ root: styles.slider }}
          onChange={(e, zoom) => setZoom(zoom)}
        />

        <Button
          onClick={props.showCroppedImage}
          variant="contained"
          color="primary"
          className={global_style.primary_button}
          id={"crop-image-preview-done-btn"}
        >
          Done
        </Button>
      </div>
    </>
  );
}
