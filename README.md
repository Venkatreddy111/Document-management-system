# 📁 Document Management System (DMS)

A full-stack **Document Management System** built using the **MEAN Stack** that enables users to securely upload, organize, search, and manage documents with role-based permissions and version control.


---

## 🚀 Features

### 🔐 Authentication & Authorization
- User Registration and Login
- JWT-based Authentication
- Role-Based Access Control (Admin / User)

### 📄 Document Management
- Upload documents (PDF, Images, etc.)
- Rename documents
- Tag and categorize files
- Folder-like structure (Google Drive style)
- Version control to track document updates
- Inline preview for PDFs and Images

### 🔍 Search & Filter
- Search documents by name
- Filter documents using tags

### 👤 User Profile
- View total uploaded files
- View total storage used
- Real-time profile synchronization

### 🎨 UI / UX
- Fully responsive web pages
- Modern UI using Tailwind CSS
- Dark / Light mode support
- Inline modals instead of pop-ups

---

## 🏗️ Tech Stack

| Layer      | Technology |
|-----------|------------|
| Frontend  | Angular (v21+), Tailwind CSS |
| Backend   | Node.js, Express.js |
| Database  | MongoDB Atlas |
| Auth      | JWT (JSON Web Tokens) |
| Uploads   | Multer |

---

## 📂 Project Structure

Document-management-system/

│

├── backend/

│ ├── controllers/

│ ├── models/

│ ├── routes/

│ ├── middleware/

│ ├── uploads/

│ ├── server.js

│ └── .env

│
├── frontend/

│ ├── src/app/

│ │ ├── components/

│ │ ├── services/

│ │ ├── guards/

│ │ └── app.routes.ts

│ └── angular.json

│

└── README.md


---

## ⚙️ Prerequisites

Ensure the following are installed on your system:

| Software | Version |
|--------|---------|
| Node.js | v18.x or later |
| npm | v9.x or later |
| Angular CLI | v17+ |
| MongoDB | MongoDB Atlas |
| Git | Latest |

---

## 🔧 Local Setup Instructions

### 1️⃣ Clone the Repository
``` bash
git clone https://github.com/Venkatreddy111/Document-management-system.git

cd Document-management-system
```

🖥️ Backend Setup
2️⃣ Navigate to Backend Folder
``` bash
cd backend
```
3️⃣ Install Backend Dependencies
``` bash
npm install
```

4️⃣ Create .env File
``` bash
PORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dms

JWT_SECRET=your_jwt_secret
```

⚠️ Make sure your IP address is allowed in
MongoDB Atlas → Network Access

5️⃣ Start Backend Server
``` bash
npm start
```

Backend will run at:
``` bash
http://localhost:5000
```
🌐 Frontend Setup
6️⃣ Navigate to Frontend Folder
``` bash
cd ../frontend
```
7️⃣ Install Frontend Dependencies
``` bash
npm install
```
8️⃣ Start Angular Application
``` bash
ng serve
```

Frontend will run at:
``` bash
http://localhost:4200
```
