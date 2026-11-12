# EMS - Full-Stack Employee Management System

A modern full-stack Employee Management System built with a **Spring Boot REST API** backend, a **React 19 & TypeScript** frontend with **Tailwind CSS**, and **MySQL** for persistence.

---

## 🚀 Features

- **Employee Directory**: View all employees with real-time employee counts.
- **Search & Filter**: Search employees instantly by name or email.
- **Create Employee**: Add new employees with instant UI updates.
- **Update Employee**: Edit existing employee details via an interactive modal.
- **Delete Employee**: Safely remove employees with confirmation.
- **Type Safety**: End-to-end typed contracts via TypeScript interfaces matching Spring Boot DTOs.
- **CORS Handling**: Automated Vite development proxy forwarding `/api` calls directly to Spring Boot (`localhost:8080`).

---

## 🛠️ Tech Stack

### Backend
- **Java 17+** / **Spring Boot 3**
- **Spring Data JPA** & **Hibernate**
- **MySQL Database**
- **Lombok** (Data models & clean DTOs)
- **Maven**

### Frontend
- **React 19**
- **TypeScript**
- **Vite** (Bundler & dev reverse proxy)
- **Tailwind CSS v4**
- **Lucide Icons**

---

## 📡 REST API Endpoints

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/employees` | Fetch all employees |
| `POST` | `/api/employees` | Create a new employee |
| `GET` | `/api/employees/{id}` | Fetch an employee by ID |
| `PUT` | `/api/employees/{id}` | Update an existing employee |
| `DELETE` | `/api/employees/{id}` | Delete an employee |

---

## 🏃 Getting Started

### 1. Backend Setup
1. Configure MySQL database `ems` in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ems
   spring.datasource.username=root
   spring.datasource.password=root
   ```
2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   Backend will start at `http://localhost:8080`.

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will run at `http://localhost:5173`.
