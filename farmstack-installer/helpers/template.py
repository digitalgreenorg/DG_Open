import sys
import os
import fnmatch
from string import Template as PyTemplate
from helpers.cli import CLI

class Template:

    @classmethod
    def render(cls, config):
        dict_ = config.get_dict()
        template_variables = cls.__get_template_variables(config)
        templates_path_parent = config.get_env_files_path()
        environment_path_parent = os.path.realpath(os.path.normpath(os.path.join(
            dict_['base_dir'],
            'docker')))
        # Environment variables for all services.
        cls.__write_templates(template_variables, templates_path_parent, environment_path_parent)
        # Database default config for usm.
        cls.__write_templates_admin_config(template_variables, os.path.join(dict_['base_dir'], 'templates', 'backend'), environment_path_parent)
        # Nginx config
        cls.__write_templates_nginx_config(template_variables, os.path.join(dict_['base_dir'], 'templates', 'nginx'), environment_path_parent)

    @staticmethod
    def __write_templates_admin_config(template_variables_, template_root_, env_root_):

        with open(os.path.join(template_root_, 'default-admin-config.yaml.tpl'), 'r') as template:
            t = ExtendedPyTemplate(template.read(), template_variables_)
            template.close()
            
        with open(os.path.join(env_root_, 'config', 'admin.yaml'),'w') as f:
            f.write(t.substitute(template_variables_))
            f.close()
    
    @staticmethod
    def __write_templates_nginx_config(template_variables_, template_root_, env_root_):

        with open(os.path.join(template_root_, 'template.conf.tpl'), 'r') as template:
            t = ExtendedPyTemplate(template.read(), template_variables_)
            template.close()

        with open(os.path.join(env_root_, 'config', 'nginx.conf'),'w') as f:
            f.write(t.substitute(template_variables_))
            f.close()
        print("*** DONE")

    @staticmethod
    def __write_templates(template_variables_, template_root_, env_root_):
        
        with open(os.path.join(template_root_, 'env.txt.tpl'), 'r') as template:
            t = ExtendedPyTemplate(template.read(), template_variables_)
            template.close()

        # print(template_variables_)
        with open(os.path.join(env_root_, '.env'),'w') as f:
            f.write(t.substitute(template_variables_))
            f.close()
        

    
    @staticmethod
    def __get_template_variables(config):
        dict_ = config.get_dict()
        # print("Here : ", dict_)
        try:

            return {
            # Front end
            'REACT_APP_BASEURL':dict_['backend_service'],
            'REACT_APP_BASEURL_without_slash':dict_['backend_service_without_slash'],
            'REACT_APP_BASEURL_without_slash_view_data': dict_['backend_service_view_data'],
            #Backend

            'SENDGRID_API_KEY' : dict_['sendgrid_key'],
            'EMAIL_HOST_USER' : dict_['sendgrid_registered_email'],
            'DATAHUB_NAME': 'www.digitalgreen.org',
            'DATAHUB_SITE': dict_['datahub_site'],

            #Database
            # 'POSTGRES_DB' : dict_['datahub_db_name'],
            'POSTGRES_DB' : 'postgres',
            'POSTGRES_USER' : dict_['datahub_db_user'],
            'POSTGRES_PASSWORD' : dict_['datahub_db_user_password'],
            'POSTGRES_HOST_AUTH_METHOD' : 'trust',
            'PORT': '5432',
            'HOST': 'db',

            # NGINX
            'request_uri' : '$request_uri',
            'uri' : '$uri',
            'http_host': '$http_host',
            'remote_addr': '$remote_addr',
            'proxy_add_x_forwarded_for':'$proxy_add_x_forwarded_for',
            'scheme': '$scheme',
            'PUBLIC_DOMAIN': dict_['public_domain'],
            'DATAHUB_ADMIN_NAME': dict_['datahub_admin_name'],
            'DATAHUB_ADMIN_EMAIL': dict_['datahub_admin_email'],
            # YAML Files
            'DATAHUB_UI_VERSION': '1.1.0',
            'DATAHUB_API_VERSION': '1.1.0',
            'DATAHUB_DB_VERSION' : 'latest',

            # Backend Additional AI Variables.
            'OPENAI_API_KEY': dict_['openai_api_key'],
            'SMTP_SERVER': dict_['smtp_server'],
            'SMTP_PORT': dict_['smtp_port'],
            'SMTP_USER': dict_['smtp_user'],
            'SMTP_PASSWORD': dict_['smtp_password'],
            'QDRANT_HOST': dict_['qdrant_host'],
            'YOUTUBE_API_KEY': dict_['youtube_api_key'],
            'STORAGE': dict_['media_storage'],
            'REDIS_HOST':'localhost',
            'REACT_APP_LOGIN_WITH_PASSWORD': 'true'
            }
        except Exception as err:
            print(err)
            CLI.colored_print('Issue with Configuration file.', CLI.COLOR_ERROR)
            sys.exit(1)

class ExtendedPyTemplate(PyTemplate):
    """
    Basic class to add conditional substitution to `string.Template`

    """
    IF_PATTERN = '{{% if {} %}}'
    ENDIF_PATTERN = '{{% endif {} %}}'

    def __init__(self, template, template_variables_):
        for key, value in template_variables_.items():
            if self.IF_PATTERN.format(key) in template:
                if value:
                    if_pattern = r'{}\s*'.format(self.IF_PATTERN.format(key))
                    endif_pattern = r'\s*{}'.format(
                        self.ENDIF_PATTERN.format(key))
                    template = re.sub(if_pattern, '', template)
                    template = re.sub(endif_pattern, '', template)
                else:
                    pattern = r'{}(.|\s)*?{}'.format(
                        self.IF_PATTERN.format(key),
                        self.ENDIF_PATTERN.format(key))
                    template = re.sub(pattern, '', template)
        super(ExtendedPyTemplate, self).__init__(template)