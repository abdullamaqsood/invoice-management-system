# InvoiceFlow

**InvoiceFlow** is a full-stack invoice management system built using **React** for the frontend and **Django REST Framework** for the backend. It supports user authentication, invoice and vendor management, file uploads, role-based access control, and powerful filtering options.

## Live Link

[Test the app here](https://invoice-management-system-two.vercel.app/)

## 🔧 Features

### ✅ Authentication

* User registration and login
* Role-based access: `admin` and `viewer`
* JWT-based secure session management

### 📄 Invoices

* View and filter invoices by status, vendor, date (all users)
* Add invoices with file upload (admin only)
* Edit and delete invoices (admin only)
* Mark invoice as "Paid" (admin only)

### 🧾 Vendors

* View vendor list (all users)
* Add, edit, delete vendors (admin only)

### 📁 File Handling

* Upload invoice files (PDF/image)
* View/download uploaded files

### 🧑 Role-Based Permissions

* **Admin**: Full CRUD access to vendors and invoices
* **Viewer**: Read-only access



## 🖥️ Tech Stack

| Layer    | Technology                     |
| -------- | ------------------------------ |
| Frontend | React + MUI + React Router     |
| Backend  | Django + Django REST Framework |
| Auth     | JWT Authentication             |
| Database | Supabase                       |


## 🚀 Getting Started

### 1. Backend Setup

#### 🔹 Requirements

* Python 3.8+
* Pip (Python package manager)

Navigate to the `backend` folder:

```bash
cd backend
```

#### 🔹 Install Dependencies

```bash
pip install -r requirements.txt
```

#### 🔹 requirements.txt

```txt
Django
djangorestframework
djangorestframework-simplejwt
gunicorn
python-dotenv
psycopg2-binary
Pillow
django-cors-headers
dj-database-url
requests
```

#### 🔹 Add `.env` File

Add `.env` file in the backend root directory.

#### 🔹 Run the Server

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```


### 2. Frontend Setup

Navigate to the `frontend` folder:

```bash
cd frontend
```

#### 🔹 Install Node Modules

```bash
npm install
```

#### 🔹 Run the React App

```bash
npm start
```


## 👥 Test Credentials

Use the following test users to explore the app:

### Admin

```txt
Username: admin  
Password: 123456
```

### Viewer

```txt
Username: viewer  
Password: 123456
```

## 🖼️ Sample Files

* Sample invoice **image** and **PDF** are included in the repository under `/samples`
* Use them when uploading invoices during testing


## 🔐 User Roles

### Admin

* Add/edit/delete vendors
* Add/edit/delete invoices
* Mark invoice as paid

### Viewer

* Can only view invoices and vendor list
* No ability to create/update/delete


## 🧪 API Overview

### Authentication

* `POST /api/auth/login/` – Login
* `POST /api/auth/register/` – Register

### Invoices

* `GET /api/invoices/` – List invoices
* `POST /api/invoices/` – Create invoice
* `PATCH /api/invoices/<id>/` – Update invoice
* `DELETE /api/invoices/<id>/` – Delete invoice

### Vendors

* `GET /api/vendors/` – List vendors
* `POST /api/vendors/` – Create vendor
* `PUT /api/vendors/<id>/` – Update vendor
* `DELETE /api/vendors/<id>/` – Delete vendor


## ✅ Form Validations

* Invoice file name is auto-renamed to: `VendorName_InvoiceNumber.ext`
* Email validation for vendor inputs
* Amount and due date validations
* Required fields check
* File upload validation (PDF/image only)


