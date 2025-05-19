const UrlConstant = {
  // base_url: process.env.REACT_APP_BASEURL,
  // base_url_without_slash: process.env.REACT_APP_BASEURL_without_slash,
  // view_data_connector: process.env.REACT_APP_BASEURL_without_slash_view_data,

  base_url:
    window?.ENV_VARS?.REACT_APP_BASEURL || process.env.REACT_APP_BASEURL,
  base_url_without_slash:
    window?.ENV_VARS?.REACT_APP_BASEURL_without_slash ||
    process.env.REACT_APP_BASEURL_without_slash,
  view_data_connector:
    window?.ENV_VARS?.REACT_APP_BASEURL_without_slash_view_data ||
    process.env.REACT_APP_BASEURL_without_slash_view_data,

  // base_url: "https://ada8-106-51-85-143.in.ngrok.io/",
  // base_url_without_slash: "https://ada8-106-51-85-143.in.ngrok.io",
  login: "accounts/login/",
  login_with_password: "accounts/login/login_with_pwd/",
  reset_password: "accounts/login/reset/",
  otp: "accounts/otp/",
  refesh: "token/refresh/",
  participant: "datahub/participant/",
  costewardlist_selfregister: "datahub/participant/get_list_co_steward/",
  support: "datahub/support/filters_tickets/",
  resolution: "datahub/support/",
  inviteparticipant: "datahub/send_invite/",
  team_member: "datahub/team_member/",
  resend_otp: "accounts/resend_otp/",
  org: "datahub/organization/",
  profile: "accounts/register/",
  branding: "datahub/theme/",
  policies_files_upload: "datahub/drop_document/",
  policies_save_upload: "datahub/save_documents/",
  delete_policies_drop_document: "datahub/drop_document/delete/",
  dataset_filter: "datahub/dataset/v2/filters_data/",
  dataset_filter_participant: "datahub/dataset/v2/filters_data/",
  dataset_list: "datahub/dataset/v2/dataset_filters/",
  costeward_onboarded_dataset: "datahub/dataset/v2/dataset_filters/",
  //costeward_onboarded_dataset: "datahub/dataset/v2/filters_data/",
  // dataset_list:"datahub/dataset/v2/filters_data/",
  dataset_participant_list: "datahub/dataset/v2/dataset_filters/",
  department: "participant/department/",
  // dataset_list: 'datahub/datasets/',
  dataset: "datahub/datasets/",
  dataseteth: "datahub/dataset/v2/temp_datasets/",
  check_dataset_name_and_description_in_database:
    "datahub/dataset/v2/validate_dataset/",
  datasetethcancel: "datahub/dataset/v2/temp_datasets/?delete_dir=True",
  datasetview: "datahub/dataset/v2/",
  datasetview_guest: "microsite/datasets/dataset_filters/",
  datasetview__guest: "microsite/datasets/",
  verify_local_data_of_user: "microsite/microsite_user_data/user_data/",
  datasetparticipant: "participant/datasets/",
  onboarded: "accounts/login/onboarded/",

  // new_datasets_v2 api
  add_basic_dataset: "datahub/new_dataset_v2/",
  upload_files: "datahub/dataset_files/",
  list_of_files: "datahub/dataset_files/?dataset=",
  get_file_columns: "datahub/dataset/v2/get_dataset_file_columns/",
  standardised_file: "datahub/dataset_files/",
  usage_policy: "datahub/dataset_files/",
  delete_dataset: "datahub/new_dataset_v2/",
  download_file: "protected-media/?id=",
  public_download_file: "microsite/microsite_media_view?id=",
  ask_for_permission: "datahub/usage_policies/",
  grant_for_permission: "datahub/usage_policies/",

  guest_organization_details: "microsite/admin_organization/",
  guest_dataset_listing: "microsite/datasets/",
  guest_dataset_filters: "microsite/datasets/filters_data/",
  guest_dataset_filtered_data: "microsite/datasets/dataset_filters/",
  connector_filter: "participant/connectors/filters_data/",
  connector_list: "participant/connectors/connectors_filters/",
  microsite_contact_form: "microsite/contact_form/",
  microsite_admin_organization: "microsite/admin_organization",
  list_of_dataset: "participant/datasets/list_of_datasets/",
  departments_connector_list: "participant/department/",
  project_list: "participant/project/",
  connector: "participant/connectors/",
  microsite_legal_documents: "/microsite/legal_documents/",
  consumer_paring_request: "participant/connectors_map/",
  provider_connectors: "participant/connectors/get_connectors/?dataset_id=",
  microsite_theme: "microsite/theme/",
  datahub_dashboard: "datahub/dashboard/",
  add_project: "/participant/project/",
  register_participant: "accounts/self_register/",
  project_listing_page_url: "participant/project/project_list/",
  search_dataset_end_point_admin: "datahub/dataset/v2/dataset_filters/",
  search_dataset_end_point_participant: "datahub/dataset/v2/dataset_filters/",
  search_dataset_end_point_guest: "microsite/datasets/dataset_filters/",
  microsite_search_participants: "microsite/participant/",
  microsite_costeward_end_point:
    "microsite/participant/organizations/?co_steward=True",
  microsite_participant_end_point: "microsite/participant/organizations/",
  microsite_participant_end_point_new: "microsite/participant/",
  microsite_get_policy: "microsite/policy/",
  microsite_category: "microsite/datasets/category/",
  microsite_list_category: "microsite/categories/",

  connection_to_db_end_point: "participant/database/database_config/",
  get_column_from_table_name: "participant/database/database_col_names/",
  send_columns_to_export: "participant/database/database_xls_file/",
  admin_dataset_new_dataset_v2: "datahub/dataset/v2/",
  live_api: "participant/database/database_live_api_export/",
  add_category_edit_category: "datahub/dataset/v2/category/",
  co_steward_add: "datahub/participant/",

  // category new APIs
  list_category: "datahub/categories/",
  add_category: "datahub/categories/",
  update_category: "datahub/categories/",
  delete_category: "datahub/categories/",

  add_subcategory: "datahub/subcategories/",
  update_subcategory: "datahub/subcategories/",
  delete_subcategory: "datahub/subcategories/",

  //integration
  get_org_name_list: "datahub/dataset_ops/organization/",
  get_dataset_name_list: "datahub/dataset_ops/datasets_names/",
  get_files_for_selected_datasets: "datahub/dataset_ops/datasets_file_names/",
  get_columns_for_selected_files: "datahub/dataset_ops/datasets_col_names/",
  joining_the_table: "datahub/dataset_ops/datasets_join_condition/",

  // Standardization

  standardization_post_data: "datahub/standardise/",
  standardization_update_data:
    "datahub/standardise/update_standardisation_template/",
  standardization_delete_category: "datahub/standardise/",
  standardization_get_data: "datahub/standardise/",
  standardization_get_all_file_name:
    "datahub/dataset/v2/temp_dataset_files/?dataset_name=",
  standardization_get_file_columns:
    "datahub/dataset/v2/temp_dataset_file_columns/",
  standardise_file: "datahub/dataset/v2/standardise/",

  joining_the_table: "connectors/integration/",
  integration_connectors: "connectors/",
  list_of_connectors: "connectors/",
  microsite_list_connectors: "microsite/connectors/",
  guest_user_connector_view: "microsite/connectors/",

  //new v2 urls
  datahub_policy: "datahub/policy/",
  new_datahub_dashboard: "datahub/newdashboard/dashboard/",

  //new support
  support_ticket: "participant/support_ticket/",
  support_ticket_tab: "/participant/support_ticket/list_tickets/",
  support_resolution: "participant/ticket_resolution/",
  search_support_ticket: "/participant/support_ticket/search_support_tickets/",

  //api request
  get_api_request_list: "",

  // dataset dashboard

  get_dashboard_for_dataset: "datahub/new_dataset_v2/",
  get_dashboard_for_dataset_guest_user: "microsite/datasets/",

  // resources
  resource_endpoint: "datahub/resource_management/",
  resource_endpoint_filter: "datahub/resource_management/resources_filter/",
  microsite_resource_endpoint: "microsite/resources/",
  microsite_resource_endpoint_filter: "microsite/resources/resources_filter/",
  file_resource: "datahub/resource_file/",
  content_file: "datahub/files/fetch_files/",
  resource_ask_for_permission: "datahub/resource_usage_policies/",
  resource_grant_for_permission: "datahub/resource_usage_policies/",
  resource_chat_api: "datahub/embeddings/chat_api/",
  resource_messages: "datahub/messages/?resource=",
  resource_fetch_videos: "datahub/resource_file/fetch_videos/?url=",
  resource_file_embeddings_and_chunks:
    "datahub/embeddings/embeddings_and_chunks/?resource_file=",
  ai_resource_file_embeddings_and_chunks:
    "ai/embeddings/embeddings_and_chunks/?resource_file=",
  resource_chat_history: "datahub/embeddings/chat_histroy/",
  resource_like_dislike: "datahub/messages/",
  resource_live_api: "datahub/resource_file/resource_live_api_export/",

  // feedback
  feedback_endpoint: "microsite/feedback/",
  // feedback_bot_url:
  //   "https://stage-vistaar.digitalgreen.org/up/telegram_app/get_feedback_dump/",

  feedback_bot_url:
    "https://farmerchat.farmstack.co/vistaar/telegram_app/get_feedback_dump/",
  feedback_download_url:
    "https://stage-vistaar.digitalgreen.org/up/telegram_app/get_feedback_dump_excel/",

  // dahsboard
  get_dashboard: "microsite/datasets_file/bot_dashboard/",
};

export default UrlConstant;
