import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";

const datasetViewResponse = {
  id: "73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
  name: "abbusijke`",
  user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
  description: "nbcjdf",
  category: {
    cat: ["Livestock farming"],
  },
  geography: {
    city: {
      name: "Andkhoy",
      latitude: "36.95293000",
      longitude: "65.12376000",
      stateCode: "FYB",
      countryCode: "AF",
    },
    state: {
      name: "Faryab",
      isoCode: "FYB",
      latitude: "36.07956130",
      longitude: "64.90595500",
      countryCode: "AF",
    },
    country: {
      flag: "🇦🇫",
      name: "Afghanistan",
      isoCode: "AF",
      currency: "AFN",
      latitude: "33.00000000",
      longitude: "65.00000000",
      phonecode: "93",
      timezones: [
        {
          tzName: "Afghanistan Time",
          zoneName: "Asia/Kabul",
          gmtOffset: 16200,
          abbreviation: "AFT",
          gmtOffsetName: "UTC+04:30",
        },
      ],
    },
  },
  constantly_update: false,
  data_capture_start: "2023-03-11T18:30:00Z",
  data_capture_end: "2023-04-12T18:30:00Z",
  organization: {
    org_email: "sohit@digitalgreen.org",
    org_description: "kjhkhkhkhkj",
    name: "new org",
    logo: "https://datahubethdev.farmstack.co/media/organizations/logos/1653272245246.jpeg",
    phone_number: "+91 23423-42343",
    address: {
      city: "",
      address: "org address",
      country: "India",
      pincode: "1234565432",
    },
  },
  user: {
    id: "74262a78-4b2b-4687-88ab-cba9ac641d37",
    first_name: "sohit",
    last_name: "kumar",
    email: "sohit@digitalgreen.org",
    on_boarded_by: null,
  },
  datasets: [
    {
      id: "81e2b35c-e9ab-40e3-8e9f-653a5d96228c",
      content: [],
      file: "protected/datasets/my test/file/testfile.png",
      source: "file",
      file_size: 171675,
      accessibility: "public",
      standardised_file: "protected/datasets/my test/file/testfile.png",
      standardisation_config: {},
      usage_policy: [],
    },
    {
      id: "f7d1cc4b-4eca-491c-aaa4-a243a3191799",
      content: [],
      file: "protected/datasets/abbusijke`/mysql/sometable.xls",
      source: "mysql",
      file_size: 5632,
      accessibility: "public",
      standardised_file: "protected/datasets/abbusijke`/mysql/sometable.xls",
      standardisation_config: {},
      usage_policy: [],
    },
    {
      id: "f7d1cc4b-4eca-491c-aaa4-a243a3191788",
      content: [],
      file: "protected/datasets/abbusijke`/postgresql/sometable2.xls",
      source: "postgresql",
      file_size: 5632,
      accessibility: "public",
      standardised_file:
        "protected/datasets/abbusijke`/postgresql/sometable.xls",
      standardisation_config: {},
      usage_policy: [],
    },
    {
      id: "f7d1cc4b-4eca-491c-aaa4-a243a3191778",
      content: [],
      file: "protected/datasets/abbusijke`/live_api/sometable2.xls",
      source: "live_api",
      file_size: 5632,
      accessibility: "public",
      standardised_file: "protected/datasets/abbusijke`/live_api/sometable.xls",
      standardisation_config: {},
      usage_policy: [],
    },
  ],
};
export const datasetHandler = [
  rest.post(
    UrlConstant.base_url + UrlConstant.dataset_list,
    (req, res, ctx) => {
      console.log("dataset handler called");
      return res(
        ctx.status(200),
        ctx.json({
          count: 12,
          next: "https://datahubethdev.farmstack.co/be/datahub/dataset/v2/dataset_filters/?page=2",
          previous: null,
          results: [
            {
              id: "5328fcbe-665f-46b4-846a-d8032b6e86d1",
              user_id: "74262a78-4b2b-4687-88ab-cba9ac641d37",
              organization_id: "ac35763e-bfce-4bf8-bb26-3c98616600b6",
              organization: {
                org_email: "sohit@digitalgreen.org",
                org_description: "kjhkhkhkhkj",
                name: "new org",
                logo: "/media/organizations/logos/1653272245246.jpeg",
                address: {
                  city: "",
                  address: "org address",
                  country: "India",
                  pincode: "1234565432",
                },
                phone_number: "+91 23423-42343",
              },
              user: {
                last_name: "kumar",
                first_name: "sohit",
                email: "sohit@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-07-11T14:13:03.536067Z",
              updated_at: "2023-07-18T04:35:52.157756Z",
              name: "test1",
              description: "test description",
              category: {},
              geography: {},
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
            },
            {
              id: "d19370cc-ef11-422d-9404-7c9ab9ab6116",
              user_id: "74262a78-4b2b-4687-88ab-cba9ac641d37",
              organization_id: "ac35763e-bfce-4bf8-bb26-3c98616600b6",
              organization: {
                org_email: "sohit@digitalgreen.org",
                org_description: "kjhkhkhkhkj",
                name: "new org",
                logo: "/media/organizations/logos/1653272245246.jpeg",
                address: {
                  city: "",
                  address: "org address",
                  country: "India",
                  pincode: "1234565432",
                },
                phone_number: "+91 23423-42343",
              },
              user: {
                last_name: "kumar",
                first_name: "sohit",
                email: "sohit@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-06-09T10:06:05.131004Z",
              updated_at: "2023-06-09T10:07:52.497909Z",
              name: "aewsdzxgvaesrdzfxgv",
              description:
                "esrdzfgxcvaerszdfgxvaersdzfxgcbaesrzdfxgcvserdzfxgcvsexdrfxgcvsexdrfxgcvsexdr.ƒð©cvaeszrds.ð©cvaesrzsdxgvaewrzsdzgxvaezrds.ð©cv as ubszrdjkfxbvjkbaszjdbfjkcbajwzsebdjfbcajkzesbdfjkbcawbeszjdzfbjkcbasezjdbfjkcb",
              category: {},
              geography: {},
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
            },
            {
              id: "3f6509e8-a9d2-4839-8878-f174640f8339",
              user_id: "74262a78-4b2b-4687-88ab-cba9ac641d37",
              organization_id: "ac35763e-bfce-4bf8-bb26-3c98616600b6",
              organization: {
                org_email: "sohit@digitalgreen.org",
                org_description: "kjhkhkhkhkj",
                name: "new org",
                logo: "/media/organizations/logos/1653272245246.jpeg",
                address: {
                  city: "",
                  address: "org address",
                  country: "India",
                  pincode: "1234565432",
                },
                phone_number: "+91 23423-42343",
              },
              user: {
                last_name: "kumar",
                first_name: "sohit",
                email: "sohit@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-05-03T05:47:36.308567Z",
              updated_at: "2023-06-09T09:53:33.633430Z",
              name: "ssjdfb",
              description:
                "t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less                                                                                                                               \n                                                 ble content of a page when looking at its layout. The point of using Lorem Ipsum is that it has\npage when",
              category: {
                "subsistence and commercial": ["ffff"],
              },
              geography: {
                country: {
                  flag: "🇧🇦",
                  name: "Bosnia and Herzegovina",
                  isoCode: "BA",
                  currency: "BAM",
                  latitude: "44.00000000",
                  longitude: "18.00000000",
                  phonecode: "387",
                  timezones: [
                    {
                      tzName: "Central European Time",
                      zoneName: "Europe/Sarajevo",
                      gmtOffset: 3600,
                      abbreviation: "CET",
                      gmtOffsetName: "UTC+01:00",
                    },
                  ],
                },
              },
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
            },
            {
              id: "7a4742f3-bff7-4612-99f8-027f56a029ff",
              user_id: "74262a78-4b2b-4687-88ab-cba9ac641d37",
              organization_id: "ac35763e-bfce-4bf8-bb26-3c98616600b6",
              organization: {
                org_email: "sohit@digitalgreen.org",
                org_description: "kjhkhkhkhkj",
                name: "new org",
                logo: "/media/organizations/logos/1653272245246.jpeg",
                address: {
                  city: "",
                  address: "org address",
                  country: "India",
                  pincode: "1234565432",
                },
                phone_number: "+91 23423-42343",
              },
              user: {
                last_name: "kumar",
                first_name: "sohit",
                email: "sohit@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-04-24T09:13:13.888082Z",
              updated_at: "2023-06-08T10:00:34.765075Z",
              name: "sohit",
              description: "sohit description",
              category: {
                Agriculture: ["Crop farming"],
                sericulture: ["add"],
                Horticulture: ["GDHFDHGDFHGF"],
                "Farm management": [
                  "Farm planning and design",
                  "Farm operations and maintenance",
                ],
                Horticultureeee: ["chilli"],
              },
              geography: {
                city: {
                  name: "Alipur",
                  latitude: "28.79862000",
                  longitude: "77.13314000",
                  stateCode: "DL",
                  countryCode: "IN",
                },
                state: {
                  name: "Delhi",
                  isoCode: "DL",
                  latitude: "28.70405920",
                  longitude: "77.10249020",
                  countryCode: "IN",
                },
                country: {
                  flag: "🇮🇳",
                  name: "India",
                  isoCode: "IN",
                  currency: "INR",
                  latitude: "20.00000000",
                  longitude: "77.00000000",
                  phonecode: "91",
                  timezones: [
                    {
                      tzName: "Indian Standard Time",
                      zoneName: "Asia/Kolkata",
                      gmtOffset: 19800,
                      abbreviation: "IST",
                      gmtOffsetName: "UTC+05:30",
                    },
                  ],
                },
              },
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
            },
            {
              id: "73cab41a-49fe-4f86-ae4b-6f63876a3cb2",
              user_id: "74262a78-4b2b-4687-88ab-cba9ac641d37",
              organization_id: "ac35763e-bfce-4bf8-bb26-3c98616600b6",
              organization: {
                org_email: "sohit@digitalgreen.org",
                org_description: "kjhkhkhkhkj",
                name: "new org",
                logo: "/media/organizations/logos/1653272245246.jpeg",
                address: {
                  city: "",
                  address: "org address",
                  country: "India",
                  pincode: "1234565432",
                },
                phone_number: "+91 23423-42343",
              },
              user: {
                last_name: "kumar",
                first_name: "sohit",
                email: "sohit@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-05-01T11:04:37.974495Z",
              updated_at: "2023-05-03T05:01:20.770828Z",
              name: "abbusijke`",
              description: "nbcjdf",
              category: {
                cat: ["Livestock farming"],
              },
              geography: {
                city: {
                  name: "Andkhoy",
                  latitude: "36.95293000",
                  longitude: "65.12376000",
                  stateCode: "FYB",
                  countryCode: "AF",
                },
                state: {
                  name: "Faryab",
                  isoCode: "FYB",
                  latitude: "36.07956130",
                  longitude: "64.90595500",
                  countryCode: "AF",
                },
                country: {
                  flag: "🇦🇫",
                  name: "Afghanistan",
                  isoCode: "AF",
                  currency: "AFN",
                  latitude: "33.00000000",
                  longitude: "65.00000000",
                  phonecode: "93",
                  timezones: [
                    {
                      tzName: "Afghanistan Time",
                      zoneName: "Asia/Kabul",
                      gmtOffset: 16200,
                      abbreviation: "AFT",
                      gmtOffsetName: "UTC+04:30",
                    },
                  ],
                },
              },
              data_capture_start: "2023-03-11T18:30:00Z",
              data_capture_end: "2023-04-12T18:30:00Z",
              constantly_update: false,
              is_temp: false,
              user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
            },
          ],
        })
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.datasetview_guest,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          count: 12,
          next: "https://datahubethdev.farmstack.co/be/datahub/dataset/v2/dataset_filters/?page=2",
          previous: null,
          results: [
            {
              id: "5328fcbe-665f-46b4-846a-d8032b6e86d1",
              user_id: "74262a78-4b2b-4687-88ab-cba9ac641d37",
              organization_id: "ac35763e-bfce-4bf8-bb26-3c98616600b6",
              organization: {
                org_email: "sohit@digitalgreen.org",
                org_description: "kjhkhkhkhkj",
                name: "new org",
                logo: "/media/organizations/logos/1653272245246.jpeg",
                address: {
                  city: "",
                  address: "org address",
                  country: "India",
                  pincode: "1234565432",
                },
                phone_number: "+91 23423-42343",
              },
              user: {
                last_name: "kumar",
                first_name: "sohit",
                email: "sohit@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-07-11T14:13:03.536067Z",
              updated_at: "2023-07-18T04:35:52.157756Z",
              name: "test1",
              description: "test description",
              category: {},
              geography: {},
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
            },
            {
              id: "d19370cc-ef11-422d-9404-7c9ab9ab6116",
              user_id: "74262a78-4b2b-4687-88ab-cba9ac641d37",
              organization_id: "ac35763e-bfce-4bf8-bb26-3c98616600b6",
              organization: {
                org_email: "sohit@digitalgreen.org",
                org_description: "kjhkhkhkhkj",
                name: "new org",
                logo: "/media/organizations/logos/1653272245246.jpeg",
                address: {
                  city: "",
                  address: "org address",
                  country: "India",
                  pincode: "1234565432",
                },
                phone_number: "+91 23423-42343",
              },
              user: {
                last_name: "kumar",
                first_name: "sohit",
                email: "sohit@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-06-09T10:06:05.131004Z",
              updated_at: "2023-06-09T10:07:52.497909Z",
              name: "aewsdzxgvaesrdzfxgv",
              description:
                "esrdzfgxcvaerszdfgxvaersdzfxgcbaesrzdfxgcvserdzfxgcvsexdrfxgcvsexdrfxgcvsexdr.ƒð©cvaeszrds.ð©cvaesrzsdxgvaewrzsdzgxvaezrds.ð©cv as ubszrdjkfxbvjkbaszjdbfjkcbajwzsebdjfbcajkzesbdfjkbcawbeszjdzfbjkcbasezjdbfjkcb",
              category: {},
              geography: {},
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
            },
          ],
        })
      );
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.microsite_category,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ dsagffas: ["some"], test: [], test2: [], asas: [] })
      );
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.add_category_edit_category,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ dsagffas: ["some"], test: [], test2: [], asas: [] })
      );
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.datasetview + ":id" + "/",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(datasetViewResponse));
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.datasetview__guest + ":id" + "/",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(datasetViewResponse));
    }
  ),
  rest.delete(
    UrlConstant.base_url + UrlConstant.delete_dataset + ":id" + "/",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(datasetViewResponse));
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.add_basic_dataset,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "01a5ec87-f5fc-434e-8084-601d0455e82d",
          created_at: "2023-07-28T06:30:03.748419Z",
          updated_at: "2023-07-28T06:30:03.748452Z",
          name: "new dataset",
          description: "snmnbdfn,",
          category: {},
          geography: {},
          data_capture_start: null,
          data_capture_end: null,
          constantly_update: true,
          is_temp: true,
          user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
        })
      );
    }
  ),
  rest.put(
    UrlConstant.base_url + UrlConstant.add_basic_dataset + ":datasetId/",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "01a5ec87-f5fc-434e-8084-601d0455e82d",
          created_at: "2023-07-28T06:30:03.748419Z",
          updated_at: "2023-07-28T06:30:03.748452Z",
          name: "new dataset",
          description: "snmnbdfn,",
          category: {},
          geography: {},
          data_capture_start: null,
          data_capture_end: null,
          constantly_update: true,
          is_temp: true,
          user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
        })
      );
    }
  ),
  rest.put(
    UrlConstant.base_url +
      UrlConstant.add_basic_dataset +
      ":props.datasetIdForEdit/",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "01a5ec87-f5fc-434e-8084-601d0455e82d",
          created_at: "2023-07-28T06:30:03.748419Z",
          updated_at: "2023-07-28T06:30:03.748452Z",
          name: "new dataset",
          description: "snmnbdfn,",
          category: {},
          geography: {},
          data_capture_start: null,
          data_capture_end: null,
          constantly_update: true,
          is_temp: true,
          user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
        })
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.upload_files,
    (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({
          id: "dbc8e1c0-c1dc-460d-a430-ff5752000cbb",
          created_at: "2023-07-30T17:54:11.689594Z",
          updated_at: "2023-07-30T17:54:11.695451Z",
          file: "test1/file/testfile.png",
          file_size: 310330,
          source: "file",
          standardised_configuration: {},
          accessibility: "public",
          dataset: "5328fcbe-665f-46b4-846a-d8032b6e86d1",
        })
      );
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.list_of_files + ":datasetId" + "/",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: "dbc8e1c0-c1dc-460d-a430-ff5752000cbb",
            file: "test1/file/testfile.png",
          },
          {
            id: "cc70ff0d-f54d-4890-80c4-22e91d3e34b1",
            file: "test1/file/sometable.xls",
          },
        ])
      );
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.standardization_get_data,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: "41369a20-0750-4849-8694-c4c8ef6bd79d",
            datapoint_category: "sdfhdshdshdsdfgdsg",
            datapoint_description: "dfgdsghsdfhsdh",
            datapoint_attributes: {
              231: "",
              "red chilli": "",
              "green chilli": "",
            },
          },
          {
            id: "0e84f79a-1ca0-4c95-ac9e-89417c872e5b",
            datapoint_category: "nbvcdxsza",
            datapoint_description: "ghfdsa",
            datapoint_attributes: {
              asdf: "",
              dcfv: "",
              sdcfv: "",
              sxdcfvg: "",
            },
          },
        ])
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.get_file_columns,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(["REGION", "WOREDA", "KEBELE", "FIRST_NAME", "LAST_NAME"])
      );
    }
  ),
  rest.put(
    UrlConstant.base_url + UrlConstant.standardised_file + ":standardiseFile/",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "dbc8e1c0-c1dc-460d-a430-ff5752000cbb",
          created_at: "2023-07-30T17:54:11.689594Z",
          updated_at: "2023-07-30T18:22:03.118932Z",
          file: "https://datahubethdev.farmstack.co/datahub/dataset_files/dbc8e1c0-c1dc-460d-a430-ff5752000cbb/test1/file/testfile.png",
          file_size: 315536,
          source: "file",
          standardised_configuration: {
            FIRST_NAME_x: {
              mapped_to: "231",
              mapped_category: "sdfhdshdshdsdfgdsg",
              masked: false,
            },
          },
          accessibility: "public",
          dataset: "5328fcbe-665f-46b4-846a-d8032b6e86d1",
        })
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.connection_to_db_end_point,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(["AEInstalacion", "AELevantamiento", "AnalisisAgua"])
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.get_column_from_table_name,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(["id", "created_by", "modified_by", "deleted", "status"])
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.send_columns_to_export,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "53f82c3f-5bd3-487a-8fba-104bf15cd4bd",
          created_at: "2023-07-31T09:05:07.417380Z",
          updated_at: "2023-07-31T09:05:07.417411Z",
          file: "test1/mysql/samplesql.xls",
          file_size: 5632,
          source: "mysql",
          standardised_configuration: {},
          accessibility: "public",
          dataset: "5328fcbe-665f-46b4-846a-d8032b6e86d1",
        })
      );
    }
  ),
  rest.patch(
    UrlConstant.base_url + UrlConstant.usage_policy + ":file/",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "e86afce4-5b6b-4477-8c1e-75011c55023d",
          created_at: "2023-07-31T06:42:00.371077Z",
          updated_at: "2023-08-01T07:48:10.164769Z",
          file: "https://datahubethdev.farmstack.co/datahub/dataset_files/e86afce4-5b6b-4477-8c1e-75011c55023d/test1/mysql/sometable.xls",
          file_size: 5632,
          source: "mysql",
          standardised_configuration: {},
          accessibility: "public",
          dataset: "5328fcbe-665f-46b4-846a-d8032b6e86d1",
        })
      );
    }
  ),
];
