DO $$
BEGIN
    -- Attempt to create the database
    PERFORM 1 FROM pg_database WHERE datname = 'buch';
    IF NOT FOUND THEN
        CREATE DATABASE buch;
ELSE
        RAISE NOTICE 'Database buch already exists, skipping.';
END IF;
END $$;

-- Grant privileges on the database to the postgres user
GRANT ALL ON DATABASE buch TO postgres;

-- Switch to the newly created 'buch' database
\c buch

-- Create schema and grant privileges
CREATE SCHEMA IF NOT EXISTS buch AUTHORIZATION postgres;
GRANT ALL PRIVILEGES ON SCHEMA buch TO postgres;

-- Set the default search path for the postgres role
ALTER ROLE postgres SET search_path = 'buch';
