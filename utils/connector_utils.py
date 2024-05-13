import json
import os
import shutil

import xmltodict
import yaml
from core.constants import Constants
from django.conf import settings
from python_on_whales import DockerClient


def get_ports():
    """This function give the ports for the connectors"""
    with open("./ports.json", "r") as openfile:
        ports_object = json.load(openfile)
    provider_core = int(ports_object.get(Constants.PROVIDER_CORE)) + 1
    consumer_core = int(ports_object.get(Constants.CONSUMER_CORE)) + 1
    provider_app = int(ports_object.get(Constants.PROVIDER_APP)) + 1
    consumer_app = int(ports_object.get(Constants.CONSUMER_APP)) + 1
    new_ports = {
        Constants.PROVIDER_CORE: provider_core,
        Constants.CONSUMER_CORE: consumer_core,
        Constants.CONSUMER_APP: consumer_app,
        Constants.PROVIDER_APP: provider_app,
    }
    with open("./ports.json", "w") as outfile:
        json.dump(new_ports, outfile)
    return new_ports


def read_json(file):
    """This function reads JSON file and returns JSON Object"""
    with open(file, "r") as file:
        json_read = json.load(file)
    return json_read


def read_modify_templates_single_pull(provider, consumer, ports):
    """Read and Modify Connector Configuration files(XML and Yaml)"""
    # Read provider and consumer templates.
    # print("XML>>>>>>>>", settings.PROVIDER_TEMPLATE_XML)
    provider_xml_template = read_json(settings.SINGLE_PULL_PROVIDER_TEMPLATE_XML)
    provider_yaml_template = read_json(settings.SINGLE_PULL_PROVIDER_TEMPLATE_YAML)
    consumer_xml_template = read_json(settings.SINGLE_PULL_CONSUMER_TEMPLATE_XML)
    consumer_yaml_template = read_json(settings.SINGLE_PULL_CONSUMER_TEMPLATE_YAML)

    provider.connector_name = provider.connector_name.replace(" ", "")
    consumer.connector_name = consumer.connector_name.replace(" ", "")
    # print(provider_xml_template, provider_yaml_template, consumer_xml_template, consumer_yaml_template)
    # Modify the templates.
    # print("************", provider_xml_template)
    provider_routes = provider_xml_template["beans"]["camelContext"]["route"]
    consumer_routes = consumer_xml_template["beans"]["camelContext"]["route"]
    # Render Provider Variables in Template.
    provider_routes[0]["from"]["@uri"] = (
        "idscp2server://0.0.0.0:%s?sslContextParameters=#serverSslContext&useIdsMessages=true&tlsClientHostnameVerification=false"
        % (ports[Constants.PROVIDER_CORE])
    )
    provider_routes[0]["choice"]["when"][0]["setProperty"][
        "constant"
    ] = "https://hub.docker.com/layers/farmstack/sha256-%s#%s" % (
        consumer.usage_policy.strip(),
        consumer.application_port,
    )
    provider_routes[1]["to"]["@uri"] = "http://provider-app:%s/get_data" % (provider.application_port)
    provider_routes[1]["setProperty"]["constant"] = "https://farmstack.digitalgreen.org/%s/%s" % (
        provider.connector_name,
        consumer.connector_name,
    )

    # Render Consumer Variables in XML Template.
    consumer_routes[0]["setProperty"]["constant"] = "https://farmstack.digitalgreen.org/%s/%s" % (
        provider.connector_name,
        consumer.connector_name,
    )
    consumer_routes[0]["to"]["@uri"] = (
        "idscp2client://provider-core:%s?awaitResponse=true&connectionShareId=%s&sslContextParameters=#clientSslContext&useIdsMessages=true"
        % (ports[Constants.PROVIDER_CORE], consumer.connector_name)
    )
    consumer_routes[0]["choice"]["when"]["to"]["@uri"] = (
        "idscp2client://provider-core:%s?awaitResponse=true&connectionShareId=%s&sslContextParameters=#clientSslContext&useIdsMessages=true"
        % (ports[Constants.PROVIDER_CORE], consumer.connector_name)
    )

    consumer_routes[1]["from"]["@uri"] = (
        "idscp2client://provider-core:%s?awaitResponse=true&connectionShareId=%s&sslContextParameters=#clientSslContext&useIdsMessages=true"
        % (ports[Constants.PROVIDER_CORE], consumer.connector_name)
    )
    consumer_routes[1]["setProperty"]["constant"] = "https://farmstack.digitalgreen.org/%s/%s" % (
        provider.connector_name,
        consumer.connector_name,
    )

    consumer_routes[1]["choice"]["when"]["to"]["@uri"] = "http://consumer-app:%s/post_data" % (
        consumer.application_port
    )

    consumer_routes[2]["setProperty"]["constant"] = "https://farmstack.digitalgreen.org/%s/%s" % (
        provider.connector_name,
        consumer.connector_name,
    )
    consumer_routes[2]["to"]["@uri"] = (
        "idscp2client://provider-core:%s?awaitResponse=true&connectionShareId=%s&sslContextParameters=#clientSslContext&useIdsMessages=true"
        % (ports[Constants.PROVIDER_CORE], consumer.connector_name)
    )
    consumer_routes[3]["setProperty"]["constant"] = "https://farmstack.digitalgreen.org/%s/%s" % (
        provider.connector_name,
        consumer.connector_name,
    )
    consumer_routes[3]["to"]["@uri"] = (
        "idscp2client://provider-core:%s?awaitResponse=true&connectionShareId=%s&sslContextParameters=#clientSslContext&useIdsMessages=true"
        % (ports[Constants.PROVIDER_CORE], consumer.connector_name)
    )
    # YAML Files.
    # copy the settings.mapdb file.
    shutil.copy(
        os.path.join(settings.CONNECTOR_TEMPLATE_STATICS, "settings.mapdb"),
        os.path.join(settings.CONNECTOR_STATICS, ("%s-settings.mapdb") % (provider.connector_name)),
    )

    shutil.copy(
        os.path.join(settings.CONNECTOR_TEMPLATE_STATICS, "settings.mapdb"),
        os.path.join(settings.CONNECTOR_STATICS, ("%s-settings.mapdb") % (consumer.connector_name)),
    )

    # XML file paths.
    connector_path = os.path.join(settings.CONNECTOR_CONFIGS, provider.connector_name + consumer.connector_name)
    if not os.path.exists(connector_path):
        os.mkdir(connector_path)
    provider_xml_file = open("%s.xml" % (os.path.join(connector_path, provider.connector_name)), "w")
    consumer_xml_file = open("%s.xml" % (os.path.join(connector_path, consumer.connector_name)), "w")
    # print("------", type(provider.certificate), str(provider.certificate))

    provider_yaml_template["services"]["provider-core"]["volumes"][2] = "%s:%s" % (
        "~/connector_configs/static_configs/certificates/certificates/%s" % str(provider.certificate).split("/")[-1],
        "/root/etc/provider-keystore.p12",
    )
    provider_yaml_template["services"]["provider-core"]["volumes"][4] = "%s:%s" % (
        os.path.join(
            "~/connector_configs/static_configs",
            ("%s-settings.mapdb") % (provider.connector_name),
        ),
        "/root/etc/settings.mapdb",
    )
    provider_yaml_template["services"]["provider-core"]["volumes"][6] = "%s:%s" % (
        "~/connector_configs/%s/%s.xml" % (provider.connector_name + consumer.connector_name, provider.connector_name),
        "/root/deploy/provider.xml",
    )
    provider_yaml_template["services"]["provider-core"]["ports"][0] = "%s:%s" % (
        ports[Constants.PROVIDER_CORE],
        ports[Constants.PROVIDER_CORE],
    )

    provider_yaml_template["services"]["provider-app"]["image"] = provider.docker_image_url
    provider_yaml_template["services"]["provider-app"]["ports"][0] = "%s:%s" % (
        ports.get(Constants.PROVIDER_APP),
        provider.application_port,
    )

    consumer_yaml_template["services"]["consumer-core"]["volumes"][2] = "%s:%s" % (
        "~/connector_configs/static_configs/certificates/certificates/%s" % str(consumer.certificate).split("/")[-1],
        "/root/etc/consumer-keystore.p12",
    )
    # consumer_yaml_template["services"]["core"]["volumes"][2] = "**** NEW SETTINGS.mapdb *****"
    consumer_yaml_template["services"]["consumer-core"]["volumes"][4] = "%s:%s" % (
        os.path.join(
            "~/connector_configs/static_configs",
            ("%s-settings.mapdb") % (consumer.connector_name),
        ),
        "/root/etc/settings.mapdb",
    )
    consumer_yaml_template["services"]["consumer-core"]["volumes"][6] = "%s:%s" % (
        "~/connector_configs/%s/%s.xml" % (provider.connector_name + consumer.connector_name, consumer.connector_name),
        "/root/deploy/consumer.xml",
    )
    consumer_yaml_template["services"]["consumer-core"]["ports"][0] = "%s:%s" % (
        ports[Constants.CONSUMER_CORE],
        ports[Constants.CONSUMER_CORE],
    )

    consumer_yaml_template["services"]["consumer-app"]["image"] = consumer.docker_image_url
    consumer_yaml_template["services"]["consumer-app"]["ports"][0] = "%s:%s" % (
        ports.get(Constants.CONSUMER_APP),
        consumer.application_port,
    )

    # Write the values to templates.
    provider_yaml_file = open("%s.yaml" % (os.path.join(connector_path, provider.connector_name)), "w")
    consumer_yaml_file = open("%s.yaml" % (os.path.join(connector_path, consumer.connector_name)), "w")

    xmltodict.unparse(provider_xml_template, pretty=True, output=provider_xml_file)
    yaml.dump(provider_yaml_template, provider_yaml_file)
    xmltodict.unparse(consumer_xml_template, pretty=True, output=consumer_xml_file)
    yaml.dump(consumer_yaml_template, consumer_yaml_file)

    # provider_xml_file.close()
    # provider_yaml_file.close()
    # consumer_xml_file.close()
    # consumer_yaml_file.close()
    return provider_yaml_file.name, consumer_yaml_file.name


def read_modify_templates_event_based_pull(provider, consumer, ports):
    """Read and Modify Connector Configuration files(XML and Yaml)"""
    # Read provider and consumer templates.
    # print("XML>>>>>>>>", settings.PROVIDER_TEMPLATE_XML)
    provider_xml_template = read_json(settings.EVENT_BASED_PULL_PROVIDER_TEMPLATE_XML)
    provider_yaml_template = read_json(settings.EVENT_BASED_PULL_PROVIDER_TEMPLATE_YAML)
    consumer_xml_template = read_json(settings.EVENT_BASED_PULL_CONSUMER_TEMPLATE_XML)
    consumer_yaml_template = read_json(settings.EVENT_BASED_PULL_CONSUMER_TEMPLATE_YAML)

    provider.connector_name = provider.connector_name.replace(" ", "")
    consumer.connector_name = consumer.connector_name.replace(" ", "")
    # print(provider_xml_template, provider_yaml_template, consumer_xml_template, consumer_yaml_template)
    # Modify the templates.
    # print("************", provider_xml_template)
    provider_routes = provider_xml_template["beans"]["camelContext"]["route"]
    consumer_routes = consumer_xml_template["beans"]["camelContext"]["route"]
    # Render Provider Variables in Template.
    provider_routes[0]["from"]["@uri"] = (
        "idscp2server://0.0.0.0:%s?sslContextParameters=#serverSslContext&useIdsMessages=true&tlsClientHostnameVerification=false"
        % (ports[Constants.PROVIDER_CORE])
    )

    provider_routes[0]["choice"]["when"][0]["setProperty"][
        "constant"
    ] = "https://hub.docker.com/layers/farmstack/sha256-%s#%s" % (
        consumer.usage_policy.strip(),
        consumer.application_port,
    )

    provider_routes[1]["to"]["@uri"] = "http://provider-app:%s/get_data" % (provider.application_port)
    provider_routes[1]["setProperty"]["constant"] = "https://farmstack.digitalgreen.org/%s/%s" % (
        provider.connector_name,
        consumer.connector_name,
    )

    # Render Consumer Variables in Template.
    consumer_routes[0]["setProperty"]["constant"] = "https://farmstack.digitalgreen.org/%s/%s" % (
        provider.connector_name,
        consumer.connector_name,
    )

    consumer_routes[0]["to"]["@uri"] = (
        "idscp2client://provider-core:%s?awaitResponse=true&connectionShareId=ucConnection&sslContextParameters=#clientSslContext&useIdsMessages=true"
        % (ports[Constants.PROVIDER_CORE])
    )

    consumer_routes[0]["choice"]["when"]["to"]["@uri"] = (
        "idscp2client://provider-core:%s?awaitResponse=true&connectionShareId=ucConnection&sslContextParameters=#clientSslContext&useIdsMessages=true"
        % (ports[Constants.PROVIDER_CORE])
    )

    consumer_routes[1]["from"]["@uri"] = (
        "idscp2client://provider-core:%s?awaitResponse=true&connectionShareId=ucConnection&sslContextParameters=#clientSslContext&useIdsMessages=true"
        % (ports[Constants.PROVIDER_CORE])
    )

    consumer_routes[1]["setProperty"]["constant"] = "https://farmstack.digitalgreen.org/%s/%s" % (
        provider.connector_name,
        consumer.connector_name,
    )

    consumer_routes[1]["choice"]["when"]["to"]["@uri"] = "http://consumer-app:%s/post_data" % (
        consumer.application_port
    )

    consumer_routes[2]["setProperty"]["constant"] = "https://farmstack.digitalgreen.org/%s/%s" % (
        provider.connector_name,
        consumer.connector_name,
    )

    consumer_routes[2]["to"]["@uri"] = (
        "idscp2client://provider-core:%s?awaitResponse=true&connectionShareId=ucConnection&sslContextParameters=#clientSslContext&useIdsMessages=true"
        % (ports[Constants.PROVIDER_CORE])
    )

    # YAML Files.
    # copy the settings.mapdb file.
    shutil.copy(
        os.path.join(settings.CONNECTOR_TEMPLATE_STATICS, "settings.mapdb"),
        os.path.join(settings.CONNECTOR_STATICS, ("%s-settings.mapdb") % (provider.connector_name)),
    )

    shutil.copy(
        os.path.join(settings.CONNECTOR_TEMPLATE_STATICS, "settings.mapdb"),
        os.path.join(settings.CONNECTOR_STATICS, ("%s-settings.mapdb") % (consumer.connector_name)),
    )

    # XML file paths.
    connector_path = os.path.join(settings.CONNECTOR_CONFIGS, provider.connector_name + consumer.connector_name)
    if not os.path.exists(connector_path):
        os.mkdir(connector_path)
    provider_xml_file = open("%s.xml" % (os.path.join(connector_path, provider.connector_name)), "w")
    consumer_xml_file = open("%s.xml" % (os.path.join(connector_path, consumer.connector_name)), "w")
    # print("------", type(provider.certificate), str(provider.certificate))

    provider_yaml_template["services"]["provider-core"]["volumes"][2] = "%s:%s" % (
        "~/connector_configs/static_configs/certificates/certificates/%s" % str(provider.certificate).split("/")[-1],
        "/root/etc/provider-keystore.p12",
    )
    provider_yaml_template["services"]["provider-core"]["volumes"][4] = "%s:%s" % (
        os.path.join(
            "~/connector_configs/static_configs",
            ("%s-settings.mapdb") % (provider.connector_name),
        ),
        "/root/etc/settings.mapdb",
    )
    provider_yaml_template["services"]["provider-core"]["volumes"][6] = "%s:%s" % (
        "~/connector_configs/%s/%s.xml" % (provider.connector_name + consumer.connector_name, provider.connector_name),
        "/root/deploy/provider.xml",
    )
    provider_yaml_template["services"]["provider-core"]["ports"][0] = "%s:%s" % (
        ports[Constants.PROVIDER_CORE],
        ports[Constants.PROVIDER_CORE],
    )

    provider_yaml_template["services"]["provider-app"]["image"] = provider.docker_image_url
    provider_yaml_template["services"]["provider-app"]["ports"][0] = "%s:%s" % (
        ports.get(Constants.PROVIDER_APP),
        provider.application_port,
    )

    consumer_yaml_template["services"]["consumer-core"]["volumes"][2] = "%s:%s" % (
        "~/connector_configs/static_configs/certificates/certificates/%s" % str(consumer.certificate).split("/")[-1],
        "/root/etc/consumer-keystore.p12",
    )
    # consumer_yaml_template["services"]["core"]["volumes"][2] = "**** NEW SETTINGS.mapdb *****"
    consumer_yaml_template["services"]["consumer-core"]["volumes"][4] = "%s:%s" % (
        os.path.join(
            "~/connector_configs/static_configs",
            ("%s-settings.mapdb") % (consumer.connector_name),
        ),
        "/root/etc/settings.mapdb",
    )
    consumer_yaml_template["services"]["consumer-core"]["volumes"][6] = "%s:%s" % (
        "~/connector_configs/%s/%s.xml" % (provider.connector_name + consumer.connector_name, consumer.connector_name),
        "/root/deploy/consumer.xml",
    )
    consumer_yaml_template["services"]["consumer-core"]["ports"][0] = "%s:%s" % (
        ports[Constants.CONSUMER_CORE],
        ports[Constants.CONSUMER_CORE],
    )

    consumer_yaml_template["services"]["consumer-app"]["image"] = consumer.docker_image_url
    consumer_yaml_template["services"]["consumer-app"]["ports"][0] = "%s:%s" % (
        ports.get(Constants.CONSUMER_APP),
        consumer.application_port,
    )

    # Write the values to templates.
    provider_yaml_file = open("%s.yaml" % (os.path.join(connector_path, provider.connector_name)), "w")
    consumer_yaml_file = open("%s.yaml" % (os.path.join(connector_path, consumer.connector_name)), "w")

    xmltodict.unparse(provider_xml_template, pretty=True, output=provider_xml_file)
    yaml.dump(provider_yaml_template, provider_yaml_file)
    xmltodict.unparse(consumer_xml_template, pretty=True, output=consumer_xml_file)
    yaml.dump(consumer_yaml_template, consumer_yaml_file)

    # provider_xml_file.close()
    # provider_yaml_file.close()
    # consumer_xml_file.close()
    # consumer_yaml_file.close()
    return provider_yaml_file.name, consumer_yaml_file.name


def generate_xml_yaml(provider, consumer):
    """Generate XML And Yaml"""
    ports = get_ports()
    print("Ports", ports)
    # Get the Provider XML and Yaml Templates.
    # provider_yaml, consumer_yaml = read_modify_templates_single_pull(provider, consumer, ports)

    provider_yaml, consumer_yaml = read_modify_templates_event_based_pull(provider, consumer, ports)
    print("************ ", provider_yaml, consumer_yaml)
    # TODO:Write the updated ports.
    # Return Yaml and XML
    return provider_yaml, consumer_yaml, ports


def run_containers(provider, consumer):
    "Run Docker containers"
    provider_yaml, consumer_yaml, ports = generate_xml_yaml(provider, consumer)
    # Run Docker Containers.
    docker_clients_provider = DockerClient(compose_files=[provider_yaml])
    docker_clients_consumer = DockerClient(compose_files=[consumer_yaml])
    # print(docker_clients)
    docker_clients_provider.compose.build()
    docker_clients_provider.compose.up(detach=True)

    docker_clients_consumer.compose.build()
    docker_clients_consumer.compose.up(detach=True)
    return ports


def stop_containers(provider, consumer):
    "stop Docker containers"
    connector_path = os.path.join(settings.CONNECTOR_CONFIGS, provider.connector_name + consumer.connector_name)
    provider_yaml = "%s.yaml" % (os.path.join(connector_path, provider.connector_name.replace(" ", "")))
    consumer_yaml = "%s.yaml" % (os.path.join(connector_path, consumer.connector_name.replace(" ", "")))
    docker_clients = DockerClient(compose_files=[provider_yaml, consumer_yaml])
    docker_clients.compose.down()
    print(connector_path)
    shutil.rmtree(connector_path, ignore_errors=True, onerror=None)
