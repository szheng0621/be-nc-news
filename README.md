# Northcoders News API

There are different databases to connect to depending on the environment, separate .env files are needed.

1. You will need to create a FILE .env.test in the root directory. This file will contain your environment variable, in this case it will be the test enviroment:
PGDATABASE=test_database_name

2. You will also need to create another file .env.development for your development enviroment, please insert the  PGDATABASE=test_database_name in this file.

3. After you completed the above steps, please make sure check .env.* is added to the .gitignore, anyone who wishes to clone your repo will not have access to the necessary environment variables.


This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
