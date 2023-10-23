CREATE TABLE IF NOT EXISTS clientuser
(
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(255)        NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    image VARCHAR(255)        NOT NULL,
)