export default function getAllOrgList() {
  return [
    {
      name: "C4GT",
      org_id: "3a73a202-ffc8-4473-998a-53817624d963",
      org_description: null,
    },
    {
      name: "dg@digitalgreen.org",
      org_id: "0b5c0fd0-906d-4392-9d5d-d99ca6140dd2",
      org_description: "<p>adfsgdgfd</p>",
    },
    {
      name: "Digital green",
      org_id: "5c6d28fb-8603-417c-95db-ecf2e85f4f07",
      org_description:
        "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices.",
    },
    {
      name: "weaseempasha+part@digitalgreen.org",
      org_id: "49b4dac6-ea23-4836-9ced-29423525e221",
      org_description: null,
    },
    {
      name: "DG",
      org_id: "bc29075a-2233-497e-b1b1-1b72f50bac19",
      org_description: "kkkkkkkk",
    },
    {
      name: "Akshata Naik",
      org_id: "444ea608-5dac-4ea5-8ee0-2b197eac519d",
      org_description: "dfghjk",
    },
    {
      name: "ekta org",
      org_id: "03c12179-8787-4ae3-9c93-12593808e7b5",
      org_description: "ok bye",
    },
    {
      name: "Digital Green",
      org_id: "35c67860-b417-46a0-ac2c-ae0f40599d27",
      org_description: null,
    },
    {
      name: "nilesh+participant",
      org_id: "2e7c48b3-4ca0-4d8a-a8af-0d69d99011f0",
      org_description: "dfgfdg",
    },
    {
      name: "Hapat",
      org_id: "ec721448-432a-494e-8ca4-aa0b6f4ea804",
      org_description: "Crazy",
    },
    {
      name: "dg",
      org_id: "5158bc4e-cdf5-466a-b491-d1a94894638a",
      org_description: "ffgdgfdgdfgdgdfsbfdfsg",
    },
    {
      name: "SHRU. orggggg",
      org_id: "9394faac-0910-4027-9e3d-cea8425f3cb3",
      org_description: "dfghjk",
    },
    {
      name: "new org",
      org_id: "ac35763e-bfce-4bf8-bb26-3c98616600b6",
      org_description: "kjhkhkhkhkj",
    },
  ];
}
export function getAllDatasetList() {
  return [
    {
      name: "Americ data check",
      id: "074a16f7-9886-4461-ab7f-96efc77f17cb",
      org_name: "Digital green",
    },
    {
      name: "Anku",
      id: "4b5cef43-1789-473c-ad12-7d98a5a35b9f",
      org_name: "Digital green",
    },
    {
      name: "api",
      id: "0f5f9c91-7cb5-4d93-8acf-c2ebf65672da",
      org_name: "Digital green",
    },
    {
      name: "aswaESDFGBQWERFGW2ERFRF",
      id: "887339ba-e3c3-497f-9ef4-d63ae6fddc46",
      org_name: "Digital green",
    },
    {
      name: "Connector test",
      id: "c50f2cc1-9286-4ea6-a390-885c59ed94d7",
      org_name: "Digital green",
    },
    {
      name: "gautam",
      id: "bdf11d59-8d71-4309-9396-e190831b2563",
      org_name: "Digital green",
    },
    {
      name: "hchfvghvhjsgvajhsvjavsjavjsvajsvjhav",
      id: "b11ae922-c09a-4e92-ac91-f79fd765fcee",
      org_name: "Digital green",
    },
    {
      name: "hgfxdzsfxgch",
      id: "135c23cc-60df-477e-919c-209c55e6c58d",
      org_name: "Digital green",
    },
    {
      name: "Nilesh",
      id: "f5dd28f3-c701-4730-b1ec-5a108474cf3b",
      org_name: "Digital green",
    },
    {
      name: "Productivity",
      id: "7945a986-22cd-4134-aefc-61563d3d032b",
      org_name: "Digital green",
    },
    {
      name: "Sohit",
      id: "16857b3d-e1e8-4168-ac39-3eeffadf0058",
      org_name: "Digital green",
    },
    {
      name: "testtte",
      id: "82a1d832-46ae-4985-af6c-18882373366d",
      org_name: "Digital green",
    },
    {
      name: "ugesh",
      id: "48aa9463-a2aa-4c2d-9ff9-28061ef34c1d",
      org_name: "Digital green",
    },
    {
      name: "Waseem11",
      id: "3a9c4318-3187-4237-8562-6256a4d338a7",
      org_name: "Digital green",
    },
    {
      name: "xsdcfv",
      id: "4a101c44-3c9a-446c-91a0-1ec38b447453",
      org_name: "Digital green",
    },
  ];
}
export function getAllFileList() {
  return [
    {
      id: "cb74a07e-8319-4cb6-96e7-43d813629cf6",
      dataset: "c50f2cc1-9286-4ea6-a390-885c59ed94d7",
      standardised_file: "Connector test/file/demo1234.csv",
      dataset_name: "Connector test",
      file_name: "demo1234.csv",
    },
  ];
}
export function getAllColumnList() {
  return {
    "Connector test/file/demo1234.csv": [
      "name",
      "age_x",
      "age_y",
      "age_x.1",
      "age_y.1",
    ],
    id: "cb74a07e-8319-4cb6-96e7-43d813629cf6",
  };
}
export function getIntegratedResponse() {
  return {
    integrated_file: "media/temp/connectors/first.csv",
    data: {
      schema: {
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "age_x",
            type: "number",
          },
          {
            name: "age_x_df1",
            type: "number",
          },
        ],
        pandas_version: "1.4.0",
      },
      data: [
        {
          name: "kanhaiya",
          age_x: 12.0,
          age_x_df1: 12.0,
        },
        {
          name: "ugesh",
          age_x: 11.0,
          age_x_df1: 11.0,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
        {
          name: null,
          age_x: null,
          age_x_df1: null,
        },
      ],
    },
    no_of_records: 5764803,
  };
}
export function getSaveConnectorData(connectorId) {
  return {
    id: "19d3c6b4-fe49-4f86-8ff9-c3a34860afc3",
    name: "fgdvscaxz",
    description: "fdvscaxz",
    integrated_file: null,
    status: true,
    config: {
      renames: {},
      selected: [],
    },
    user: "0f76cb90-2394-499b-9b60-bf4cad3751a4",
  };
}
export function getAlreadySavedConnectorData() {
  return {
    id: "19d3c6b4-fe49-4f86-8ff9-c3a34860afc3",
    maps: [
      {
        id: "bf6f80de-8407-4c97-a3d4-ea60df583e30",
        left_dataset_file: {
          id: "cb74a07e-8319-4cb6-96e7-43d813629cf6",
          dataset: {
            name: "Connector test",
            description: "fbdsa",
            user_map: {
              id: "a4afc139-5829-49a4-8131-9021eceb4dd6",
              organization: {
                org_email: "digitalgreen@digitalgreen.com",
                org_description:
                  "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices.",
                name: "Digital green",
              },
              user: "0f76cb90-2394-499b-9b60-bf4cad3751a4",
            },
          },
          file: "/media/Connector%20test/file/demo1234.csv",
          file_size: 12089,
          source: "file",
          standardised_file: "/media/Connector%20test/file/demo1234.csv",
          standardised_configuration: {},
          accessibility: "public",
        },
        right_dataset_file: {
          id: "cb74a07e-8319-4cb6-96e7-43d813629cf6",
          dataset: {
            name: "Connector test",
            description: "fbdsa",
            user_map: {
              id: "a4afc139-5829-49a4-8131-9021eceb4dd6",
              organization: {
                org_email: "digitalgreen@digitalgreen.com",
                org_description:
                  "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices.",
                name: "Digital green",
              },
              user: "0f76cb90-2394-499b-9b60-bf4cad3751a4",
            },
          },
          file: "/media/Connector%20test/file/demo1234.csv",
          file_size: 12089,
          source: "file",
          standardised_file: "/media/Connector%20test/file/demo1234.csv",
          standardised_configuration: {},
          accessibility: "public",
        },
        condition: {
          how: "inner",
          left: [],
          right: [],
          result: [],
          left_on: ["name"],
          right_on: ["name"],
          left_selected: ["name"],
          right_selected: ["name"],
          left_available_columns: [
            "name",
            "age_x",
            "age_y",
            "age_x.1",
            "age_y.1",
          ],
          right_available_columns: [
            "name",
            "age_x",
            "age_y",
            "age_x.1",
            "age_y.1",
          ],
        },
        status: true,
        connectors: "19d3c6b4-fe49-4f86-8ff9-c3a34860afc3",
      },
    ],
    data: {
      schema: {
        fields: [
          {
            name: "name",
            type: "string",
          },
        ],
        pandas_version: "1.4.0",
      },
      data: [
        {
          name: "kanhaiya",
        },
        {
          name: "ugesh",
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
        {
          name: null,
        },
      ],
      no_of_records: 5764803,
    },
    created_at: "2023-07-31T10:32:19.551189Z",
    updated_at: "2023-07-31T10:32:19.551217Z",
    name: "fgdvscaxz",
    description: "fdvscaxz",
    integrated_file: "/media/media/connectors/fgdvscaxz.csv",
    status: true,
    config: {
      renames: {},
      selected: [],
    },
    user: "0f76cb90-2394-499b-9b60-bf4cad3751a4",
  };
}
export function getPatchedConnectorData() {
  return {
    message: "File Updated Sucessfully",
    file_path: "media/connectors/fgdvscaxz_edited.csv",
  };
}
