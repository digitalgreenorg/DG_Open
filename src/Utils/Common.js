import LocalStorageConstants from "../Constants/LocalStorageConstants";
import RegexConstants from "../Constants/RegexConstants";
import HTTP_CONSTANTS from "../Constants/HTTPConstants";
import FileSaver from "file-saver";
import HTTPService from "../Services/HTTPService";
import UrlConstant from "../Constants/UrlConstants";

const converter = require("json-2-csv");

export const setTokenLocal = (token) => {
  localStorage.setItem(
    LocalStorageConstants.KEYS.JWTToken,
    JSON.stringify(token)
  );
};
export const setRefreshTokenLocal = (token) => {
  localStorage.setItem(
    LocalStorageConstants.KEYS.refresh_token,
    JSON.stringify(token)
  );
};
export const getTokenLocal = () => {
  const tokenString = localStorage.getItem(LocalStorageConstants.KEYS.JWTToken);
  const userToken = JSON.parse(tokenString);
  return userToken;
};
export const getRefreshTokenLocal = () => {
  const tokenString = localStorage.getItem(
    LocalStorageConstants.KEYS.refresh_token
  );
  const userToken = JSON.parse(tokenString);
  return userToken;
};
// user id
export const setUserId = (token) => {
  localStorage.setItem(LocalStorageConstants.KEYS.user, JSON.stringify(token));
};
export const getUserLocal = () => {
  const tokenString = localStorage.getItem(LocalStorageConstants.KEYS.user);
  const userToken = JSON.parse(tokenString);
  return userToken;
};

// user map
export const setUserMapId = (token) => {
  localStorage.setItem(
    LocalStorageConstants.KEYS.user_map,
    JSON.stringify(token)
  );
};
export const getUserMapId = () => {
  const tokenString = localStorage.getItem(LocalStorageConstants.KEYS.user_map);
  const userToken = JSON.parse(tokenString);
  return userToken;
};

// org id
export const setOrgId = (token) => {
  localStorage.setItem(
    LocalStorageConstants.KEYS.org_id,
    JSON.stringify(token)
  );
};
export const getOrgLocal = () => {
  const tokenString = localStorage.getItem(LocalStorageConstants.KEYS.org_id);
  const userToken = JSON.parse(tokenString);
  return userToken;
};

/*
  Generic Method to check regex match between a string and a regex pattern 
  */
export const validateInputField = (newFieldValue, regex) => {
  if (newFieldValue.match(regex)) {
    return true;
  }
  return false;
};

/*
  Generic Method used to disallow leading spaces and consecutive spaces
  in an input field.
  Returns true after preveting input if user attempted invalid space input.
  */
export const handleUnwantedSpace = (fieldValue, e) => {
  if ((fieldValue == "" || fieldValue.endsWith(" ")) && e.keyCode === 32) {
    e.preventDefault();
    return true;
  }
};
/*
  Generic Method used to disallow invalid characters in address fields.
  Used as handler method for onKeyDown attribute in TextField
  */
export const handleAddressCharacters = (fieldValue, e) => {
  if (!handleUnwantedSpace(fieldValue, e)) {
    if (e.key.match(RegexConstants.INVALID_ADDRESS_CHARACTERS)) {
      e.preventDefault();
    }
  }
};

/*
  Generic Method used to disallow invalid characters in Name fields.
  Used as handler method for onKeyDown attribute in TextField
  */
export const handleNameFieldEntry = (fieldValue, e) => {
  if (!handleUnwantedSpace(fieldValue, e)) {
    if (!e.key.match(RegexConstants.APLHABET_REGEX)) {
      e.preventDefault();
    }
  }
};

export const refreshToken = async () => {
  try {
    const url = UrlConstant.base_url + UrlConstant.refesh;

    const refreshToken = JSON.parse(localStorage.getItem("refresh"));
    if (!refreshToken) {
      let error = {
        toast: false,
        path: "/error/401",
        status: 401,
        message: "Refresh token is not valid",
      };
      return error;
    }
    localStorage.setItem("lastPathname", window.location.pathname);
    const response = await HTTPService("POST", url, {
      refresh: refreshToken,
    });

    if (response?.status === 200) {
      localStorage.setItem("JWTToken", JSON.stringify(response?.data?.access));
      const lastPathname = localStorage.getItem("lastPathname");
      if (lastPathname) {
        let error = {
          toast: true,
          path: lastPathname,
          status: 200,
          message: "New access token has been set successfully.",
        };
        return error;
      }
    }
  } catch (e) {
    let error = {
      toast: false,
      path: "/error/401",
      status: 401,
      message: "Refresh token is not valid",
    };
    return error;
  }
};

export const GetErrorHandlingRoute = async (e) => {
  // var errorMessage = "";
  console.log(e?.response?.data, e.response?.status, "error");
  if (e?.response?.data && e?.response?.status == 401) {
    let resultOfRefresh = await refreshToken();
    if (resultOfRefresh.status != 401) {
      window.location.reload();
    }
    return resultOfRefresh;
  } else if (
    (e?.response?.data && e?.response?.status == 403) ||
    (e?.response?.data && e?.response?.status >= 500)
  ) {
    return {
      toast: false,
      path: "/error/" + e.response.status,
      status: e.response.status,
      message: e?.response?.data?.message,
      data: e?.response?.data,
    };
  } else if (
    e?.response?.data &&
    (e?.response?.status == 404 ||
      e?.response?.status == 405 ||
      e?.response?.status == 400)
  ) {
    return {
      toast: true,
      path: "/error/" + e?.response?.status,
      status: e.response.status,
      message: e?.response?.data?.message,
      data: e?.response?.data,
    };
  } else {
    return {
      toast: false,
      path: "/error/" + 500,
      status: "error",
      message: "Something went wrong!",
      data: e?.response?.data,
    };
  }

  // if (e?.response && e?.response?.data && e?.response?.data?.message) {
  //   errorMessage = e.response.data.message;
  // } else if (e.response && e.response.data) {
  //   try {
  //     JSON.parse(e.response.data);
  //     errorMessage = String(e.response.data);
  //   } catch (e) {
  //     if (e.response) {
  //       errorMessage = e.response.statusText;
  //     } else {
  //       errorMessage = "Unknown";
  //     }
  //   }
  // } else if (e.response) {
  //   errorMessage = e.response.statusText;
  // } else {
  //   errorMessage = "unknown";
  // }
  // console.log(errorMessage, "errorMessage159");
  // setErrorLocal({
  //   ErrorCode: e.response ? e.response.status : "",
  //   ErrorMessage: errorMessage,
  // });
  // if (
  //   e.response != null &&
  //   e.response != undefined &&
  //   e?.response?.status == HTTP_CONSTANTS.SESSION_TIMEOUT
  // ) {
  //   let response = refreshToken();
  //   if (response) {
  //     return {
  //       message: "verified",
  //       statusCode: 200,
  //     };
  //   } else {
  //     return {
  //       message: "not_verified",
  //       statusCode: 401,
  //     };
  //   }
  // } else {
  //   return {
  //     message: errorMessage,
  //     statusCode: e.response ? e.response.status : "",
  //   };
  // }
};

export const setRoleLocal = (role) => {
  localStorage.setItem(LocalStorageConstants.KEYS.role, JSON.stringify(role));
};
export const getRoleLocal = () => {
  const roleString = localStorage.getItem(LocalStorageConstants.KEYS.role);
  const userRole = JSON.parse(roleString);
  return userRole;
};

export const setErrorLocal = (error) => {
  localStorage.setItem(LocalStorageConstants.KEYS.error, JSON.stringify(error));
};
export const getErrorLocal = () => {
  return JSON.parse(localStorage.getItem(LocalStorageConstants.KEYS.error));
};

export const isLoggedInUserAdmin = () => {
  return getRoleLocal()
    ? getRoleLocal().toLowerCase() ==
        LocalStorageConstants.ROLES.DATAHUB_ADMIN.toLowerCase()
    : false;
};

export const isLoggedInUserParticipant = () => {
  //return true;
  return getRoleLocal()
    ? getRoleLocal().toLowerCase() ==
        LocalStorageConstants.ROLES.DATAHUB_PARTICIPANT_ROOT.toLowerCase()
    : false;
};
export const isLoggedInUserCoSteward = () => {
  //return true;
  return getRoleLocal()
    ? getRoleLocal().toLowerCase() ==
        LocalStorageConstants.ROLES.DATAHUB_CO_STEWARD.toLowerCase()
    : false;
};

// file upload
export const fileUpload = (bodyFormData, file, Key) => {
  if (file != null && typeof file != "string") {
    return bodyFormData.append(Key, file);
  }
};

export const dateTimeFormat = (datetime, istime) => {
  const today = new Date(datetime);
  var y = today.getFullYear();
  var m = (today.getMonth() + 1).toString().padStart(2, "0");
  var d = today.getDate().toString().padStart(2, "0");
  var h = today.getHours();
  var mi = (today.getMinutes() < 10 ? "0" : "") + today.getMinutes();
  // var s = today.getSeconds();
  if (istime) {
    let format = d + "/" + m + "/" + y + " | " + h + ":" + mi;
    return format;
  } else {
    let format = d + "/" + m + "/" + y;
    return format;
  }
};

export const flushLocalstorage = () => {
  Object.keys(LocalStorageConstants.KEYS).map((key, i) => {
    console.log(key);
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  });
};

export const downloadAttachment = (uri, name) => {
  console.log("click on download", uri, name);
  FileSaver.saveAs(uri, name);
};

export const downloadDocument = (row, name) => {
  converter.json2csv(row, async (err, csv) => {
    if (err) {
      throw err;
    }
    // print CSV string
    console.log(csv);
    download(csv, name);
  });
};

export const download = (data, name, type) => {
  console.log(data, type);
  const blob = new Blob([data], { type: type ? type : "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", name);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const createFile = (data, name, type) => {
  const jsonString = JSON.stringify(data);
  const blob = new Blob([jsonString], { type: type });
  const jsonFile = new File([blob], name, {
    type: type,
  });
  return jsonFile;
};

export const GetErrorKey = (e, keyList) => {
  var errorKeys = [];
  var errorMessages = [];
  for (var key of keyList) {
    if (
      e.response &&
      e.response.status === 400 &&
      e.response.data &&
      e.response.data[key]
    ) {
      errorKeys.push(key);
      errorMessages.push(e.response.data[key][0]);
    }
  }
  return [errorKeys, errorMessages];
};

export const getDockerHubURL = (dockerImageName) => {
  const [dockerImage, tag] = dockerImageName.split(":");
  return `https://hub.docker.com/r/${dockerImage}/${tag}`;
};
export const openLinkInNewTab = (url) => {
  console.log(url);
  if (url.includes("http")) {
    localStorage.setItem("show_data", JSON.stringify(url));
    window.open(url, "_blank");

    // window.open(UrlConstant.base_url_without_slash+ "/datahub/connectors/detail",'_blank');
    // history.push("connectors/detail")
  } else {
    localStorage.setItem("show_data", JSON.stringify("http://" + url));
    window.open(url, "_blank");
    // window.open(UrlConstant.base_url_without_slash+ "/datahub/connectors/detail",'_blank');
    // window.open("http://localhost:3000/datahub/connectors/detail",'_blank');
    // window.open("http://"+url,'_blank');
    // history.push("connectors/detail")
  }
};

export const mobileNumberMinimunLengthCheck = (number) => {
  return number?.length >= 9;
};

export const stringMinimumLengthCheck = (str, len) => {
  return str?.length >= len;
};

export function toTitleCase(str) {
  return str ? str[0].toUpperCase() + str.substr(1).toLowerCase() : "";
}

export const isParticipantRoute = (url) => {
  console.log(url);
  return url.toLowerCase().includes("/participant/");
};

export const isRoleName = (url) => {
  console.log(url);
  if (url.toLowerCase().includes("/participant/")) {
    return "/participant/";
  }
  if (url.toLowerCase().includes("/datahub/")) {
    return "/datahub/";
  }
};
export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}
export const adminNotFoundRoute = (e) => {
  var errorMessage = "";
  if (e.response && e.response.data && e.response.data.message) {
    errorMessage = e.response.data.message;
  } else if (e.response) {
    errorMessage = e.response.statusText;
  } else {
    errorMessage = "Admin not found";
  }
  setErrorLocal({
    ErrorCode: e.response ? e.response.status : "Admin not found",
    ErrorMessage: errorMessage,
  });
  if (
    e.response != null &&
    e.response != undefined &&
    e.response.status == HTTP_CONSTANTS.SESSION_TIMEOUT
  ) {
    console.log(e.response.status);
    return "/sessionexpired";
  } else {
    return "/error";
  }
};

//function to scroll on top
export function goToTop(no) {
  document.body.scrollTop = no ? no : 0; // For Safari
  document.documentElement.scrollTop = no ? no : 0; // For Chrome, Firefox, IE and Opera
}

export function findType() {
  if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
    return "datahub";
  } else if (isLoggedInUserParticipant()) {
    return "participant";
  }
}

export function checkProjectFor(name) {
  console.log(
    Window?.ENV_VARS?.REACT_APP_PROJECT_FOR,
    process.env.REACT_APP_PROJECT_FOR,
    name
  );
  if (
    (Window?.ENV_VARS?.REACT_APP_PROJECT_FOR ||
      process.env.REACT_APP_PROJECT_FOR) === name
  ) {
    return true;
  }
  return false;
}

export function isArray(variable) {
  return Array.isArray(variable);
}

export function isHttpOrHttpsLink(str) {
  // Regular expression to match HTTP and HTTPS links
  var httpHttpsPattern = /^(https?|HTTP|HTTPS):\/\/.+/i;

  return httpHttpsPattern.test(str);
}

export const setUserEmail = (email) => {
  localStorage.setItem(LocalStorageConstants.KEYS.email, JSON.stringify(email));
};

export const getUserEmail = () => {
  const userEmail = localStorage.getItem(LocalStorageConstants.KEYS.email);
  const email = JSON.parse(userEmail);
  return email;
};
