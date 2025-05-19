import React from "react";
import {
  act,
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Support from "../../Components/Support_New/Support";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { setUserId } from "../../Utils/Common";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../../mocks/server";
import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";
describe("Support module for admin", () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });
  test("renders support component without crashing", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("trigger search in co-steward tab in support list page", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const searchField = screen.getByPlaceholderText("Search tickets..");
    fireEvent.change(searchField, { target: { value: "John" } });
    expect(searchField.value).toEqual("John");
  });
  test("trigger search in participant tab in support list page", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    localStorage.setItem("supportTicketsTabValue", 1);
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const searchField = screen.getByPlaceholderText("Search tickets..");
    fireEvent.change(searchField, { target: { value: "monika" } });
    expect(searchField.value).toEqual("monika");
  });
  test("trigger status filter action in support page for admin", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const statusFilterBtn = screen.getByTestId("status_filter");
    fireEvent.click(statusFilterBtn);
  });
  test("trigger categories filter action in support page", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const categoryFilterBtn = screen.getByTestId(
      "support-filter-by-categories-id"
    );
    fireEvent.click(categoryFilterBtn);
  });

  test("trigger date filter action in support page", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const dateFilterBtn = screen.getByTestId("support-filter-by-date-id");
    fireEvent.click(dateFilterBtn);
  });

  test("trigger clear all filter action in support page", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const statusFilterBtn = screen.getByTestId("dataset-filter-clear-all-id");
    fireEvent.click(statusFilterBtn);
  });

  test("trigger handleFilterByStatus action in support page", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const statusFilterBtn = screen.getByTestId("status_filter");
    fireEvent.click(statusFilterBtn);

    const checkbox = screen.getByRole("checkbox", {
      name: /open/i,
    });
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeBtn);
  });
  test("trigger handleFilterByStatus action in support page failure", () => {
    server.use(
      rest.post(
        `${UrlConstant.base_url}${UrlConstant.support_ticket_tab}`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const statusFilterBtn = screen.getByTestId("status_filter");
    fireEvent.click(statusFilterBtn);

    const checkbox = screen.getByRole("checkbox", {
      name: /open/i,
    });
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeBtn);
  });
  test("trigger handleFilterByCategory action in support page", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const categoryFilterBtn = screen.getByTestId(
      "support-filter-by-categories-id"
    );
    fireEvent.click(categoryFilterBtn);

    const checkbox = screen.getByRole("checkbox", {
      name: /certificate/i,
    });
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeBtn);
  });
  test("trigger handleFilterByCategory action in support page failure", () => {
    server.use(
      rest.post(
        `${UrlConstant.base_url}${UrlConstant.support_ticket_tab}`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const categoryFilterBtn = screen.getByTestId(
      "support-filter-by-categories-id"
    );
    fireEvent.click(categoryFilterBtn);

    const checkbox = screen.getByRole("checkbox", {
      name: /certificate/i,
    });
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeBtn);
  });
  test("trigger handleFilterByDate action in support page", async () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const dateFilterBtn = screen.getByTestId("support-filter-by-date-id");
    fireEvent.click(dateFilterBtn);
    const fromDatePickerInput = screen.getByRole("textbox", {
      name: /start date/i,
    });
    fireEvent.focus(fromDatePickerInput);
    const selectedDate = new Date(2022, 10, 21);
    const formattedDate = `${selectedDate.getDate()}/${
      selectedDate.getMonth() + 1
    }/${selectedDate.getFullYear()}`;
    fireEvent.change(fromDatePickerInput, { target: { value: formattedDate } });
    expect(fromDatePickerInput).toHaveValue(formattedDate);

    const toDatePickerInput = screen.getByRole("textbox", {
      name: /end date/i,
    });
    fireEvent.focus(toDatePickerInput);
    const selectedDate1 = new Date(2022, 10, 21);
    const formattedDate1 = `${selectedDate1.getDate()}/${
      selectedDate1.getMonth() + 1
    }/${selectedDate1.getFullYear()}`;
    fireEvent.change(toDatePickerInput, { target: { value: formattedDate1 } });
    expect(toDatePickerInput).toHaveValue(formattedDate1);
  });
  test("renders list of tickets failure scenarios", async () => {
    server.use(
      rest.post(
        `${UrlConstant.base_url}${UrlConstant.support_ticket_tab}`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("trigger load more function in support module", async () => {
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const loadMoreBtn = await screen.findByTestId("loadmorebtn");
    fireEvent.click(loadMoreBtn);
  });
});

describe("Support module for Costeward", () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });
  test("renders support component without crashing", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("trigger search in co-steward tab in support list page", async () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const searchField = screen.getByPlaceholderText("Search tickets..");
    fireEvent.change(searchField, { target: { value: "jhon" } });
    expect(searchField.value).toEqual("jhon");
  });
  test("trigger search in participant tab in support list page", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    localStorage.setItem("supportTicketsTabValue", 1);
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const searchField = screen.getByPlaceholderText("Search tickets..");
    fireEvent.change(searchField, { target: { value: "John" } });
    expect(searchField.value).toEqual("John");
  });
  test("trigger status filter action in support page for co-steward", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const statusFilterBtn = screen.getByTestId("status_filter");
    fireEvent.click(statusFilterBtn);
  });
  test("trigger handleFilterByStatus action in support page", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const statusFilterBtn = screen.getByTestId("status_filter");
    fireEvent.click(statusFilterBtn);

    const checkbox = screen.getByRole("checkbox", {
      name: /open/i,
    });
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeBtn);
  });
  test("trigger handleFilterByCategory action in support page", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const categoryFilterBtn = screen.getByTestId(
      "support-filter-by-categories-id"
    );
    fireEvent.click(categoryFilterBtn);

    const checkbox = screen.getByRole("checkbox", {
      name: /certificate/i,
    });
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeBtn);
  });
  test("trigger handleFilterByDate action in support page", async () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <Support />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const dateFilterBtn = screen.getByTestId("support-filter-by-date-id");
    fireEvent.click(dateFilterBtn);
    const fromDatePickerInput = screen.getByRole("textbox", {
      name: /start date/i,
    });
    fireEvent.focus(fromDatePickerInput);
    const selectedDate = new Date(2022, 10, 21);
    const formattedDate = `${selectedDate.getDate()}/${
      selectedDate.getMonth() + 1
    }/${selectedDate.getFullYear()}`;
    fireEvent.change(fromDatePickerInput, { target: { value: formattedDate } });
    expect(fromDatePickerInput).toHaveValue(formattedDate);

    const toDatePickerInput = screen.getByRole("textbox", {
      name: /end date/i,
    });
    fireEvent.focus(toDatePickerInput);
    const selectedDate1 = new Date(2022, 10, 21);
    const formattedDate1 = `${selectedDate1.getDate()}/${
      selectedDate1.getMonth() + 1
    }/${selectedDate1.getFullYear()}`;
    fireEvent.change(toDatePickerInput, { target: { value: formattedDate1 } });
    expect(toDatePickerInput).toHaveValue(formattedDate1);
  });
});
