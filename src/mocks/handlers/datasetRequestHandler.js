import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";

export const datasetRequestHandler = [
  rest.post(
    `${UrlConstant.base_url}datahub/new_dataset_v2/requested_datasets/`,
    (req, res, ctx) => {
      // console.log("🚀 ~ file: datasetRequestHandler.js:8 ~ req:", req);
      return res(
        ctx.status(200),
        ctx.json({
          sent: [
            {
              approval_status: "requested",
              updated_at: "2023-08-01T01:50:27.476157Z",
              accessibility_time: null,
              dataset_id: "6a697b90-d153-4979-8580-541aaad92243",
              dataset_name: "privet dataset w2",
              file_name: "Copy_of_Saharapada_FPC_Members_1.xlsx",
              organization_name: "nilesh+13@digitalgreen.org",
              organization_email: "nilesh13@digitalgreen.org",
            },
          ],
          recieved: [
            {
              id: "252ff7eb-5b03-41fd-918e-e0fdc0ed9e3a",
              approval_status: "requested",
              accessibility_time: null,
              updated_at: "2023-08-01T01:52:46.934827Z",
              dataset_id: "41f883c7-ae19-4173-b7b9-9ad655655dd3",
              dataset_name: "privet dataset test",
              file_name: "Copy_of_Saharapada_FPC_Members_1.xlsx",
              organization_name: "nilesh+13@digitalgreen.org",
              organization_email: "nilesh13@digitalgreen.org",
            },
          ],
        })
      );
    }
  ),
  rest.patch(
    `${UrlConstant.base_url}datahub/usage_policies/:usagePolicyId/`,
    (req, res, ctx) => {
      const { usagePolicyId } = req.params; // Corrected to req.params
      const requestBody = req.body; // Access the request body

      console.log(
        "🚀 ~ file: datasetRequestHandler.js:43 ~ rest ~ req.params:",
        req.params,
        usagePolicyId,
        requestBody
      );
      console.log(
        "🚀 ~ file: datasetRequestHandler.js:52 ~ requestBody:",
        requestBody
      );
      let { approval_status } = requestBody;
      if (approval_status == "approved") {
        return res(
          ctx.status(200),
          ctx.json({
            id: "4918e734-0994-4a67-aa67-17dd7e69e02a",
            created_at: "2023-08-04T07:54:02.283679Z",
            updated_at: "2023-08-04T07:54:32.150959Z",
            approval_status: "approved",
            accessibility_time: "2023-08-11",
            user_organization_map: "374056bd-5d5c-4bfa-8d2e-5b16af757342",
            dataset_file: "536aff16-b18c-41c3-8c1d-5a5a7c279288",
          })
        );
      }
      if (approval_status == "rejected") {
        return res(
          ctx.status(200),
          ctx.json({
            id: "98258a82-1867-4f0d-a6ed-df198d71acc7",
            created_at: "2023-08-04T07:25:01.788578Z",
            updated_at: "2023-08-04T07:53:18.687332Z",
            approval_status: "rejected",
            accessibility_time: "2023-08-05",
            user_organization_map: "374056bd-5d5c-4bfa-8d2e-5b16af757342",
            dataset_file: "536aff16-b18c-41c3-8c1d-5a5a7c279288",
          })
        );
      }
      return res(ctx.status(200), ctx.json());
    }
  ),
];
