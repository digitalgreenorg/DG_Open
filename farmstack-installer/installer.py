from distutils.core import setup
from setuptools import find_packages
from helpers.config import Config

print("Starting Installer")
setup(
    name='farmstack-installer',
    version= Config.STEWARD_INSTALL_VERSION,
    url= Config.GIT_BASE_URL,
    author='digitalgreen',
    author_email='waseempasha@digitalgreen.org',
    description='Farmstack Installer'
)