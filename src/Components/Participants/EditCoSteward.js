import React from "react";
import EditParticipants from "../../Views/Participants/EditParticipants";

const EditCoSteward = () => {
  return (
    <>
      <EditParticipants coSteward={true} title="Co-Steward" />
    </>
  );
};

export default EditCoSteward;
