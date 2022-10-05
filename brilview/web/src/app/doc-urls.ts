export function docURLFromRouteURL(routeurl) {
    switch (routeurl) {
    case '/home':
        return 'http://brilview.readthedocs.io/en/latest/index.html';
    case '/totlumi/live-bestlumi':
        return 'http://brilview.readthedocs.io/en/latest/bestlumi_live.html';
    case '/totlumi':
        return 'http://brilview.readthedocs.io/en/latest/total_lumi_inspector.html';
    case '/bxlumi':
        return 'http://brilview.readthedocs.io/en/latest/bx_lumi_inspector.html';
    case '/totlumi/atlaslumi':
        return 'http://brilview.readthedocs.io/en/latest/atlas_lumi.html';
    default:
        return 'http://brilview.readthedocs.io';
    }
}
