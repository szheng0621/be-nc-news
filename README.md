# Northcoders News API

<!-- There are different databases to connect to depending on the environment, separate .env files are needed.

1. You will need to create a FILE .env.test in the root directory. This file will contain your environment variable, in this case it will be the test enviroment:
PGDATABASE=test_database_name

2. You will also need to create another file .env.development for your development enviroment, please insert the  PGDATABASE=test_database_name in this file.

3. After you completed the above steps, please make sure check .env.* is added to the .gitignore, anyone who wishes to clone your repo will not have access to the necessary environment variables.


This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/) -->

Hosted Version:
https://its-nc-news.onrender.com/api

Project Summary:
This project is an API designed to provide programmatic access to application data, The goal is to create a real-world backend service, similar to Reddit, which serves information to a front-end architecture. The API allows users to interact with various resources related to articles, topics, comments, and users.

The API is built using Node.js and connects to a PostgreSQL database through the node-postgres library. It offers several endpoints to perform CRUD operations on the application's data.

API Endpoints:
GET /api/topics: Responds with a list of topics.
GET /api: Responds with a list of available endpoints.
GET /api/articles/
: Responds with a single article by its article_id.
GET /api/articles: Responds with a list of articles.
GET /api/articles/
/comments: Responds with a list of comments associated with the specified article_id.
POST /api/articles/
/comments: Adds a comment for the specified article_id.
PATCH /api/articles/
: Updates an article by its article_id.
DELETE /api/comments/
: Deletes a comment by its comment_id.
GET /api/users: Responds with a list of users.
GET /api/articles (queries): Allows articles to be filtered and sorted.
GET /api/articles/
(comment count): Adds a comment count to the response when retrieving a single article.

Installation Instructions:
1. Clone the Repository
git clone https://github.com/szheng0621/be-nc-news.git

2. Install Dependencies: 
Ensure you have the minimum versions of Node.js, and Postgres needed to run the project and also make sure npm installed. Then run:
npm install .

3. Set Up Environment Variables: 
Create two .env files in the root directory of the project:
.env.development (PGDATABASE=nc_news)
.env.test (PGDATABASE=nc_news_test)


4. Seed the Local Database:
Run the following command to seed your database with initial data:
npm run seed

5. Run Tests To execute the test suite, run:
npm test