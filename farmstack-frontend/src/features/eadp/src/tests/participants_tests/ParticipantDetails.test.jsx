import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import ParticipantAndCoStewardDetailsNew from "../../Views/ParticipantCoSteward/ParticipantAndCoStewardDetailsNew";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { BrowserRouter as Router } from "react-router-dom";
import UrlConstant from "../../Constants/UrlConstants";
import { server } from "../../mocks/server";
import { rest } from "msw";


describe("render all values", () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });
  afterEach(() => cleanup());
  test("should render participant details correctly", () => {
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    expect(screen.getByText("Organisation Name")).toBeInTheDocument();

    expect(screen.getByText("Website Link")).toBeInTheDocument();

    expect(screen.getByText("Country")).toBeInTheDocument();

    expect(screen.getByText("Address")).toBeInTheDocument();

    expect(screen.getByText("First Name")).toBeInTheDocument();

    expect(screen.getByText("Contact Number")).toBeInTheDocument();

    expect(screen.getByText("Last Name")).toBeInTheDocument();

    expect(screen.getByText("Participant details")).toBeInTheDocument();
  });
  test("onclick of breadcrumb", () => {
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const breadcrubmButton = screen.getByTestId("route-breadcrubm-button");
    fireEvent.click(breadcrubmButton);
  });
  test("onclick of breadcrumb for guest", () => {
    localStorage.setItem("last_route", "/datahub/settings/");
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const breadcrubmButton = screen.getByTestId("route-breadcrubm-button");
    fireEvent.click(breadcrubmButton);
  });

  test("onclick of edit and delete buttons", () => {
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);

    const editButton = screen.getByTestId("edit-button");
    fireEvent.click(editButton);
  });
  test("onclick of dataset buttons", () => {
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew user={"guest"} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("onclick of back", () => {
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew isParticipantRequest={true} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const backButton = screen.getByTestId("back-button-test");
    fireEvent.click(backButton);
  });
  test("onclick of approveButton", () => {
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew isParticipantRequest={true} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const approveButton = screen.getByTestId("approve-button-test");
    fireEvent.click(approveButton);
  });
  test("onclick of rejectButton", () => {
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew isParticipantRequest={true} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const rejectButton = screen.getByTestId("reject-button-test");
    fireEvent.click(rejectButton);
  });
  test("onclick of loadmore in child component", () => {
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew isCosteward={true} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const loadMoreButton = screen.getByTestId("load-more-button-test-button");
    fireEvent.click(loadMoreButton);
  });
  test("onclick of loadmore", async () => {
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const loadMoreButton = await screen.findByTestId("load-more-button-test");
    fireEvent.click(loadMoreButton);
  });
  test("onclick of back button with no request", () => {
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const backButton = screen.getByTestId("back-con-button");
    fireEvent.click(backButton);
  });
  test("render view details failed", () => {
    server.use(
      rest.get(
        `${UrlConstant.base_url}${UrlConstant.participant}:id/`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("render view details failed when onboarded_by", () => {
    server.use(
      rest.get(
        UrlConstant.base_url +
          UrlConstant.participant +
          "?on_boarded_by=" +
          ":id",
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("render view details failed when delete", () => {
    server.use(
      rest.delete(
        UrlConstant.base_url + UrlConstant.participant + ":id" + "/",
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("render view details", () => {
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.costeward_onboarded_dataset,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("render loadmore button failed", () => {
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.costeward_onboarded_dataset + "?page=2",
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("render Approve button failed", () => {
    server.use(
      rest.put(
        UrlConstant.base_url + UrlConstant.participant + ":id" + "/",
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("render loadmore button failed of part", () => {
    server.use(
      rest.get(
        UrlConstant.base_url + UrlConstant.participant + "?page=2",
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("render loadmore button failed", () => {
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.costeward_onboarded_dataset,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("render list in microsite", () => {
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.guest_dataset_filtered_data,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
});

describe("render ParticipantAndCoSteward", () => {
  test("render all values", async () => {
    render(
      <Router>
        <ParticipantAndCoStewardDetailsNew />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const name = await screen.findByText("monikashruthi");
    expect(name).toBeInTheDocument();
    const website = await screen.findByText("www.sdf.com");
    expect(website).toBeInTheDocument();
    const lastName = await screen.findByText("ravi");
    expect(lastName).toBeInTheDocument();
    const contact = await screen.findByText("+91 34567-89456");
    expect(contact).toBeInTheDocument();
    const address = await screen.findByText("chennai");
    expect(address).toBeInTheDocument();
    const country = await screen.findByText("Jersey");
    expect(country).toBeInTheDocument();
    const orgName = await screen.findByText("SHRU. orggggg");
    expect(orgName).toBeInTheDocument();
  });
});
