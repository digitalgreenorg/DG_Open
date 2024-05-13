const RegexConstants = {
  APLHABET_REGEX: /[A-Za-z]/,
  TEXT_REGEX: /^[A-Za-z]*$/,
  NUMBER_REGEX: /^[0-9]*$/,
  // DIGIT_REGEX : /[0-9]/,
  ORG_NAME_REGEX: /^$|^[A-za-z0-9](([^\s])+(\s)?)*$/,
  INVALID_ADDRESS_CHARACTERS: /[!@$%^*(){}\[\]:;"'?]/,
  PINCODE_REGEX: /^[0-9]{0,10}$/,
  WEBSITE_URL_REGEX:
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-zA-Z0-9]+\.[a-zA-Z]+(\/[a-zA-Z0-9#]+\/?)*$/,
  NEW_WEBSITE_REGEX: "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?", 
  NEW_C_WEBSITE_REGEX: "^(HTTP[S]?:\\/\\/(WWW\\.)?|FTP:\\/\\/(WWW\\.)?|WWW\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?",
  NO_SPACE_REGEX: /^([^\s])*$/,
  //   DATE_SET_REGEX: /^$|^[A-za-z][0-9]?(([^\s])+(\s)?)*$/,
  // DATA_SET_REGEX: /^$|^[a-zA-Z][A-Za-z0-9_&@-]?(([^\s])+(\s)?)*$/,
  DATA_SET_REGEX: /^$|^[a-zA-Z0-9.][a-zA-Z0-9. ]*$/,
  connector_name: /^$|^[a-zA-Z0-9][a-zA-Z0-9 ]*$/,
  CROP_SET_REGEX: /^$|^[a-zA-Z][ A-Za-z0-9_-]*$/,
  // GEO_SET_REGEX: /^$|^[a-zA-Z\s]?(([^\s])+(\s)?)*$/,
  GEO_SET_REGEX: /^$|^[a-zA-Z0-9][a-zA-Z0-9 ]*$/,
  // DES_SET_REGEX: /^$|^[a-zA-Z][A-Za-z0-9]?(([^\s])+(\s)?)*$/
  DES_SET_REGEX: /^$|^[a-zA-Z0-9.][a-zA-Z0-9. ]*$/,
  city_name: /^$|^[a-zA-Z][a-zA-Z ]*$/,
  address: /^$|^[a-zA-Z0-9#,][a-zA-Z0-9#, ]*$/,
  NEW_NAME_REGEX: /^([a-zA-Z0-9]+\s?)*$/,   //allows only one space and no spl characters allowed
  DATAPOINT_ATTRIBUTE_REGEX:  /^$|^[a-zA-Z0-9][a-zA-Z0-9_ ]*$/,//   accepts only 1 spl charecter "_" and no spl characters and no space
  PINCODE_REGEX_NEWUI: /^[0-9]{0,10}$/, //accepts only numbers for new UI fs_2.0
};

export default RegexConstants;
