import React from "react";
import {
  act,
  cleanup,
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import SupportView from "../../Components/Support_New/SupportView";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { BrowserRouter as Router } from "react-router-dom";
import { setUserId, setUserMapId } from "../../Utils/Common";
import { server } from "../../mocks/server";
import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";
import userEvent from "@testing-library/user-event";
describe("Support View component", () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });
  afterEach(() => cleanup());
  test("render view support without crashing", async () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <SupportView />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    expect(await screen.findByText("6 tickets")).toBeInTheDocument();
  });
  test("render view support with crashing", () => {
    server.use(
      rest.get(
        `${UrlConstant.base_url}${UrlConstant.support_ticket}:id/`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <SupportView />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("render all existing feilds", async () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <SupportView />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    expect(await screen.findByText("6 tickets")).toBeInTheDocument();
    expect(await screen.findByText("open")).toBeInTheDocument();
    expect(await screen.findByText("sdfr")).toBeInTheDocument();
    expect(
      await screen.findByText(
        "monikasdfrgthygtrfedfrgthyjuhgfergthyjukjyhgfdsfgthyjuyhgfdwefrgthyjuhgfdsfghyjuyhtgrfedwefrgthyjuk"
      )
    ).toBeInTheDocument();
    expect(await screen.findByText("08/06/2023")).toBeInTheDocument();
    expect(await screen.findByText("others")).toBeInTheDocument();
    screen.debug();
  });
  test("update resolution", async () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <SupportView />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const replyField = screen.getByPlaceholderText("Reply");
    fireEvent.change(replyField, { target: { value: "resolving" } });
    expect(replyField.value).toBe("resolving");

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);
  });
  test("update resolution failure scenario", async () => {
    server.use(
      rest.post(
        `${UrlConstant.base_url}${UrlConstant.support_resolution}`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <SupportView />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const replyField = screen.getByPlaceholderText("Reply");
    fireEvent.change(replyField, { target: { value: "resolving" } });
    expect(replyField.value).toBe("resolving");

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);
  });
  test("push back from view page to list page", async () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <SupportView />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const supportNavigationBtn = screen.getByText("Support");
    fireEvent.click(supportNavigationBtn);
  });
  test("action on each resolution", async () => {
    render(
      <Router>
        <SupportView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const resolutions = await screen.findAllByTestId("eachresolution");
    fireEvent.mouseEnter(resolutions[0]);

    fireEvent.mouseLeave(resolutions[0]);
  });
  test("update last ticket message", async () => {
    userEvent.setup();
    setUserId("sometoken");
    setUserMapId("somemapid");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <SupportView />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    const resolutions = await screen.findAllByTestId("eachresolution");
    fireEvent.mouseEnter(resolutions[3]);
    const editButton = await screen.findByTestId("editthe");
    fireEvent.click(editButton);
    const responseMessageField = screen.getByLabelText(/Resolution message/i);
    fireEvent.change(responseMessageField, { target: { value: "something" } });
    const sendButton = await screen.findByTestId("sendicon");
    fireEvent.click(sendButton);
  });
  test("update last ticket message failure", async () => {
    server.use(
      rest.put(
        `${UrlConstant.base_url}${UrlConstant.support_resolution}:messageId/`,
        (req, res, ctx) => {
          console.log("🚀 ~ file: viewsupport.test.js:100 ~ test ~ req:", req);

          return res(ctx.status(400), ctx.json());
        }
      )
    );
    userEvent.setup();
    setUserId("sometoken");
    setUserMapId("somemapid");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <SupportView />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    const resolutions = await screen.findAllByTestId("eachresolution");
    fireEvent.mouseEnter(resolutions[3]);
    const editButton = await screen.findByTestId("editthe");
    fireEvent.click(editButton);
    const responseMessageField = screen.getByLabelText(/Resolution message/i);
    fireEvent.change(responseMessageField, { target: { value: "something" } });
    const sendButton = await screen.findByTestId("sendicon");
    fireEvent.click(sendButton);
  });
  test("action on close the status of ticket", async () => {
    render(
      <Router>
        <SupportView />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    const submitButton = await screen.findByRole("button", {
      name: /submit/i,
    });

    fireEvent.click(submitButton);
  });
  test("action on close the status of ticket failure", async () => {
    server.use(
      rest.put(
        `${UrlConstant.base_url}${UrlConstant.support_ticket}:id/`,
        (req, res, ctx) => {
          console.log("🚀 ~ file: viewsupport.test.js:100 ~ test ~ req:", req);

          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <SupportView />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    const submitButton = await screen.findByRole("button", {
      name: /submit/i,
    });

    fireEvent.click(submitButton);
  });
});
