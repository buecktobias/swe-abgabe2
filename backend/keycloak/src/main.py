import os
import signal
import time

from config import NEST_CLIENT_ID, ADMIN_ROLE, USER_ROLE, FILE_PATH
from keycloak_manager import KeycloakManager


def cleanup(signum, frame):
    print("Cleaning up...")
    if os.path.exists(FILE_PATH):
        os.remove(FILE_PATH)
    print("File deleted. Exiting application...")
    exit(0)


if __name__ == "__main__":
    keycloak_manager = KeycloakManager()
    print("Starting Keycloak Manager...")
    keycloak_manager.wait_for_keycloak_to_start()
    keycloak_manager.save_client_secret(NEST_CLIENT_ID)
    print(f"Client secret set for {NEST_CLIENT_ID}.")

    admin_id = keycloak_manager.create_or_reset_user("admin", "p", "admin@acme.com", "Admin", "Nest")
    user_id = keycloak_manager.create_or_reset_user("user", "p", "user@acme.co", "User", "Client")
    print("User passwords created/reset and additional details set.")

    keycloak_manager.assign_client_role_to_user(admin_id, NEST_CLIENT_ID, ADMIN_ROLE)
    keycloak_manager.assign_client_role_to_user(admin_id, NEST_CLIENT_ID, USER_ROLE)
    keycloak_manager.assign_client_role_to_user(user_id, NEST_CLIENT_ID, USER_ROLE)
    print(f"Roles assigned: {ADMIN_ROLE} to admin, {USER_ROLE} to user.")

    signal.signal(signal.SIGTERM, cleanup)

    print("Application is running. Press Ctrl+C to exit.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup(None, None)
