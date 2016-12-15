import sys

REQUIRED = []
NOT_ALLOWED = ['update', 'get_dict']
KEYS = set()


def update(config):

    for req in REQUIRED:
        if req not in config:
            raise KeyError(
                'Cannot update config - missing required key: {}'.format(req))

    for na in NOT_ALLOWED:
        if na in config:
            raise KeyError(
                'Cannot update config - not allowed key: {}'.format(na))

    for k, v in config.iteritems():
        KEYS.add(k)
        setattr(sys.modules[__name__], k, v)


def get_dict():
    return {k: getattr(sys.modules[__name__], k) for k in KEYS}
