import logging
import logging.handlers
import config

formatter = logging.Formatter(
    '%(asctime)s %(levelname)s [%(filename)s:%(lineno)d]: %(message)s')
level = logging.getLevelName(config.loglevel)

if config.log_to_screen:
    handler = logging.handlers.StreamHandler()
else:
    if 'log_file_max_bytes' in config:
        maxbytes = config.log_file_max_bytes
    else:
        maxbytes = 10485760
    if 'log_file_backup_count' in config:
        backupcount = config.log_file_backup_count
    else:
        backupcount = 5

    handler = logging.handlers.RotatingFileHandler(
        config.error_log_file, maxBytes=maxbytes, backupCount=backupcount)

handler.setLevel(level)
handler.setFormatter(formatter)


def get_logger(name):
    l = logging.getLogger(name)
    l.setLevel(level)
    l.addHandler(handler)
    return l


def get_handler():
    return handler
