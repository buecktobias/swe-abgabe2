CREATE SCHEMA IF NOT EXISTS AUTHORIZATION firma;

ALTER ROLE firma SET search_path = 'firma';

CREATE TYPE branche AS ENUM ('IT', 'FINANZEN', 'GESUNDHEIT', 'BILDUNG');

CREATE TABLE IF NOT EXISTS firma (
                                     id            integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY USING INDEX TABLESPACE firmaspace,
    version       integer NOT NULL DEFAULT 0,
    name            text,
    mitarbeiterzahl  integer,
    branche           branche,
    umsatz         decimal(8,2) NOT NULL,
    aktiv     boolean NOT NULL DEFAULT FALSE,
    gruendungsdatum         date,
    website      text,
    schlagwoerter text,
    erzeugt       timestamp NOT NULL DEFAULT NOW(),
    aktualisiert  timestamp NOT NULL DEFAULT NOW()
    ) TABLESPACE firmaspace;

CREATE TABLE IF NOT EXISTS beschreibung (
                                            id          integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY USING INDEX TABLESPACE firmaspace,
    slogan       text NOT NULL,
    mission  text,
    firma_id     integer NOT NULL UNIQUE USING INDEX TABLESPACE firmaspace REFERENCES firma
    );


CREATE TABLE IF NOT EXISTS standort (
                                        id              integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY USING INDEX TABLESPACE firmaspace,
    adresse    text NOT NULL,
    land    text NOT NULL,
    stadt    text NOT NULL,
    firma_id         integer NOT NULL REFERENCES firma
    ) TABLESPACE firmaspace;
CREATE INDEX IF NOT EXISTS standort_firma_id_idx ON standort(firma_id) TABLESPACE firmaspace;

CREATE TABLE IF NOT EXISTS firma_file (
                                          id              integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY USING INDEX TABLESPACE firmaspace,
    data            bytea NOT NULL,
    filename        text NOT NULL,
    firma_id         integer NOT NULL REFERENCES firma
    ) TABLESPACE firmaspace;
CREATE INDEX IF NOT EXISTS firma_file_firma_id_idx ON firma_file(firma_id) TABLESPACE firmaspace;