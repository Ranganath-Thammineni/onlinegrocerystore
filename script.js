import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || "", // Set in environment variables
  database: process.env.DB_NAME || "grocery_store",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to grocery_store database.");
});

// Serve product form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle product submission
app.post("/add-product", (req, res) => {
  const { name, description, image_url, price } = req.body;

  const sql = "INSERT INTO products (name, description, image_url, price) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, description, image_url, price], (err, result) => {
    if (err) {
      console.error("Error inserting product:", err.message);
      return res.status(500).send("Failed to add product.");
    }
    console.log("Product added with ID:", result.insertId);
    res.send("Product added successfully.");
  });
});

app.get("/inventory", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching inventory:", err.message);
      return res.status(500).send("Failed to fetch inventory.");
    }
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
</head>
<body>
    <header>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand" href="#"> 
        <img src="https://www.designmantic.com/blog/wp-content/uploads/2025/02/Walmart-Logo-Icon.png" width= "40" alt="Logo" class="me-2">
        Welcome to Product Store!
      </a>

      <!-- Toggler for mobile -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Links -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item"><a class="nav-link active" href="/index.html">Home</a></li>
          <li class="nav-item"><a class="nav-link active" href="/form.html">Add</a></li>
          <li class="nav-item"><a class="nav-link active" href="/inventory">Inventory</a></li>
          <li class="nav-item"><a class="nav-link active" href="/about.html">About</a></li>
        </ul>
      </div>
    </div>
  </nav>
    </header> 
    <div class="container mt-4">
        <div class="row row-cols-1 row-cols-md-3 g-4">
`;

    results.forEach((product) => { 
      html += `
            <div class="col">
                <div class="card h-100">
                    <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">$${product.price}</small>
                    </div>
                </div>
            </div>
      `;
    }
    );
    
    html += `
        </div>
    </div>
</body>
</html>
    `;
    res.send(html);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

