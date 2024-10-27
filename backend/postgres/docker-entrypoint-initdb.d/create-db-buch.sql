DO
$$
BEGIN
    CREATE DATABASE buch;
EXCEPTION
    WHEN duplicate_database THEN RAISE NOTICE 'Database buch already exists, skipping.';
END
GRANT ALL ON DATABASE buch TO postgres;

CREATE SCHEMA IF NOT EXISTS buch AUTHORIZATION postgres;
GRANT ALL PRIVILEGES ON SCHEMA buch TO postgres;

ALTER ROLE postgres SET search_path = 'buch';