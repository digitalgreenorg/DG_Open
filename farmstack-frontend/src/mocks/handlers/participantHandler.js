import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";

export const participantHandler = [
  // pass your url in the first parameter
  rest.post(
    UrlConstant.base_url + UrlConstant.register_participant,
    (req, res, ctx) => {
      return res(ctx.status(201), ctx.json({}));
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.costewardlist_selfregister,
    (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json([
          {
            user: "26192c83-4cd2-4926-b0e5-c77ea58008d0",
            organization_name: "Jai's Demo Organization_1",
          },
          {
            user: "686192d2-d3cc-4dfa-aefe-0f9848935e01",
            organization_name: "JSN",
          },
          {
            user: "fe79f0f3-5c7a-48be-abfc-4a86b6199515",
            organization_name: "kanhaiya",
          },
          {
            user: "65e08d53-5c47-4854-bd3f-a57e4e7ad691",
            organization_name: "Kanhaiya",
          },
          {
            user: "17e2bd9e-cfed-4f40-b788-063784fc7cda",
            organization_name: "Kanhaiya Participant Org",
          },
          {
            user: "2fb4be13-a6c8-4f95-8f78-c45320005180",
            organization_name: "monika org costeward",
          },
          {
            user: "4131d9e6-bdae-47cb-9ad9-01fe6690095e",
            organization_name: "nilesh+10@digitalgreen.org",
          },
          {
            user: "81931fc3-ecc8-4d76-b7b2-f8f2a77dc713",
            organization_name: "nilesh+12@digitalgreen.org",
          },
          {
            user: "3e85eef0-9fb9-491f-9bb7-658bb1aea089",
            organization_name: "NS",
          },
          {
            user: "3ddd3e85-c0f5-44d7-a151-f282702ff7ca",
            organization_name: "org",
          },
          {
            user: "7d23cedc-c205-4b3b-978d-a6a18b9cd582",
            organization_name: "sdfghj",
          },
          {
            user: "56695d23-37f2-4cc1-9abb-9051f7a84761",
            organization_name:
              "shru costeward org and something new to check the space",
          },
          {
            user: "bed3b6e7-ffec-4460-ae3c-8dd5c85a806a",
            organization_name: "Test 2",
          },
          {
            user: "7d8bf883-a027-4b4a-acd4-771955464e54",
            organization_name: "Titan",
          },
          {
            user: "054d6fc9-cc55-4b8a-85e2-6456fb6bcd14",
            organization_name: null,
          },
        ])
      );
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.participant + ":id" + "/",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(
          {
          id: "b73523b5-40f0-4435-8000-df71b431daeb",
          user_id: "759f6af8-49ba-41c7-bfba-d0e232f039e0",
          organization_id: "9394faac-0910-4027-9e3d-cea8425f3cb3",
          user: {
            id: "759f6af8-49ba-41c7-bfba-d0e232f039e0",
            email: "shruthichandran+2@digitalgreen.org",
            first_name: "monikashruthi",
            last_name: "ravi",
            phone_number: "+91 34567-89456",
            role: 3,
            status: true,
            subscription: null,
            profile_picture: null,
            on_boarded: true,
            on_boarded_by: null,
            approval_status: true,
          },
          organization: {
            id: "9394faac-0910-4027-9e3d-cea8425f3cb3",
            name: "SHRU. orggggg",
            org_email: "fghjk@fghj.com",
            address: {
              city: "",
              address: "chennai",
              country: "Jersey",
              pincode: "234567890",
            },
            phone_number: "+91 34567-89222",
            logo: "/media/organizations/logos/ATI_ZePh7g6.png",
            hero_image: null,
            org_description: "dfghjk",
            website: "www.sdf.com",
            status: true,
          },
          dataset_count: 6,
          connector_count: 0,
          number_of_participants: 0,
        }
        )
      );
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.participant + "?on_boarded_by=" + ":id",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ count: 0, next: null, previous: null, results: [] })
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.costeward_onboarded_dataset,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          count: 6,
          next: "https://datahubethdev.farmstack.co/be/datahub/dataset/v2/dataset_filters/?page=2",
          previous: null,
          results: [
            {
              id: "7ebc81d7-530a-4d57-9551-4b20b28c7e54",
              user_id: "8ec1bac3-2171-4222-9b4f-7908626ae109",
              organization_id: "bc29075a-2233-497e-b1b1-1b72f50bac19",
              organization: {
                org_email: "shruth@df.com",
                org_description: "kkkkkkkk",
                name: "DG",
                logo: "/media/organizations/logos/carssss_rRltuAr.jpeg",
                address: {
                  city: "",
                  address: "chennai",
                  country: "American Samoa",
                  pincode: "3333333333",
                },
                phone_number: "+254456789873",
              },
              user: {
                last_name: "",
                first_name: "Shruthi",
                email: "shruthichandran@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-07-05T11:11:30.958286Z",
              updated_at: "2023-07-14T12:12:07.808213Z",
              name: "check for view",
              description: "swdcfv",
              category: {
                Horticulture: [
                  "GDHFDHGDFHGF",
                  "dsvxc",
                  "sdxz",
                  "rzdfc",
                  "dvsxc",
                  "sdfxc",
                  "rdzfvxc",
                  "dxdsvxc",
                  "sdzfx",
                ],
              },
              geography: {
                city: {
                  name: "Airds",
                  latitude: "-34.08599000",
                  longitude: "150.83322000",
                  stateCode: "NSW",
                  countryCode: "AU",
                },
                state: {
                  name: "New South Wales",
                  isoCode: "NSW",
                  latitude: "-31.25321830",
                  longitude: "146.92109900",
                  countryCode: "AU",
                },
                country: {
                  flag: "🇦🇺",
                  name: "Australia",
                  isoCode: "AU",
                  currency: "AUD",
                  latitude: "-27.00000000",
                  longitude: "133.00000000",
                  phonecode: "61",
                  timezones: [
                    {
                      tzName: "Macquarie Island Station Time",
                      zoneName: "Antarctica/Macquarie",
                      gmtOffset: 39600,
                      abbreviation: "MIST",
                      gmtOffsetName: "UTC+11:00",
                    },
                    {
                      tzName: "Australian Central Daylight Saving Time",
                      zoneName: "Australia/Adelaide",
                      gmtOffset: 37800,
                      abbreviation: "ACDT",
                      gmtOffsetName: "UTC+10:30",
                    },
                    {
                      tzName: "Australian Eastern Standard Time",
                      zoneName: "Australia/Brisbane",
                      gmtOffset: 36000,
                      abbreviation: "AEST",
                      gmtOffsetName: "UTC+10:00",
                    },
                    {
                      tzName: "Australian Central Daylight Saving Time",
                      zoneName: "Australia/Broken_Hill",
                      gmtOffset: 37800,
                      abbreviation: "ACDT",
                      gmtOffsetName: "UTC+10:30",
                    },
                    {
                      tzName: "Australian Eastern Daylight Saving Time",
                      zoneName: "Australia/Currie",
                      gmtOffset: 39600,
                      abbreviation: "AEDT",
                      gmtOffsetName: "UTC+11:00",
                    },
                    {
                      tzName: "Australian Central Standard Time",
                      zoneName: "Australia/Darwin",
                      gmtOffset: 34200,
                      abbreviation: "ACST",
                      gmtOffsetName: "UTC+09:30",
                    },
                    {
                      tzName:
                        "Australian Central Western Standard Time (Unofficial)",
                      zoneName: "Australia/Eucla",
                      gmtOffset: 31500,
                      abbreviation: "ACWST",
                      gmtOffsetName: "UTC+08:45",
                    },
                    {
                      tzName: "Australian Eastern Daylight Saving Time",
                      zoneName: "Australia/Hobart",
                      gmtOffset: 39600,
                      abbreviation: "AEDT",
                      gmtOffsetName: "UTC+11:00",
                    },
                    {
                      tzName: "Australian Eastern Standard Time",
                      zoneName: "Australia/Lindeman",
                      gmtOffset: 36000,
                      abbreviation: "AEST",
                      gmtOffsetName: "UTC+10:00",
                    },
                    {
                      tzName: "Lord Howe Summer Time",
                      zoneName: "Australia/Lord_Howe",
                      gmtOffset: 39600,
                      abbreviation: "LHST",
                      gmtOffsetName: "UTC+11:00",
                    },
                    {
                      tzName: "Australian Eastern Daylight Saving Time",
                      zoneName: "Australia/Melbourne",
                      gmtOffset: 39600,
                      abbreviation: "AEDT",
                      gmtOffsetName: "UTC+11:00",
                    },
                    {
                      tzName: "Australian Western Standard Time",
                      zoneName: "Australia/Perth",
                      gmtOffset: 28800,
                      abbreviation: "AWST",
                      gmtOffsetName: "UTC+08:00",
                    },
                    {
                      tzName: "Australian Eastern Daylight Saving Time",
                      zoneName: "Australia/Sydney",
                      gmtOffset: 39600,
                      abbreviation: "AEDT",
                      gmtOffsetName: "UTC+11:00",
                    },
                  ],
                },
              },
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "3c9071cb-5fe1-4cdb-8e15-7961c065989b",
            },
          ],
        })
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.costeward_onboarded_dataset + "?page=2",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(
          {
            "id": "d0bb3072-4f42-4e72-835f-9416e1df1ec2",
            "user_id": "dccf135e-cdc3-4412-aa79-a89db0dfa6bc",
            "organization_id": "a4e60876-a249-4c45-b13a-7993c2572e27",
            "user": {
                "id": "dccf135e-cdc3-4412-aa79-a89db0dfa6bc",
                "email": "ekta+part@digitalgreen.org",
                "first_name": "ekta",
                "last_name": "part",
                "phone_number": "+91 96114-57777",
                "role": 3,
                "status": true,
                "subscription": null,
                "profile_picture": null,
                "on_boarded": true,
                "on_boarded_by": null,
                "approval_status": true
            },
            "organization": {
                "id": "a4e60876-a249-4c45-b13a-7993c2572e27",
                "name": "ekta dummy",
                "org_email": "ekta+part@digitalgreen.org",
                "address": {
                    "city": "",
                    "address": "patna",
                    "country": "India",
                    "pincode": "800001"
                },
                "phone_number": "+91 96114-57777",
                "logo": "/media/organizations/logos/download_y5chEtC.png",
                "hero_image": null,
                "org_description": "dhgdhh",
                "website": "https://www.google.com",
                "status": true
            },
            "dataset_count": 0,
            "connector_count": 0,
            "number_of_participants": 0
        }
        )
      );
    }
  ),
  rest.put(
    UrlConstant.base_url + UrlConstant.participant + ":id" + "/",
    (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({
          user: {
            id: "f8c58cf7-0523-4cc3-ad34-ae999b4de99b",
            email: "test@gmail.com",
            first_name: "test",
            last_name: "testuser",
            phone_number: "+91 93449-57735",
            role: 3,
            subscription: null,
            profile_picture: null,
            on_boarded: false,
            approval_status: true,
            on_boarded_by: null,
          },
          organization: {
            id: "bb92b790-e810-462d-b5db-c40139ffa8fe",
            org_email: "dummy@gmail.com",
            website: "https://www.digitalgreen.org",
            name: "Dummy org",
            address: {
              address: "Chennai",
              country: "Anguilla",
              pincode: "234567456",
            },
            phone_number: "+91 93449-57735",
            logo: null,
            hero_image: null,
            org_description: null,
            status: true,
          },
        })
      );
    }
  ),
  rest.delete(
    UrlConstant.base_url + UrlConstant.participant + ":id" + "/",
    (req, res, ctx) => {
      return res(ctx.status(204), ctx.json());
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.participant + "?page=2",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          count: 45,
          next: "https://datahubethdev.farmstack.co/be/datahub/participant/?page=3",
          previous:
            "https://datahubethdev.farmstack.co/be/datahub/participant/",
          results: [
            {
              id: "d0bb3072-4f42-4e72-835f-9416e1df1ec2",
              user_id: "dccf135e-cdc3-4412-aa79-a89db0dfa6bc",
              organization_id: "a4e60876-a249-4c45-b13a-7993c2572e27",
              user: {
                id: "dccf135e-cdc3-4412-aa79-a89db0dfa6bc",
                email: "ekta+part@digitalgreen.org",
                first_name: "ekta",
                last_name: "part",
                phone_number: "+91 96114-57777",
                role: 3,
                status: true,
                subscription: null,
                profile_picture: null,
                on_boarded: true,
                on_boarded_by: null,
                approval_status: true,
              },
              organization: {
                id: "a4e60876-a249-4c45-b13a-7993c2572e27",
                name: "ekta dummy",
                org_email: "ekta+part@digitalgreen.org",
                address: {
                  city: "",
                  address: "patna",
                  country: "India",
                  pincode: "800001",
                },
                phone_number: "+91 96114-57777",
                logo: "/media/organizations/logos/download_y5chEtC.png",
                hero_image: null,
                org_description: "dhgdhh",
                website: "https://www.google.com",
                status: true,
              },
              dataset_count: 0,
              connector_count: 0,
              number_of_participants: 0,
            },
          ],
        })
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.costeward_onboarded_dataset,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          count: 6,
          next: "https://datahubethdev.farmstack.co/be/datahub/dataset/v2/dataset_filters/?page=2",
          previous: null,
          results: [
            {
              id: "1f6d2d36-d5b1-4fd2-aae4-a36d38c27c02",
              user_id: "759f6af8-49ba-41c7-bfba-d0e232f039e0",
              organization_id: "9394faac-0910-4027-9e3d-cea8425f3cb3",
              organization: {
                org_email: "fghjk@fghj.com",
                org_description: "dfghjk",
                name: "SHRU. orggggg",
                logo: "/media/organizations/logos/ATI_ZePh7g6.png",
                address: {
                  city: "",
                  address: "chennai",
                  country: "Jersey",
                  pincode: "234567890",
                },
                phone_number: "+91 34567-89222",
              },
              user: {
                last_name: "ravi",
                first_name: "monikashruthi",
                email: "shruthichandran+2@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-07-25T13:57:05.334176Z",
              updated_at: "2023-07-25T13:57:21.914650Z",
              name: "green gram",
              description: "sdfv",
              category: {},
              geography: {},
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "b73523b5-40f0-4435-8000-df71b431daeb",
            },
            {
              id: "ed11791d-d4a9-4416-9bd3-1e39bd1b89aa",
              user_id: "759f6af8-49ba-41c7-bfba-d0e232f039e0",
              organization_id: "9394faac-0910-4027-9e3d-cea8425f3cb3",
              organization: {
                org_email: "fghjk@fghj.com",
                org_description: "dfghjk",
                name: "SHRU. orggggg",
                logo: "/media/organizations/logos/ATI_ZePh7g6.png",
                address: {
                  city: "",
                  address: "chennai",
                  country: "Jersey",
                  pincode: "234567890",
                },
                phone_number: "+91 34567-89222",
              },
              user: {
                last_name: "ravi",
                first_name: "monikashruthi",
                email: "shruthichandran+2@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-07-25T13:56:33.085199Z",
              updated_at: "2023-07-25T13:56:50.240405Z",
              name: "lemon",
              description: "dsf",
              category: {},
              geography: {},
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "b73523b5-40f0-4435-8000-df71b431daeb",
            },
            {
              id: "e7335c8f-a613-41ec-b7b5-21e3e6793fe5",
              user_id: "759f6af8-49ba-41c7-bfba-d0e232f039e0",
              organization_id: "9394faac-0910-4027-9e3d-cea8425f3cb3",
              organization: {
                org_email: "fghjk@fghj.com",
                org_description: "dfghjk",
                name: "SHRU. orggggg",
                logo: "/media/organizations/logos/ATI_ZePh7g6.png",
                address: {
                  city: "",
                  address: "chennai",
                  country: "Jersey",
                  pincode: "234567890",
                },
                phone_number: "+91 34567-89222",
              },
              user: {
                last_name: "ravi",
                first_name: "monikashruthi",
                email: "shruthichandran+2@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-07-25T13:56:08.051756Z",
              updated_at: "2023-07-25T13:56:22.280499Z",
              name: "carrot",
              description: "sxcdf",
              category: {},
              geography: {},
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "b73523b5-40f0-4435-8000-df71b431daeb",
            },
          ],
        })
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.guest_dataset_filtered_data,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          count: 6,
          next: "https://datahubethdev.farmstack.co/be/datahub/dataset/v2/dataset_filters/?page=2",
          previous: null,
          results: [
            {
              id: "1f6d2d36-d5b1-4fd2-aae4-a36d38c27c02",
              user_id: "759f6af8-49ba-41c7-bfba-d0e232f039e0",
              organization_id: "9394faac-0910-4027-9e3d-cea8425f3cb3",
              organization: {
                org_email: "fghjk@fghj.com",
                org_description: "dfghjk",
                name: "SHRU. orggggg",
                logo: "/media/organizations/logos/ATI_ZePh7g6.png",
                address: {
                  city: "",
                  address: "chennai",
                  country: "Jersey",
                  pincode: "234567890",
                },
                phone_number: "+91 34567-89222",
              },
              user: {
                last_name: "ravi",
                first_name: "monikashruthi",
                email: "shruthichandran+2@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-07-25T13:57:05.334176Z",
              updated_at: "2023-07-25T13:57:21.914650Z",
              name: "green gram",
              description: "sdfv",
              category: {},
              geography: {},
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "b73523b5-40f0-4435-8000-df71b431daeb",
            },
            {
              id: "ed11791d-d4a9-4416-9bd3-1e39bd1b89aa",
              user_id: "759f6af8-49ba-41c7-bfba-d0e232f039e0",
              organization_id: "9394faac-0910-4027-9e3d-cea8425f3cb3",
              organization: {
                org_email: "fghjk@fghj.com",
                org_description: "dfghjk",
                name: "SHRU. orggggg",
                logo: "/media/organizations/logos/ATI_ZePh7g6.png",
                address: {
                  city: "",
                  address: "chennai",
                  country: "Jersey",
                  pincode: "234567890",
                },
                phone_number: "+91 34567-89222",
              },
              user: {
                last_name: "ravi",
                first_name: "monikashruthi",
                email: "shruthichandran+2@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-07-25T13:56:33.085199Z",
              updated_at: "2023-07-25T13:56:50.240405Z",
              name: "lemon",
              description: "dsf",
              category: {},
              geography: {},
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "b73523b5-40f0-4435-8000-df71b431daeb",
            },
            {
              id: "e7335c8f-a613-41ec-b7b5-21e3e6793fe5",
              user_id: "759f6af8-49ba-41c7-bfba-d0e232f039e0",
              organization_id: "9394faac-0910-4027-9e3d-cea8425f3cb3",
              organization: {
                org_email: "fghjk@fghj.com",
                org_description: "dfghjk",
                name: "SHRU. orggggg",
                logo: "/media/organizations/logos/ATI_ZePh7g6.png",
                address: {
                  city: "",
                  address: "chennai",
                  country: "Jersey",
                  pincode: "234567890",
                },
                phone_number: "+91 34567-89222",
              },
              user: {
                last_name: "ravi",
                first_name: "monikashruthi",
                email: "shruthichandran+2@digitalgreen.org",
                on_boarded_by: null,
              },
              created_at: "2023-07-25T13:56:08.051756Z",
              updated_at: "2023-07-25T13:56:22.280499Z",
              name: "carrot",
              description: "sxcdf",
              category: {},
              geography: {},
              data_capture_start: null,
              data_capture_end: null,
              constantly_update: true,
              is_temp: false,
              user_map: "b73523b5-40f0-4435-8000-df71b431daeb",
            },
          ],
        })
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + "microsite/participant/" + ":id" + "/",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "4a38d1b1-868d-4bbf-950a-db62d9350f50",
          user_id: "56695d23-37f2-4cc1-9abb-9051f7a84761",
          organization_id: "c70ea1e1-2af9-4abe-b963-c8917db22b4e",
          user: {
            id: "56695d23-37f2-4cc1-9abb-9051f7a84761",
            email: "shruthichandran+17@digitalgreen.org",
            first_name:
              "monikasdfrgthygtrfedfrgthyjuhgfergthyjukjyhgfdsfgthyjuyhgfdwefrgthyjuhgfdsfghyjuyhtgrfedwefrgthyjuk",
            last_name: "chandran",
            phone_number: "+91 23456-78909",
            role: 6,
            status: true,
            subscription: null,
            profile_picture: null,
            on_boarded: true,
            on_boarded_by: null,
            approval_status: true,
          },
          organization: {
            id: "c70ea1e1-2af9-4abe-b963-c8917db22b4e",
            name: "shru costeward org and something new to check the space",
            org_email: "wdefrg@sdf.com",
            address: {
              address: "scdvf",
              country: "Aruba",
              pincode: "098765432",
            },
            phone_number: "+91 23456-78909",
            logo: "/media/organizations/logos/bitter_VVN9G1p.jpeg",
            hero_image: null,
            org_description: "cdvf",
            website: "www.sdf.com",
            status: true,
          },
          dataset_count: 1,
          connector_count: 0,
          number_of_participants: 3,
        })
      );
    }
  ),
  rest.delete(
    UrlConstant.base_url + UrlConstant.participant + ":id" + "/",
    (req, res, ctx) => {
      return res(ctx.status(204), ctx.json());
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
];
