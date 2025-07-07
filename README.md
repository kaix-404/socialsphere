# SocialSphere – A Full Stack Social Media Platform 🧵

A **feature-rich social networking platform** built with the **MERN stack** and **Tailwind CSS**. Designed for seamless user interaction including posting, liking, commenting, and following — with a sleek and responsive UI.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - JWT-secured login/register
  - Profile-based access with route protection

- 🧑‍🤝‍🧑 **User Profiles**
  - View profiles with posts, followers, and following
  - Follow/unfollow functionality
  - Edit profile details

- 📝 **Post Management**
  - Create, edit, delete posts (text + optional image)
  - Like/unlike posts
  - View posts by any user

- 💬 **Comments**
  - Add/delete comments in real time
  - Nested under each post

- 📱 **Responsive UI**
  - Built with **React** and **Tailwind CSS**
  - Clean, cozy, mobile-first layout

---

## 🧰 Tech Stack

| Layer       | Technology                             |
|-------------|----------------------------------------|
| Frontend    | React, Tailwind CSS                    |
| Backend     | Node.js, Express.js                    |
| Database    | MongoDB, Mongoose                      |
| Auth        | JWT, bcrypt                            |

---

## 🛠️ Getting Started

### 🔧 Prerequisites

- Node.js
- MongoDB installed and running locally
- npm or yarn

---

### 📦 Installation

```bash
git clone https://github.com/yourusername/social-media-app.git
cd social-media-app
```

#### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/socialapp
JWT_SECRET=your_jwt_secret
PORT=9000
```

Run the backend server:

```bash
npm run dev
```

---

#### 2. Frontend Setup

```bash
cd ../frontend
npm install
```

Run the frontend (Vite):

```bash
npm run dev
```

Visit the app: [http://localhost:5173](http://localhost:5173)

---

## 🔐 API Overview

| Method | Route                             | Function              |
|--------|-----------------------------------|-----------------------|
| POST   | `/api/auth/register`              | Register user         |
| POST   | `/api/auth/login`                 | Login user            |
| GET    | `/api/users/:id`                  | Get user profile      |
| PUT    | `/api/users/:id/follow`           | Follow user           |
| PUT    | `/api/users/:id/unfollow`         | Unfollow user         |
| GET    | `/api/posts`                      | Get all posts         |
| POST   | `/api/posts`                      | Create a post         |
| PUT    | `/api/posts/:id`                  | Edit a post           |
| DELETE | `/api/posts/:id`                  | Delete a post         |
| POST   | `/api/posts/:id/like`             | Like a post           |
| POST   | `/api/posts/:id/unlike`           | Unlike a post         |
| POST   | `/api/comments`                   | Add a comment         |
| DELETE | `/api/comments/:id`               | Delete a comment      |

---

## 🙌 Author

Built with ❤️ by [Kai](https://github.com/yourusername)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
