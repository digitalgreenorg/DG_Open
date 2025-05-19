import React from "react";
import ViewParticipants from "../../Views/Participants/ViewParticipants";

const ViewCoSteward = ()=>{
    
    return(<>
    <ViewParticipants coSteward={true} title="Co-Steward"/>
    </>)
}

export default ViewCoSteward;