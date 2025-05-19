import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import DataSetsView from "../../Components/Datasets_New/DataSetsView";
import { server } from "../../mocks/server";
import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";
import { setTokenLocal } from "../../Utils/Common";

describe("View Dataset module for admin", () => {
  const history = createMemoryHistory();

  beforeEach(() => {
    cleanup();
  });
  afterEach(() => cleanup());

  test("render dataset view component", () => {
    const state = { tab: "my_organisation" };
    history.push(
      "/datahub/new_datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    render(
      <Router history={history}>
        <DataSetsView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("render dataset view component failure", () => {
    const state = { tab: "my_organisation" };
    history.push(
      "/datahub/new_datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    server.use(
      rest.get(
        `${UrlConstant.base_url}${UrlConstant.datasetview}:id/`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router history={history}>
        <DataSetsView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("trigger breadcrum element", () => {
    const state = { tab: "my_organisation" };
    history.push(
      "/datahub/new_datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router history={history}>
        <DataSetsView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const breadcrumbBtn = screen.getByTestId("goPrevRoute");
    fireEvent.click(breadcrumbBtn);
  });
  test("trigger Back button", () => {
    const state = { tab: "my_organisation" };
    history.push(
      "/datahub/new_datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    render(
      <Router history={history}>
        <DataSetsView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const backBtn = screen.getByText("Back");
    fireEvent.click(backBtn);
  });
  test("trigger edit button", () => {
    const state = { tab: "my_organisation" };
    history.push(
      "/datahub/new_datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router history={history}>
        <DataSetsView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const editBtn = screen.getByText("Edit dataset");
    fireEvent.click(editBtn);
  });
  test("trigger delete button", async () => {
    const state = { tab: "my_organisation" };
    history.push(
      "/datahub/new_datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router history={history}>
        <DataSetsView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const deleteBtn = screen.getByText("Delete dataset");
    act(() => {
      fireEvent.click(deleteBtn);
    });
    const deletePopperBtn = screen.getByTestId("deletepopper");
    fireEvent.click(deletePopperBtn);
  });
  test("trigger delete button failure", async () => {
    server.use(
      rest.delete(
        `${UrlConstant.base_url}${UrlConstant.delete_dataset}:id/`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    const state = { tab: "my_organisation" };
    history.push(
      "/datahub/new_datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router history={history}>
        <DataSetsView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const deleteBtn = screen.getByText("Delete dataset");
    act(() => {
      fireEvent.click(deleteBtn);
    });
    const deletePopperBtn = screen.getByTestId("deletepopper");
    fireEvent.click(deletePopperBtn);
  });
  test("trigger close button", async () => {
    const state = { tab: "my_organisation" };
    history.push(
      "/datahub/new_datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router history={history}>
        <DataSetsView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const deleteBtn = screen.getByText("Delete dataset");
    act(() => {
      fireEvent.click(deleteBtn);
    });
    const cancelPopperBtn = screen.getByTestId("closepopper");
    fireEvent.click(cancelPopperBtn);
  });
});

describe("View Dataset module for participant", () => {
  const history = createMemoryHistory();
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => cleanup());
  test("trigger breadcrum element", () => {
    const state = { tab: "my_organisation" };
    history.push(
      "/datahub/new_datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router history={history}>
        <DataSetsView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const breadcrumbBtn = screen.getByTestId("goPrevRoute");
    fireEvent.click(breadcrumbBtn);
  });
  test("trigger edit button", () => {
    const state = { tab: "my_organisation" };
    history.push(
      "/participant/new_datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router history={history}>
        <DataSetsView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const editBtn = screen.getByText("Edit dataset");
    fireEvent.click(editBtn);
  });
  test("trigger delete button", async () => {
    const state = { tab: "my_organisation" };
    history.push(
      "/datahub/new_datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router history={history}>
        <DataSetsView />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const deleteBtn = screen.getByText("Delete dataset");
    act(() => {
      fireEvent.click(deleteBtn);
    });
    const deletePopperBtn = screen.getByTestId("deletepopper");
    fireEvent.click(deletePopperBtn);
  });
});

describe("View Dataset module for guest", () => {
  const history = createMemoryHistory();
  beforeEach(() => cleanup());
  afterEach(() => cleanup());

  test("render dataset view component", () => {
    const state = { tab: "" };
    history.push(
      "/home/datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    render(
      <Router history={history}>
        <DataSetsView userType="guest" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("render dataset view component failure", () => {
    server.use(
      rest.get(
        `${UrlConstant.base_url}${UrlConstant.datasetview__guest}:id/`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    const state = { tab: "" };
    history.push(
      "/home/datasets/view/73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
      state
    );
    render(
      <Router history={history}>
        <DataSetsView userType="guest" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
});
