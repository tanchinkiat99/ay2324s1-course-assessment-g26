### Setting up the database locally

1. Download and install PostgreSQL from https://www.postgresql.org/download/.
2. (Optional) Download and install pgAdmin from https://www.pgadmin.org/ to connect to the database. Or you can also use any other client/command line interface to run queries on the database.
2. Create the database using the query `CREATE DATABASE <DB_NAME>`.
3. Create a `.env` file in the root directory of the backend folder with the fields `DB_HOST`, `DB_USER`, `DB_PASSWORD` and `DB_NAME`.

The backend server should be able to connect to the database now.