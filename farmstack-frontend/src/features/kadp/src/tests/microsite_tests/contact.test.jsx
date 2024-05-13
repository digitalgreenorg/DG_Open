import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import GuestUserContactNew from "../../Views/GuestUser/GuestUserContactNew";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { BrowserRouter as Router } from "react-router-dom";
import UrlConstant from "../../Constants/UrlConstants";
import { server } from "../../mocks/server";
import { rest } from "msw";
import "@testing-library/dom";
import "@testing-library/jest-dom";

describe("render all values", () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });
  afterEach(() => cleanup());
  test("render contact form correctly", () => {
    render(
      <Router>
        <GuestUserContactNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("render the labels correclty", () => {
    render(
      <Router>
        <GuestUserContactNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    expect(
      screen.getByText(
        "We are eager to connect with organizations, researchers, and individuals who share our passion for revolutionizing agriculture. If you have questions, suggestions or would like to explore collaboration opportunities, please don't hesitate to get in touch with us."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Talk with us")).toBeInTheDocument();
  });
  test("should render contact us field labels correctly and trigger the events", async () => {
    render(
      <Router>
        <GuestUserContactNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const firstName = screen.getByPlaceholderText("Enter your first name");
    fireEvent.change(firstName, { target: { value: "shruthi" } });

    const lastName = screen.getByPlaceholderText("Enter your last name");
    fireEvent.change(lastName, { target: { value: "monika" } });

    const mailId = screen.getByPlaceholderText("Enter your email address");
    fireEvent.change(mailId, { target: { value: "test@gmail.com" } });

    const contactNumber = screen.getByPlaceholderText("Contact Number");
    fireEvent.change(contactNumber, { target: { value: "+91 9344957735" } });

    const query = screen.getByPlaceholderText("Describe your query");
    fireEvent.change(query, {
      target: {
        value: "    how to become a participant under particular costeward    ",
      },
    });
    fireEvent.blur(query);

    const becomeParticipantRadio = screen.getByLabelText(
      "Become a Participant (Data Provider / Consumer)"
    );
    fireEvent.click(becomeParticipantRadio);
  });
  test("onclick of submit button with events", async () => {
    render(
      <Router>
        <GuestUserContactNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const firstName = screen.getByPlaceholderText("Enter your first name");
    fireEvent.change(firstName, { target: { value: "shruthi" } });

    const lastName = screen.getByPlaceholderText("Enter your last name");
    fireEvent.change(lastName, { target: { value: "monika" } });

    const mailId = screen.getByPlaceholderText("Enter your email address");
    fireEvent.change(mailId, { target: { value: "test@gmail.com" } });

    const contactNumber = screen.getByPlaceholderText("Contact Number");
    fireEvent.change(contactNumber, { target: { value: "+91 9344957735" } });

    const query = screen.getByPlaceholderText("Describe your query");
    fireEvent.change(query, {
      target: {
        value: "    how to become a participant under particular costeward    ",
      },
    });
    fireEvent.blur(query);

    const becomeParticipantRadio = screen.getByLabelText(
      "Become a Participant (Data Provider / Consumer)"
    );
    fireEvent.click(becomeParticipantRadio);

    // const otherQueriesRadio = screen.getByLabelText(
    //   "Other queries (Describe your query in detail)"
    // );
    // fireEvent.click(otherQueriesRadio);

    const submitButton = screen.getByTestId("submit-button-test");
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);
    console.log("values", contactNumber, mailId, lastName, firstName, query);
  });
  test("onclick of cancel button", async () => {
    render(
      <Router>
        <GuestUserContactNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const cancelButton = screen.getByTestId("cancel-button-test");
    fireEvent.click(cancelButton);
  });
  test("submit button failure", async () => {
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.microsite_contact_form,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              first_name: ["invalid name"],
              last_name: ["invalid_lastname"],
              email: ["invalid_emailid"],
              subject: ["subject may not be empty"],
              describe_query: ["not a valid query"],
              contact_number: ["invalid_number"],
            })
          );
        }
      )
    );
    render(
      <Router>
        <GuestUserContactNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const firstName = screen.getByPlaceholderText("Enter your first name");
    fireEvent.change(firstName, { target: { value: "shruthi" } });

    const lastName = screen.getByPlaceholderText("Enter your last name");
    fireEvent.change(lastName, { target: { value: "monika" } });

    const mailId = screen.getByPlaceholderText("Enter your email address");
    fireEvent.change(mailId, { target: { value: "test@gmail.com" } });

    const contactNumber = screen.getByPlaceholderText("Contact Number");
    fireEvent.change(contactNumber, { target: { value: "+91 9344957735" } });

    const query = screen.getByPlaceholderText("Describe your query");
    fireEvent.change(query, {
      target: {
        value: "    how to become a participant under particular costeward    ",
      },
    });
    fireEvent.blur(query);

    const becomeParticipantRadio = screen.getByLabelText(
      "Become a Participant (Data Provider / Consumer)"
    );
    fireEvent.click(becomeParticipantRadio);
    const submitButton = screen.getByTestId("submit-button-test");
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);
  });
  test("get admin data gets failure", async () => {
    server.use(
      rest.get(
        UrlConstant.base_url + UrlConstant.guest_organization_details,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <GuestUserContactNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });

  test("get all data of  datahubadmin", async () => {
    render(
      <Router>
        <GuestUserContactNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    // const adminName = screen.getByTestId("admin_name");
    // expect(adminName).toBe("asdfg");

    // const lastName = screen.getByPlaceholderText("Enter your last name");
    // expect(lastName.value).toBe("");

    // const orgAddress = screen.getByLabelText(/Organisation Address /i);
    // expect(orgAddress.value).toBe("patna");

    // const country = await screen.findByRole("button", {
    //   name: /Country/i,
    // });
    // // expect(country.value).toBe("India");
    // expect(country).toBeInTheDocument();

    // const pincode = screen.getByLabelText(/PIN Code/i);
    // expect(pincode.value).toBe("800001");

    // const firstName = await screen.findByRole("textbox", {
    //   name: /First Name/i,
    // });
    // expect(firstName.value).toBe("ekta");
  });
  test("refresh token failure", async () => {
    server.use(
      rest.get(
        `${UrlConstant.base_url}token/refresh/`,
        (req, res, ctx) => {
          return res(ctx.status(401), ctx.json());
        }
      )
    );
    render(
      <Router>
        <GuestUserContactNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
});
