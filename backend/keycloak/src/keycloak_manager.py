from keycloak.keycloak_admin import KeycloakAdmin
from tenacity import retry, stop_after_attempt, wait_fixed

from config import KEYCLOAK_SERVER_URL, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_CLIENT_ID, NEST_REALM_NAME, NEST_CLIENT_ID, FILE_PATH


class KeycloakManager:
    def __init__(self):
        self.keycloak_admin = KeycloakAdmin(
            server_url=KEYCLOAK_SERVER_URL,
            realm_name=NEST_REALM_NAME,
            user_realm_name="master",
            username=ADMIN_USERNAME,
            password=ADMIN_PASSWORD,
            client_id=ADMIN_CLIENT_ID,
            verify=False
        )

    def wait_for_keycloak_to_start(self):
        @retry(stop=stop_after_attempt(60), wait=wait_fixed(5))
        def _check_keycloak_is_running():
            print(".", end="")
            self.keycloak_admin.get_realms()
            print("Keycloak is running.")

        print("Checking if Keycloak is running")
        print("Waiting", end="")
        _check_keycloak_is_running()

    def get_client_uuid(self, client_id):
        clients = self.keycloak_admin.get_clients()
        client = next((c for c in clients if c["clientId"] == client_id), None)

        if client:
            return client["id"]
        else:
            raise ValueError(f"Client with clientId '{client_id}' not found.")

    def save_client_secret(self, client_id):
        print(f"Generating client secret for {client_id}...")
        client_uuid = self.get_client_uuid(NEST_CLIENT_ID)
        new_client_secrets = self.keycloak_admin.get_client_secrets(client_uuid)
        print(f"Client secrets found: {new_client_secrets}")
        # noinspection PyTypeChecker
        new_client_secret = new_client_secrets["value"]
        print(f"Client secret set for {client_id}.")
        with open(FILE_PATH, "w") as file:
            file.write(new_client_secret)

    def create_or_reset_user(self, username, password, email, first_name, last_name):
        users = self.keycloak_admin.get_users({"username": username})

        if users:
            user_id = users[0]["id"]
            print(f"User {username} found, resetting password...")

            self.keycloak_admin.set_user_password(user_id, password, temporary=False)

            self.keycloak_admin.update_user(
                user_id,
                {
                    "email": email,
                    "firstName": first_name,
                    "lastName": last_name
                }
            )

        else:
            print(f"User {username} not found, creating...")

            new_user = {
                "username": username,
                "enabled": True,
                "email": email,
                "firstName": first_name,
                "lastName": last_name,
                "credentials": [{
                    "type": "password",
                    "value": password,
                    "temporary": False
                }]
            }
            user_id = self.keycloak_admin.create_user(new_user)

        return user_id

    def assign_client_role_to_user(self, user_id, client_id, client_role_name):
        client_uuid = self.get_client_uuid(client_id)
        roles = self.keycloak_admin.get_client_roles(client_uuid)
        role = next((r for r in roles if r["name"] == client_role_name), None)
        if not role:
            raise ValueError(f"Role '{client_role_name}' not found in client '{NEST_CLIENT_ID}'")

        self.keycloak_admin.assign_client_role(user_id=user_id, client_id=client_uuid, roles=[role])
        print(f"Assigned role '{client_role_name}' to user {user_id}.")
