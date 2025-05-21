import json
import subprocess
import os
import time
from helpers.config import Config
from helpers.template import Template
from helpers.cli import CLI
from urllib.request import urlopen
from version import __version_code__


class Command:
    
    @classmethod
    def compose_steward(cls):
        config = Config()
        dict_ = config.get_dict()

        '''
        TODO:
        1. Check if configuration exist. Load or Discard.
        2. Ask where do you want to install http or https.
        '''
        if(not bool(dict_)):
            config.get_configuration_settings()
        config.generate_ssl_certificate()
        
        # dict_['steward_url'] = dict_['public_domain']
        config.update_steward()
        Template.render(config)
        exec_dir = os.path.join(dict_['base_dir'], 'docker')
        db_command = [
            'docker-compose',
            '-f',
            'docker-compose.db.yml',
            'up',
            '-d'
        ]
        subprocess.call(db_command, cwd=exec_dir)
        time.sleep(10)
        
        command = [
            'docker-compose',
            '-f',
            'docker-compose.backend.yml',
            '-f',
            'docker-compose.frontend.yml',
            'up',
            '-d'
        ]  
        subprocess.call(command, cwd=exec_dir)

    @classmethod
    def compose_participant(cls, steward):
        config = Config()
        dict_ = config.get_dict()

        config.get_configuration_settings()
        config.generate_ssl_certificate()

        config.update_steward(steward)
        # config.copy_connector_configuration()
        Template.render(config)

        exec_dir = os.path.join(dict_['base_dir'], 'docker')
        command = [
            'docker-compose',
            '-f',
            'docker-compose.participant.yml',
            'up',
            '-d',
            'mysql'
        ]  
        subprocess.call(command, cwd=exec_dir)

        time.sleep(10)

        command = [
            'docker-compose',
            '-f',
            'docker-compose.participant.yml',
            'up',
            '-d',
            'usm',
            'graphql-api',
            'participant-ui'
        ]  
        subprocess.call(command, cwd=exec_dir)

    @classmethod
    def update(cls):
        response = urlopen(Config.RELEASE_URL)
        data = json.loads(response.read())
        latest_release = data[0]
        config = Config()
        dict_ = config.get_dict()
        if latest_release['version_code'] > __version_code__:
            print("Latest version available: ", latest_release['version'])
            # TODO Criticality levels
            cls.update_installation(latest_release)
            install_dir = os.path.join(dict_['base_dir'], 'docker')
            if os.path.isfile(os.path.join(install_dir, "docker-compose.frontend.yml")):
                cls.update_steward(latest_release)
            if os.path.isfile(os.path.join(install_dir, "docker-compose.participant.yml")):
                cls.update_participant(latest_release)



    @classmethod
    def update_installation(cls, latest_release):
        print("Updating the installation scripts")
        command = ["git", "pull"]
        subprocess.call(command)

    @classmethod
    def update_steward(cls, latest_release):
        print("Updating Steward installation")
        # TODO: check if latest steward image version != current steward image version
        # can use docker ps "--filter ancestor=<image>"
        # or save config file in deploy folder and check for versions
        cls.compose_steward()

    @classmethod
    def update_participant(cls, latest_release):
        print("Updating Participant installation")
        # TODO: check if latest participant image version != current participant image version
        cls.compose_participant()

    @classmethod
    def compose_datahub(cls):
        print("Composing Datahub")
        config= Config()
        dict_ = config.get_dict()

        config.get_configuration_settings()
        config.generate_ssl_certificate()
        # config.copy_connector_configuration()
        Template.render(config)

        exec_dir = os.path.join(dict_['base_dir'], 'docker')
        command = [
            'docker-compose',
            '-f',
            'docker-compose.datahub.yml',
            'up',
            '-d',
        ]  
        subprocess.call(command, cwd=exec_dir)

        # time.sleep(10)

        # command = [
        #     'docker-compose',
        #     '-f',
        #     'docker-compose.datahub.yml',
        #     'up',
        #     '-d',
        #     'datahub-be',
        #     'datahub'
        # ]  
        # subprocess.call(command, cwd=exec_dir)