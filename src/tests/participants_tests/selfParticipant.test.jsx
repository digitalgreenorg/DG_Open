import React from "react";
import {
  act,
  cleanup,
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { BrowserRouter as Router } from "react-router-dom";
import { setUserMapId } from "../../Utils/Common";
import { server } from "../../mocks/server";
import { rest } from "msw";
import ParticipantFormNew from "../../Components/Card/ParticipantForm/ParticipantFormNew";
import UrlConstant from "../../Constants/UrlConstants";
global.URL.createObjectURL = jest.fn(() => "mocked-object-url");
global.URL.revokeObjectURL = jest.fn();
// localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
describe("Self register module", () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });
  test("renders Add participant component event triggering and submit add part form of admin", async () => {
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    const setIsCoStewardMock = jest.fn();
    render(
      <Router>
        <ParticipantFormNew
          userType={false}
          setIsCoSteward={setIsCoStewardMock}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const orgName = screen.getByLabelText(/organisation name/i);
    fireEvent.change(orgName, { target: { value: "DG ORG" } });

    const orgEmail = screen.getByLabelText(/Orgnaisation email Id/);
    fireEvent.change(orgEmail, {
      target: { value: "eshrut@digitalgreen.org" },
    });

    const orgWebsite = screen.getByLabelText(/Website Link/i);
    fireEvent.change(orgWebsite, {
      target: { value: "https://www.digitalgreen.org" },
    });

    const orgAddress = screen.getByLabelText(/Organisation Address /i);
    fireEvent.change(orgAddress, { target: { value: "bangalore" } });

    const country = screen.getByLabelText(/Country/i);
    fireEvent.change(country, { target: { value: "India" } });

    const pincode = screen.getByLabelText(/PIN Code/i);
    fireEvent.change(pincode, { target: { value: "608001" } });

    const firstName = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstName, { target: { value: "John" } });

    const lastName = screen.getByLabelText(/Last Name/i);
    fireEvent.change(lastName, { target: { value: "David" } });

    const emailInput = screen.getByPlaceholderText(/Mail Id/i);
    fireEvent.change(emailInput, {
      target: { value: "eshrut@digitalgreen.org" },
    });

    const contactNumber = screen.getByLabelText(/Contact Number /i);
    screen.debug();
    fireEvent.change(contactNumber, { target: { value: "+91 9344957735" } });
    // expect(screen.getByText(/Invalid phone number/i)).not.toBeInTheDocument();

    const coStewardCheckbox = screen.getByLabelText(/Co-Steward/i);
    expect(coStewardCheckbox).toBeInTheDocument();
    fireEvent.change(coStewardCheckbox);

    const handleSubmitButton = screen.getByTestId("handle-submit-button");
    fireEvent.click(handleSubmitButton);

    const submitButton = screen.getByRole("button", {
      name: /Submit/i,
    });
    fireEvent.click(submitButton);
  });
  test("renders Add participant component event triggering and submit self register form of self part", async () => {
    render(
      <Router>
        <ParticipantFormNew userType={"guest"} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const orgName = screen.getByLabelText(/organisation name/i);
    fireEvent.change(orgName, { target: { value: "ekta dummy" } });

    const orgWebsite = screen.getByLabelText(/Website Link/i);
    fireEvent.change(orgWebsite, {
      target: { value: "https://www.digitalgreen.org" },
    });
    const orgMail = screen.getByLabelText(/Orgnaisation email Id/i);
    fireEvent.change(orgMail, {
      target: { value: "dummy@gmail.com" },
    });

    const orgAddress = screen.getByLabelText(/Organisation Address /i);
    fireEvent.change(orgAddress, { target: { value: "Chennai" } });

    const country = screen.getByLabelText(/Country/i);
    fireEvent.change(country, { target: { value: "Anguilla" } });

    const pincode = screen.getByLabelText(/PIN Code/i);
    fireEvent.change(pincode, { target: { value: "234567456" } });

    const firstName = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstName, { target: { value: "test" } });

    const lastName = screen.getByLabelText(/Last Name/i);
    fireEvent.change(lastName, { target: { value: "testuser" } });

    const emailInput = screen.getByPlaceholderText(/Mail Id/i);
    fireEvent.change(emailInput, {
      target: { value: "eshrut@digitalgreen.org" },
    });

    const contactNumber = screen.getByLabelText(/Contact Number /i);
    fireEvent.change(contactNumber, { target: { value: "+91 93449-57735" } });

    const submitButtonElement = await screen.findByRole("button", {
      name: /Submit/i,
    });
    expect(submitButtonElement).toBeInTheDocument();
    fireEvent.click(submitButtonElement);
  });
  test("edit and submit the form on edit of admin", async () => {
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <ParticipantFormNew isEditModeOn={true} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const orgEmail = await screen.findByRole("textbox", {
      name: /Orgnaisation email Id/i,
    });
    expect(orgEmail.value).toBe("fghjk@fghj.com");

    const orgName = screen.getByLabelText(/organisation name/i);
    expect(orgName.value).toBe("SHRU. orggggg");
    fireEvent.change(orgName, { target: { value: "DG ORG" } });

    const orgWebsite = screen.getByLabelText(/Website Link/i);
    expect(orgWebsite.value).toBe("www.sdf.com");
    fireEvent.change(orgWebsite, {
      target: { value: "https://www.digitalgreen.org" },
    });

    const orgAddress = screen.getByLabelText(/Organisation Address /i);
    expect(orgAddress.value).toBe("chennai");
    fireEvent.change(orgAddress, { target: { value: "bangalore" } });

    const country = screen.getByLabelText(/Country/i);
    fireEvent.change(country, { target: { value: "India" } });

    const pincode = screen.getByLabelText(/PIN Code/i);
    expect(pincode.value).toBe("234567890");
    fireEvent.change(pincode, { target: { value: "608001" } });

    const firstName = screen.getByLabelText(/First Name/i);
    expect(firstName.value).toBe("monikashruthi");
    fireEvent.change(firstName, { target: { value: "John" } });

    const lastName = screen.getByLabelText(/Last Name/i);
    fireEvent.change(lastName, { target: { value: "David" } });

    const contactNumber = screen.getByLabelText(/Contact Number /i);
    fireEvent.change(contactNumber, { target: { value: "9344957735" } });

    const submitButton = screen.getByRole("button", {
      name: /Submit/i,
    });
    fireEvent.click(submitButton);
  });

  test("click cancel button of admin", async () => {
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <ParticipantFormNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });
    fireEvent.click(cancelButton);
  });
  test("click cancel button of self part", async () => {
    render(
      <Router>
        <ParticipantFormNew userType={"guest"} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });
    fireEvent.click(cancelButton);
  });
  test("click cancel button on edit", async () => {
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <ParticipantFormNew isEditModeOn={true} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });
    fireEvent.click(cancelButton);
  });
  test("check for get list of costeward failure", async () => {
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.costewardlist_selfregister,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <ParticipantFormNew userType={"guest"} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("get details for edit failure", async () => {
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    server.use(
      rest.get(
        UrlConstant.base_url + UrlConstant.participant + ":id" + "/",
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <ParticipantFormNew isEditModeOn={true} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("update of part failure", async () => {
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    server.use(
      rest.put(
        UrlConstant.base_url + UrlConstant.participant + ":id" + "/",
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              first_name: ["Invalid name"],
              last_name: ["Invalid last name"],
              phone_number: ["Invalid formact"],
              name: ["Invalid org name"],
              website: ["Invalid website"],
            })
          );
        }
      )
    );
    render(
      <Router>
        <ParticipantFormNew isEditModeOn={true} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const orgEmail = await screen.findByRole("textbox", {
      name: /Orgnaisation email Id/i,
    });
    expect(orgEmail.value).toBe("fghjk@fghj.com");

    const orgName = screen.getByLabelText(/organisation name/i);
    expect(orgName.value).toBe("SHRU. orggggg");
    fireEvent.change(orgName, { target: { value: "DG ORG" } });

    const orgWebsite = screen.getByLabelText(/Website Link/i);
    expect(orgWebsite.value).toBe("www.sdf.com");
    fireEvent.change(orgWebsite, {
      target: { value: "https://www.digitalgreen.org" },
    });

    const orgAddress = screen.getByLabelText(/Organisation Address /i);
    expect(orgAddress.value).toBe("chennai");
    fireEvent.change(orgAddress, { target: { value: "bangalore" } });

    const country = screen.getByLabelText(/Country/i);
    fireEvent.change(country, { target: { value: "India" } });

    const pincode = screen.getByLabelText(/PIN Code/i);
    expect(pincode.value).toBe("234567890");
    fireEvent.change(pincode, { target: { value: "608001" } });

    const firstName = screen.getByLabelText(/First Name/i);
    expect(firstName.value).toBe("monikashruthi");
    fireEvent.change(firstName, { target: { value: "John" } });

    const lastName = screen.getByLabelText(/Last Name/i);
    fireEvent.change(lastName, { target: { value: "David" } });

    const contactNumber = screen.getByLabelText(/Contact Number /i);
    fireEvent.change(contactNumber, { target: { value: "9344957735" } });

    const submitButton = screen.getByRole("button", {
      name: /Submit/i,
    });
    fireEvent.click(submitButton);
  });
  test("check for submit button failure for admin", async () => {
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    server.use(
      rest.post(
        `${UrlConstant.base_url + UrlConstant.participant}`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              first_name: ["Invalid name"],
              last_name: ["Invalid last name"],
              email: ["email id not valid"],
              phone_number: ["Invalid formact"],
              name: ["Invalid org name"],
              org_email: ["Invalid email"],
              email: ["email id not valid"],
              website: ["Invalid website"],
            })
          );
        }
      )
    );
    render(
      <Router>
        <ParticipantFormNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const orgName = screen.getByLabelText(/organisation name/i);
    fireEvent.change(orgName, { target: { value: "DG ORG" } });

    const orgEmail = screen.getByLabelText(/Orgnaisation email Id/);
    fireEvent.change(orgEmail, {
      target: { value: "eshrut@digitalgreen.org" },
    });

    const orgWebsite = screen.getByLabelText(/Website Link/i);
    fireEvent.change(orgWebsite, {
      target: { value: "https://www.digitalgreen.org" },
    });

    const orgAddress = screen.getByLabelText(/Organisation Address /i);
    fireEvent.change(orgAddress, { target: { value: "bangalore" } });

    const country = screen.getByLabelText(/Country/i);
    fireEvent.change(country, { target: { value: "India" } });

    const pincode = screen.getByLabelText(/PIN Code/i);
    fireEvent.change(pincode, { target: { value: "608001" } });

    const firstName = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstName, { target: { value: "John" } });

    const lastName = screen.getByLabelText(/Last Name/i);
    fireEvent.change(lastName, { target: { value: "David" } });

    const contactNumber = screen.getByLabelText(/Contact Number /i);
    fireEvent.change(contactNumber, { target: { value: "91 91378-31800" } });
    // fireEvent.change(contactNumber, { target: { value: "12345567" } });

    const coStewardCheckbox = screen.getByLabelText(/Co-Steward/i);
    expect(coStewardCheckbox).toBeInTheDocument();
    fireEvent.change(coStewardCheckbox);

    const emailInput = await screen.findAllByRole("textbox", {
      name: /Mail Id/i,
    });

    const handleSubmitButton = screen.getByTestId("handle-submit-button");
    fireEvent.click(handleSubmitButton);

    const submitButton = screen.getByRole("button", {
      name: /Submit/i,
    });
    fireEvent.click(submitButton);
  });
});
