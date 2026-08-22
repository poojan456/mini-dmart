# Mini D-Mart - Grocery Store Application

## Project Overview
Mini D-Mart is a full-stack e-commerce application designed to simulate a real-world grocery store. It allows customers to seamlessly browse products, manage their cart, schedule deliveries or store pickups, and handle returns. The platform also provides a robust Admin Dashboard for staff to manage inventory, track orders, and approve/reject return requests.

This project was built as part of a Full Stack Developer Practical Assessment.

## Features
- **User Management**: Secure Registration, Login, Profile management, and Role-Based Access Control (Admin vs. Customer).
- **Product Management**: Admins can add, edit, and delete products, manage inventory stock, and categorize items.
- **Shopping Experience**: Dynamic cart management, stock validation during checkout, and seamless order creation.
- **Order Management**: Customers can view order history and statuses. Admins manage the lifecycle of an order from preparation to delivery. Delivery methods include Home Delivery and Scheduled Store Pickup.
- **Returns & Exchanges**: Customers can request returns for delivered items. Admins process (approve/reject) these requests, and the status dynamically reflects on the user's order dashboard.
- **Product Design**: Clean, responsive, Zepto-inspired UI with modal overlays, interactive data tables, and distinct customer/staff experiences.

## Architecture
The application follows a standard modern 3-tier architecture:
- **Frontend**: React.js (Vite), React Router for navigation, and SweetAlert2 for modern interactive popups.
- **Backend**: Spring Boot (Java 17), providing RESTful APIs, business logic, and security configurations.
- **Database**: MySQL, utilizing Spring Data JPA for ORM and schema management.
- **Security**: Stateless JSON Web Tokens (JWT) for authentication and API endpoint authorization.

## Database Design
- `users`: Stores user credentials, roles (`ROLE_USER`, `ROLE_ADMIN`), and profile data.
- `products`: Stores grocery items, including `LONGTEXT` for high-resolution image URLs, stock quantities, and pricing.
- `orders`: Tracks the order lifecycle, delivery types, total amounts, and timestamps.
- `order_items`: Maps the many-to-many relationship between orders and products with historical pricing.
- `return_requests`: Links directly to an `order_id`, tracking the status (`PENDING`, `APPROVED`, `REJECTED`) and reasons for returns.

## API Documentation (Selected Endpoints)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate and get JWT | Public |
| GET | `/api/products` | Get all products | Public |
| POST | `/api/products` | Create a new product | Admin Only |
| GET | `/api/orders/my-orders` | Get user's order history | User |
| POST | `/api/returns/{orderId}` | Submit a return request | User |
| PUT | `/api/returns/{id}/status`| Approve/reject return | Admin Only |

## Setup Instructions

### Prerequisites
- Node.js & npm
- Java 17
- MySQL

### 1. Database Setup
1. Create a MySQL database named `mini_dmart`.
2. Update the credentials in `Backend/Backend/src/main/resources/application.properties` (or use environment variables as detailed in `.env.example`).

### 2. Backend Setup
```bash
cd Backend/Backend
mvn clean install
mvn spring-boot:run
```
The API will run on `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The React app will be accessible at `http://localhost:5173`.

## Deployment
*(Deployment links will be updated in the next phase!)*
