CREATE TABLE t_todo (
    id            SERIAL PRIMARY KEY NOT NULL,
    todo          TEXT NOT NULL,
    done_todo     BOOLEAN NOT NULL,
    created_at    TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP
);
