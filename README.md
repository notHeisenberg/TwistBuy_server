# TwistBuy Backend

This repository contains the backend code for TwistBuy, an eCommerce platform for accessories. It is built using Node.js, Express.js, and MongoDB.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Additional Notes](#additional-notes)
- [Contributing](#contributing)

## Features

- **User Authentication:** JWT-based authentication for secure access.
- **Product Management:** CRUD operations for product data.
- **User Management:** Register and manage users.
- **Error Handling:** Proper error handling for API responses.
- **CORS Configuration:** Secure cross-origin requests with specific origins.

## Prerequisites

Before you start, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 16.x or later)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/) (Either locally or using a cloud service like MongoDB Atlas)

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/twistbuy-backend.git
   cd twistbuy-backend
## Install Dependencies
Ensure you are in the root of the backend directory, then run:
```bash npm install npm init -y`

## Create Environment Variables

Create a .env file in the root of the backend directory and add the following:

```bash PORT=3000 DB_USER=yourMongoDBUsername DB_PASS=yourMongoDBPassword ACCESS_TOKEN_SECRET=yourSecretKey`

Replace yourMongoDBUsername, yourMongoDBPassword, and yourSecretKey with your actual MongoDB credentials and JWT secret key.

# API Endpoints

## Authentication
- POST /jwt
    Generate a JWT token for a user.
    Request Body:
    ```{
  "email": "user@example.com",
  "password": "yourpassword"}
 
Response:
 ``` bash {"token": "your.jwt.token"}`

# Users
## POST /users
   Register a new user.
   Request Body:
   ```bash{"name": "User Name","email": "user@example.com","password": "yourpassword"}```
Response:
```bash {"insertedId": "userId"}```

# Products
## GET /products
   Get a list of products. Supports pagination.
   Query Parameters:

- page (optional): Page number (default is 1)
- limit (optional): Number of items per page (default is 10)
- sort (optional): Sort order (priceLowToHigh, priceHighToLow, newestFirst)
- search (optional): Search query
- filters (optional): Filters for category, brand, price range

## Response: 
[
  {
    "id": "productId",
    "name": "Product Name",
    "image": "url",
    "description": "Product Description",
    "price": 100.00,
    "category": "Category",
    "brand": "Brand",
    "ratings": 4.5
  }
]

# Running the Application
To start the backend server, use the following command:
```bash npm start```
The application will run on http://localhost:3000.

# Additional Notes
- Production Environment: For a production environment, ensure you use environment variables securely and deploy using a process manager like PM2 or a cloud service.
- Database: Ensure MongoDB is running and accessible. Configure connection strings and credentials in the .env file.
- Testing: Implement and run tests to ensure the stability of your API. Use tools like Mocha or Jest.

# Contributing
If you'd like to contribute:

- Fork the repository.
- Create a new branch (git checkout -b feature/YourFeature).
- Make your changes and commit (git commit -am 'Add new feature').
- Push to the branch (git push origin feature/YourFeature).
- Open a Pull Request on GitHub.

Note: Replace yourusername with your actual GitHub username or organization name.


This `README.md` includes detailed setup instructions, API endpoint descriptions, and additional notes to help set up and run the backend for the TwistBuy application.

