import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import DataSets from "../../Components/Datasets_New/DataSets";
import { server } from "../../mocks/server";
import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";
import { setTokenLocal, setUserId } from "../../Utils/Common";

jest.mock("../../hooks/useDebounce", () => (value, delay) => value);

describe("dataset listing module for admin", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());
  test("render dataset listing component", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("Go home from breadcumb", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const button = screen.getByTestId("go_home");
    fireEvent.click(button);
  });
  test("get All datasets", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("get All datasets failure", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.dataset_list,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("get All Category and sub category failure", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    server.use(
      rest.get(
        UrlConstant.base_url + UrlConstant.add_category_edit_category,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("search dataset", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const searchDataset = screen.getByPlaceholderText("Search dataset..");
    fireEvent.change(searchDataset, { target: { value: "sampledset" } });

    act(() => {
      jest.advanceTimersByTime(1000); // Debounce delay is set to 1000ms in useDebounce
    });
  });
  test("search dataset with loadmore", async () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const searchDataset = screen.getByPlaceholderText("Search dataset..");
    fireEvent.change(searchDataset, { target: { value: "sampledset" } });

    const loadMoreBtn = await screen.findByTestId("load_more_admin");
    fireEvent.click(loadMoreBtn);
    act(() => {
      jest.advanceTimersByTime(1000); // Debounce delay is set to 1000ms in useDebounce
    });
  });
  test("trigger geograpy filter action", async () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const geographyFilterBtn = screen.getByTestId(
      "dataset-filter-by-geography-id"
    );
    fireEvent.click(geographyFilterBtn);
  });
  test("trigger categories filter action", async () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const categoriesFilterBtn = screen.getByTestId(
      "dataset-filter-by-categories-id"
    );
    fireEvent.click(categoriesFilterBtn);
    const checkBoxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkBoxes[0]);

    fireEvent.click(checkBoxes[0]);
  });
  test("trigger date filter action", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const dateFilterBtn = screen.getByTestId("dataset-filter-by-date-id");
    fireEvent.click(dateFilterBtn);
    const startDate = screen.getByRole("textbox", {
      name: /start date/i,
    });
    fireEvent.change(startDate, { target: { value: "20/11/2022" } });
    const endDate = screen.getByRole("textbox", {
      name: /end date/i,
    });
    fireEvent.change(endDate, { target: { value: "20/04/2023" } });

    const cancelfilterChip = screen.getByTestId("CancelIcon");
    fireEvent.click(cancelfilterChip);
  });
  test("trigger clearAll filter action", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const clearFilterBtn = screen.getByTestId("dataset-filter-clear-all-id");
    fireEvent.click(clearFilterBtn);
  });
  test("Add dataset card click", async () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const addDataset = await screen.findByTestId("add_dataset_card");
    fireEvent.click(addDataset);
  });
  test("navigate dataset view page by doing card click", async () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const viewDataset = await screen.findAllByTestId("navigate_dataset_view");
    fireEvent.click(viewDataset[0]);
  });
  test("trigger loadmore action", async () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const loadMoreBtn = await screen.findByTestId("load_more_admin");
    fireEvent.click(loadMoreBtn);
  });
});

describe("dataset listing module for co-steward", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());
  test("render dataset listing component", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("Go home from breadcumb", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const button = screen.getByTestId("go_home");
    fireEvent.click(button);
  });
  test("get All datasets", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("get All datasets failure", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.dataset_list,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("get All Category and sub category failure", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    server.use(
      rest.get(
        UrlConstant.base_url + UrlConstant.add_category_edit_category,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("search dataset", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const searchDataset = screen.getByPlaceholderText("Search dataset..");
    fireEvent.change(searchDataset, { target: { value: "sampledset" } });

    act(() => {
      jest.advanceTimersByTime(1000); // Debounce delay is set to 1000ms in useDebounce
    });
  });
  test("trigger clearAll filter action", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const clearFilterBtn = screen.getByTestId("dataset-filter-clear-all-id");
    fireEvent.click(clearFilterBtn);
  });
});

describe("dataset listing module for participant", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());
  test("render dataset listing component", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("Go home from breadcumb", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const button = screen.getByTestId("go_home");
    fireEvent.click(button);
  });
  test("get All datasets", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("get All datasets failure", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.dataset_list,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("get All Category and sub category failure", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    server.use(
      rest.get(
        UrlConstant.base_url + UrlConstant.add_category_edit_category,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("search dataset", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const searchDataset = screen.getByPlaceholderText("Search dataset..");
    fireEvent.change(searchDataset, { target: { value: "sampledset" } });

    act(() => {
      jest.advanceTimersByTime(1000); // Debounce delay is set to 1000ms in useDebounce
    });
  });
  test("trigger clearAll filter action", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const clearFilterBtn = screen.getByTestId("dataset-filter-clear-all-id");
    fireEvent.click(clearFilterBtn);
  });
  test("Add dataset card click", async () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const addDataset = await screen.findByTestId("add_dataset_card");
    fireEvent.click(addDataset);
  });
});

describe("dataset listing module for guest", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());
  test("render dataset listing component", () => {
    render(
      <Router>
        <DataSets user="guest" breadcrumbFromRoute="Home" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("Go home from breadcumb", () => {
    render(
      <Router>
        <DataSets user="guest" breadcrumbFromRoute="Home" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const button = screen.getByTestId("go_home");
    fireEvent.click(button);
  });
  test("get All datasets", () => {
    render(
      <Router>
        <DataSets user="guest" breadcrumbFromRoute="Home" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("get All datasets failure", () => {
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.dataset_list,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <DataSets user="guest" breadcrumbFromRoute="Home" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("get All Category and sub category failure", () => {
    server.use(
      rest.get(
        UrlConstant.base_url + UrlConstant.microsite_category,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <DataSets user="guest" breadcrumbFromRoute="Home" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("search dataset", () => {
    render(
      <Router>
        <DataSets user="guest" breadcrumbFromRoute="Home" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const searchDataset = screen.getByPlaceholderText("Search dataset..");
    fireEvent.change(searchDataset, { target: { value: "sampledset" } });

    act(() => {
      jest.advanceTimersByTime(1000); // Debounce delay is set to 1000ms in useDebounce
    });
  });
  test("trigger clearAll filter action", () => {
    render(
      <Router>
        <DataSets user="guest" breadcrumbFromRoute="Home" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const clearFilterBtn = screen.getByTestId("dataset-filter-clear-all-id");
    fireEvent.click(clearFilterBtn);
  });
});

describe("data listing in other organisation", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());
  test("render dataset listing component on others organisation", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const otherOrganisation = screen.getByRole("tab", {
      name: /other organisation/i,
    });
    fireEvent.click(otherOrganisation);
  });
  test("render dataset listing component on others organisation failure", () => {
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.dataset_list,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const otherOrganisation = screen.getByRole("tab", {
      name: /other organisation/i,
    });
    fireEvent.click(otherOrganisation);
  });
  test("trigger clearAll filter action", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const otherOrganisation = screen.getByRole("tab", {
      name: /other organisation/i,
    });
    fireEvent.click(otherOrganisation);
    const clearFilterBtn = screen.getByTestId("dataset-filter-clear-all-id");
    fireEvent.click(clearFilterBtn);
  });
  test("trigger loadmore action", async () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const otherOrganisation = screen.getByRole("tab", {
      name: /other organisation/i,
    });
    fireEvent.click(otherOrganisation);
    const loadMoreBtn = await screen.findByTestId("load_more_member");
    fireEvent.click(loadMoreBtn);
  });
  test("search dataset", () => {
    setTokenLocal("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const otherOrganisation = screen.getByRole("tab", {
      name: /other organisation/i,
    });
    fireEvent.click(otherOrganisation);
    const searchDataset = screen.getByPlaceholderText("Search dataset..");
    fireEvent.change(searchDataset, { target: { value: "sampledset" } });

    act(() => {
      jest.advanceTimersByTime(1000); // Debounce delay is set to 1000ms in useDebounce
    });
  });
  test("render dataset listing component on others organisation", () => {
    setTokenLocal("sometoken");
    setUserId("someuser");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const otherOrganisation = screen.getByRole("tab", {
      name: /other organisation/i,
    });
    fireEvent.click(otherOrganisation);
  });
  test("render dataset listing component on others organisation with less than 2 response", async () => {
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.dataset_list,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              count: 1,
              next: null,
              previous: null,
              results: [
                {
                  id: "5328fcbe-665f-46b4-846a-d8032b6e86d1",
                  user_id: "74262a78-4b2b-4687-88ab-cba9ac641d37",
                  organization_id: "ac35763e-bfce-4bf8-bb26-3c98616600b6",
                  organization: {
                    org_email: "sohit@digitalgreen.org",
                    org_description: "kjhkhkhkhkj",
                    name: "new org",
                    logo: "/media/organizations/logos/1653272245246.jpeg",
                    address: {
                      city: "",
                      address: "org address",
                      country: "India",
                      pincode: "1234565432",
                    },
                    phone_number: "+91 23423-42343",
                  },
                  user: {
                    last_name: "kumar",
                    first_name: "sohit",
                    email: "sohit@digitalgreen.org",
                    on_boarded_by: null,
                  },
                  created_at: "2023-07-11T14:13:03.536067Z",
                  updated_at: "2023-07-18T04:35:52.157756Z",
                  name: "test1",
                  description: "test description",
                  category: {},
                  geography: {},
                  data_capture_start: null,
                  data_capture_end: null,
                  constantly_update: true,
                  is_temp: false,
                  user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
                },
              ],
            })
          );
        }
      )
    );
    setTokenLocal("sometoken");
    setUserId("someuser");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <DataSets />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const otherOrganisation = screen.getByRole("tab", {
      name: /other organisation/i,
    });
    fireEvent.click(otherOrganisation);

    const searchDataset = screen.getByPlaceholderText("Search dataset..");
    fireEvent.change(searchDataset, { target: { value: "sampledset" } });
  });
});
