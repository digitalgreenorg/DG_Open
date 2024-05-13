import { rest } from "msw";

function accessTokenFail(req, res, ctx) {
  return res(
    ctx.status(401),
    ctx.json({
      code: "token_not_valid",
      access: "Given token not valid for any token type",
      messages: [
        {
          token_class: "AccessToken",
          token_type: "access",
          message: "Token is invalid or expired",
        },
      ],
      0: {
        token_class: "AccessToken",
        token_type: "access",
        message: "Token is invalid or expired",
      },
    })
  );
}

const settingController = {
  accessTokenFail,
};

export default settingController;
