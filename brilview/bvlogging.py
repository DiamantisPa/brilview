import logging
import logging.handlers

formatter = logging.Formatter(
    '%(asctime)s %(levelname)s [%(filename)s:%(lineno)d]: %(message)s')

stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
file_handler = logging.NullHandler()
logger = logging.getLogger('CENTRAL_BRILVIEW_LOGGER')
logger.addHandler(stream_handler)
logger.addHandler(file_handler)


def update(config):
    global stream_handler
    global file_handler

    logger.removeHandler(stream_handler)
    logger.removeHandler(file_handler)

    if 'log_level' in config:
        level = logging.getLevelName(config['log_level'])
    else:
        level = logging.getLevelName('INFO')

    if 'log_to_screen' in config and config['log_to_screen']:
        stream_handler.close()
        stream_handler = logging.StreamHandler()
        stream_handler.setLevel(level)
        stream_handler.setFormatter(formatter)
    else:
        stream_handler.close()
        stream_handler = logging.NullHandler()

    if 'log_file' in config and config['log_file'] is not None:
        if 'log_file_max_bytes' in config:
            maxbytes = config['log_file_max_bytes']
        else:
            maxbytes = 10485760
        if 'log_file_backup_count' in config:
            backupcount = config['log_file_backup_count']
        else:
            backupcount = 5

        file_handler.close()
        file_handler = logging.handlers.RotatingFileHandler(
            config['log_file'], maxBytes=maxbytes, backupCount=backupcount)
        file_handler.setLevel(level)
        file_handler.setFormatter(formatter)
    else:
        file_handler.close()
        file_handler = logging.NullHandler()

    logger.setLevel(level)
    logger.addHandler(stream_handler)
    logger.addHandler(file_handler)


def get_logger():
    return logger


def get_current_handlers():
    return [stream_handler, file_handler]
