
CREATE TABLE users (
    id serial NOT NULL,
    user_id text,
    email text,
    name text,
    password text
);

CREATE TABLE "sessions" (
    id serial NOT NULL,
    token text,
    user_id integer
);

CREATE TABLE transactions (
    id serial NOT NULL,
    user_id integer,
    value numeric(20,2),
    description text,
    date date DEFAULT now()
);
