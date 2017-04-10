export function docURLFromRouteURL(routeurl) {
    switch (routeurl) {
    case '/totlumi':
        return 'http://brilview.readthedocs.io/en/latest/lumi_inspector.html';
    default:
        return 'http://brilview.readthedocs.io';
    }
}
