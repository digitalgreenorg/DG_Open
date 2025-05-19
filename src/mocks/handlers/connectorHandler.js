import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";
import { getUserLocal, isLoggedInUserCoSteward } from "../../Utils/Common";
import getAllOrgList, {
  getAllColumnList,
  getAllDatasetList,
  getAllFileList,
  getAlreadySavedConnectorData,
  getIntegratedResponse,
  getPatchedConnectorData,
  getSaveConnectorData,
} from "../controllers/connector.controller";

const getValuesOfSearchParams = (searchParams) => {
  // Accessing the "user" value
  const user = searchParams.get("user");

  // Accessing the "co_steward" value and converting it to a boolean if needed
  const coSteward = searchParams.get("co_steward");
  const page = searchParams.get("page");
  const org_id = searchParams.get("org_id");
  const isCoSteward = coSteward === "true";
  return { user, isCoSteward, page, org_id };
};

export const connectorHandler = [
  //writing the api end points and responses in positive flow.
  // NOTE: To fail the api response and api are written at block level in the test file itself
  rest.get(
    UrlConstant.base_url + UrlConstant.list_of_connectors,
    (req, res, ctx) => {
      //taking out user, isCosteward and page param
      const { user, isCoSteward, page } = getValuesOfSearchParams(
        req.url.searchParams
      );
      return res(
        ctx.status(200),
        ctx.json({
          count: 10,
          next:
            page == 2
              ? null
              : `https://datahubethdev.farmstack.co/be/connectors/?co_steward=${isCoSteward}&page=${2}&user=${user}`,
          previous: null,
          results: [
            {
              id: "cba5da10-189d-42c5-85d6-02b14ec79a29",
              dataset_count: 2,
              providers_count: 1,
              created_at: "2023-07-26T10:01:40.447090Z",
              updated_at: "2023-07-26T10:01:40.447117Z",
              name: "first",
              description: "wergthyjgw",
              integrated_file: "/media/media/connectors/first.csv",
              status: true,
              config: { renames: {}, selected: [] },
              user: user,
            },
            {
              id: "a4cc505b-9724-489f-ba58-960a491ebed5",
              dataset_count: 2,
              providers_count: 1,
              created_at: "2023-05-02T08:06:09.059170Z",
              updated_at: "2023-07-25T05:28:27.051715Z",
              name: "random",
              description: "random11212",
              integrated_file: "/media/media/connectors/random.csv",
              status: true,
              config: {
                renames: { id: "ID", first_name: "First name" },
                selected: ["id", "first_name", "id_df1"],
              },
              user: user,
            },
            {
              id: "173dfb09-0ee0-473d-9c59-423ca778f94e",
              dataset_count: 6,
              providers_count: 1,
              created_at: "2023-07-21T07:41:40.745109Z",
              updated_at: "2023-07-24T09:57:52.157764Z",
              name: "testing123",
              description: "testing123a",
              integrated_file: "/media/media/connectors/testing123.csv",
              status: true,
              config: {},
              user: user,
            },
            {
              id: "35088757-f0ee-4068-81a9-d88decae5c4d",
              dataset_count: 2,
              providers_count: 1,
              created_at: "2023-05-22T12:35:21.726948Z",
              updated_at: "2023-07-20T15:09:53.538190Z",
              name: "sadada",
              description: "jbkjbkbkjas",
              integrated_file: "/media/media/connectors/sadada.csv",
              status: true,
              config: { renames: {}, selected: [] },
              user: user,
            },
            {
              id: "4bdd0f46-1bdc-4567-81d7-905d1298745d",
              dataset_count: 2,
              providers_count: 1,
              created_at: "2023-07-20T10:16:19.876353Z",
              updated_at: "2023-07-20T12:42:53.972168Z",
              name: "newwwww1",
              description: "descccc1",
              integrated_file: "/media/media/connectors/newwwww1.csv",
              status: true,
              config: { renames: {}, selected: [] },
              user: user,
            },
          ],
        })
      );
    }
  ),

  //for add mode all the api having crud operation
  // for getting org list ==> url = UrlConstant.base_url + UrlConstant.get_org_name_list
  // url = https://datahubethdev.farmstack.co/be/datahub/dataset_ops/organization/
  rest.get(
    UrlConstant.base_url + UrlConstant.get_org_name_list,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(getAllOrgList()));
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.get_dataset_name_list,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(getAllDatasetList()));
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.get_files_for_selected_datasets,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(getAllFileList()));
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.get_columns_for_selected_files,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(getAllColumnList()));
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.joining_the_table,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(getIntegratedResponse()));
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.integration_connectors,
    (req, res, ctx) => {
      // const { connectorId } = req.params;
      console.log(req.params);
      return res(ctx.status(200), ctx.json(getSaveConnectorData()));
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.integration_connectors + ":connectorId",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(getAlreadySavedConnectorData()));
    }
  ),
  rest.post(
    UrlConstant.base_url + "connectors/patch_config/",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(getPatchedConnectorData()));
    }
  ),
];
