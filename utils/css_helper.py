import logging, os, shutil, cssutils
from python_http_client import exceptions

LOGGER = logging.getLogger(__name__)


def get_css_attributes(css_path, css_file_name, css_attribute):
    """Get CSS files"""
    try:
        # with open(css_path['override.css']) as css:
        with open(css_path[css_file_name]) as css:
            sheet = cssutils.css.CSSStyleSheet()
            sheet.cssText = css.read()
            print(sheet)
            css_attribute_value = sheet.cssRules[0].style[css_attribute]
        return css_attribute_value
    except exceptions as e:
        LOGGER.error(e)


def create_css_file():
    """Create a css file with css attributes"""
