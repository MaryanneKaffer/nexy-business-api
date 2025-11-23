# 📦 Fullstack Order Management System

This project is a **fullstack application** built with **Next.js, React, Prisma, SQLite, Tailwind CSS, and React Router**.
It provides a simple and responsive system for managing **customers, products, and orders** through an API and frontend interface.

---

## 🚀 Tech Stack

* **Backend / API**

  * **Prisma** – ORM for database queries
  * **SQLite** – Lightweight relational database
  * **Next.js API Routes** – Backend endpoints for CRUD operations

* **Frontend**

  * **React** – UI library
  * **Next.js** – React framework with App Router
  * **Tailwind CSS** – Utility-first styling
  * **React Router** – Client-side navigation

* **Other**

  * Fully **responsive design** (works on desktop and mobile)

---

## 📂 Features

* **Customer Management**

  * Create, list, update, and delete customers
* **Product Management**

  * Create, list, update, and delete products
* **Order Management**

  * Register orders linked to customers and products
  * View detailed order information
* **Responsive UI**

---

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MaryanneKaffer/next-business-api.git
   cd next-business-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**

   * Initialize Prisma and the SQLite database:

     ```bash
     npx prisma migrate dev --name init
     ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

---

## 📡 API Endpoints (examples)

### Customers

* `GET /api/customers` → List all customers
* `POST /api/customers` → Create a new customer
* `GET /api/customers/:id` → Get customer by ID
* `PUT /api/customers/:id` → Update customer
* `DELETE /api/customers/:id` → Delete customer

### Products

* `GET /api/products` → List all products
* `POST /api/products` → Create a new product
* `GET /api/products/:id` → Get product by ID
* `PUT /api/products/:id` → Update product
* `DELETE /api/products/:id` → Delete product

### Orders

* `GET /api/orders` → List all orders
* `POST /api/orders` → Create a new order
* `GET /api/orders/:id` → Get order by ID

---

## 📱 Responsive Design

The application is fully responsive thanks to **Tailwind CSS**, ensuring a smooth experience across desktops, tablets, and smartphones.

---

## 🛠️ Development

* Edit Prisma schema in `prisma/schema.prisma`
* Run migrations after schema changes:

  ```bash
  npx prisma migrate dev
  ```
* Inspect the database using:

  ```bash
  npx prisma studio
  ```
