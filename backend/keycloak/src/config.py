from util import get_env_variable

KEYCLOAK_SERVER_URL = get_env_variable("KEYCLOAK_SERVER_URL")
ADMIN_USERNAME = get_env_variable("KEYCLOAK_USERNAME")
ADMIN_PASSWORD = get_env_variable("KEYCLOAK_PASSWORD")
ADMIN_CLIENT_ID = get_env_variable("KEYCLOAK_CLIENT_ID")
NEST_REALM_NAME = "nest"
NEST_CLIENT_ID = "nest-client"
ADMIN_ROLE = "admin"
USER_ROLE = "user"
FILE_PATH = "/secrets/client_secret.txt"
