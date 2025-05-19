import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import UploadBanner from "./UploadBanner";
import "./BrandingRightside";
import { SketchPicker } from "react-color";
import Button from "@mui/material/Button";

import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
import HandleSessionTimeout, {
  setTokenLocal,
  getTokenLocal,
} from "../../Utils/Common";
import Loader from "../Loader/Loader";
import { GetErrorHandlingRoute } from "../../Utils/Common";
import Footer from "../Footer/Footer";

export default function BrandingRightside(props) {
  const [file, setFile] = useState(null);
  const [color, setColor] = useState({ r: 200, g: 150, b: 35, a: 1 });
  const [hexColor, sethexColor] = useState("");
  const [Brandingnextbutton, setBrandingnextbutton] = useState(true);
  const [isLoader, setIsLoader] = useState(false);

  const history = useHistory();
  const fileTypes = ["JPEG", "PNG", "jpg"];
  const handleBannerFileChange = (file) => {
    setFile(file);
    console.log(file);
    if (file != null && file.length && file[0].size > 2097152) {
      setBrandingnextbutton(false);
    }
  };
  const handleColorChange = (color) => {
    setColor(color.rgb);
    var hexColor = color.hex;
    console.log(hexColor);
    sethexColor(hexColor);
  };
  const handleBrandingSubmit = async (e) => {
    e.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.append("button_color", hexColor);
    bodyFormData.append("banner", file);
    bodyFormData.append("email", props.validemail);

    console.log("branding data", bodyFormData);
    let url = UrlConstant.base_url + UrlConstant.branding;

    setIsLoader(true);
    await HTTPService(
      "POST",
      url,
      bodyFormData,
      true,
      true,
      props.isaccesstoken
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response");
        console.log("branding details", response.data);
        //   console.log(response.json());
        console.log(response.status);
        setTokenLocal(props.isaccesstoken);
        props.setOnBoardedTrue();
        history.push("/datahub/participants");
      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);
        history.push(GetErrorHandlingRoute(e));
        //   setError(true);
      });
  };
  const HandleFinishLater = async (e) => {
    props.setOnBoardedTrue();
    setTokenLocal(props.isaccesstoken);
    history.push("/datahub/participants");
    /*
    e.preventDefault()
    var bodyFormData = new FormData()
    // bodyFormData.append("button_color", hexColor);
    // bodyFormData.append("banner", file);
    bodyFormData.append('email', props.validemail)

    console.log('branding data', bodyFormData)
    let url = UrlConstant.base_url + UrlConstant.branding
    setIsLoader(true);
    await HTTPService('POST', url, bodyFormData, true, true, props.isaccesstoken)
      .then((response) => {
        setIsLoader(false);
        console.log('response')
        console.log('branding details', response.data)
        //   console.log(response.json());
        console.log(response.status)
        setTokenLocal(props.isaccesstoken)
        history.push('/datahub/participants')
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      })
      */
  };
  return (
    <div className="branding">
      {isLoader ? <Loader /> : ""}
      <p className="brandingtitle">Create your Branding</p>
      <div>
        <form noValidate autoComplete="off" onSubmit={handleBrandingSubmit}>
          <div className="brandinglogo">
            <FileUploader
              handleChange={handleBannerFileChange}
              name="file"
              types={fileTypes}
              children={
                <UploadBanner
                  uploaddes="Size should be '1300 pixels X 220 pixels' 2MB only"
                  uploadtitle="Upload your banner image here"
                />
              }
              //   maxSize={2}
            />
            <p className="brandinglogoname">
              {file
                ? file.size
                  ? `File name: ${file.name}`
                  : ""
                : "No file uploaded yet"}
            </p>
            <p className="oversizemb-brandionglogo">
              {file != null && file.size > 2097152
                ? "File uploaded is more than 2MB!"
                : ""}
            </p>
          </div>
          <p className="colortitle">Button Color</p>
          <div className="colorpicker">
            <SketchPicker
              onChange={handleColorChange}
              color={color}
              width="400"
            />
          </div>
          <div>
            {/* <Button variant="contained" className="brandbtn" type="submit">
          <span className="signupbtnname">Next</span>
        </Button> */}
            {Brandingnextbutton ? (
              <Button variant="contained" className="brandbtn" type="submit">
                <span className="signupbtnname">Next</span>
              </Button>
            ) : (
              <Button variant="outlined" disabled className="disablebrandbtn">
                Next
              </Button>
            )}
            {/* <Button variant="outlined" disabled className="disablebrandbtn">
          Next
        </Button> */}
          </div>
          <div>
            <Button
              variant="outlined"
              className="finishlaterbrandbtn"
              type="button"
              // onClick={() => {
              //   history.push("/datahub/participants");
              // }}
              onClick={HandleFinishLater}>
              Finish Later
            </Button>
          </div>
        </form>
      </div>
      <div className="footerimg3">
        <svg
          width={150}
          height={127}
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g opacity={0.1} fill="#E7B100">
            <circle cx={5.814} cy={5.728} r={5.728} />
            <circle cx={40.181} cy={5.728} r={5.728} />
            <circle cx={74.547} cy={5.728} r={5.728} />
            <circle cx={108.914} cy={5.728} r={5.728} />
            <circle cx={143.28} cy={5.728} r={5.728} />
            <circle cx={5.814} cy={28.631} r={5.728} />
            <circle cx={40.181} cy={28.631} r={5.728} />
            <circle cx={74.547} cy={28.631} r={5.728} />
            <circle cx={108.914} cy={28.631} r={5.728} />
            <circle cx={143.28} cy={28.631} r={5.728} />
            <circle cx={5.814} cy={51.549} r={5.728} />
            <circle cx={40.181} cy={51.549} r={5.728} />
            <circle cx={74.547} cy={51.549} r={5.728} />
            <circle cx={108.914} cy={51.549} r={5.728} />
            <circle cx={143.28} cy={51.549} r={5.728} />
            <circle cx={5.814} cy={74.461} r={5.728} />
            <circle cx={40.181} cy={74.461} r={5.728} />
            <circle cx={74.547} cy={74.461} r={5.728} />
            <circle cx={108.914} cy={74.461} r={5.728} />
            <circle cx={143.28} cy={74.461} r={5.728} />
            <circle cx={5.814} cy={97.365} r={5.728} />
            <circle cx={40.181} cy={97.365} r={5.728} />
            <circle cx={74.547} cy={97.365} r={5.728} />
            <circle cx={108.914} cy={97.365} r={5.728} />
            <circle cx={143.28} cy={97.365} r={5.728} />
            <circle cx={5.814} cy={120.282} r={5.728} />
            <circle cx={40.181} cy={120.282} r={5.728} />
            <circle cx={74.547} cy={120.282} r={5.728} />
            <circle cx={108.914} cy={120.282} r={5.728} />
            <circle cx={143.28} cy={120.282} r={5.728} />
          </g>
        </svg>
      </div>
      <div style={{ position: "absolute", top: "1200px" }}>
        <Footer />
      </div>
    </div>
  );
}
