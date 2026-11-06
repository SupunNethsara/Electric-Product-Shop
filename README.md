# ⚡ Electric Product Shop — Enterprise E-Commerce REST API Backend

<div align="center">

  [![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
  [![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
  [![Laravel Sanctum](https://img.shields.io/badge/Sanctum-Auth-red?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/docs/sanctum)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

  <p align="center">
    A robust, scalable RESTful API backend for an Electrical & Electronic Equipment E-Commerce Platform. Built with <strong>Laravel 12</strong>, featuring role-based access control (Customers, Admins, Super Admins), quotation negotiation workflows, automated Excel reporting, and Cloudinary media pipelines.
  </p>

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-api-modules">API Modules</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-author">Author</a>
  </p>

</div>

---

## 🌟 Overview

The **Electric Product Shop API** powers an end-to-end e-commerce solution tailored for industrial, commercial, and retail electrical supplies. Designed with strict domain-driven separation, token-based authentication via **Laravel Sanctum**, and multi-tier administrative dashboards, it supports wholesale quotation requests, order fulfillment tracking, inventory status, and automated sales reporting.

Companion Frontend Repository: [eproduct-frontend](https://github.com/SupunNethsara/eproduct-frontend)

---

## ✨ Key Features

- **🔐 Multi-Role Authentication & Authorization**:
  - Secure token authentication via **Laravel Sanctum** with token refresh and revocation.
  - Social OAuth integration via **Laravel Socialite**.
  - Role-based permissions guarding Customer, Store Admin, and Super Admin routes.
- **📦 Inventory & Product Catalog Management**:
  - Category and brand taxonomies with multi-attribute filtering.
  - Top products, featured deals, and automated stock level tracking.
  - High-resolution media optimization via **Cloudinary**.
- **📑 B2B Quotation Management System**:
  - Direct customer quotation inquiries for bulk/wholesale electrical equipment orders.
  - Admin quotation review, price adjustments, and approval workflow.
- **🛒 Shopping Cart, Wishlist & Orders Lifecycle**:
  - Persistent shopping cart and wishlist management.
  - Multi-state order processing pipeline: `Pending` $\to$ `Confirmed` $\to$ `Processing` $\to$ `Dispatched` $\to$ `Delivered`.
- **📊 Business Intelligence & Excel Export**:
  - Real-time sales, revenue, and customer acquisition metrics.
  - Automated spreadsheet report exports powered by **Maatwebsite/Excel**.
- **⚙️ System Configuration & Branding**:
  - Dynamic store branding, tax rules, currency configurations, and platform settings.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Clients"]
        WEB["React 19 Customer Storefront"]
        ADMIN["Admin / SuperAdmin Dashboard"]
    end

    subgraph APIGateway["Laravel 12 REST API & Middleware"]
        SANCTUM["Sanctum Token Guard & Socialite"]
        ROLES["Role Middleware (Customer | Admin | SuperAdmin)"]
    end

    subgraph Controllers["Domain Controllers"]
        PROD["Product & Brand Controllers"]
        ORDER["Order & Cart Controllers"]
        QUOTE["Quotation Controller (B2B)"]
        REPORT["Excel Report & Analytics Controller"]
    end

    subgraph DataStorage["Data & Cloud Tier"]
        MYSQL[("MySQL Database")]
        CLOUDINARY[("Cloudinary Media CDN")]
    end

    WEB --> SANCTUM
    ADMIN --> SANCTUM
    SANCTUM --> ROLES
    ROLES --> PROD
    ROLES --> ORDER
    ROLES --> QUOTE
    ROLES --> REPORT
    PROD --> MYSQL
    ORDER --> MYSQL
    QUOTE --> MYSQL
    PROD --> CLOUDINARY
```

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend Framework** | **Laravel 12.x** | Enterprise PHP framework with modern service providers |
| **Runtime** | **PHP 8.3+** | High-performance PHP engine |
| **Authentication** | **Laravel Sanctum & Socialite** | Lightweight SPA token authentication & OAuth |
| **Database** | **MySQL 8.0** | Relational data persistence with foreign key constraints |
| **Media Management** | **Cloudinary Laravel** | Automated cloud transformations and CDN asset delivery |
| **Excel Export** | **Maatwebsite/Excel 3.1** | Spreadsheet data streaming and report downloads |
| **Dev Tools** | **Laravel Sail & Pint** | Dockerized dev environment and PSR-12 code linting |

---

## 📡 Core API Modules

| Endpoint Group | Description |
| :--- | :--- |
| `/api/auth/*` | Registration, login, password reset, OTP verification, Socialite redirect/callback |
| `/api/products/*` | Product CRUD, image uploads, category & brand filtering, top products |
| `/api/cart/*` | Add to cart, update quantity, remove item, sync cart |
| `/api/orders/*` | Checkout, order status tracking, user order history, admin fulfillment |
| `/api/quotations/*` | Submit bulk quotation requests, admin pricing review, status updates |
| `/api/wishlist/*` | Customer favorite products wishlist |
| `/api/reports/*` | Sales summaries, product performance metrics, Excel exports |
| `/api/admin/*` | Super admin user management, system settings, branding controls |

---

## 🚀 Getting Started

### Prerequisites

- **PHP**: 8.3 or higher with extensions (`pdo_mysql`, `mbstring`, `curl`, `gd`, `xml`)
- **Composer**: Dependency manager for PHP
- **MySQL Server**: 8.0 or compatible database

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SupunNethsara/Electric-Product-Shop.git
   cd Electric-Product-Shop
   ```

2. **Install PHP dependencies**:
   ```bash
   composer install
   ```

3. **Environment Setup**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Update `.env` with your database and Cloudinary credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=electric_shop_db
   DB_USERNAME=root
   DB_PASSWORD=

   CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
   ```

4. **Run Database Migrations & Seeders**:
   ```bash
   php artisan migrate --seed
   ```

5. **Start the Laravel Server**:
   ```bash
   php artisan serve
   ```
   The API will be available at `http://127.0.0.1:8000`.

---

## 👨‍💻 Author & Connect

**Supun Dharmathilaka (Supun Nethsara)**  
*Associate Team Lead Software Engineer & Full Stack Developer*

- 🌐 **Portfolio**: [supunnethsaradev.netlify.app](https://supunnethsaradev.netlify.app/)
- 💼 **LinkedIn**: [linkedin.com/in/supun-dharmathilaka](https://www.linkedin.com/in/supun-dharmathilaka-a64389257/)
- 🐙 **GitHub**: [@SupunNethsara](https://github.com/SupunNethsara)
- 📧 **Email**: [supundarmathilaka@gmail.com](mailto:supundarmathilaka@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
