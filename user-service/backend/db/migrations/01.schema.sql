DROP TABLE clientuser;

CREATE TABLE IF NOT EXISTS clientuser (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255),
    auth_method VARCHAR(10) CHECK (auth_method IN ('local', 'google')),
    role_type VARCHAR(20) CHECK (role_type IN ('user', 'admin')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);