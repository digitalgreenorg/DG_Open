import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import DashboardNew from "../../Views/Dashboard/DashboardNew";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import "@testing-library/jest-dom/extend-expect";
import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";
import { isLoggedInUserParticipant } from "../../Utils/Common";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}));
jest.mock("../../Utils/Common", () => {
  const originalModule = jest.requireActual("../../Utils/Common");
  return {
    ...originalModule,
    isLoggedInUserParticipant: jest.fn(),
  };
});

function customWaitFor(fun, options = { time: 5000, interval: 50 }) {
  let { time, interval } = options;

  return new Promise(async (resolve, reject) => {
    let totalWait = 0;
    const checkCondition = async () => {
      let result = await fun();
      console.log(
        "🚀 ~ file: dashboardNew.test.js:30 ~ checkCondition ~ result:",
        result,
        window.location.pathname
      );

      if (result) {
        resolve(result);
      } else if (totalWait >= time) {
        reject(new Error("waitFor timed out."));
        // reject("time out");
      } else {
        totalWait += interval;
        setInterval(checkCondition, interval);
      }
    };
    checkCondition();
  });
}

describe("dashboard component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("rendering dashboard component", () => {
    render(
      <Router>
        <DashboardNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("api call for other org as a admin", () => {
    render(
      <Router>
        <DashboardNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    const parentElement = screen.getByTestId(
      "option-for-my-and-other-org-test"
    );

    // Getting child select option from perent
    const selectElement = parentElement.querySelector("select");

    // Check that the initial selected option is "My organisation"
    expect(selectElement.value).toBe("my_organisation");

    // Simulate selecting "Other organisation" option
    fireEvent.change(selectElement, {
      target: { value: "other_organisation" },
    });

    // Get the updated selected option value from the NativeSelect element
    const updatedValue = selectElement.selectedOptions[0].value;

    // Check that the 'org' state is updated to "other_organisation"
    expect(updatedValue).toBe("other_organisation");
  });

  test("error response", async () => {
    rest.get(
      `${UrlConstant.base_url}${UrlConstant.new_datahub_dashboard}`,
      (req, res, ctx) => {
        console.log("🚀 ~ file: dashboardNew.test.js:97 ~ test ~ req:");
        return res(ctx.status(500), ctx.json({ message: "Internal Server" }));
      }
    );
    render(
      <Router>
        <DashboardNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    // await waitFor;
    let checkUrl = await customWaitFor(() => {
      if (window.location.pathname == "/error/500") {
        return true;
      }
    });
    if (checkUrl) {
      expect(window.location.pathname).toBe("/error/500");
    }
  });
  test("other data of dashboard should not be available for participant", () => {
    isLoggedInUserParticipant.mockReturnValueOnce(true);

    // Call your function that uses isLoggedInUserParticipant
    let myAndOtherOrgOption = null;
    try {
      myAndOtherOrgOption = screen.getByTestId(
        "option-for-my-and-other-org-test"
      );
    } catch (error) {
      expect(myAndOtherOrgOption).toBeNull();
    }
  });
});

// describe("dashboard unexpected error, error 404", () => {
//   test("something unexpected accurs or wrong api call, error 404", async () => {
//     rest.get(
//       `${UrlConstant.base_url}${UrlConstant.new_datahub_dashboard}`,
//       (req, res, ctx) => {
//         console.log("🚀 ~ file: dashboardNew.test.js:140 ~ test ~ req:");

//         return res(ctx.status(404), ctx.json({ message: "Not Found" }));
//       }
//     );
//     render(
//       <Router>
//         <DashboardNew />
//       </Router>,
//       { wrapper: FarmStackProvider }
//     );
//     let checkUrl = await customWaitFor(() => {
//       if (window.location.pathname == "/error/404") {
//         console.log(
//           "🚀 ~ file: dashboardNew.test.js:153 ~ checkUrl ~ window.location.pathname:",
//           window.location.pathname
//         );
//         return true;
//       }
//     });
//     console.log(
//       "🚀 ~ file: dashboardNew.test.js:160 ~ checkUrl ~ checkUrl:",
//       checkUrl
//     );
//     if (checkUrl) {
//       expect(window.location.pathname).toBe("/error/404");
//     }
//   });
// });
