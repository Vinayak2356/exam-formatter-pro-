# System Design Patterns Explorer

A modern, full-stack application built with Spring Boot (Java 17), React (Vite), and MySQL to explore and manage 30+ distributed systems design patterns.

## Features
- **Modern Glassmorphism UI**: Built with React, Tailwind CSS, Recharts, and Lucide Icons.
- **Spring Boot Backend**: Fully secured with JWT, custom exceptions, and JPA.
- **Dockerized MySQL**: Easy setup with Docker Compose.
- **Pre-seeded Database**: Automatically injects 30 production System Design patterns (Load Balancing, CQRS, Saga, Sharding, etc.) and an Admin user on startup.
- **Exporting**: Export data locally to CSV.

## Quick Start Guide

### 1. Start the Database
Ensure you have Docker Desktop running.
```bash
cd system-design-explorer
docker-compose up -d
```
This starts MySQL and phpMyAdmin (accessible at `http://localhost:8081`).

### 2. Run the Backend (Spring Boot)
Ensure you have Java 17 and Maven installed.
```bash
cd system-design-explorer/backend
./mvnw spring-boot:run
```
*(The backend will run on `http://localhost:8080` and will automatically create the tables and seed the 30 patterns + Admin user).*

### 3. Run the Frontend (React)
```bash
cd system-design-explorer/frontend
npm install
npm run dev
```
*(The frontend will run on `http://localhost:5173`)*

## Login Credentials
- **Email:** `admin@systemdesign.com`
- **Password:** `admin123`

## API Documentation
Once the backend is running, you can view the Swagger OpenAPI documentation here:
`http://localhost:8080/swagger-ui.html`
