from handlers import cmmdhandler, lumidbhandler


def query(options):
    """Choose appropriate handler and call it with options.

    :param options: dict query options
    :returns: result
    :rtype: dict

    """
    hadnlerfn = get_handler_fn(options)
    return hadnlerfn(options)


def get_handler_fn(options):
    """Select handler function by query type

    :param options: dict query options
    :returns: handler executor function
    :rtype: function

    """
    if 'query_type' not in options:
        raise KeyError(
            'Query type is missing. Could not determine handlername.')

    t = str(options['query_type']).lower()
    if t == 'timelumi':
        return _handlerfn_cmmd_lumi
    if t == 'livebestlumi':
        return _handlerfn_lumidb_live_bestlumi
    if t == 'atlaslumi':
        return _handlerfn_lumidb_atlaslumi
    if t == 'bxlumi':
        return _handlerfn_cmmd_bxlumi
    elif t == 'iovtags':
        return _handlerfn_lumidb_iovtags
    elif t == 'normtags':
        return _handlerfn_cmmd_normtags
    elif t == 'dummy':
        raise NotImplementedError('No dummy handler yet.')

    raise KeyError('Query type did not match any handler name.')


def _handlerfn_cmmd_lumi(options):
    """cmmdhandler executor - call to query luminosity over time

    :param options: dict query options
    :returns: luminosity chart data
    :rtype: dict

    """

    return cmmdhandler.get_brilcalc_lumi(options)


def _handlerfn_cmmd_bxlumi(options):
    """cmmdhandler executor - call to query per bx luminosity

    :param options: dict query options
    :returns: luminosity chart data
    :rtype: dict

    """

    return cmmdhandler.get_brilcalc_bxlumi(options)


def _handlerfn_lumidb_iovtags(options):
    """lumidbhandler executor - call to query iovtags

    :param options: dict query options
    :returns: data
    :rtype: dict

    """

    return lumidbhandler.get_iovtags()


def _handlerfn_cmmd_normtags(options):
    """cmmdhandler executor - call to list normtag files

    :param options: dict query options
    :returns: data
    :rtype: dict

    """

    return cmmdhandler.get_normtag_filenames()


def _handlerfn_lumidb_live_bestlumi(options):
    """lumidb executor - call to get fastbestlumi

    :param options: dict query options
    :returns: data
    :rtype: dict

    """

    return lumidbhandler.get_live_bestlumi(options)


def _handlerfn_lumidb_atlaslumi(options):
    """lumidb executor - call to get atlaslumi

    :param options: dict query options
    :returns: data
    :rtype: dict

    """

    return lumidbhandler.get_atlaslumi(options)


def _handlerfn_lumidb_last_fill(options):
    """lumidb executor - call to get latest fill number

    :param options: dict query options
    :returns: data
    :rtype: dict

    """

    return lumidbhandler.get_last_fill_number(options)
