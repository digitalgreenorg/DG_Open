
                                                                **Farmstack 2.0 – HLD Technical**


#**Objective**
The objective of this document is to briefly explain the technical details involved in the development, setup, configuration and usage of FarmStack 2.0.

FarmStack is an open-source data exchange platform. It is built to address the agriculture sector data exchange/sharing needs. However, it can be used in any ecosystem where exchange/sharing of data is happening between participants. The detailed information is available in the ‘README.MD’ file at the below given location.
https://github.com/digitalgreenorg/farmstack-backend/blob/Satischandra-docs-upload/README.md


##**Details**
This technical documention mainly contains details about the below items/modules. 

###**1. Architecture(functional) diagram**
      Please refer the below mentioned folder/document. 
      docs/FS DataHub Functional Diagram V0.2.png

###**2. Data flwo diagram - Provider participant**
      Please refer the below mentioned folder/document.
      docs/DFD_Provider.png 

###**3. Data flow diagram - Consumer participant**
      Please refer the below mentioned folder/document.
      docs/DFD_Consumer.png

###**4. Accounts:**
      accounts/admin.py
          # Register your models here.

      accounts/apps.py

      accounts/models.py
          class UserManager(BaseUserManager):
              """UserManager to manage creation of users"""

          class UserRole(models.Model):
              """UserRole model for user roles of the datahub users""""

          class User(AbstractBaseUser, TimeStampMixin):
              """User model of all the datahub users

          

      accounts/serializers.py
          class UserRoleSerializer(serializers.ModelSerializer):
                """UserRoleSerializer"""

          class UserCreateSerializer(serializers.ModelSerializer):
                """UserCreateSerializer"""

          class UserUpdateSerializer(serializers.ModelSerializer):
                """UserUpdateSerializer"""


      accounts/urls.py

      accounts/utils.py
          class generateKey:
              """Generates OTP"""
              
          class OTPManager:
              """Manages user OTPs in django cache

      accounts/views.py
            class RegisterViewset(GenericViewSet):
                """RegisterViewset for users to register"""

            class LoginViewset(GenericViewSet):
                """LoginViewset for users to register"""

            class ResendOTPViewset(GenericViewSet):
                """ResendOTPViewset for users to register"""

            class VerifyLoginOTPViewset(GenericViewSet):
                """User verification with OTP"""

            class SelfRegisterParticipantViewSet(GenericViewSet):
                """This class handles the participant CRUD operations."""

            
          
**5. Connectors:**
      connectors/__init__.py
      
      connectors/admin.py
          # Register your models here.

      connectors/apps.py
          
      connectors/models.py
          class Connectors(TimeStampMixin):
              """Stores a single connectors entry."""

          class ConnectorsMap(TimeStampMixin):
              """Stores a single connectors entry, related to :model:`datahub_datasetv2file` (DatsetV2File)."""

              

      connectors/serializers.py

      connectors/urls.py

      connectors/views.py
          class ConnectorsViewSet(GenericViewSet):
                """Viewset for Product model"""
          
        

**6. Datahub:**
      datahub/admin.py
          # Register your models here.

      datahub/apps.py

      datahub/database.py

      datahub/models.py
          class Organization(TimeStampMixin):
              """Organization model
                  status:
                  active = 1
                  inactive = 0
              """

          class DatahubDocuments(models.Model):
              """OrganizationDocuments model"""

          class UserOrganizationMap(TimeStampMixin):
              """UserOrganizationMap model for mapping User and Organization model"""

          class Datasets(TimeStampMixin):
              """Datasets model of all the users"""

          class DatasetV2(TimeStampMixin):
              """" Stores a single dataset entry, related to :model:`datahub_userorganizationmap` (UserOrganizationMap).
                    New version of model for dataset - DatasetV2 to store Meta data of Datasets.
              """

          class StandardisationTemplate(TimeStampMixin):
              """ 
              Data Standardisation Model.
              datapoint category - Name of the category for a group of attributes
              datapoint attribute - datapoints for each attribute (JSON)
              """
              
          class Policy(TimeStampMixin):
              """
              Policy documentation Model.
              name - Name of the Policy.
              description - datapoints of each Policy.
              file - file of each policy.
              """

            class DatasetV2File(TimeStampMixin):
              """
              Stores a single file (file paths/urls) entry for datasets with a reference to DatasetV2 instance.
              related to :model:`datahub_datasetv2` (DatasetV2)

              `Source` (enum): Enum to store file type
              `file`: dataset of file type
              `mysql`: dataset of mysql connection
              `postgresql`: dataset of postgresql connection
              """

              class UsagePolicy(TimeStampMixin):
              """
              Policy documentation Model.
              datapoint category - Name of the category for a group of attributes
              datapoint attribute - datapoints for each attribute (JSON)
              """
              
      datahub/serializers.py
              class OrganizationRetriveSerializer(serializers.ModelSerializer):
                  """_summary- Args:serializers (_type_): _description_"""

              class Meta:
                  """_summary_"""

              class OrganizationSerializer(serializers.ModelSerializer):
                  """_summary_Args:serializers (_type_): _description_"""
                  
              class Meta:
                  """_summary_"""

              class UserOrganizationCreateSerializer(serializers.Serializer):
                  """_summary_Args:serializers (_type_): _description_"""


              class UserOrganizationMapSerializer(serializers.ModelSerializer):
                  """_summary_Args:serializers (_type_): _description_"""

              class DropDocumentSerializer(serializers.Serializer):
                    """DropDocumentSerializer class"""

              class PolicyDocumentSerializer(serializers.ModelSerializer):
                    """PolicyDocumentSerializer class"""

              class DatahubThemeSerializer(serializers.Serializer):
                    """DatahubThemeSerializer class"""

                class TeamMemberListSerializer(serializers.Serializer):
                    """Create Team Member Serializer."""

                class TeamMemberCreateSerializer(serializers.ModelSerializer):
                    """Create a Team Member"""

                class TeamMemberDetailsSerializer(serializers.ModelSerializer):
                    """Details of a Team Member"""

                class TeamMemberUpdateSerializer(serializers.ModelSerializer):
                    """Update Team Member"""

                class DatasetSerializer(serializers.ModelSerializer):
                    """_summary_ Args:serializers (_type_): _description_"""

                class DatasetUpdateSerializer(serializers.ModelSerializer):
                    """_summary_Args:serializers (_type_): _description_"""

                class DatasetV2Validation(serializers.Serializer):
                    """Serializer to validate dataset name & dataset description. """

                class DatasetV2TempFileSerializer(serializers.Serializer):
                    """ Serializer for DatasetV2File model to serialize dataset files.
                        Following are the fields required by the serializer:
                        `datasets` (Files, mandatory): Multi upload Dataset files"""

                class DatasetV2FileSerializer(serializers.ModelSerializer):
                    """ Serializer for DatasetV2File model to serialize dataset files.
                        Following are the fields required by the serializer:
                        `id` (int): auto-generated Identifier
                        `dataset` (DatasetV2, FK): DatasetV2 reference object
                        `file` (File, mandatory): Dataset file """

                  class DatasetV2Serializer(serializers.ModelSerializer):
    """
    Serializer for DatasetV2 model to serialize the Meta Data of Datasets.
    Following are the fields required by the serializer:
        `id` (UUID): auto-generated Identifier
        `name` (String, unique, mandatory): Dataset name
        `user_map` (UUID, mandatory): User Organization map ID, related to :model:`datahub_userorganizationmap` (UserOrganizationMap)
        `description` (Text): Dataset description
        `category` (JSON, mandatory): Category as JSON object
        `geography` (String): Geography of the dataset
        `data_capture_start` (DateTime): Start DateTime of the dataset captured
        `data_capture_end` (DateTime): End DateTime of the dataset captured
        `datasets` (Files, FK, read only): Dataset files stored
        `upload_datasets` (List, mandatory): List of dataset files to be uploaded
    """

                class DatahubDatasetsV2Serializer(serializers.ModelSerializer):
                      """Serializer for filtered list of datasets."""

        
      datahub/urls.py

      datahub/views.py
          class DefaultPagination(pagination.PageNumberPagination):
              """Configure Pagination"""
          
          class TeamMemberViewSet(GenericViewSet):
              """Viewset for Product model"""
          
          class OrganizationViewSet(GenericViewSet):
              Organisation Viewset.

          class ParticipantViewSet(GenericViewSet):
              This class handles the participant CRUD operations.
          
          class MailInvitationViewSet(GenericViewSet):
              """This class handles the mail invitation API views."""

          class DropDocumentView(GenericViewSet):
              """View for uploading organization document files"""

          class DocumentSaveView(GenericViewSet):
            """View for uploading all the datahub documents and content"""

        class DatahubThemeView(GenericViewSet):
            """View for modifying datahub branding"""

        class SupportViewSet(GenericViewSet):
            """This class handles the participant support tickets CRUD operations."""

        class DatahubDatasetsViewSet(GenericViewSet):
            """This class handles the participant Datsets CRUD operations"""

        class DatahubDashboard(GenericViewSet):
            """Datahub Dashboard viewset"""

        class DatasetV2ViewSet(GenericViewSet):
            """
              ViewSet for DatasetV2 model for create, update, detail/list view, & delete endpoints.
              **Context**
            ``DatasetV2``
            An instance of :model:`datahub_datasetv2`
            **Serializer**
            ``DatasetV2Serializer``
            :serializer:`datahub.serializer.DatasetV2Serializer`

            **Authorization**
            ``ROLE`` only authenticated users/participants with following roles are allowed to make a POST request to this endpoint.
            :role: `datahub_admin` (:role_id: `1`)
            :role: `datahub_participant_root` (:role_id: `3`)
          """

          class DatasetV2ViewSetOps(GenericViewSet):
          """
              A viewset for performing operations on datasets with Excel files.

              This viewset supports the following actions:

              - `dataset_names`: Returns the names of all datasets that have at least one Excel file.
              - `dataset_file_names`: Given two dataset names, returns the names of all Excel files associated with each dataset.
              - `dataset_col_names`: Given the paths to two Excel files, returns the column names of each file as a response.
              - `dataset_join_on_columns`: Given the paths to two Excel files and the names of two columns, returns a JSON response with the result of an inner join operation on   the two files based on the selected columns.
          """

          class DatahubNewDashboard(GenericViewSet):
                """Datahub Dashboard viewset"""

      
**9. Participant Management:**
        participant/apps.py

        participant/models.py
            class SupportTicket(TimeStampMixin):
                """SupportTicket model of all the participant users"""

            class Department(TimeStampMixin):
                """Department model of all the users"""

            class Project(TimeStampMixin):
                """Project model of all the users"""

            class Connectors(TimeStampMixin):
                """Connectors model of all the users"""

            class ConnectorsMap(TimeStampMixin):
                """ConnectorsMap model of all the users"""

          participant/serializers.py
              class TicketSupportSerializer(serializers.ModelSerializer):
                  """_summary_

              class DatasetSerializer(serializers.ModelSerializer):
                  """_summary_
                      Args:
                      serializers (_type_): _description_
                  """
          participant/urls.py

          participant/views.py
              class ParticipantSupportViewSet(GenericViewSet):
                  """This class handles the participant CRUD operations."""

              class ParticipantDatasetsViewSet(GenericViewSet):
                  """ This class handles the participant Datsets CRUD operations. """

            class ParticipantConnectorsViewSet(GenericViewSet):
                  """ This class handles the participant Datsets CRUD operations. """

            class ParticipantConnectorsMapViewSet(GenericViewSet):
                  """ This class handles the participant Datsets CRUD operations. """

            class ParticipantDepatrmentViewSet(GenericViewSet):
                  """ This class handles the participant Datsets CRUD operations. """

            class ParticipantProjectViewSet(GenericViewSet):
                  """This class handles the participant Datsets CRUD operations. """

            class DataBaseViewSet(GenericViewSet):
                  """ This class handles the participant external Databases  operations. """

            
        
**10. WebApp:**


**11. APIs:**
            Please refer the postman link, 
            https://farmstack.postman.co/workspace/Team-Workspace~969c8a4f-ed74-4a62-8242-136e8f19f004/collection/21462346-53d41ee4-4726-42fe-8b41-49b188d8ee1a?action=share&creator=25788189

            
**12. Usage Policy:**

**13. Data Joining:**

**14. Dashboard:**

**15. Installation:**
      Please refer the path, docs/INSTALLATION_GUIDE.md
      
**16. System Requirement**
      Please refer the path, docs/SYSTEM_REQUIREMENTS.md
