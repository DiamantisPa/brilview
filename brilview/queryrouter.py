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

    t = str(options['type']).lower()
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
    handlername = 'brilcommandhandler'

    command = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__), '..', '..', '..', 'bin', 'brilcalc'))

    if handlername in config.appconfig:
        handler = config.appconfig[handlername]
        if 'command' in handler and handler['command']:
            command = handler['command']

    run_from = options['from']
    run_to = options['to']
    return cmmdhandler.brilcalcLumiHandler(
        ['--begin', str(run_from), '--end', str(run_to)],
        cmmd=[command])
