# Happy Thoughts API


## Project Overview

Happy Thoughts API is a RESTful backend built with Node.js, Express, and MongoDB. It provides endpoints for creating, reading, updating, liking, and deleting "thoughts" (messages), as well as user authentication and registration.

### Key Features

- **Mongoose Schema Models:** All data is structured and validated using Mongoose models for both thoughts and users. This ensures consistent data and enforces rules such as required fields and minimum password length.
- **Password Security:** User passwords are securely hashed using bcrypt before being stored in the database.
- **Authentication:** The API uses access tokens to protect routes for creating, updating, and deleting thoughts. Only authenticated users can perform these actions.
- **Error Handling:** All routes include robust error handling and return clear status codes and messages for invalid input, authentication failures, and other errors.
- **RESTful Design:** The API follows RESTful principles, with clear separation of resources and HTTP methods for CRUD operations.
- **Filtering & Sorting:** Thoughts can be filtered by number of likes (hearts) and sorted by creation date.
- **Frontend Integration:** Designed to work seamlessly with a frontend application, supporting features like updating and deleting thoughts, user signup/login, and error feedback.

---

## Project Requirements

**Fulfilled requirements:**
- ✅ API documentation with Express List Endpoints
- ✅ Read all thoughts
- ✅ Read a single thought
- ✅ Like a thought
- ✅ Create a thought (authenticated)
- ✅ Update a thought (authenticated)
- ✅ Delete a thought (authenticated)
- ✅ Sign up (register user)
- ✅ Log in (user authentication)
- ✅ RESTful structure
- ✅ Clean code according to guidelines
- ✅ Uses Mongoose models
- ✅ Validates user input
- ✅ Unique email addresses
- ✅ Error handling and status codes
- ✅ Frontend supports Update/Delete/Signup/Login and error handling
- ✅ Passwords encrypted with bcrypt
- ✅ API deployed on Render
- ✅ Backend and frontend are synced
- ✅ Filtering thoughts by number of hearts (`/thoughts?hearts=5`)
- ✅ Sorting by date (newest first)
- ✅ API error messages displayed in frontend during registration
- ✅ Token stored in localStorage and sent in headers

---

## API Endpoints

- `GET /thoughts` – Get all thoughts (with filtering/sorting)
- `GET /thoughts/:id` – Get a single thought
- `POST /thoughts` – Create a thought (requires authentication)
- `PATCH /thoughts/:id/like` – Like a thought
- `PATCH /thoughts/:id` – Update a thought (requires authentication)
- `DELETE /thoughts/:id` – Delete a thought (requires authentication)
- `POST /user/signup` – Register user
- `POST /user/login` – Log in user

---

## File structure
middleware/
└──authMiddleware.js   
models/         
├── Thought.js            
└── User.js            
routes/
├── thoughtRoutes.js 
└── userRoutes.js 

└── server,js        
```