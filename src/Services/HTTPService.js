import axios from "axios";
import { getTokenLocal } from "../Utils/Common";
const HTTPService = async (
  method,
  url,
  data,
  isFormData,
  isAuthorization,
  jwttoken,
  withCredentials
) => {
  if (method == "GET") {
    return await axios({
      method,
      url,
      params: data,
      headers: authHeader(isFormData, isAuthorization, jwttoken),
    });
  } else {
    return await axios({
      method,
      url,
      data,
      headers: authHeader(isFormData, isAuthorization, jwttoken),
    });
  }
};
const authHeader = (isFormData, isAuthorization, jwttoken) => {
  let token = jwttoken;
  if (!token) {
    token = getTokenLocal();
  }
  if (isAuthorization) {
    if (isFormData) {
      return {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      };
    } else {
      return {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };
    }
  } else {
    if (isFormData) {
      return {
        "Content-Type": "application/json",
        "content-type": "multipart/form-data",
      };
    } else {
      return { Accept: "application/json", "Content-Type": "application/json" };
    }
  }
};
export default HTTPService;
