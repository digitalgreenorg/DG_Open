import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import DataSets from "../../Components/Datasets_New/DataSets";
import { server } from "../../mocks/server";
import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";
import { setTokenLocal, setUserId, setUserMapId } from "../../Utils/Common";
import DatasetRequestTable from "../../Components/Datasets_New/DatasetRequestTable/DatasetRequestTable";

function customWaitFor(fun, options = { time: 5000, interval: 50 }) {
  let { time, interval } = options;
  console.log(
    "🚀 ~ file: verifyEmail.test.js:14 ~ customWaitFor ~ interval:",
    interval
  );

  return new Promise(async (resolve, reject) => {
    let totalWait = 0;
    const checkCondition = async () => {
      let result;
      if (totalWait) {
        result = await fun();
      }
      // console.log(
      //   "🚀 ~ file: dashboardNew.test.js:30 ~ checkCondition ~ result:",
      //   result,
      //   window.location.pathname
      // );

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

describe("Dataset request", () => {
  beforeAll(() => cleanup());
  afterAll(() => cleanup());
  setUserMapId("6ceb943a-2b97-4084-b467-a613a063a477");

  test("Render dataset request component without error", async () => {
    render(
      <Router>
        <DatasetRequestTable />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    let toggleButton = await screen.findByTestId(
      "dataset-requests-receive-and-sent-toggle-test"
    );
    // screen.debug(toggleButton);
    expect(toggleButton).toBeInTheDocument();
  });

  test("All received request and approve it", async () => {
    render(
      <Router>
        <DatasetRequestTable />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    const actionButtonInReceivedRequest = await screen.findByTestId(
      "dataset-request-recevied-approve-btn2-test"
    );
    // Check if action is there in DOM
    expect(actionButtonInReceivedRequest).toBeInTheDocument();

    fireEvent.click(actionButtonInReceivedRequest);

    const tillDateInput = await screen.findByLabelText("Till");

    // screen.debug(tillDateInput);
    fireEvent.change(tillDateInput, { target: { value: "05/10/2023" } });

    const finalApproveButton = await screen.findByTestId(
      "dataset-request-recevied-approve-btn-test"
    );
    // screen.debug(finalApproveButton);
    expect(finalApproveButton).toBeEnabled();
    fireEvent.click(finalApproveButton);

    const approvedBadge = await screen.findByTestId("approved-badge-test");
    screen.debug(approvedBadge);
    expect(approvedBadge).toBeInTheDocument();
  });

  test("Click cancel button while approving dataset access", async () => {
    render(
      <Router>
        <DatasetRequestTable />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    const actionButtonInReceivedRequest = await screen.findByTestId(
      "dataset-request-recevied-approve-btn2-test"
    );
    // Check if action is there in DOM
    expect(actionButtonInReceivedRequest).toBeInTheDocument();

    fireEvent.click(actionButtonInReceivedRequest);

    const tillDateInput = await screen.findByLabelText("Till");

    // screen.debug(tillDateInput);
    fireEvent.change(tillDateInput, { target: { value: "05/10/2023" } });

    const finalApproveButton = await screen.findByTestId(
      "dataset-request-recevied-approve-btn-test"
    );
    // screen.debug(finalApproveButton);
    expect(finalApproveButton).toBeEnabled();
    fireEvent.click(finalApproveButton);

    const approvedBadge = await screen.findByTestId("approved-badge-test");
    screen.debug(approvedBadge);
    expect(approvedBadge).toBeInTheDocument();
  });

  test("Recall approved dataset", async () => {
    render(
      <Router>
        <DatasetRequestTable />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    let actionButtonInReceivedRequest = await screen.findByTestId(
      "dataset-request-recevied-approve-btn2-test"
    );
    // Check if action is there in DOM
    expect(actionButtonInReceivedRequest).toBeInTheDocument();

    fireEvent.click(actionButtonInReceivedRequest);

    const tillDateInput = await screen.findByLabelText("Till");

    // screen.debug(tillDateInput);
    fireEvent.change(tillDateInput, { target: { value: "05/10/2023" } });

    const cancelButton = await screen.findByTestId(
      "dataset-request-recevied-cancel-btn-test"
    );
    expect(cancelButton).toBeEnabled();
    fireEvent.click(cancelButton);
    actionButtonInReceivedRequest = await screen.findByTestId(
      "dataset-request-recevied-approve-btn2-test"
    );
    expect(actionButtonInReceivedRequest).toBeInTheDocument();
  });

  test("Reject received request", async () => {
    render(
      <Router>
        <DatasetRequestTable />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    const actionButtonInReceivedRequest = await screen.findByTestId(
      "dataset-request-recevied-recall-reject-btn-test"
    );

    expect(actionButtonInReceivedRequest).toBeInTheDocument();

    fireEvent.click(actionButtonInReceivedRequest);

    const rejectBadge = await screen.findByTestId(
      "approved_and_reject_test_id"
    );
    console.log(
      "🚀 ~ file: datasetRequest.test.js:82 ~ test ~ rejectBadge:",
      rejectBadge
    );
    expect(rejectBadge).toBeInTheDocument();
  });

  test("Route to details page on click of details", async () => {
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <DatasetRequestTable />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const detailsBtn = await screen.findByTestId("dataset-request-detail-test");
    screen.debug(detailsBtn);
    fireEvent.click(detailsBtn);
    // expect(historyMockPush).toHaveBeenCalled();
    let routed = await customWaitFor(() => {
      console.log(
        "🚀 ~ file: datasetRequest.test.js:184 ~ routed ~ window.location.pathname:",
        window.location.pathname
      );
      if (window.location.pathname.includes("/datahub/new_datasets/view/")) {
        return true;
      }
    });
    // screen.debug(routed);
    expect(routed).toBeTruthy();
  });

  test("Error 500 while getting all request list", () => {
    server.use(
      rest.post(
        `${UrlConstant.base_url}datahub/new_dataset_v2/requested_datasets/`,
        (req, res, ctx) => {
          // console.log("🚀 ~ file: datasetRequestHandler.js:8 ~ req:", req);
          return res(
            ctx.status(500),
            ctx.json({ message: "soomething went wrong!" })
          );
        }
      )
    );
    render(
      <Router>
        <DatasetRequestTable />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });

  test("Error responce on click of reject or approve", async () => {
    server.use(
      rest.patch(
        `${UrlConstant.base_url}datahub/usage_policies/:usagePolicyId/`,
        (req, res, ctx) => {
          //   const { usagePolicyId } = req.params; // Corrected to req.params
          const requestBody = req.body; // Access the request body

          console.log(
            "🚀 ~ file: datasetRequestHandler.js:4312342 ~ rest ~ req.params"
          );
          console.log(
            "🚀 ~ file: datasetRequestHandler.js:521 ~ requestBody:",
            requestBody
          );
          let { approval_status } = requestBody;

          return res(
            ctx.status(400),
            ctx.json({
              approval_status: ["something went worng!"],
            })
          );
        }
      )
    );
    render(
      <Router>
        <DatasetRequestTable />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    const actionButtonInReceivedRequest = await screen.findByTestId(
      "dataset-request-recevied-recall-reject-btn-test"
    );

    expect(actionButtonInReceivedRequest).toBeInTheDocument();

    fireEvent.click(actionButtonInReceivedRequest);

    const rejectBadge = await screen.findByTestId(
      "approved_and_reject_test_id"
    );
    console.log(
      "🚀 ~ file: datasetRequest.test.js:82 ~ test ~ rejectBadge:",
      rejectBadge
    );
    expect(rejectBadge).toBeInTheDocument();
  });

  test("Error responce on click of approve accessibility time", async () => {
    server.use(
      rest.patch(
        `${UrlConstant.base_url}datahub/usage_policies/:usagePolicyId/`,
        (req, res, ctx) => {
          //   const { usagePolicyId } = req.params; // Corrected to req.params
          const requestBody = req.body; // Access the request body

          console.log(
            "🚀 ~ file: datasetRequestHandler.js:4312342 ~ rest ~ req.params"
          );
          console.log(
            "🚀 ~ file: datasetRequestHandler.js:521 ~ requestBody:",
            requestBody
          );
          let { approval_status } = requestBody;

          return res(
            ctx.status(400),
            ctx.json({
              accessibility_time: ["something went worng!"],
            })
          );
        }
      )
    );
    render(
      <Router>
        <DatasetRequestTable />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    const actionButtonInReceivedRequest = await screen.findByTestId(
      "dataset-request-recevied-recall-reject-btn-test"
    );

    expect(actionButtonInReceivedRequest).toBeInTheDocument();

    fireEvent.click(actionButtonInReceivedRequest);

    const rejectBadge = await screen.findByTestId(
      "approved_and_reject_test_id"
    );
    console.log(
      "🚀 ~ file: datasetRequest.test.js:82 ~ test ~ rejectBadge:",
      rejectBadge
    );
    expect(rejectBadge).toBeInTheDocument();
  });

  test("Error 500 responce on click of reject or approve", async () => {
    server.use(
      rest.patch(
        `${UrlConstant.base_url}datahub/usage_policies/:usagePolicyId/`,
        (req, res, ctx) => {
          //   const { usagePolicyId } = req.params; // Corrected to req.params
          const requestBody = req.body; // Access the request body

          console.log(
            "🚀 ~ file: datasetRequestHandler.js:4312342 ~ rest ~ req.params"
          );
          console.log(
            "🚀 ~ file: datasetRequestHandler.js:521 ~ requestBody:",
            requestBody
          );
          let { approval_status } = requestBody;

          return res(
            ctx.status(500),
            ctx.json({
              message: "something went worng!",
            })
          );
        }
      )
    );
    render(
      <Router>
        <DatasetRequestTable />
      </Router>,
      { wrapper: FarmStackProvider }
    );

    const actionButtonInReceivedRequest = await screen.findByTestId(
      "dataset-request-recevied-recall-reject-btn-test"
    );

    expect(actionButtonInReceivedRequest).toBeInTheDocument();

    fireEvent.click(actionButtonInReceivedRequest);

    const rejectBadge = await screen.findByTestId(
      "approved_and_reject_test_id"
    );
    console.log(
      "🚀 ~ file: datasetRequest.test.js:82 ~ test ~ rejectBadge:",
      rejectBadge
    );
    expect(rejectBadge).toBeInTheDocument();
  });
});
