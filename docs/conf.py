from recommonmark.parser import CommonMarkParser

source_parsers = {
    '.md': CommonMarkParser,
}

source_suffix = ['.rst', '.md']

master_doc = 'index'


def setup(app):
    app.add_stylesheet('css/styles.css')
