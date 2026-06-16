# 🌟 Exam Formatter Pro & System Design Patterns Explorer

Welcome to the central codebase documentation. This workspace contains two primary projects:
1. **Exam Formatter Pro**: A TanStack Start (React 19 + Vite 7) application to generate school exam papers, timetables, and holiday homework.
2. **System Design Patterns Explorer (SDP Explorer)**: A full-stack Spring Boot (Java 17) + React SPA application using MySQL to catalog and manage 30+ distributed systems design patterns.

---

## 🔗 Deployed Application Links & Routes

### 1. System Design Patterns Explorer
* **Base Production URL**: [https://sdp-explorer-production.up.railway.app](https://sdp-explorer-production.up.railway.app)
* **Frontend SPA Pages**:
  * **Dashboard**: `https://sdp-explorer-production.up.railway.app/`
  * **Pattern Library**: `https://sdp-explorer-production.up.railway.app/explorer`
  * **Admin Panel**: `https://sdp-explorer-production.up.railway.app/admin` *(Restricted to Role: ADMIN)*
  * **Login Page**: `https://sdp-explorer-production.up.railway.app/login`
* **Swagger API Documentation**: [https://sdp-explorer-production.up.railway.app/swagger-ui.html](https://sdp-explorer-production.up.railway.app/swagger-ui.html)

### 2. Exam Formatter Pro
* **Base Production URL**: [https://exam-formatter-pro-production.up.railway.app](https://exam-formatter-pro-production.up.railway.app)

---

## 🛠️ Swagger OpenAPI Specifications (Backend Endpoints)

The Spring Boot backend exposes several API endpoints documented at `/swagger-ui.html`. Below is the detailed resource structure:

```mermaid
graph TD
    Client[React Frontend] -->|HTTP Requests| Gateway[Spring Security Filter Chain]
    Gateway -->|Anonymous Allowed| Auth[/api/auth/login]
    Gateway -->|Anonymous Allowed| GetPatterns[GET /api/patterns]
    Gateway -->|Anonymous Allowed| GetStats[GET /api/stats]
    Gateway -->|Token Required: ROLE_ADMIN| AdminPatterns[POST/PUT/DELETE /api/patterns]
```

### 1. Authentication Endpoints (`/api/auth/**`)
* **`POST /api/auth/login`**
  * **Description**: Authenticates users and returns a JWT bearer token.
  * **Request Body**:
    ```json
    {
      "email": "admin@systemdesign.com",
      "password": "admin123"
    }
    ```
  * **Response (200 OK)**:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "email": "admin@systemdesign.com",
      "role": "ADMIN"
    }
    ```

### 2. Design Pattern Operations (`/api/patterns/**`)
* **`GET /api/patterns`**
  * **Description**: Returns a list of all distributed system design patterns.
  * **Access**: Public / Anonymous.
* **`GET /api/patterns/{id}`**
  * **Description**: Fetches detailed information for a single design pattern.
  * **Access**: Public / Anonymous.
* **`POST /api/patterns`**
  * **Description**: Inserts a new design pattern.
  * **Access**: Restricted (`ADMIN` role required, pass JWT token in headers).
* **`PUT /api/patterns/{id}`**
  * **Description**: Modifies properties of an existing pattern by ID.
  * **Access**: Restricted (`ADMIN` role required, pass JWT token in headers).
* **`DELETE /api/patterns/{id}`**
  * **Description**: Removes a design pattern from the repository.
  * **Access**: Restricted (`ADMIN` role required, pass JWT token in headers).

### 3. Application Statistics (`/api/stats/**`)
* **`GET /api/stats`**
  * **Description**: Retrieves aggregate counts of patterns, categories, and logs.
  * **Access**: Public / Anonymous.

---

## 📂 Project Directory Structure

Here is an architectural map highlighting key components and files of interest:

```
exam-formatter-pro/
├── src/                               # --- Exam Formatter Pro (React 19) ---
│   ├── components/
│   │   ├── ExamPaperView.tsx          # Renders exam templates (CBSE, logo, marks)
│   │   ├── HHWView.tsx                # Renders Holiday Homework templates (Standard, VVIP)
│   │   └── TimetableView.tsx          # Renders landscape Timetable grids
│   ├── routes/
│   │   └── index.tsx                  # Main workspace router and settings control
│   └── styles.css                     # CBSE & VVIP CSS layout engine
│
└── system-design-explorer/            # --- SDP Explorer (Spring Boot + React) ---
    ├── Dockerfile                     # Multi-stage container build config (Vite + Maven)
    │
    ├── backend/                       # --- Spring Boot Java Backend ---
    │   ├── pom.xml                    # Maven dependency manager (Security, JPA, MySQL, Swagger)
    │   └── src/main/java/com/systemdesign/explorer/
    │       ├── ExplorerApplication.java
    │       ├── config/
    │       │   ├── SecurityConfig.java # JWT Filter placement & SPA routes access rules
    │       │   └── SpaWebFilter.java   # Mapped fallback resource resolver for React Router
    │       ├── controller/
    │       │   ├── AuthController.java
    │       │   ├── PatternController.java
    │       │   └── StatsController.java
    │       └── seeder/
    │           └── DataSeeder.java    # Auto-seeds 30 patterns & default Admin on startup
    │
    └── frontend/                      # --- React TypeScript Frontend ---
        ├── vite.config.ts             # Tailwind CSS v4 compiler setup
        └── src/
            ├── App.tsx                # Protected routing config (/admin, /explorer, /)
            ├── context/
            │   └── AuthContext.tsx    # Session wrapper (Token, Role, Email)
            ├── index.css              # Custom HSL design tokens & @theme wrapper
            ├── services/
            │   └── api.ts             # Axios service with automated Auth Header Interceptor
            └── pages/
                ├── Dashboard.tsx      # Chart distribution summaries using Recharts
                ├── Explorer.tsx       # Search grid & Glassmorphic detail viewing modal
                └── Admin.tsx          # CRUD panel (Create, Edit, Delete modals)
```

---

## 💻 Code & Core Architecture Overview

### 1. The SPA Client-Side Routing Fix
* **File of Interest**: [SecurityConfig.java](file:///c:/Users/vinayak%20singh/Downloads/New%20folder%20(12)/exam%20paper/exam-formatter-pro-f812be80-main/system-design-explorer/backend/src/main/java/com/systemdesign/explorer/config/SecurityConfig.java)
* **Explanation**: To prevent `403 Forbidden` errors when reloading the browser directly on frontend routes (`/login`, `/explorer`, `/admin`), we explicitly whitelist these paths in Spring Security. This allows Spring WebMvc's [SpaWebFilter.java](file:///c:/Users/vinayak%20singh/Downloads/New%20folder%20(12)/exam%20paper/exam-formatter-pro-f812be80-main/system-design-explorer/backend/src/main/java/com/systemdesign/explorer/config/SpaWebFilter.java) to catch the request and return `index.html`, letting React Router resolve the path on the client side.

### 2. Auto-Seeding Database
* **File of Interest**: [DataSeeder.java](file:///c:/Users/vinayak%20singh/Downloads/New%20folder%20(12)/exam%20paper/exam-formatter-pro-f812be80-main/system-design-explorer/backend/src/main/java/com/systemdesign/explorer/seeder/DataSeeder.java)
* **Explanation**: On boot, the backend checks for the presence of the default admin user (`admin@systemdesign.com`) and creates it if missing. It also seeds 30 distributed design patterns including Load Balancing, CQRS, Saga, and Service Discovery with detailed descriptions, complexity rankings, and trade-offs.

### 3. JWT Authentication & Axios Interceptor
* **File of Interest**: [api.ts](file:///c:/Users/vinayak%20singh/Downloads/New%20folder%20(12)/exam%20paper/exam-formatter-pro-f812be80-main/system-design-explorer/frontend/src/services/api.ts)
* **Explanation**: All API calls automatically pull the authorization token from `localStorage` and inject it into the request headers as a Bearer token:
  ```typescript
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```

### 4. Tailwind CSS v4 Theme Configuration
* **File of Interest**: [index.css](file:///c:/Users/vinayak%20singh/Downloads/New%20folder%20(12)/exam%20paper/exam-formatter-pro-f812be80-main/system-design-explorer/frontend/src/index.css)
* **Explanation**: Tailwinds v4 handles custom themes dynamically using native CSS properties. We registered custom shadcn-style variables under `@theme` so utility styling classes like `bg-background`, `border-border`, and `text-foreground` compile correctly:
  ```css
  @theme {
    --color-background: hsl(var(--background));
    --color-foreground: hsl(var(--foreground));
    --color-border: hsl(var(--border));
    --color-primary: hsl(var(--primary));
  }
  ```

---

## 🎨 UI & Aesthetics Design Overview

The visual guidelines implement a premium **glassmorphism** design:

* **Animated Blur Elements**: Circular dynamic background elements (`bg-primary/5 blur-3xl`) float in the backdrop with smooth pulse animations to keep the interface feeling alive.
* **Glass Panels**: All dashboard card elements, login inputs, tables, and modal drawers utilize the custom `.glass` class:
  ```css
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  ```
* **Complexity-Colored Badges**: Complexity levels (Low, Medium, High) utilize harmonious tails (emerald green, amber orange, and rose red) to ensure visual readability.
* **CRUD Management Overlays**: Creating or modifying patterns displays slide-up modal cards with dark blurred backgrounds (`bg-black/60 backdrop-blur-sm`), keeping actions focused and elegant.
