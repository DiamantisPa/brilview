import os
import config
from handlers import cmmdhandler


def query(options):
    """Choose appropriate handler and call it with options.

    :param options: dict query options
    :returns: chart data
    :rtype: dict

    """
    hanlerfn = get_handler_fn(options)
    return hanlerfn(options)


def get_handler_fn(options):
    """Select handler function by query type

    :param options: dict query options
    :returns: handler executor function
    :rtype: function

    """
    if 'type' not in options:
        raise KeyError(
            'Query type is missing. Could not determine handlername.')

    t = str(options['query_type']).lower()
    if t == 'timelumi':
        return _call_cmmdhandler
    elif t == 'dummy':
        raise NotImplementedError('No dummy handler yet.')

    raise KeyError('Query type did not match any handler name.')


def _call_cmmdhandler(options):
    """cmmdhandler executor - call to query cmmdhandler

    :param options: dict query options
    :returns: chart data
    :rtype: dict

    """

    return cmmdhandler.brilcalcLumiHandler(options)
