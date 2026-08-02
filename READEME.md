# 🩸 Blood Management System

A modern web-based **Blood Management System** designed to simplify blood donation, inventory management, donor registration, blood requests, and administrative operations. The system helps hospitals, blood banks, and administrators efficiently manage blood-related information while ensuring secure access and accurate records.

---

# 📌 Features

## Authentication

* User Login
* User Registration
* Role-Based Authorization
* JWT Authentication
* Password Encryption

## Donor Management

* Register New Donor
* View All Donors
* Update Donor Information
* Delete Donor Records
* Search Donors

## Blood Inventory

* Add Blood Units
* Update Blood Stock
* Remove Blood Stock
* View Available Blood Types
* Low Stock Alerts

## Blood Requests

* Create Blood Request
* Approve/Reject Requests
* Track Request Status

## Dashboard

* Total Donors
* Total Blood Units
* Blood Requests Statistics
* Recent Activities

## Reports

* Blood Inventory Reports
* Donor Reports
* Request Reports

---

# 🛠️ Technologies Used

## Frontend

* React.js
* Vite
* Bootstrap
* Axios
* React Router DOM

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication

* JSON Web Token (JWT)
* bcrypt

## Validation

* Validator.js

## Development Tools

* Nodemon
* Git
* GitHub
* Postman

---

# 📁 Project Folder Structure

```text
Blood-Management-System/
│
├── Backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── donorController.js
│   │   ├── bloodController.js
│   │   └── requestController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Donor.js
│   │   ├── Blood.js
│   │   └── Request.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── donorRoutes.js
│   │   ├── bloodRoutes.js
│   │   └── requestRoutes.js
│   │
│   ├── services/
│   ├── validators/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/sakariyemohamoud05-source/Blood-Bank-donation-Project.git
```

---

## 2. Navigate to the Project

```bash
cd blood-management-system
```

---

## 3. Install Backend Dependencies

```bash
cd Backend
npm install
```

---

## 4. Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

---

## 5. Configure Environment Variables

Create a `.env` file inside the **Backend** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## 6. Start Backend

```bash
cd Backend
npm run dev
```

---

## 7. Start Frontend

```bash
cd Frontend
npm run dev
```

---

# 🌐 Default URLs

Backend

```
http://localhost:5000
```

Frontend

```
http://localhost:5173
```

---

# 🔐 User Roles

### Administrator

* Manage Users
* Manage Donors
* Manage Blood Inventory
* Approve Blood Requests
* Generate Reports

### Staff

* Register Donors
* Manage Blood Stock
* Submit Blood Requests
* View Dashboard

---

# 📊 Database Collections

* Users
* Donors
* BloodInventory
* BloodRequests

---

# 🚀 Future Improvements

* Email Notifications
* SMS Notifications
* QR Code for Donors
* Blood Donation Scheduling
* Hospital Integration
* Analytics Dashboard
* Export Reports (PDF & Excel)

---

# 👥 Team Members

| Name                     

Zakaria Mohamoud Osman         
najma Apdirahman Mohamed       
Hafsa Saleban Adan
Mohamed Apdisalam Hasan
Ahmedyasen Hasan Omar


---

# 🤝 Contributing

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 📄 License

This project is intended for educational purposes. You may modify and use it according to your institution's requirements.

---

# 🙏 Acknowledgements

Special thanks to all contributors, instructors, and open-source communities whose tools and resources made this project possible.
