import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";

const savedDatapoint = [
  {
    id: "8d098de5-2178-4fb9-a257-d9d09a5707ab",
    datapoint_category: "sofshdj",
    datapoint_description: "ddf",
    datapoint_attributes: {
      "red chilli": "",
      "blue chilli": "",
      "pink chilli": "",
      "green chilli": "",
    },
  },
  {
    id: "8d098de5-2178-4fb9-a257-d9d09a5745ab",
    datapoint_category: "Georgopol",
    datapoint_description: "PochdsfdankiGatka",
    datapoint_attributes: {},
  },
];

export const settingHandler = [
  rest.get(
    UrlConstant.base_url + UrlConstant.datahub_policy,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: "d17263d0-b9a3-4f50-bd75-66d000eeda4c",
            created_at: "2023-07-14T11:23:36.506894Z",
            updated_at: "2023-07-14T11:23:36.506921Z",
            name: "jiohujgvbv",
            description: "<p>kojilkbhv</p>",
            file: null,
          },
          {
            id: "d17263d0-b9a3-4f50-bd75-66d000eedane",
            created_at: "2023-07-14T11:23:36.506894Z",
            updated_at: "2023-07-14T11:23:36.506921Z",
            name: "kanhaiya",
            description: "<p>dsghvj</p>",
            file: null,
          },
        ])
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.datahub_policy,
    (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({
          id: "d17263d0-b9a3-4f50-bd75-66d000eeda4c",
          created_at: "2023-07-14T11:23:36.506894Z",
          updated_at: "2023-07-14T11:23:36.506921Z",
          name: "kannu",
          description: "",
          file: null,
        })
      );
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.standardization_get_data,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(savedDatapoint));
    }
  ),
  rest.put(
    UrlConstant.base_url + UrlConstant.standardization_update_data,
    (req, res, ctx) => {
      return res(ctx.status(201), ctx.json({}));
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.standardization_update_data,
    (req, res, ctx) => {
      return res(ctx.status(201), ctx.json({}));
    }
  ),
  rest.post(`${UrlConstant.base_url}token/refresh/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access: "refreshed token",
      })
    );
  }),
  rest.post(
    UrlConstant.base_url + UrlConstant.standardization_post_data,
    (req, res, ctx) => {
      return res(ctx.status(201), ctx.json({}));
    }
  ),
  rest.post(UrlConstant.base_url + UrlConstant.onboarded, (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({}));
  }),
];
