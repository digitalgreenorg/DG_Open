import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";
import { getUserLocal } from "../../Utils/Common";
import settingController from "../controllers/setting.controller";

export const getBaseUrl = () => {
  return process.env.REACT_APP_BASEURL;
};
export const onboardingHandler = [
  // pass your url in the first parameter
  rest.get(
    `${UrlConstant.base_url}${UrlConstant.profile}:userId/`,
    (req, res, ctx) => {
      console.log("IN GET");
      // ctx.status(401),
      // ctx.json({
      //   code: "token_not_valid",
      //   access: "Given token not valid for any token type",
      //   messages: [
      //     {
      //       token_class: "AccessToken",
      //       token_type: "access",
      //       message: "Token is invalid or expired",
      //     },
      //   ],
      //   0: {
      //     token_class: "AccessToken",
      //     token_type: "access",
      //     message: "Token is invalid or expired",
      //   },
      // })
      //   );
      // } else {
      return res(
        ctx.status(200),
        ctx.json({
          id: "id",
          email: "dgemail@digitalgreen.org",
          first_name: "digital",
          last_name: "green",
          phone_number: "+91 98989-89898",
          role: 1,
          subscription: null,
          profile_picture: null,
          on_boarded: true,
          approval_status: true,
          on_boarded_by: null,
        })
      );
      // }
    }
  ),
  rest.put(
    `${UrlConstant.base_url}${UrlConstant.profile}:userId/`,
    (req, res, ctx) => {
      console.log("IN PUT");
      // if (userId === "error") {
      //   console.log(userId, "put call");

      //   return res(
      //     ctx.status(400),
      //     ctx.json({
      //       email: ["This field may not be blank."],
      //       phone_number: ["This field may not be blank."],
      //       first_name: ["This field may not be blank."],
      //       last_name: ["This field may not be blank."],
      //     })
      //   );
      // } else if (userId === "status403") {
      //   // console.log(userId, "put call");

      //   return res(
      //     ctx.status(403),
      //     ctx.json({
      //       detail: ["Something went wrong"],
      //     })
      //   );
      // } else if (userId == "token_failure") {
      //   return res(
      //     ctx.status(400),
      //     ctx.json({
      //       code: "token_not_valid",
      //       detail: "Given token not valid for any token type",
      //       messages: [
      //         {
      //           token_class: "AccessToken",
      //           token_type: "access",
      //           message: "Token is invalid or expired",
      //         },
      //       ],
      //       0: {
      //         token_class: "AccessToken",
      //         token_type: "access",
      //         message: "Token is invalid or expired",
      //       },
      //     })
      //   );
      // }a else {
      return res(
        ctx.status(201),
        ctx.json({
          message: "updated user details",
          response: {
            approval_status: true,
            email: "dgemail@digitalgreen.org",
            first_name: "digital",
            last_name: "green",
            phone_number: "+91 98989-89898",
            on_boarded: true,
            on_boarded_by: null,
            profile_picture: null,
            role: 1,
          },
        })
      );
    }
    // }
  ),
  rest.get(`${getBaseUrl()}${UrlConstant.org}:userId/`, (req, res, ctx) => {
    console.log("calling org get");
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: "userid",
        },
        organization: {
          id: "orgid",
          org_email: "dg@digitalgreen.com",
          website: "https://www.digitalgreen.org",
          name: "Digital green",
          address: {
            city: "",
            address: "4th block, Koramangala, New Hp Petrol pump, Bangalore",
            country: "Argentina",
            pincode: "12345678654321",
          },
          phone_number: "+91 97380-19097",
          logo: "/media/organizations/logos/KALRO_PcWNbzH.png",
          hero_image: null,
          org_description:
            "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices.",
          status: true,
        },
      })
    );
  }),
  rest.put(`${getBaseUrl()}${UrlConstant.org}:userId/`, (req, res, ctx) => {
    console.log("calling org get");
    return res(
      ctx.status(201),
      ctx.json({
        user: {
          id: "0f76cb90-2394-499b-9b60-bf4cad3751a4",
        },
        organization: {
          id: "5c6d28fb-8603-417c-95db-ecf2e85f4f07",
          org_email: "dg@digitalgreen.com",
          website: "https://www.digitalgreen.org",
          name: "Digital green",
          address: {
            country: "Argentina",
            pincode: "12345678654321",
            address: "4th block, Koramangala, New Hp Petrol pump, Bangalore",
            city: "",
          },
          phone_number: "+91 97380-19097",
          logo: "/media/organizations/logos/KALRO_PcWNbzH.png",
          hero_image: null,
          org_description:
            "Digital Green is a non-profit organization that was founded in 2006 and is based in Koramangala, Bangalore. The organization uses technology to empower smallholder farmers in developing countries by sharing agricultural knowledge and practices.",
          status: true,
        },
        user_map: "a4afc139-5829-49a4-8131-9021eceb4dd6",
        org_id: "5c6d28fb-8603-417c-95db-ecf2e85f4f07",
      })
    );
  }),
  rest.get(`${getBaseUrl()}${UrlConstant.refesh}`, (req, res, ctx) => {
    console.log("calling refresh token");
    return res(
      ctx.status(200),
      ctx.json({
        access: "new token",
      })
    );
  }),
  rest.get(
    `${getBaseUrl()}${UrlConstant.add_category_edit_category}`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          category1: ["subcat1", "subcat2"],
        })
      );
    }
  ),
  rest.post(
    `${getBaseUrl()}${UrlConstant.add_category_edit_category}`,
    (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({
          category1: ["subcat1", "subcat2"],
        })
      );
    }
  ),
];
