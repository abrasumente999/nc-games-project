# Northcoders House of Games API

## How to create environment variables for this project

There are two databases in this project. One for real dev data and one which consists of simpler test data.

- First you will need to create two `.env` files for this project: `.env.test` and `.env.development` in the root of this repo.

- Into each file, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). There is also an example .env file in this repo for you to reference.

- Lastly, you will need to add `.env.*` to your gitignore file. This ensures that all .env files are ignored.
