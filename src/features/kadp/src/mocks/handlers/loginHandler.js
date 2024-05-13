import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";

export const loginHandler = [
  rest.post(`${UrlConstant.base_url + UrlConstant.login}`, (req, res, ctx) => {
    console.log("resss", req.body);
    let { email } = req.body;
    if (email == "nilesh@google.org") {
      console.log("🚀 ~ file: verifyEmail.test.js:213 ~ test ~ login:");

      return res(ctx.status(400), ctx.json({ email: ["User not registered"] }));
    }
    return res(
      ctx.status(201),
      ctx.json({
        id: "acc0a9a4-4fba-4d99-aa2e-e98d732c3fd7",
        email: "nilesh@digitalgreen.org",
        message: "Enter the OTP to login",
      })
    );
  }),
  rest.post(`${UrlConstant.base_url}${UrlConstant.otp}`, (req, res, ctx) => {
    console.log("resss body", req.body);
    let { email, otp } = req.body;
    if (otp == "000000") {
      return res(
        ctx.status(400),
        ctx.json({ otp: ["Invalid OTP, remaining attempts left: 2"] })
      );
    }
    if (email == "nilesh+12@digitalgreen.org") {
      return res(
        ctx.status(201),
        res.json({
          user: "81931fc3-ecc8-4d76-b7b2-f8f2a77dc713",
          user_map: "6ceb943a-2b97-4084-b467-a613a063a477",
          org_id: "a506ddcb-4933-40e0-98f6-a3c1fa72a0c6",
          email: "nilesh+12@digitalgreen.org",
          status: true,
          on_boarded: true,
          role: "datahub_co_steward",
          role_id: "6",
          refresh:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5MTE0MzExMywiaWF0IjoxNjkwNTM4MzEzLCJqdGkiOiJjZTllOWNiMDM3ZjY0ZjFmOTY3ODM3MDAxNTU2ZDAxNiIsInVzZXJfaWQiOiI4MTkzMWZjMy1lY2M4LTRkNzYtYjdiMi1mOGYyYTc3ZGM3MTMiLCJvcmdfaWQiOiJhNTA2ZGRjYi00OTMzLTQwZTAtOThmNi1hM2MxZmE3MmEwYzYiLCJtYXBfaWQiOiI2Y2ViOTQzYS0yYjk3LTQwODQtYjQ2Ny1hNjEzYTA2M2E0NzciLCJyb2xlIjoiNiIsIm9uYm9hcmRlZF9ieSI6Ik5vbmUifQ.jgE8PwAPUhAt2955hSnDEYxWc0K40ikz0BI4gf0Iju4",
          access:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkwNjI0NzEzLCJpYXQiOjE2OTA1MzgzMTMsImp0aSI6IjUxNzE3YTYzNWQyYjRiOGU4MmRjNzkzMmFhYzUzNDFiIiwidXNlcl9pZCI6IjgxOTMxZmMzLWVjYzgtNGQ3Ni1iN2IyLWY4ZjJhNzdkYzcxMyIsIm9yZ19pZCI6ImE1MDZkZGNiLTQ5MzMtNDBlMC05OGY2LWEzYzFmYTcyYTBjNiIsIm1hcF9pZCI6IjZjZWI5NDNhLTJiOTctNDA4NC1iNDY3LWE2MTNhMDYzYTQ3NyIsInJvbGUiOiI2Iiwib25ib2FyZGVkX2J5IjoiTm9uZSJ9.EbC9hRhVhghNZJy5SOy8as5SMPexuxC5bZ1_8mjHKug",
          message: "Successfully logged in!",
        })
      );
    } else if (email == "nilesh+13@digitalgreen.org") {
      return res(
        ctx.status(201),
        ctx.json({
          user: "9dcc8577-a7b0-4c01-b576-0fe77abe2738",
          user_map: "374056bd-5d5c-4bfa-8d2e-5b16af757342",
          org_id: "ccf85389-95e1-4d79-afbd-328038df667f",
          email: "nilesh+13@digitalgreen.org",
          status: true,
          on_boarded: true,
          role: "datahub_participant_root",
          role_id: "3",
          refresh:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5MTE0MzM5MCwiaWF0IjoxNjkwNTM4NTkwLCJqdGkiOiIwZWE3N2QwMjAwZGQ0OTZiOWU5OWMzNDNkNTM0MzU3NyIsInVzZXJfaWQiOiI5ZGNjODU3Ny1hN2IwLTRjMDEtYjU3Ni0wZmU3N2FiZTI3MzgiLCJvcmdfaWQiOiJjY2Y4NTM4OS05NWUxLTRkNzktYWZiZC0zMjgwMzhkZjY2N2YiLCJtYXBfaWQiOiIzNzQwNTZiZC01ZDVjLTRiZmEtOGQyZS01YjE2YWY3NTczNDIiLCJyb2xlIjoiMyIsIm9uYm9hcmRlZF9ieSI6IjgxOTMxZmMzLWVjYzgtNGQ3Ni1iN2IyLWY4ZjJhNzdkYzcxMyJ9.BwJilca0kdrdrJDIzoqHXwllLDKUIMtzqyhsoL9XhBw",
          access:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkwNjI0OTkwLCJpYXQiOjE2OTA1Mzg1OTAsImp0aSI6IjgzZTBmZmNmY2IyMTQ0OTQ5NGNmYzJkMzhlNDM0MDkzIiwidXNlcl9pZCI6IjlkY2M4NTc3LWE3YjAtNGMwMS1iNTc2LTBmZTc3YWJlMjczOCIsIm9yZ19pZCI6ImNjZjg1Mzg5LTk1ZTEtNGQ3OS1hZmJkLTMyODAzOGRmNjY3ZiIsIm1hcF9pZCI6IjM3NDA1NmJkLTVkNWMtNGJmYS04ZDJlLTViMTZhZjc1NzM0MiIsInJvbGUiOiIzIiwib25ib2FyZGVkX2J5IjoiODE5MzFmYzMtZWNjOC00ZDc2LWI3YjItZjhmMmE3N2RjNzEzIn0.jsk_1haPbc8ngK-I_-C3kNZiFkDS5ezmQCMXLugaUek",
          message: "Successfully logged in!",
        })
      );
    } else {
      return res(
        ctx.status(201),
        ctx.json({
          user: "acc0a9a4-4fba-4d99-aa2e-e98d732c3fd7",
          user_map: "d7a59916-8824-4bba-bb8e-dbf3ee9f1ac8",
          org_id: "5158bc4e-cdf5-466a-b491-d1a94894638a",
          email: "nilesh@digitalgreen.org",
          status: true,
          on_boarded: true,
          role: "datahub_admin",
          role_id: "1",
          refresh:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5MTEzMTU1NSwiaWF0IjoxNjkwNTI2NzU1LCJqdGkiOiIzZGZmNWE2NzdhYTg0YzNhOGExMDMyOTQ3MTdlZjQzZSIsInVzZXJfaWQiOiJhY2MwYTlhNC00ZmJhLTRkOTktYWEyZS1lOThkNzMyYzNmZDciLCJvcmdfaWQiOiI1MTU4YmM0ZS1jZGY1LTQ2NmEtYjQ5MS1kMWE5NDg5NDYzOGEiLCJtYXBfaWQiOiJkN2E1OTkxNi04ODI0LTRiYmEtYmI4ZS1kYmYzZWU5ZjFhYzgiLCJyb2xlIjoiMSIsIm9uYm9hcmRlZF9ieSI6Ik5vbmUifQ.FEnTst4t-Vyb8huUXd30ISZjU4CWKJBhPAoqyyjTxxw",
          access:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkwNjEzMTU1LCJpYXQiOjE2OTA1MjY3NTUsImp0aSI6Ijg3M2VlOTg0OTVlZTQ3YWY5NTdmYzU1NDQ2OWYxZDllIiwidXNlcl9pZCI6ImFjYzBhOWE0LTRmYmEtNGQ5OS1hYTJlLWU5OGQ3MzJjM2ZkNyIsIm9yZ19pZCI6IjUxNThiYzRlLWNkZjUtNDY2YS1iNDkxLWQxYTk0ODk0NjM4YSIsIm1hcF9pZCI6ImQ3YTU5OTE2LTg4MjQtNGJiYS1iYjhlLWRiZjNlZTlmMWFjOCIsInJvbGUiOiIxIiwib25ib2FyZGVkX2J5IjoiTm9uZSJ9.H8awHgz7lX_18f4LeMjKvMUfLFAzC6MrsrVKMSzuYxA",
          message: "Successfully logged in!",
        })
      );
    }
  }),
  rest.post(
    `${UrlConstant.base_url}${UrlConstant.resend_otp}`,
    (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({
          id: "acc0a9a4-4fba-4d99-aa2e-e98d732c3fd7",
          email: "nilesh@digitalgreen.org",
          message: "Enter the resent OTP to login",
        })
      );
    }
  ),
];
