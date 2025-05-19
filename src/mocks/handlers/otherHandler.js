import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";

export const otherHandler = [
  // pass your url in the first parameter
  //   rest.get(
  //     UrlConstant.base_url + UrlConstant.datahub_policy,
  //     (req, res, ctx) => {
  //       return res(ctx.status(200), ctx.json([]));
  //     }
  //   ),
];
