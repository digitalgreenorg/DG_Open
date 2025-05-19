import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";

export const dashboardHandler = [
  rest.get(
    `${UrlConstant.base_url}${UrlConstant.new_datahub_dashboard}`,
    async (req, res, ctx) => {
      console.log("mopckk get call");

      const queryParams = req.url.searchParams;
      const my_org = queryParams.get("my_org");

      if (my_org) {
        return res(
          ctx.status(200),
          ctx.json({
            user: {
              first_name: "Nilesh",
              last_name: "",
              logo: "media/organizations/logos/dglogo.png",
              org_email: "nilesh@digitalgreen.org",
              name: "dg",
            },
            total_participants: {
              co_steward_count: 14,
              participants_count: 44,
            },
            dataset_file_metrics: [
              {
                datasets__source: "file",
                dataset_count: 3,
                file_count: 7,
                total_size: 1110194,
              },
            ],
            dataset_state_metrics: [
              {
                state_name: null,
                dataset_count: 5,
              },
            ],
            total_dataset_count: 5,
            dataset_category_metrics: {},
            recent_datasets: [
              {
                id: "1892e6c5-b126-4be0-b400-d77baae4ad67",
                dataset_files: [
                  {
                    id: "e1e1882b-bf21-48c2-b610-7bf5001a1bcd",
                    file: "/media/sdafgdasgadsgadsg/file/download_1.csv",
                    file_size: 466,
                    source: "file",
                    standardised_file:
                      "/media/sdafgdasgadsgadsg/file/download_1.csv",
                    standardised_configuration: {},
                    accessibility: "public",
                    dataset: "1892e6c5-b126-4be0-b400-d77baae4ad67",
                  },
                  {
                    id: "8aab8331-a2b7-45a9-af7e-9670d2f53565",
                    file: "/media/sdafgdasgadsgadsg/file/Copy_of_Saharapada_FPC_Members_1.xlsx",
                    file_size: 41434,
                    source: "file",
                    standardised_file:
                      "/media/sdafgdasgadsgadsg/file/Copy_of_Saharapada_FPC_Members_1.xlsx",
                    standardised_configuration: {},
                    accessibility: "public",
                    dataset: "1892e6c5-b126-4be0-b400-d77baae4ad67",
                  },
                  {
                    id: "7838ad7e-6e07-4f1f-abee-794bbb5dea9a",
                    file: "/media/sdafgdasgadsgadsg/file/color_srgb.csv",
                    file_size: 500,
                    source: "file",
                    standardised_file:
                      "/media/sdafgdasgadsgadsg/file/color_srgb.csv",
                    standardised_configuration: {},
                    accessibility: "registered",
                    dataset: "1892e6c5-b126-4be0-b400-d77baae4ad67",
                  },
                ],
                name: "sdafgdasgadsgadsg",
                description: "dsagdasgadsgdsag",
                category: {},
                geography: {},
                data_capture_start: null,
                data_capture_end: null,
                constantly_update: true,
                is_temp: false,
                user_map: "d7a59916-8824-4bba-bb8e-dbf3ee9f1ac8",
              },
              {
                id: "1884d28b-f74c-4ac2-a76f-556c3ba2e477",
                dataset_files: [
                  {
                    id: "c6552c05-0ada-4522-b584-71e26286a2e3",
                    file: "/media/date%20test%2010/file/Claim_form_Part_A-B_1.pdf",
                    file_size: 470701,
                    source: "file",
                    standardised_file:
                      "/media/date%20test%2010/file/Claim_form_Part_A-B_1.pdf",
                    standardised_configuration: {},
                    accessibility: "public",
                    dataset: "1884d28b-f74c-4ac2-a76f-556c3ba2e477",
                  },
                ],
                name: "date test 10",
                description: "date test 10",
                category: {},
                geography: {},
                data_capture_start: "2023-06-02T11:00:00Z",
                data_capture_end: "2023-06-03T11:00:00Z",
                constantly_update: false,
                is_temp: false,
                user_map: "d7a59916-8824-4bba-bb8e-dbf3ee9f1ac8",
              },
              {
                id: "ba4e0fb3-58b6-4ceb-80af-e4cec29134ad",
                dataset_files: [],
                name: "earfgtresrdtgdr",
                description: "dsrfgdghsdfh",
                category: {},
                geography: {},
                data_capture_start: "2023-06-01T18:30:00Z",
                data_capture_end: "2023-06-02T18:30:00Z",
                constantly_update: false,
                is_temp: false,
                user_map: "d7a59916-8824-4bba-bb8e-dbf3ee9f1ac8",
              },
            ],
            total_connectors_count: 2,
            other_datasets_used_in_my_connectors: 4,
            my_dataset_used_in_connectors: 18,
            recent_connectors: [
              {
                id: "ab1b14f3-acab-4083-a254-1d8c831e7d55",
                dataset_count: 2,
                providers_count: 1,
                created_at: "2023-06-21T04:39:49.183016Z",
                updated_at: "2023-06-21T04:39:49.183045Z",
                name: "adsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdai",
                description:
                  "adsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdaiadsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdaiadsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdaiadsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdaiadsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdaiadsgdsajhdgs",
                integrated_file:
                  "/media/media/connectors/adsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdai.csv",
                status: true,
                config: {},
                user: "acc0a9a4-4fba-4d99-aa2e-e98d732c3fd7",
              },
              {
                id: "4498aff4-9f84-4e3a-9bff-09745ce41286",
                dataset_count: 2,
                providers_count: 1,
                created_at: "2023-05-17T05:49:29.548717Z",
                updated_at: "2023-05-17T05:49:29.548743Z",
                name: "ert",
                description: "fdgs",
                integrated_file: "/media/media/connectors/ert.csv",
                status: true,
                config: {},
                user: "acc0a9a4-4fba-4d99-aa2e-e98d732c3fd7",
              },
            ],
          })
        );
      } else {
        return res(
          ctx.status(200),
          ctx.json({
            user: {
              first_name: "Nilesh",
              last_name: "",
              logo: "media/organizations/logos/dglogo.png",
              org_email: "nilesh@digitalgreen.org",
              name: "dg",
            },
            total_participants: {
              co_steward_count: 14,
              participants_count: 44,
            },
            dataset_file_metrics: [
              {
                datasets__source: "file",
                dataset_count: 53,
                file_count: 94,
                total_size: 75930625,
              },
              {
                datasets__source: "live_api",
                dataset_count: 2,
                file_count: 3,
                total_size: 30023,
              },
              {
                datasets__source: "mysql",
                dataset_count: 2,
                file_count: 2,
                total_size: 634026,
              },
              {
                datasets__source: "postgresql",
                dataset_count: 2,
                file_count: 2,
                total_size: 23552,
              },
            ],
            dataset_state_metrics: [
              {
                state_name: "Addis Ababa Addis Ababa Addis Ababa Addis Ababa",
                dataset_count: 3,
              },
              {
                state_name: "Barbuda",
                dataset_count: 2,
              },
              {
                state_name: "Bihar",
                dataset_count: 1,
              },
              {
                state_name: "Delhi",
                dataset_count: 1,
              },
              {
                state_name: "Durrës County",
                dataset_count: 1,
              },
              {
                state_name: "Faryab",
                dataset_count: 1,
              },
              {
                state_name: "Gambela Region",
                dataset_count: 1,
              },
              {
                state_name: "Gujarat",
                dataset_count: 2,
              },
              {
                state_name: "Karnataka",
                dataset_count: 5,
              },
              {
                state_name: "Kerala",
                dataset_count: 1,
              },
              {
                state_name: "New South Wales",
                dataset_count: 1,
              },
              {
                state_name: "Tamil Nadu",
                dataset_count: 2,
              },
              {
                state_name: null,
                dataset_count: 35,
              },
            ],
            total_dataset_count: 56,
            dataset_category_metrics: {
              "Farm management": 2,
              sericulture: 2,
              "subsistence and commercial subsistence and commercial subsistence and commercial": 2,
              Horticultureeee: 2,
              Horticulture: 6,
              Agriculture: 3,
              cat: 4,
              Periculture: 1,
            },
            recent_datasets: [
              {
                id: "e541f126-2546-4690-8df4-8aa3d1750be1",
                dataset_files: [
                  {
                    id: "e93c045d-3097-4e7c-ab95-55f9d3792725",
                    file: "/media/Research%20and%20development/file/Research-and-development.csv",
                    file_size: 5888,
                    source: "file",
                    standardised_file:
                      "/media/Research%20and%20development/file/Research-and-development_standerdise.csv",
                    standardised_configuration: {
                      Number: {
                        masked: false,
                        mapped_to: "swdefr",
                        mapped_category: "Farmer profile",
                      },
                    },
                    accessibility: "public",
                    dataset: "e541f126-2546-4690-8df4-8aa3d1750be1",
                  },
                ],
                name: "Research and development",
                description: "Research and development about ....",
                category: {},
                geography: {
                  city: {
                    name: "Puttur",
                    latitude: "12.75975000",
                    longitude: "75.20169000",
                    stateCode: "KA",
                    countryCode: "IN",
                  },
                  state: {
                    name: "Karnataka",
                    isoCode: "KA",
                    latitude: "15.31727750",
                    longitude: "75.71388840",
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
                user_map: "db099113-4e7e-4335-bf4e-13e861c5bc01",
              },
              {
                id: "7b500ec8-1ea0-460b-a8bb-9b6d62372737",
                dataset_files: [
                  {
                    id: "b6cb48d1-2b34-4e00-9c60-fa1663205172",
                    file: "/media/Address%20data%20set/file/addresses.csv",
                    file_size: 330,
                    source: "file",
                    standardised_file:
                      "/media/Address%20data%20set/file/addresses_standerdise.csv",
                    standardised_configuration: {
                      John: {
                        masked: false,
                        mapped_to: "swdefr",
                        mapped_category: "Farmer profile",
                      },
                      Riverside: {
                        masked: false,
                        mapped_to: "swdefr",
                        mapped_category: "Farmer profile",
                      },
                    },
                    accessibility: "public",
                    dataset: "7b500ec8-1ea0-460b-a8bb-9b6d62372737",
                  },
                ],
                name: "Address data set",
                description: "addressssss...........",
                category: {},
                geography: {
                  city: {
                    name: "Malappuram",
                    latitude: "11.00000000",
                    longitude: "76.16667000",
                    stateCode: "KL",
                    countryCode: "IN",
                  },
                  state: {
                    name: "Kerala",
                    isoCode: "KL",
                    latitude: "10.85051590",
                    longitude: "76.27108330",
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
                user_map: "db099113-4e7e-4335-bf4e-13e861c5bc01",
              },
              {
                id: "21853678-05b2-40d0-819e-73fe36ee0bd3",
                dataset_files: [
                  {
                    id: "c6a96f20-edb2-4cce-9074-770ddbcb9e56",
                    file: "/media/Dataset%20related%20to%20survey/file/selected-services-example.csv",
                    file_size: 263956,
                    source: "file",
                    standardised_file:
                      "/media/Dataset%20related%20to%20survey/file/selected-services-example_standerdise.csv",
                    standardised_configuration: {
                      Series_reference: {
                        masked: false,
                        mapped_to: "swdefr",
                        mapped_category: "Farmer profile",
                      },
                    },
                    accessibility: "public",
                    dataset: "21853678-05b2-40d0-819e-73fe36ee0bd3",
                  },
                ],
                name: "Dataset related to survey",
                description: "contains information about services....",
                category: {},
                geography: {
                  city: {
                    name: "Madikeri",
                    latitude: "12.42602000",
                    longitude: "75.73820000",
                    stateCode: "KA",
                    countryCode: "IN",
                  },
                  state: {
                    name: "Karnataka",
                    isoCode: "KA",
                    latitude: "15.31727750",
                    longitude: "75.71388840",
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
                user_map: "db099113-4e7e-4335-bf4e-13e861c5bc01",
              },
            ],
            total_connectors_count: 2,
            other_datasets_used_in_my_connectors: 4,
            my_dataset_used_in_connectors: 18,
            recent_connectors: [
              {
                id: "ab1b14f3-acab-4083-a254-1d8c831e7d55",
                dataset_count: 2,
                providers_count: 1,
                created_at: "2023-06-21T04:39:49.183016Z",
                updated_at: "2023-06-21T04:39:49.183045Z",
                name: "adsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdai",
                description:
                  "adsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdaiadsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdaiadsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdaiadsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdaiadsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdaiadsgdsajhdgs",
                integrated_file:
                  "/media/media/connectors/adsgdsajhdgslkdsfahgdhgsjlhkdgsdgsjhhjdgsjdhkgsjdsajhvjkxcbvncmksalxmvdsnjjfsdklahgjadsgjhasduigsdai.csv",
                status: true,
                config: {},
                user: "acc0a9a4-4fba-4d99-aa2e-e98d732c3fd7",
              },
              {
                id: "4498aff4-9f84-4e3a-9bff-09745ce41286",
                dataset_count: 2,
                providers_count: 1,
                created_at: "2023-05-17T05:49:29.548717Z",
                updated_at: "2023-05-17T05:49:29.548743Z",
                name: "ert",
                description: "fdgs",
                integrated_file: "/media/media/connectors/ert.csv",
                status: true,
                config: {},
                user: "acc0a9a4-4fba-4d99-aa2e-e98d732c3fd7",
              },
            ],
          })
        );
      }
    }
  ),
];
