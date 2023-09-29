CREATE DATABASE user;
USE user;

CREATE TABLE username (
    username VARCHAR(45) NOT NULL PRIMARY KEY,
    password VARCHAR(20) NOT NULL
);

INSERT INTO  username(username, password) VALUES
("test", "test");