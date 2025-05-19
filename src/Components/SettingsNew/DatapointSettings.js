import React from "react";
import StandardizationInOnbord from "../Standardization/StandardizationInOnbording";

const DatapointSettings = (props) => {
    const { setActiveStep } = props;
  
    return (
      <>
        <StandardizationInOnbord inSettings={true} />
      </>
    );
  };
  
  export default DatapointSettings;
  