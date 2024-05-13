import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";

export const supportTicketHandler = [
  rest.post(
    UrlConstant.base_url + UrlConstant.support_ticket_tab,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          count: 3,
          next: "https://datahubethdev.farmstack.co/be/participant/support_ticket/list_tickets/?page=2",
          previous: null,
          results: [
            {
              id: "e1fa439e-5216-4459-89ff-a446b13aef62",
              user_map: {
                id: "4a38d1b1-868d-4bbf-950a-db62d9350f50",
                user: {
                  first_name: "monika",
                  last_name: "chandran",
                  phone_number: "+91 23456-78909",
                  role: 6,
                },
                organization: {
                  name: "shru costeward org and something new to check the space",
                  hero_image: null,
                  phone_number: "+91 23456-78909",
                  logo: "/media/organizations/logos/bitter_VVN9G1p.jpeg",
                },
              },
              created_at: "2023-06-08T03:22:52.837095Z",
              updated_at: "2023-07-19T08:51:11.454693Z",
              ticket_title: "6 tickets",
              description: "sdfr",
              category: "others",
              ticket_attachment: null,
              status: "open",
            },
            {
              id: "a290f396-01b6-4530-a01b-f5ba2b9126f6",
              user_map: {
                id: "4a38d1b1-868d-4bbf-950a-db62d9350f50",
                user: {
                  first_name:
                    "monikasdfrgthygtrfedfrgthyjuhgfergthyjukjyhgfdsfgthyjuyhgfdwefrgthyjuhgfdsfghyjuyhtgrfedwefrgthyjuk",
                  last_name: "chandran",
                  phone_number: "+91 23456-78909",
                  role: 6,
                },
                organization: {
                  name: "shru costeward org and something new to check the space",
                  hero_image: null,
                  phone_number: "+91 23456-78909",
                  logo: "/media/organizations/logos/bitter_VVN9G1p.jpeg",
                },
              },
              created_at: "2023-06-08T03:22:21.832032Z",
              updated_at: "2023-06-09T12:58:02.663128Z",
              ticket_title: "3 tickets",
              description: "df",
              category: "user_accounts",
              ticket_attachment: null,
              status: "open",
            },
          ],
        })
      );
    }
  ),
  rest.post(
    "https://datahubethdev.farmstack.co/be/participant/support_ticket/list_tickets/?page=2",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          count: 7,
          next: null,
          previous:
            "https://datahubethdev.farmstack.co/be/participant/support_ticket/list_tickets/",
          results: [
            {
              id: "0adfcaf0-6f47-4c95-ade5-c6c4c12eb049",
              user_map: {
                id: "4a38d1b1-868d-4bbf-950a-db62d9350f50",
                user: {
                  first_name:
                    "monikasdfrgthygtrfedfrgthyjuhgfergthyjukjyhgfdsfgthyjuyhgfdwefrgthyjuhgfdsfghyjuyhtgrfedwefrgthyjuk",
                  last_name: "chandran",
                  phone_number: "+91 23456-78909",
                  role: 6,
                },
                organization: {
                  name: "shru costeward org and something new to check the space",
                  hero_image: null,
                  phone_number: "+91 23456-78909",
                  logo: "/media/organizations/logos/bitter_VVN9G1p.jpeg",
                },
              },
              created_at: "2023-06-07T20:04:40.982617Z",
              updated_at: "2023-06-07T20:04:40.982645Z",
              ticket_title: "costeward ticket of shru",
              description: "doubt in connectors need admin support",
              category: "connectors",
              ticket_attachment: null,
              status: "closed",
            },
            {
              id: "f87e7bca-0769-448d-a1cb-e5958c8ffb3e",
              user_map: {
                id: "65ffcfd2-acb6-431d-8969-dc53ecfd8723",
                user: {
                  first_name: "sdfa",
                  last_name: "sf,nsdlkj",
                  phone_number: "+91 9996957626",
                  role: 6,
                },
                organization: {
                  name: "Jai's Demo Organization_1",
                  hero_image: null,
                  phone_number: "+91 86969-57626",
                  logo: "/media/organizations/logos/Akasa_Air_Logo.png",
                },
              },
              created_at: "2023-06-06T06:02:38.489507Z",
              updated_at: "2023-06-06T06:02:38.489527Z",
              ticket_title: "Some Ticket Title",
              description: "Some description",
              category: "datasets",
              ticket_attachment: null,
              status: "open",
            },
          ],
        })
      );
    }
  ),
  rest.get(
    UrlConstant.base_url + UrlConstant.support_ticket + ":id" + "/",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          ticket: {
            id: "e1fa439e-5216-4459-89ff-a446b13aef62",
            user_map: {
              id: "4a38d1b1-868d-4bbf-950a-db62d9350f50",
              user: {
                first_name:
                  "monikasdfrgthygtrfedfrgthyjuhgfergthyjukjyhgfdsfgthyjuyhgfdwefrgthyjuhgfdsfghyjuyhtgrfedwefrgthyjuk",
                last_name: "chandran",
                phone_number: "+91 23456-78909",
                role: 6,
              },
              organization: {
                name: "shru costeward org and something new to check the space",
                hero_image: null,
                phone_number: "+91 23456-78909",
                logo: "/media/organizations/logos/bitter_VVN9G1p.jpeg",
              },
            },
            created_at: "2023-06-08T03:22:52.837095Z",
            updated_at: "2023-07-19T08:51:11.454693Z",
            ticket_title: "6 tickets",
            description: "sdfr",
            category: "others",
            ticket_attachment: null,
            status: "open",
          },
          resolutions: [
            {
              id: "077f8e21-3838-42ae-b3d8-6f3dee9bc103",
              user_map: {
                id: "4a38d1b1-868d-4bbf-950a-db62d9350f50",
                user: {
                  first_name:
                    "monikasdfrgthygtrfedfrgthyjuhgfergthyjukjyhgfdsfgthyjuyhgfdwefrgthyjuhgfdsfghyjuyhtgrfedwefrgthyjuk",
                  last_name: "chandran",
                  phone_number: "+91 23456-78909",
                  role: 6,
                },
                organization: {
                  name: "shru costeward org and something new to check the space",
                  hero_image: null,
                  phone_number: "+91 23456-78909",
                  logo: "/media/organizations/logos/bitter_VVN9G1p.jpeg",
                },
              },
              created_at: "2023-06-12T10:35:36.200427Z",
              updated_at: "2023-06-12T10:35:36.200456Z",
              resolution_text: "SWDEF",
              solution_attachments: null,
              ticket: "e1fa439e-5216-4459-89ff-a446b13aef62",
            },
            {
              id: "3c0c1fff-4b20-4b90-a899-db04aaffa0a7",
              user_map: {
                id: "3c9071cb-5fe1-4cdb-8e15-7961c065989b",
                user: {
                  first_name: "Shruthi",
                  last_name: "",
                  phone_number: "+91 25123-45678",
                  role: 1,
                },
                organization: {
                  name: "DG",
                  hero_image: null,
                  phone_number: "+254456789873",
                  logo: "/media/organizations/logos/carssss_rRltuAr.jpeg",
                },
              },
              created_at: "2023-06-13T05:29:39.748781Z",
              updated_at: "2023-06-13T05:29:39.748809Z",
              resolution_text: "sawdefrgt",
              solution_attachments: null,
              ticket: "e1fa439e-5216-4459-89ff-a446b13aef62",
            },
            {
              id: "171d9c75-0e8c-4c66-b622-f64f2fb48710",
              user_map: {
                id: "3c9071cb-5fe1-4cdb-8e15-7961c065989b",
                user: {
                  first_name: "Shruthi",
                  last_name: "",
                  phone_number: "+91 25123-45678",
                  role: 1,
                },
                organization: {
                  name: "DG",
                  hero_image: null,
                  phone_number: "+254456789873",
                  logo: "/media/organizations/logos/carssss_rRltuAr.jpeg",
                },
              },
              created_at: "2023-06-13T05:29:49.231527Z",
              updated_at: "2023-06-14T11:53:47.140565Z",
              resolution_text: "sdfvsdf",
              solution_attachments:
                "/media/support_resolutions/resolutions/c4611_sample_explain_kDBYLhi.pdf",
              ticket: "e1fa439e-5216-4459-89ff-a446b13aef62",
            },
            {
              id: "2b8df637-4184-4941-a112-9f12e0139903",
              user_map: {
                id: "4a38d1b1-868d-4bbf-950a-db62d9350f50",
                user: {
                  first_name:
                    "monikasdfrgthygtrfedfrgthyjuhgfergthyjukjyhgfdsfgthyjuyhgfdwefrgthyjuhgfdsfghyjuyhtgrfedwefrgthyjuk",
                  last_name: "chandran",
                  phone_number: "+91 23456-78909",
                  role: 6,
                },
                organization: {
                  name: "shru costeward org and something new to check the space",
                  hero_image: null,
                  phone_number: "+91 23456-78909",
                  logo: "/media/organizations/logos/bitter_VVN9G1p.jpeg",
                },
              },
              created_at: "2023-06-15T11:39:28.700977Z",
              updated_at: "2023-06-15T11:39:28.701004Z",
              resolution_text: "vbnm",
              solution_attachments:
                "/media/support_resolutions/resolutions/c4611_sample_explain_QkTpmEp.pdf",
              ticket: "e1fa439e-5216-4459-89ff-a446b13aef62",
            },
          ],
          logged_in_organization: {
            org_id: "ac35763e-bfce-4bf8-bb26-3c98616600b6",
            org_logo: "/media/organizations/logos/1653272245246.jpeg",
          },
        })
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.support_resolution,
    (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({
          id: "7a13f0f4-fcce-44d8-b902-3f5e1fa3b52c",
          created_at: "2023-07-21T07:12:57.479135Z",
          updated_at: "2023-07-21T07:12:57.479160Z",
          resolution_text: "sampple",
          solution_attachments: null,
          ticket: "e1fa439e-5216-4459-89ff-a446b13aef62",
          user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
        })
      );
    }
  ),
  rest.put(
    UrlConstant.base_url + UrlConstant.support_ticket + ":id" + "/",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "a290f396-01b6-4530-a01b-f5ba2b9126f6",
          user_map: {
            id: "4a38d1b1-868d-4bbf-950a-db62d9350f50",
            user: {
              first_name:
                "monikasdfrgthygtrfedfrgthyjuhgfergthyjukjyhgfdsfgthyjuyhgfdwefrgthyjuhgfdsfghyjuyhtgrfedwefrgthyjuk",
              last_name: "chandran",
              phone_number: "+91 23456-78909",
              role: 6,
            },
            organization: {
              name: "shru costeward org and something new to check the space",
              hero_image: null,
              phone_number: "+91 23456-78909",
              logo: "https://datahubethdev.farmstack.co/media/organizations/logos/bitter_VVN9G1p.jpeg",
            },
          },
          created_at: "2023-06-08T03:22:21.832032Z",
          updated_at: "2023-07-21T07:54:01.918285Z",
          ticket_title: "3 tickets",
          description: "df",
          category: "user_accounts",
          ticket_attachment: null,
          status: "open",
        })
      );
    }
  ),
  rest.put(
    UrlConstant.base_url + UrlConstant.support_ticket + ":messageId" + "/",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "2d275ec9-a390-4a23-b864-aaa903044c12",
          ticket: {
            id: "a290f396-01b6-4530-a01b-f5ba2b9126f6",
            user_map: {
              id: "4a38d1b1-868d-4bbf-950a-db62d9350f50",
              user: {
                first_name:
                  "monikasdfrgthygtrfedfrgthyjuhgfergthyjukjyhgfdsfgthyjuyhgfdwefrgthyjuhgfdsfghyjuyhtgrfedwefrgthyjuk",
                last_name: "chandran",
                phone_number: "+91 23456-78909",
                role: 6,
              },
              organization: {
                name: "shru costeward org and something new to check the space",
                hero_image: null,
                phone_number: "+91 23456-78909",
                logo: "https://datahubethdev.farmstack.co/media/organizations/logos/bitter_VVN9G1p.jpeg",
              },
            },
            created_at: "2023-06-08T03:22:21.832032Z",
            updated_at: "2023-07-21T07:54:01.918285Z",
            ticket_title: "3 tickets",
            description: "df",
            category: "user_accounts",
            ticket_attachment: null,
            status: "open",
          },
          created_at: "2023-07-21T07:52:09.346040Z",
          updated_at: "2023-07-21T08:53:50.233763Z",
          resolution_text: "sdfsdgfs",
          solution_attachments: null,
          user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
        })
      );
    }
  ),
  rest.put(
    UrlConstant.base_url + UrlConstant.support_resolution + ":messageId" + "/",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: "7a13f0f4-fcce-44d8-b902-3f5e1fa3b52c",
          ticket: {
            id: "e1fa439e-5216-4459-89ff-a446b13aef62",
            user_map: {
              id: "4a38d1b1-868d-4bbf-950a-db62d9350f50",
              user: {
                first_name:
                  "monikasdfrgthygtrfedfrgthyjuhgfergthyjukjyhgfdsfgthyjuyhgfdwefrgthyjuhgfdsfghyjuyhtgrfedwefrgthyjuk",
                last_name: "chandran",
                phone_number: "+91 23456-78909",
                role: 6,
              },
              organization: {
                name: "shru costeward org and something new to check the space",
                hero_image: null,
                phone_number: "+91 23456-78909",
                logo: "https://datahubethdev.farmstack.co/media/organizations/logos/bitter_VVN9G1p.jpeg",
              },
            },
            created_at: "2023-06-08T03:22:52.837095Z",
            updated_at: "2023-07-19T08:51:11.454693Z",
            ticket_title: "6 tickets",
            description: "sdfr",
            category: "others",
            ticket_attachment: null,
            status: "open",
          },
          created_at: "2023-07-21T07:12:57.479135Z",
          updated_at: "2023-07-22T12:59:08.069374Z",
          resolution_text: "anku1d",
          solution_attachments: null,
          user_map: "206722c0-4a7e-4415-961a-8fd921eb5342",
        })
      );
    }
  ),
  rest.post(
    UrlConstant.base_url + UrlConstant.support_ticket,
    (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({
          id: "e039426b-18a5-418d-bdea-9461740897e1",
          created_at: "2023-07-23T08:39:50.212576Z",
          updated_at: "2023-07-23T08:39:50.212600Z",
          ticket_title: "someticket",
          description: "sample query",
          category: "connectors",
          ticket_attachment: null,
          status: "open",
          user_map: "361d6d8a-a809-4120-aa33-14a213aa4aa1",
        })
      );
    }
  ),
];
