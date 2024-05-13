// login.test.js
import React from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; // Make sure to import the appropriate Router based on your setup
import VerifyEmailStep from "../../Components/NewOnboarding/VerifyEmail";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/dom";
import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";
import { server } from "../../mocks/server";

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

function customWait(fun, option = { time: 2000 }) {
  const { time } = option;
  setTimeout(fun, time);
}

describe("Login component", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());
  test("Render Login without error", () => {
    render(
      <Router>
        <VerifyEmailStep />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });

  // test("error 500 while login", async () => {
  //   server.use(
  //     rest.post(
  //       `${UrlConstant.base_url}${UrlConstant.login}`,
  //       (req, res, ctx) => {
  //         console.log("🚀 ~ file: verifyEmail.test.js:364 ~ test ~ req:", req);

  //         return res(
  //           ctx.status(500),
  //           ctx.json({
  //             message: "Internal Server Error.",
  //           })
  //         );
  //       }
  //     )
  //   );
  //   render(
  //     <Router>
  //       <VerifyEmailStep />
  //     </Router>,
  //     { wrapper: FarmStackProvider }
  //   );
  //   const emailInput = await screen.findByPlaceholderText(/Enter mail id/i);
  //   fireEvent.change(emailInput, {
  //     target: { value: "nilesh@digitalgreen.org" },
  //   });
  //   // Click and accept term and condition
  //   const termsAndCondition = screen.getByTestId(
  //     "login-agree-terms-and-condition-check-box-test"
  //   );
  //   const checkbox = termsAndCondition.querySelector("input");
  //   fireEvent.click(checkbox);
  //   console.log(
  //     "🚀 ~ file: verifyEmail.test.js:96 ~ routed ~ window.location.pathname:",
  //     window.location.pathname
  //   );
  //   // Press enter button in keyboard to get otp
  //   const submitButton = screen.getByTestId("send-otp-btn-test");
  //   expect(submitButton).toBeEnabled();
  //   fireEvent.keyDown(emailInput, { key: "Enter", code: 13, charCode: 13 });
  //   let routed = await customWaitFor(() => {
  //     console.log(
  //       "🚀 ~ file: verifyEmail.test.js:393 ~ routed ~ window.location.pathname:",
  //       window.location.pathname
  //     );
  //     if (window.location.pathname === "/error/500") {
  //       return true;
  //     }
  //   });
  //   if (routed) {
  //     expect(window.location.pathname).toBe("/error/500");
  //   }
  // });

  test("Enter email and click submit and enter opt and verify", async () => {
    render(
      <Router>
        <VerifyEmailStep />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const emailInput = await screen.findByPlaceholderText(/Enter mail id/i);
    fireEvent.change(emailInput, {
      target: { value: "nilesh@digitalgreen.org" },
    });
    // Click and accept term and condition
    const termsAndCondition = screen.getByTestId(
      "login-agree-terms-and-condition-check-box-test"
    );
    const checkbox = termsAndCondition.querySelector("input");
    fireEvent.click(checkbox);

    // Click on Send Otp button
    const submitButton = screen.getByTestId("send-otp-btn-test");
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);
    // Enter OTP
    const otpInput = await screen.findByPlaceholderText(/Enter 6 digit OTP/i);
    screen.debug(otpInput);
    expect(otpInput).toBeEnabled();
    // Click on submit after entering otp
    fireEvent.change(otpInput, { target: { value: "123456" } });
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);
    // check if user login and routed currectly
    let route = await customWaitFor(() => {
      if (window.location.pathname == "/datahub/new_datasets") {
        return true;
      }
    });
    expect(window.location.pathname).toBe("/datahub/new_datasets");
  });

  test("Click enter in keyboard", async () => {
    render(
      <Router>
        <VerifyEmailStep />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const emailInput = await screen.findByPlaceholderText(/Enter mail id/i);
    fireEvent.change(emailInput, {
      target: { value: "nilesh@digitalgreen.org" },
    });
    // Click and accept term and condition
    const termsAndCondition = screen.getByTestId(
      "login-agree-terms-and-condition-check-box-test"
    );
    const checkbox = termsAndCondition.querySelector("input");
    fireEvent.click(checkbox);

    // Press enter button in keyboard to get otp
    const submitButton = screen.getByTestId("send-otp-btn-test");
    expect(submitButton).toBeEnabled();
    fireEvent.keyDown(emailInput, { key: "Enter", code: 13, charCode: 13 });
    console.log("waiting for the page");

    // Enter OTP
    const otpInput = await screen.findByPlaceholderText(/Enter 6 digit OTP/i);
    screen.debug(otpInput);
    expect(otpInput).toBeEnabled();
    // Press enter to submit otp
    fireEvent.change(otpInput, { target: { value: "123456" } });
    expect(submitButton).toBeEnabled();
    fireEvent.keyDown(emailInput, { key: "Enter", code: 13, charCode: 13 });
    // check if user login and routed currectly
    let route = await customWaitFor(() => {
      if (window.location.pathname == "/datahub/new_datasets") {
        return true;
      }
    });
    expect(window.location.pathname).toBe("/datahub/new_datasets");
  });
  test("Route after successfully otp verifiaction for co-steward", async () => {
    render(
      <Router>
        <VerifyEmailStep />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const emailInput = await screen.findByPlaceholderText(/Enter mail id/i);
    fireEvent.change(emailInput, {
      target: { value: "nilesh+12@digitalgreen.org" },
    });
    // Click and accept term and condition
    const termsAndCondition = screen.getByTestId(
      "login-agree-terms-and-condition-check-box-test"
    );
    const checkbox = termsAndCondition.querySelector("input");
    fireEvent.click(checkbox);

    // Press enter button in keyboard to get otp
    const submitButton = screen.getByTestId("send-otp-btn-test");
    expect(submitButton).toBeEnabled();
    fireEvent.keyDown(emailInput, { key: "Enter", code: 13, charCode: 13 });
    console.log("waiting for the page");

    // Enter OTP
    const otpInput = await screen.findByPlaceholderText(/Enter 6 digit OTP/i);
    screen.debug(otpInput);
    expect(otpInput).toBeEnabled();
    // Press enter to submit otp
    fireEvent.change(otpInput, { target: { value: "123456" } });
    expect(submitButton).toBeEnabled();
    fireEvent.keyDown(emailInput, { key: "Enter", code: 13, charCode: 13 });
    // check if user login and routed currectly
    let route = await customWaitFor(() => {
      if (window.location.pathname == "/datahub/new_datasets") {
        return true;
      }
    });
    expect(window.location.pathname).toBe("/datahub/new_datasets");
  });
  test("Route after successfully otp verifiaction for participant", async () => {
    render(
      <Router>
        <VerifyEmailStep />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const emailInput = await screen.findByPlaceholderText(/Enter mail id/i);
    fireEvent.change(emailInput, {
      target: { value: "nilesh+13@digitalgreen.org" },
    });
    // Click and accept term and condition
    const termsAndCondition = screen.getByTestId(
      "login-agree-terms-and-condition-check-box-test"
    );
    const checkbox = termsAndCondition.querySelector("input");
    fireEvent.click(checkbox);

    // Press enter button in keyboard to get otp
    const submitButton = screen.getByTestId("send-otp-btn-test");
    expect(submitButton).toBeEnabled();
    fireEvent.keyDown(emailInput, { key: "Enter", code: 13, charCode: 13 });
    console.log("waiting for the page");

    // Enter OTP
    const otpInput = await screen.findByPlaceholderText(/Enter 6 digit OTP/i);
    screen.debug(otpInput);
    expect(otpInput).toBeEnabled();
    // Press enter to submit otp
    fireEvent.change(otpInput, { target: { value: "123456" } });
    expect(submitButton).toBeEnabled();
    fireEvent.keyDown(emailInput, { key: "Enter", code: 13, charCode: 13 });
    // check if user login and routed currectly
    let route = await customWaitFor(() => {
      if (window.location.pathname == "/participant/new_datasets") {
        return true;
      }
    });
    expect(window.location.pathname).toBe("/participant/new_datasets");
  });
  test("Unregisterd email error", async () => {
    render(
      <Router>
        <VerifyEmailStep />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const emailInput = await screen.findByPlaceholderText(/Enter mail id/i);
    fireEvent.change(emailInput, {
      target: { value: "nilesh@google.org" },
    });
    // Click and accept term and condition
    const termsAndCondition = screen.getByTestId(
      "login-agree-terms-and-condition-check-box-test"
    );
    const checkbox = termsAndCondition.querySelector("input");
    fireEvent.click(checkbox);

    // Press enter button in keyboard to get otp
    const submitButton = screen.getByTestId("send-otp-btn-test");
    expect(submitButton).toBeEnabled();
    fireEvent.keyDown(emailInput, { key: "Enter", code: 13, charCode: 13 });
    console.log("waiting for the page");

    // Check if error shown
    // let emailInputEle = screen.getByTestId("email_id_for_login_test")
    // const errorPTag = emailInputEle.querySelector("p")
    let errorText = await screen.findByText(/User not registered/i);
    screen.debug(errorText);
    expect(errorText).toBeEnabled();
  });

  test("Wrong otp error", async () => {
    // server.use(
    //   rest.post(`${UrlConstant.base_url}${UrlConstant.otp}`, () => {
    //     console.log("error 401");
    //     return rest(
    //       ctx.status(400),
    //       ctx.status({ otp: "Invalid OTP, remaining attempts left: 2" })
    //     );
    //   })
    // );
    render(
      <Router>
        <VerifyEmailStep />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const emailInput = await screen.findByPlaceholderText(/Enter mail id/i);
    fireEvent.change(emailInput, {
      target: { value: "nilesh403@google.org" },
    });
    // Click and accept term and condition
    const termsAndCondition = screen.getByTestId(
      "login-agree-terms-and-condition-check-box-test"
    );
    const checkbox = termsAndCondition.querySelector("input");
    fireEvent.click(checkbox);

    // Press enter button in keyboard to get otp
    const submitButton = screen.getByTestId("send-otp-btn-test");
    expect(submitButton).toBeEnabled();
    fireEvent.keyDown(emailInput, { key: "Enter", code: 13, charCode: 13 });
    console.log("waiting for the page");

    // Check if error shown
    // let emailInputEle = screen.getByTestId("email_id_for_login_test")
    // const errorPTag = emailInputEle.querySelector("p")
    // Enter OTP
    const otpInput = await screen.findByPlaceholderText(/Enter 6 digit OTP/i);
    screen.debug(otpInput);
    expect(otpInput).toBeEnabled();
    // Press enter to submit otp
    fireEvent.change(otpInput, { target: { value: "000000" } });
    expect(submitButton).toBeEnabled();
    fireEvent.keyDown(emailInput, { key: "Enter", code: 13, charCode: 13 });

    // Check error shown on screen
    let errorText = await screen.findByText(
      /Invalid OTP, remaining attempts left: 2/i
    );
    screen.debug(errorText);
    expect(errorText).toBeEnabled();
  });
  // resend otp button should be visible after 120 second
  test("resend otp after 120 sec", async () => {
    // jest.useFakeTimers();
    render(
      <Router>
        <VerifyEmailStep timer={3} />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const emailInput = await screen.findByPlaceholderText(/Enter mail id/i);
    fireEvent.change(emailInput, {
      target: { value: "nilesh@digitalgreen.org" },
    });
    // Click and accept term and condition
    const termsAndCondition = screen.getByTestId(
      "login-agree-terms-and-condition-check-box-test"
    );
    const checkbox = termsAndCondition.querySelector("input");
    fireEvent.click(checkbox);

    // Press enter button in keyboard to get otp
    const submitButton = screen.getByTestId("send-otp-btn-test");
    expect(submitButton).toBeEnabled();
    fireEvent.keyDown(emailInput, { key: "Enter", code: 13, charCode: 13 });
    // Finding resend button
    const resendOtpButton = await screen.findByTestId("resend-otp-button-test");
    screen.debug(resendOtpButton);
    fireEvent.click(resendOtpButton);
    let date = new Date();
    console.log("date...1", date.getMinutes(), date.getSeconds());
    let waitFor2Sec = customWait(async () => {
      return true;
    });
    console.log("date...2", date.getMinutes(), date.getSeconds());

    if (waitFor2Sec) {
      const resendOtpButton2 = await screen.findByTestId(
        "resend-otp-button-test"
      );
      expect(resendOtpButton2).toBeUndefined();
    }
  });
});
