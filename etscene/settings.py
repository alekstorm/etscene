LISTEN_PORT = 8080

DB_PORT = 27017
DB_NAME = 'etscene'

COOKIE_SECRET = '442428be-3713-4c38-a518-1a9f905d7079'

try:
    from local_settings import *
except ImportError:
    pass
