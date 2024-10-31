from keycloak.keycloak_admin import KeycloakAdmin
from tenacity import retry, stop_after_attempt, wait_fixed

from util import get_env_variable

KEYCLOAK_SERVER_URL = get_env_variable("KEYCLOAK_SERVER_URL")
ADMIN_USERNAME = get_env_variable("KEYCLOAK_USERNAME")
ADMIN_PASSWORD = get_env_variable("KEYCLOAK_PASSWORD")
ADMIN_CLIENT_ID = get_env_variable("KEYCLOAK_CLIENT_ID")
NEST_REALM_NAME = "nest"
NEST_CLIENT_ID = "nest-client"
ADMIN_ROLE = "admin"
USER_ROLE = "user"

keycloak_admin = KeycloakAdmin(
    server_url=KEYCLOAK_SERVER_URL,
    username=ADMIN_USERNAME,
    password=ADMIN_PASSWORD,
    realm_name=NEST_REALM_NAME,
    client_id=ADMIN_CLIENT_ID,
    verify=False
)


@retry(stop=stop_after_attempt(30), wait=wait_fixed(2))
def check_keycloak_is_running():
    keycloak_admin.get_realms()
    print("Keycloak is running.")


def get_client_uuid(client_id):
    clients = keycloak_admin.get_clients()
    client = next((c for c in clients if c["clientId"] == client_id), None)

    if client:
        return client["id"]
    else:
        raise ValueError(f"Client with clientId '{client_id}' not found.")


def save_client_secret(client_id):
    print(f"Generating client secret for {client_id}...")
    client_uuid = get_client_uuid(NEST_CLIENT_ID)
    new_client_secrets = keycloak_admin.get_client_secrets(client_uuid)
    print(f"Client secrets found: {new_client_secrets}")
    # noinspection PyTypeChecker
    new_client_secret = new_client_secrets["value"]
    print(f"Client secret set for {client_id}.")
    with open("/secrets/client_secret.txt", "w") as file:
        file.write(new_client_secret)


def create_or_reset_user(username, password, email, first_name, last_name):
    users = keycloak_admin.get_users({"username": username})

    if users:
        user_id = users[0]["id"]
        print(f"User {username} found, resetting password...")

        keycloak_admin.set_user_password(user_id, password, temporary=False)

        keycloak_admin.update_user(
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
        user_id = keycloak_admin.create_user(new_user)

    return user_id


def assign_client_role_to_user(user_id, client_id, client_role_name):
    client_uuid = get_client_uuid(client_id)
    roles = keycloak_admin.get_client_roles(client_uuid)
    role = next((r for r in roles if r["name"] == client_role_name), None)
    if not role:
        raise ValueError(f"Role '{client_role_name}' not found in client '{NEST_CLIENT_ID}'")

    keycloak_admin.assign_client_role(user_id=user_id, client_id=client_uuid, roles=[role])
    print(f"Assigned role '{client_role_name}' to user {user_id}.")


if __name__ == "__main__":
    check_keycloak_is_running()
    save_client_secret(NEST_CLIENT_ID)
    print(f"Client secret set for {NEST_CLIENT_ID}.")

    admin_id = create_or_reset_user("admin", "p", "admin@acme.com", "Admin", "Nest")
    user_id = create_or_reset_user("user", "p", "user@acme.co", "User", "Client")
    print("User passwords created/reset and additional details set.")

    assign_client_role_to_user(admin_id, NEST_CLIENT_ID, ADMIN_ROLE)
    assign_client_role_to_user(user_id, NEST_CLIENT_ID, USER_ROLE)
    print(f"Roles assigned: {ADMIN_ROLE} to admin, {USER_ROLE} to user.")
