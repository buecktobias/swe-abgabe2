ALTER ROLE postgres SET search_path = 'buch';

DO
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'buchart') THEN
        CREATE TYPE buch.buchart AS ENUM ('EPUB', 'HARDCOVER', 'PAPERBACK');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS buch.buch (
    id            integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY,
    version       integer NOT NULL DEFAULT 0,
    isbn          text NOT NULL UNIQUE,
    rating        integer NOT NULL CHECK (rating >= 0 AND rating <= 5),
    art           buch.buchart,
    preis         decimal(8,2) NOT NULL,
    rabatt        decimal(4,3) NOT NULL,
    lieferbar     boolean NOT NULL DEFAULT FALSE,
    datum         date,
    homepage      text,
    schlagwoerter text,
    erzeugt       timestamp NOT NULL DEFAULT NOW(),
    aktualisiert  timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buch.titel (
    id          integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY,
    titel       text NOT NULL,
    untertitel  text,
    buch_id     integer NOT NULL UNIQUE REFERENCES buch.buch
);

CREATE TABLE IF NOT EXISTS buch.abbildung (
    id              integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY,
    beschriftung    text NOT NULL,
    content_type    text NOT NULL,
    buch_id         integer NOT NULL REFERENCES buch.buch
);

CREATE TABLE IF NOT EXISTS buch.buch_file (
    id              integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY,
    data            bytea NOT NULL,
    filename        text NOT NULL,
    buch_id         integer NOT NULL REFERENCES buch.buch
);
