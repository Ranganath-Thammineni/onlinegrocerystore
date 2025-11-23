# Online Grocery Store

A Node.js web application for managing a grocery store inventory with product addition and display functionality.

## Features

- Add new products with name, description, image URL, and price
- View inventory in a responsive Bootstrap grid layout
- MySQL database integration
- Express.js server with static file serving

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ranganath-Thammineni/onlinegrocerystore.git
   cd onlinegrocerystore
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your database credentials in the `.env` file

4. Set up your MySQL database with the required table structure

5. Start the server:
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npx nodemon script.js
   ```

## Usage

- Navigate to `http://localhost:3000` to view the home page
- Use `/form.html` to add new products
- Visit `/inventory` to see all products in a grid layout

## Technologies Used

- Node.js
- Express.js
- MySQL
- Bootstrap 5
- HTML/CSS/JavaScript

## Database Schema

The application uses a `products` table with the following structure:
- `id` (Primary Key, Auto Increment)
- `name` (VARCHAR)
- `description` (TEXT)
- `image_url` (VARCHAR)
- `price` (DECIMAL)