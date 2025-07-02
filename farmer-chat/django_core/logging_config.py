import logging.config

from django_core.config import ENV_CONFIG

logging.SUCCESS = logging.CRITICAL + 1
logging.addLevelName(logging.SUCCESS, "SUCCESS")


def success(self, message, *args, **kwargs):
    """
    Add a success log level method to the logger.
    """
    if self.isEnabledFor(logging.SUCCESS):
        self._log(logging.SUCCESS, message, args, **kwargs)


logging.Logger.success = success


# Define color codes for different log levels
COLORS = {
    "DEBUG": "\033[94m",  # Bright Blue
    "INFO": "\033[96m",  # Bright Cyan
    "SUCCESS": "\033[32m",  # Bright Green
    "WARNING": "\033[93;1m",  # Bright Yellow
    "ERROR": "\033[91;1m",  # Bright Red
    "CRITICAL": "\033[101;97m",  # Bright Red on White Background
    "ENDC": "\033[0m",  # Reset color
    "WHITE": "\033[97m",  # Bright White
    "BRIGHT_BLUE": "\033[94m",  # Bright Blue
    "BRIGHT_MAGENTA": "\033[95m",  # Bright Magenta
    "BRIGHT_CYAN": "\033[96m",  # Bright Cyan
    "BRIGHT_YELLOW": "\033[93m",  # Bright Yellow
    "BRIGHT_GREEN": "\033[92m",  # Bright Green
    "BRIGHT_RED": "\033[91m",  # Bright Red
}


# Formatter for adding color to log messages
class ColoredFormatter(logging.Formatter):
    def format(self, record):
        """
        Format the logger with specific colors.
        """
        log_level = record.levelname
        if log_level in COLORS:
            # record.asctime = COLORS[log_level] + record.levelname + COLORS["ENDC"]
            record.levelname = COLORS[log_level] + log_level + COLORS["ENDC"]
            # record.msg = COLORS[log_level] + record.msg + COLORS["ENDC"]
            record.msg = (
                COLORS[log_level] + record.msg + COLORS["ENDC"]
                if isinstance(record.msg, str)
                else str(record.msg)
            )
            record.name = COLORS["BRIGHT_MAGENTA"] + record.name + COLORS["ENDC"]
        return super().format(record)


LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": True,
    "filters": {
        # information regarding filters
    },
    "root": {
        "handlers": ["console"],
        "level": ENV_CONFIG.get("LOG_LEVEL_FOR_CONSOLE", "INFO"),
    },
    "formatters": {
        "Simple_Format": {
            "format": "{levelname} {message}",
            "style": "{",
        },
        "colored_formatter_with_datetime": {
            "format": "[%(asctime)s] [%(levelname)-s] %(lineno)-4s%(name)-15s | %(message)s",
            "()": ColoredFormatter,
        },
    },
    "handlers": {
        "console": {
            "level": ENV_CONFIG.get("LOG_LEVEL_FOR_CONSOLE", "DEBUG"),
            "class": "logging.StreamHandler",
            "formatter": "colored_formatter_with_datetime",
        },
    },
}


def configure_logging():
    """
    Function to configure logging.
    """
    logging.config.dictConfig(LOGGING_CONFIG)
