import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";

const getBaseUrl = () => {
  return process.env.REACT_APP_BASEURL;
};

export const legalHandler = [
  rest.get(
    `${UrlConstant.base_url}${UrlConstant.microsite_get_policy}`,
    (req, res, ctx) => {
      console.log("get policy api");
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: "d0a73d78-0962-45b1-ab51-6701ac23a1b8",
            created_at: "2023-07-24T06:48:27.935860Z",
            updated_at: "2023-07-24T06:48:27.935887Z",
            name: "Sample policy",
            description: "<p>hi policy.</p>",
            file: "https://datahubethdev.farmstack.co/media/media/policy/GIT_Practices..pdf",
          },
          {
            id: "6c35f01c-2d0b-4b45-b50d-5d1beb0ca970",
            created_at: "2023-07-24T09:33:37.923603Z",
            updated_at: "2023-07-24T09:33:37.923630Z",
            name: "dafs",
            description: "<p><br></p>",
            file: "https://datahubethdev.farmstack.co/media/media/policy/GIT_Practices._75RWtuf.pdf",
          },
        ])
      );
    }
  ),
  // rest.get(`${getBaseUrl}policy_file`, (req, res, ctx) => {
  //   // Replace 'policy-file.pdf' with the expected file name
  //   const fileName = "Users/nilesh/Downloads/GIT_Practices.%20(1).pdf";
  //   const fileContent = "File content goes here"; // Replace with the actual file content
  //   return res(
  //     ctx.status(200),
  //     ctx.set("Content-Disposition", `attachment; filename="${fileName}"`),
  //     ctx.text(fileContent)
  //   );
  // }),
];
