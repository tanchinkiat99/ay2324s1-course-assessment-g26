CREATE DATABASE user;
USE user;

CREATE TABLE username (
    email VARCHAR(255) NOT NULL PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE history_bank (
    email VARCHAR(45) NOT NULL,
    question_id INT(255),
    PRIMARY KEY (email, question_id),
    FOREIGN KEY (email) REFERENCES username(email)
);