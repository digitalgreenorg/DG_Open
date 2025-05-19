import React from "react";
import { server } from "../../mocks/server";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { rest } from "msw";
import {
  isLoggedInUserParticipant,
  setRoleLocal,
  setUserId,
  setUserMapId,
} from "../../Utils/Common";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import OrganizationDetails from "../../Components/NewOnboarding/OrganizationDetails";
import { BrowserRouter as Router } from "react-router-dom";
import UrlConstant from "../../Constants/UrlConstants";
import { act } from "react-dom/test-utils";

global.URL.createObjectURL = jest.fn(() => "mocked-object-url");
global.URL.revokeObjectURL = jest.fn();

describe("Positive scenerio for organisation details in setting and onboarding", () => {
  afterEach(() => {
    cleanup();
  });
  beforeEach(() => {
    // cleanup();
  });
  test("Component rendered successfully", () => {
    render(
      <Router>
        <OrganizationDetails />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });

  test("Checking for all the labels present in organisation detail component during onboarding", () => {
    render(
      <Router>
        <OrganizationDetails />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    // {props.isOrgSetting
    //   ? "Organisation settings"
    //   : " Organisation Details"}
    // {props.isOrgSetting
    //   ? "Manage and update your organization's details to reflect accurate and up-to-date information."
    //   : ""}
    // {props.isOrgSetting ? (
    //   ""
    // ) : (
    //   <div className={styles.sub_label}>
    //     Enter your organisation details, we will show to others!
    //   </div>
    // )}
    expect(screen.getByText("Organisation Details")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your organisation details, we will show to others!"
      )
    ).toBeInTheDocument();
  });

  test("Checking for all the input and get call", async () => {
    setRoleLocal("datahub_admin");
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails setActiveStep={setActiveStep} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const organisationNameElement = await screen.findByRole("textbox", {
      name: /organisation name/i,
    });
    expect(organisationNameElement.value).toBe("Digital green");

    const organisationEmailElement = await screen.findByRole("textbox", {
      name: /organisation mail id/i,
    });
    expect(organisationEmailElement.value).toBe("dg@digitalgreen.com");

    const organisationWebSiteLinkElement = await screen.findByRole("textbox", {
      name: /website link/i,
    });
    expect(organisationWebSiteLinkElement.value).toBe(
      "https://www.digitalgreen.org"
    );
    const organisationMobileNumberElement = await screen.findByRole("textbox", {
      name: /organisation contact number/i,
    });
    expect(organisationMobileNumberElement.value).toBe("+91 97380-19097");
    const organisationOrgAddressElement = await screen.findByRole("textbox", {
      name: /organisation address/i,
    });
    expect(organisationOrgAddressElement.value).toBe(
      "4th block, Koramangala, New Hp Petrol pump, Bangalore"
    );

    const countryElement = await screen.findByRole("button", {
      name: /Argentina/i,
    });
    expect(countryElement).toBeInTheDocument();

    const pinCodeElement = await screen.findByRole("textbox", {
      name: /pin code/i,
    });
    expect(pinCodeElement.value).toBe("12345678654321");
    const organisationDescriptionElement = await screen.findByLabelText(
      /organisation description/i
    );
    expect(organisationDescriptionElement).toBeInTheDocument();
    expect(organisationDescriptionElement.value).toBe(
      "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices."
    );
    const submitButtonElement = await screen.findByRole("button", {
      name: /next/i,
    });
    expect(submitButtonElement).toBeInTheDocument();

    screen.debug();
    // expect(countryElement.value).toBe("Argentina");
  });

  test("Submitting the form", async () => {
    setRoleLocal("datahub_admin");
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails setActiveStep={setActiveStep} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const organisationNameElement = await screen.findByRole("textbox", {
      name: /organisation name/i,
    });
    expect(organisationNameElement.value).toBe("Digital green");

    const organisationEmailElement = await screen.findByRole("textbox", {
      name: /organisation mail id/i,
    });
    expect(organisationEmailElement.value).toBe("dg@digitalgreen.com");

    const organisationWebSiteLinkElement = await screen.findByRole("textbox", {
      name: /website link/i,
    });
    expect(organisationWebSiteLinkElement.value).toBe(
      "https://www.digitalgreen.org"
    );
    const organisationMobileNumberElement = await screen.findByRole("textbox", {
      name: /organisation contact number/i,
    });
    expect(organisationMobileNumberElement.value).toBe("+91 97380-19097");
    const organisationOrgAddressElement = await screen.findByRole("textbox", {
      name: /organisation address/i,
    });
    expect(organisationOrgAddressElement.value).toBe(
      "4th block, Koramangala, New Hp Petrol pump, Bangalore"
    );

    const countryElement = await screen.findByRole("button", {
      name: /Argentina/i,
    });
    expect(countryElement).toBeInTheDocument();

    const pinCodeElement = await screen.findByRole("textbox", {
      name: /pin code/i,
    });
    expect(pinCodeElement.value).toBe("12345678654321");
    const organisationDescriptionElement = await screen.findByLabelText(
      /organisation description/i
    );
    expect(organisationDescriptionElement).toBeInTheDocument();
    expect(organisationDescriptionElement.value).toBe(
      "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices."
    );
    const submitButtonElement = await screen.findByRole("button", {
      name: /next/i,
    });
    expect(submitButtonElement).toBeInTheDocument();
    fireEvent.click(submitButtonElement);
    // expect(countryElement.value).toBe("Argentina");
  });
  test("finding cancel button and click on it", async () => {
    setRoleLocal("datahub_admin");
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails
          isOrgSetting={true}
          setActiveStep={setActiveStep}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const submitButtonElement = await screen.findByRole("button", {
      name: /cancel/i,
    });

    expect(submitButtonElement).toBeInTheDocument();
    fireEvent.click(submitButtonElement);
    screen.debug();
    // expect(countryElement.value).toBe("Argentina");
  });
  test("finding cancel button and click on it", async () => {
    setRoleLocal("datahub_participant_root");
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails
          isOrgSetting={true}
          setActiveStep={setActiveStep}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const submitButtonElement = await screen.findByRole("button", {
      name: /cancel/i,
    });

    expect(submitButtonElement).toBeInTheDocument();
    fireEvent.click(submitButtonElement);
    screen.debug();
    // expect(countryElement.value).toBe("Argentina");
  });
  test("Changing the form data and submitting it", async () => {
    setRoleLocal("datahub_admin");
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails setActiveStep={setActiveStep} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const organisationNameElement = await screen.findByRole("textbox", {
      name: /organisation name/i,
    });
    fireEvent.change(organisationNameElement, {
      target: { value: "some org name" },
    });

    expect(organisationNameElement.value).toBe("some org name");

    const organisationEmailElement = await screen.findByRole("textbox", {
      name: /organisation mail id/i,
    });
    fireEvent.change(organisationEmailElement, {
      target: { value: "dg1@digitalgreen.com" },
    });

    expect(organisationEmailElement.value).toBe("dg1@digitalgreen.com");

    const organisationWebSiteLinkElement = await screen.findByRole("textbox", {
      name: /website link/i,
    });
    console.log(
      organisationWebSiteLinkElement,
      "organisationWebSiteLinkElement"
    );

    fireEvent.change(organisationWebSiteLinkElement, {
      target: { value: "" },
    });

    fireEvent.change(organisationWebSiteLinkElement, {
      target: { value: "https://www.digitalgreen.org" },
    });

    expect(organisationWebSiteLinkElement.value).toBe(
      "https://www.digitalgreen.org"
    );
    const organisationMobileNumberElement = await screen.findByRole("textbox", {
      name: /organisation contact number/i,
    });
    fireEvent.change(organisationMobileNumberElement, {
      target: { value: "+91 9" },
    });
    fireEvent.change(organisationMobileNumberElement, {
      target: { value: "+91 97380-19097" },
    });

    expect(organisationMobileNumberElement.value).toBe("+91 97380-19097");
    const organisationOrgAddressElement = await screen.findByRole("textbox", {
      name: /organisation address/i,
    });
    fireEvent.change(organisationOrgAddressElement, {
      target: {
        value: "",
      },
    });
    fireEvent.change(organisationOrgAddressElement, {
      target: {
        value: "4th block, Koramangala, New Hp Petrol pump, Bangalore",
      },
    });

    expect(organisationOrgAddressElement.value).toBe(
      "4th block, Koramangala, New Hp Petrol pump, Bangalore"
    );

    const countryElement = await screen.findByRole("button", {
      name: /Argentina/i,
    });
    // fireEvent.change(organisationOrgAddressElement, { target: { value:"4th block, Koramangala, New Hp Petrol pump, Bangalore" } });

    expect(countryElement).toBeInTheDocument();

    const pinCodeElement = await screen.findByRole("textbox", {
      name: /pin code/i,
    });
    fireEvent.change(pinCodeElement, { target: { value: "12345678654321" } });
    expect(pinCodeElement.value).toBe("12345678654321");

    const organisationDescriptionElement = await screen.findByLabelText(
      /organisation description/i
    );
    fireEvent.change(organisationDescriptionElement, {
      target: {
        value: "",
      },
    });
    fireEvent.change(organisationDescriptionElement, {
      target: {
        value:
          "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices.",
      },
    });

    expect(organisationDescriptionElement).toBeInTheDocument();
    expect(organisationDescriptionElement.value).toBe(
      "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices."
    );
    const submitButtonElement = await screen.findByRole("button", {
      name: /next/i,
    });

    expect(submitButtonElement).toBeInTheDocument();
    fireEvent.click(submitButtonElement);
    screen.debug();
    // expect(countryElement.value).toBe("Argentina");
  });
  test("Handling file upload", async () => {
    setRoleLocal("datahub_admin");
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails setActiveStep={setActiveStep} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    const fileInput = screen.getByLabelText(/Drop files here or click/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    screen.debug();
    const cancel = await screen.findByTestId(/CancelIcon/i);
    fireEvent.click(cancel);
  });

  test("checking phone number", async () => {
    setRoleLocal("datahub_admin");
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails setActiveStep={setActiveStep} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const organisationMobileNumberElement = await screen.findByRole("textbox", {
      name: /organisation contact number/i,
    });
    act(() => {
      fireEvent.change(organisationMobileNumberElement, {
        target: { value: "" },
      });
    });

    console.log(
      organisationMobileNumberElement,
      "organisationMobileNumberElement"
    );

    expect(organisationMobileNumberElement.value).toBe("+91 97380-19097");
  });
});

describe("first", () => {
  test("Changing the form data and submitting it as participant", async () => {
    setUserId("sometoken");
    setUserMapId("somemapid");

    console.log(isLoggedInUserParticipant());
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails setActiveStep={setActiveStep} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    console.log(isLoggedInUserParticipant(), "part");
    const organisationNameElement = await screen.findByRole("textbox", {
      name: /organisation name/i,
    });
    fireEvent.change(organisationNameElement, {
      target: { value: "some org name" },
    });

    expect(organisationNameElement.value).toBe("some org name");

    const organisationEmailElement = await screen.findByRole("textbox", {
      name: /organisation mail id/i,
    });
    fireEvent.change(organisationEmailElement, {
      target: { value: "dg1@digitalgreen.com" },
    });

    expect(organisationEmailElement.value).toBe("dg1@digitalgreen.com");

    const organisationWebSiteLinkElement = await screen.findByRole("textbox", {
      name: /website link/i,
    });

    fireEvent.change(organisationWebSiteLinkElement, {
      target: { value: "https://www.digitalgreen.org" },
    });

    expect(organisationWebSiteLinkElement.value).toBe(
      "https://www.digitalgreen.org"
    );
    const organisationMobileNumberElement = await screen.findByRole("textbox", {
      name: /organisation contact number/i,
    });
    fireEvent.change(organisationMobileNumberElement, {
      target: { value: "+91 97380-19097" },
    });

    expect(organisationMobileNumberElement.value).toBe("+91 97380-19097");
    const organisationOrgAddressElement = await screen.findByRole("textbox", {
      name: /organisation address/i,
    });
    fireEvent.change(organisationOrgAddressElement, {
      target: {
        value: "4th block, Koramangala, New Hp Petrol pump, Bangalore",
      },
    });

    expect(organisationOrgAddressElement.value).toBe(
      "4th block, Koramangala, New Hp Petrol pump, Bangalore"
    );

    const countryElement = await screen.findByRole("button", {
      name: /Argentina/i,
    });
    // fireEvent.change(organisationOrgAddressElement, { target: { value:"4th block, Koramangala, New Hp Petrol pump, Bangalore" } });

    expect(countryElement).toBeInTheDocument();

    const pinCodeElement = await screen.findByRole("textbox", {
      name: /pin code/i,
    });
    fireEvent.change(pinCodeElement, { target: { value: "12345678654321" } });
    expect(pinCodeElement.value).toBe("12345678654321");

    const organisationDescriptionElement = await screen.findByLabelText(
      /organisation description/i
    );
    fireEvent.change(organisationDescriptionElement, {
      target: {
        value:
          "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices.",
      },
    });

    expect(organisationDescriptionElement).toBeInTheDocument();
    expect(organisationDescriptionElement.value).toBe(
      "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices."
    );
    const submitButtonElement = screen.getByRole("button", {
      name: /Finish/i,
    });

    expect(submitButtonElement).toBeInTheDocument();
    fireEvent.click(submitButtonElement);
    screen.debug();
    // expect(countryElement.value).toBe("Argentina");
  });
  test("Changing the form data and submitting it as participant", async () => {
    setUserId("sometoken");
    setUserMapId("somemapid");

    console.log(isLoggedInUserParticipant());
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails setActiveStep={setActiveStep} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    console.log(isLoggedInUserParticipant(), "part");
    const organisationNameElement = await screen.findByRole("textbox", {
      name: /organisation name/i,
    });
    fireEvent.change(organisationNameElement, {
      target: { value: "some org name" },
    });

    expect(organisationNameElement.value).toBe("some org name");

    const organisationEmailElement = await screen.findByRole("textbox", {
      name: /organisation mail id/i,
    });
    fireEvent.change(organisationEmailElement, {
      target: { value: "dg1@digitalgreen.com" },
    });

    expect(organisationEmailElement.value).toBe("dg1@digitalgreen.com");

    const organisationWebSiteLinkElement = await screen.findByRole("textbox", {
      name: /website link/i,
    });

    fireEvent.change(organisationWebSiteLinkElement, {
      target: { value: "https://www.digitalgreen.org" },
    });

    expect(organisationWebSiteLinkElement.value).toBe(
      "https://www.digitalgreen.org"
    );
    const organisationMobileNumberElement = await screen.findByRole("textbox", {
      name: /organisation contact number/i,
    });
    fireEvent.change(organisationMobileNumberElement, {
      target: { value: "+91 97380-19097" },
    });

    expect(organisationMobileNumberElement.value).toBe("+91 97380-19097");
    const organisationOrgAddressElement = await screen.findByRole("textbox", {
      name: /organisation address/i,
    });
    fireEvent.change(organisationOrgAddressElement, {
      target: {
        value: "4th block, Koramangala, New Hp Petrol pump, Bangalore",
      },
    });

    expect(organisationOrgAddressElement.value).toBe(
      "4th block, Koramangala, New Hp Petrol pump, Bangalore"
    );

    const countryElement = await screen.findByRole("button", {
      name: /Argentina/i,
    });
    // fireEvent.change(organisationOrgAddressElement, { target: { value:"4th block, Koramangala, New Hp Petrol pump, Bangalore" } });

    expect(countryElement).toBeInTheDocument();

    const pinCodeElement = await screen.findByRole("textbox", {
      name: /pin code/i,
    });
    fireEvent.change(pinCodeElement, { target: { value: "12345678654321" } });
    expect(pinCodeElement.value).toBe("12345678654321");

    const organisationDescriptionElement = await screen.findByLabelText(
      /organisation description/i
    );
    fireEvent.change(organisationDescriptionElement, {
      target: {
        value:
          "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices.",
      },
    });

    expect(organisationDescriptionElement).toBeInTheDocument();
    expect(organisationDescriptionElement.value).toBe(
      "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices."
    );
    const submitButtonElement = screen.getByRole("button", {
      name: /Finish/i,
    });

    expect(submitButtonElement).toBeInTheDocument();
    fireEvent.click(submitButtonElement);
    screen.debug();
    // expect(countryElement.value).toBe("Argentina");
  });
  test("Changing the form data and submitting it as participant", async () => {
    server.use(
      rest.post(
        `${UrlConstant.base_url}${UrlConstant.onboarded}`,
        (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              error: "error",
            })
          );
        }
      )
    );

    setUserId("sometoken");
    setUserMapId("somemapid");

    console.log(isLoggedInUserParticipant());
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails setActiveStep={setActiveStep} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    console.log(isLoggedInUserParticipant(), "part");
    const organisationNameElement = await screen.findByRole("textbox", {
      name: /organisation name/i,
    });
    fireEvent.change(organisationNameElement, {
      target: { value: "some org name" },
    });

    expect(organisationNameElement.value).toBe("some org name");

    const organisationEmailElement = await screen.findByRole("textbox", {
      name: /organisation mail id/i,
    });
    fireEvent.change(organisationEmailElement, {
      target: { value: "dg1@digitalgreen.com" },
    });

    expect(organisationEmailElement.value).toBe("dg1@digitalgreen.com");

    const organisationWebSiteLinkElement = await screen.findByRole("textbox", {
      name: /website link/i,
    });

    fireEvent.change(organisationWebSiteLinkElement, {
      target: { value: "https://www.digitalgreen.org" },
    });

    expect(organisationWebSiteLinkElement.value).toBe(
      "https://www.digitalgreen.org"
    );
    const organisationMobileNumberElement = await screen.findByRole("textbox", {
      name: /organisation contact number/i,
    });
    fireEvent.change(organisationMobileNumberElement, {
      target: { value: "+91 97380-19097" },
    });

    expect(organisationMobileNumberElement.value).toBe("+91 97380-19097");
    const organisationOrgAddressElement = await screen.findByRole("textbox", {
      name: /organisation address/i,
    });
    fireEvent.change(organisationOrgAddressElement, {
      target: {
        value: "4th block, Koramangala, New Hp Petrol pump, Bangalore",
      },
    });

    expect(organisationOrgAddressElement.value).toBe(
      "4th block, Koramangala, New Hp Petrol pump, Bangalore"
    );

    const countryElement = await screen.findByRole("button", {
      name: /Argentina/i,
    });
    // fireEvent.change(organisationOrgAddressElement, { target: { value:"4th block, Koramangala, New Hp Petrol pump, Bangalore" } });

    expect(countryElement).toBeInTheDocument();

    const pinCodeElement = await screen.findByRole("textbox", {
      name: /pin code/i,
    });
    fireEvent.change(pinCodeElement, { target: { value: "12345678654321" } });
    expect(pinCodeElement.value).toBe("12345678654321");

    const organisationDescriptionElement = await screen.findByLabelText(
      /organisation description/i
    );
    fireEvent.change(organisationDescriptionElement, {
      target: {
        value:
          "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices.",
      },
    });

    expect(organisationDescriptionElement).toBeInTheDocument();
    expect(organisationDescriptionElement.value).toBe(
      "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices."
    );
    const submitButtonElement = screen.getByRole("button", {
      name: /Finish/i,
    });

    expect(submitButtonElement).toBeInTheDocument();
    fireEvent.click(submitButtonElement);
    screen.debug();
    // expect(countryElement.value).toBe("Argentina");
  });
});

describe("NEGATIVE SCENERIO for organisation details", () => {
  test("failing of get call", async () => {
    // try {
    server.use(
      rest.get(
        `${UrlConstant.base_url}${UrlConstant.org}:userId/`,
        (req, res, ctx) => {
          console.log("inside 1234 failed call");
          return res(ctx.status(400), ctx.json());
        }
      )
    );

    setRoleLocal("datahub_admin");
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails setActiveStep={setActiveStep} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("Error handling in submitting the data", async () => {
    // try {
    server.use(
      rest.put(
        `${UrlConstant.base_url}${UrlConstant.org}:userId/`,
        (req, res, ctx) => {
          console.log("inside 1234 failed call");
          return res(
            ctx.status(401),
            ctx.json({
              error: "error",
            })
          );
        }
      )
    );

    setRoleLocal("datahub_admin");
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails setActiveStep={setActiveStep} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const submitButtonElement = await screen.findByRole("button", {
      name: /next/i,
    });
    expect(submitButtonElement).toBeInTheDocument();
    fireEvent.click(submitButtonElement);
  });
  test("Error handling in submitting the data", async () => {
    // try {
    server.use(
      rest.put(
        `${UrlConstant.base_url}${UrlConstant.org}:userId/`,
        (req, res, ctx) => {
          console.log("inside 1234 failed call");
          return res(
            ctx.status(400),
            ctx.json({
              logo: ["This field may not be blank."],
              org_email: ["This field may not be blank."],
              website: ["This field may not be blank."],
              address: ["This field may not be blank."],
              phone_number: ["This field may not be blank."],
              org_description: ["This field may not be blank."],
              name: ["This field may not be blank."],
            })
          );
        }
      )
    );

    setRoleLocal("datahub_admin");
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails setActiveStep={setActiveStep} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const submitButtonElement = await screen.findByRole("button", {
      name: /next/i,
    });
    expect(submitButtonElement).toBeInTheDocument();
    fireEvent.click(submitButtonElement);
  });

  test("Error handling in submitting the data", async () => {
    // try {
    server.use(
      rest.put(
        `${UrlConstant.base_url}${UrlConstant.org}:userId/`,
        (req, res, ctx) => {
          console.log("inside 1234 failed call");
          return res(
            ctx.status(400),
            ctx.json({
              logo: ["This field may not be blank."],
              org_email: ["This field may not be blank."],
              website: ["This field may not be blank."],
              address: ["This field may not be blank."],
              phone_number: ["This field may not be blank."],
              org_description: ["This field may not be blank."],
              name: ["This field may not be blank."],
            })
          );
        }
      )
    );

    setRoleLocal("datahub_admin");
    const setActiveStep = jest.fn();
    render(
      <Router>
        <OrganizationDetails
          isOrgSetting={false}
          setActiveStep={setActiveStep}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    const fileInput = screen.getByLabelText(/Drop files here or click/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const Done = await screen.findByRole("button", {
      name: /done/i,
    });
    act(() => {
      fireEvent.click(Done);
    });
    // screen.debug();
    // const submitButtonElement = screen.getByRole("button", {
    //   name: /next/i,
    // });
    // expect(submitButtonElement).toBeInTheDocument();
    // fireEvent.click(submitButtonElement);
  });
});
