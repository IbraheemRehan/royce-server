# Royce Threads Backend

## Overview

This is the backend API for the Royce Threads e-commerce application. It is built with Node.js, Express, and MongoDB, and provides:

- Product management and CRUD operations
- User authentication with registration and login
- Image uploading for products using Cloudinary
- Order placement with email notifications to admin and customers
- Cart persistence and order storage
- Newsletter subscription handling with email delivery via Resend

## What this does

The backend exposes REST API endpoints used by the frontend client. It stores data in MongoDB, manages user accounts, handles orders, and sends email notifications.

## Prerequisites

- Node.js `20.x`
- MongoDB database (local or hosted)
- Cloudinary account for image hosting
- Resend API key for newsletter email delivery
- Gmail credentials for order notification emails

## Required configuration

Create a `.env` file in `royce-server/` with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
RESEND_EMAIL=your_resend_sender_email
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@yourdomain.com
BASE_URL=https://royce-client.vercel.app
```

> Note: `BASE_URL` is used to generate product links in order confirmation emails.

### Cloudinary setup

The project currently stores Cloudinary credentials in `utils/cloudinary.js`. Replace the placeholder values with your actual values:

```js
cloudinary.config({
  cloud_name: 'your_cloud',
  api_key: 'your_key',
  api_secret: 'your_secret',
});
```

## Installation

```bash
cd royce-server
npm install
```

## Running the backend

Start the server in development mode:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

The server listens on port `5000` by default unless `PORT` is set in the environment.

## Seed sample product data

If you want to load the product list from `products.json`, run:

```bash
cd royce-server
node seedProducts.js
```

## Main API endpoints

- `GET /api/products` - fetch all products
- `GET /api/products/:id` - fetch a single product
- `POST /api/products/add` - add a new product
- `PUT /api/products/:id` - update a product
- `DELETE /api/products/:id` - delete a product
- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - login and receive JWT token
- `POST /api/upload` - upload an image to Cloudinary
- `POST /api/orders` - create a new order and send emails
- `POST /api/cart` - cart persistence operations
- `POST /api/newsletter` - subscribe to newsletter and send welcome email

## Notes

- The backend enables CORS for local development and deployed frontend origins.
- Uploaded images are saved through Cloudinary via `/api/upload`.
- Newsletter signups are stored in the database and sent through Resend.
- Order emails use Gmail credentials configured with `GMAIL_USER` and `GMAIL_PASS`.

## Project structure

- `config/db.js` — MongoDB connection utility
- `controllers/` — request handlers for products
- `models/` — Mongoose models for `Cart`, `Newsletter`, `Order`, `Product`, `User`
- `routes/` — Express API route definitions
- `utils/cloudinary.js` — Cloudinary configuration
- `seedProducts.js` — import script for sample product data
- `server.js` — Express server entrypoint

## Troubleshooting

- If the server fails to connect, verify `MONGO_URI`.
- If newsletter email fails, confirm `RESEND_API_KEY` and `RESEND_EMAIL`.
- If order emails fail, confirm `GMAIL_USER` and `GMAIL_PASS`.
- If image uploads fail, confirm Cloudinary credentials in `utils/cloudinary.js`.
