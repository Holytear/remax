# 🧾 Case Study for: RE/MAX Türkiye

**Submission Deadline:** July 2, 2025 – 17:00 (GMT+3)

---

## 🛠 Requirements

### 🔹 Responsive Design
- All pages must be **mobile-first**.
- The layout must work correctly between **320px and 1440px** with no visual breakage.

### 🔹 User Experience
- Enhance UX with **animations and interactive elements** like:
  - Card hover effects  
  - Loading skeletons  
  - Transitions

### 🔹 Styling Preference (in order):
1. **Tailwind CSS**
2. **CSS Modules**
3. **Styled Components**

### 🔹 Backend & API
- Use **FastAPI** as the backend framework.
- An `/openapi.json` file must be auto-generated.
- Swagger UI should be exposed and working.

### 🔹 Frontend Framework
- **Next.js** is the primary preference (React.js is acceptable if needed).

### 🔹 Documentation
- Include a comprehensive `README.md` file with:
  - Setup instructions
  - Installation steps
  - Environment setup
  - Running and deployment guide

### 🔹 Docker
- Dockerization is **preferred** for easy setup and testing.
- Not mandatory, but adds bonus points.

---

## 📱 Application Structure

### 🏠 Homepage
- Displays a **paginated list** of users.
- Data source:  
  `GET https://reqres.in/api/users`  `[1]`
- Each user card must show:
  - **Full Name**
  - **Avatar**
  - **Button linking to the user’s detail page**
    - Button color:  
      `GET https://reqres.in/api/unknown`  `[3]`

- Additional:
  - **“Create New User” button**: opens a form (Name, Surname, Email, Age)  
    - On submit:  
      `POST https://reqres.in/api/users`  `[5]`  
      Show API response status on the UI
  - **“Login” button**  
    - Uses:  
      `POST https://reqres.in/api/login`  `[6]`  
      - Sample request:
        ```json
        {
          "email": "eve.holt@reqres.in",
          "password": "test"
        }
        ```
      - On success: store received token in **localStorage**

### 👤 Detail Page
- Shows selected user details:
  - Full Name
  - Avatar
  - Email
- Data source:  
  `GET https://reqres.in/api/users/{id}`  `[2]`
- Includes a **“Back to Home”** button.
  - Button color source:  
    `GET https://reqres.in/api/unknown/2`  `[4]`
- Also display the **color value** from endpoints `[3]` and `[4]`.

---

## 🛒 Products Page

Users can:
- Add products
- List added products
- Mark products as favorites
- View favorite products
- Delete specific products
- Update product information

Each product contains:
- `name` (string)
- `amount` (number)
- `price` (number)
- `description` (string)

Store data in a local **database**.

You must create and expose relevant **API endpoints** for these operations.

---

## 🤖 Chatbot (within Products Page)
Implement a basic chatbot where users can:
- Ask for:
  - Total product count
  - Product prices (e.g., sum, max, average, etc.)
- Chatbot should support both:
  - Simple **Q&A**
  - Small talk/general conversation

---

## 🌐 Endpoint Summary

| Purpose | Method | Endpoint |
|--------|--------|----------|
| List users | `GET` | https://reqres.in/api/users |
| Get single user | `GET` | https://reqres.in/api/users/{id} |
| Get button colors | `GET` | https://reqres.in/api/unknown |
| Get single button color | `GET` | https://reqres.in/api/unknown/2 |
| Create user | `POST` | https://reqres.in/api/users |
| Login | `POST` | https://reqres.in/api/login |