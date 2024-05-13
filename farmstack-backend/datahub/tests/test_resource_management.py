from django.test import TestCase
from django.urls import reverse, resolve

class ResourceManagementTest(TestCase):
    '''
    Test cases for ResourceManagement by user.
    '''
    # @classmethod
    # def setUpClass(self):
    #     # set_up_class is called only once for every class.
    #     self.url = "/datahub/resource-management"

    # def test_check_url(self):
    #     # URL -- Exist or Not.
    #     curr_url = reverse("resource-management")
    #     assert self.url == curr_url
        
    # def test_url_map_to_view(self):
    #     # URL -- Exist and View Execution.
    #     # print("******", resolve(self.url))
    #     assert resolve(self.url)._func_path == "datahub.views.ResourceManagementViewSet"

    # def test_create_resource_status(self):
    #     # POST -- Create --> Check if the record is created.
    #     pass

    # def test_create_resource(self):
    #     # POST -- Response
    #     pass

    # def test_create_resource_without_file(self):
    #     # -- Try to create without file. -- Atleast one file is mandatory.
    #     pass

    # def test_create_resource_without_title(self):
    #     #       -- Try to create without title. -- Title is mandatory.
    #     pass
    
    # def test_create_resource_with_more_title_length(self):
    #     #       -- Try to create with title more than 20 characters -- Title cannot be more than 20 characters.
    #     pass

    # def test_create_resource_with_more_description_length(self):
    #     #       -- Try to create description more than 100 characters -- Cannot exceed 100 characters error
    #     pass
    
    # def test_create_resource_without_description(self):
    #     # -- Try to create without description. -- Description is mandatory.
    #     pass

    # def test_create_resource_with_multiple_files(self):
    #     # -- Try to create with multiple files. -- Success message.
    #     pass

    # def test_create_resource_with_unsupported_file(self):
    #     # -- Try to create with unsuppported file format. -- Unsupported file format.
    #     pass

    # def test_create_resource_for_another_user(self):
    #     # POST -- Create --> For different User_MAP_ID.
    #     pass

    # def test_get_resource_list_for_me(self):
    #     # GET -- List --> Get the list of Resources By me.
    #     pass

    # def test_no_resource_from_other_users_resource_list(self):
    #     # GET -- List --> Check if there is no record of someone else.
    #     pass

    # def test_no_resource_from_me_in_others_users_resource_list(self):
    #     # GET -- List --> Check if there is no record of someone else.
    #     pass

    # def test_get_list_of_resources_of_other_users(self):
    #     # GET -- List --> Get the list of Resources By Others.
    #     pass

    # def test_get_resource_detail(self):
    #     # GET -- Detail --> Resource Details.
    #     pass

    # def test_get_invalid_resource_details(self):
    #     # GET -- Detail --> 404 Response -- File Not Found.
    #     pass

    # def test_update_title_of_resource(self):
    #     # PUT -- Update Resource --> Update Title.
    #     pass

    # def test_update_description_of_resource(self):
    #     # PUT -- Update Resource --> Update Description.
    #     pass

    # def test_update_title_more_than_max_length(self):
    #     # PUT -- Try to Update with title more than 20 characters -- Title cannot be more than 20 characters.
    #     pass

    # def test_update_description_more_than_max_length(self):
    #     # PUT -- Try to Update description more than 100 characters -- Cannot exceed 100 characters error
    #     pass

    # def test_update_add_files_to_resource(self):
    #     # PUT -- Update Resource --> Add File. --> 2 files should be there.
    #     pass
    
    # def test_remove_file_from_resource(self):
    #     # PUT -- Update Resource --> Remove single file  --> 1 file should be there.
    #     pass

    # def test_remove_only_file_from_resource(self):
    #     # PUT -- Update Resource --> Remove existing single file  --> Atleast one file error.
    #     pass

    # def test_invalid_resource_response(self):
    #     # PUT -- Update Resource --> Invalid ID --> 404 response code.
    #     pass

    # def test_delete_non_existant_resource_by_id(self):
    #     # DELETE --> Delete non existing resource --> 404 resposne.
    #     pass

    # def test_delete_resource_by_id(self):
    #     # DELETE --> Valid --> Remove Resource from DB.
    #     pass
