# Library Backend API Documentation

## Base URL
All API endpoints are relative to:
`/api/v1`

**General Response Format:**
Success and error responses typically follow this structure:
```json
{
  "status": "success" | "error",
  "message": "Description of the result",
  "data": {} // Optional data payload on success
}
```

---

## Authentication Routes

### Register
* **URL:** `/auth/register`
* **Method:** `POST`
* **Auth required:** No
* **Description:** Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Registrasi berhasil",
  "data": {
    "accessToken": "jwt-token-string",
    "user": {
      "userId": "uuid-string",
      "email": "user@example.com"
    }
  }
}
```

### Login
* **URL:** `/auth/login`
* **Method:** `POST`
* **Auth required:** No
* **Description:** Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "accessToken": "jwt-token-string",
    "user": {
      "userId": "uuid-string",
      "email": "user@example.com"
    }
  }
}
```

### Logout
* **URL:** `/auth/logout`
* **Method:** `POST`
* **Auth required:** No
* **Description:** Logout the current user.

**Success Response:**
```json
{
  "status": "success",
  "message": "Logout berhasil"
}
```

### Refresh Token
* **URL:** `/auth/refresh-token`
* **Method:** `POST`
* **Auth required:** No (Reads from HTTP-only cookie)
* **Description:** Refresh the access token.

**Success Response:**
```json
{
  "status": "success",
  "message": "Sesi berhasil diperbarui",
  "data": {
    "accessToken": "new-jwt-token-string",
    "user": {
      "userId": "uuid-string",
      "name": "User Name",
      "email": "user@example.com"
    }
  }
}
```

---

## Profile Routes

### Get Login User
* **URL:** `/profile/`
* **Method:** `GET`
* **Auth required:** Yes
* **Description:** Get the profile of the currently authenticated user.

**Success Response:**
```json
{
  "status": "success",
  "message": "Profile found",
  "data": {
    "id": "uuid-string",
    "name": "User Name",
    "gender": "Male",
    "photo_profile": "url-string"
  }
}
```

### Get Profile by ID
* **URL:** `/profile/:id`
* **Method:** `GET`
* **Auth required:** No
* **Description:** Get public profile information of any user by ID.

**Path Parameters:**
* `id` (string/UUID)

### Complete Profile
* **URL:** `/profile/complete-profile`
* **Method:** `PUT`
* **Auth required:** Yes
* **Description:** Complete the authenticated user's profile details.

**Request Body:**
```json
{
  "name": "John Doe",
  "photo_profile": "https://example.com/photo.jpg", 
  "gender": "Male" // Or "Female"
}
```

### Upload Photo Profile
* **URL:** `/profile/photo`
* **Method:** `POST`
* **Auth required:** Yes
* **Description:** Upload a profile picture for the logged-in user. Uses `multipart/form-data`.

**Request Body:**
* `form-data` with a file field (e.g., `photo`)

---

## Book Routes

### Get All Books
* **URL:** `/books`
* **Method:** `GET`
* **Auth required:** No
* **Description:** Retrieve a list of all books, including category information.

### Get Book by ID
* **URL:** `/books/:id`
* **Method:** `GET`
* **Auth required:** No
* **Description:** Retrieve a single book's details by its UUID.

**Path Parameters:**
* `id` (integer)

### Add a Book
* **URL:** `/books`
* **Method:** `POST`
* **Auth required:** Yes
* **Description:** Add a new book to the library.

**Request Body:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book Description",
  "stock": 10,
  "cover_url": "https://example.com/cover.jpg",
  "category_id": 1
}
```

### Update a Book
* **URL:** `/books/:id`
* **Method:** `PUT`
* **Auth required:** Yes
* **Description:** Update an existing book's details.

**Path Parameters:**
* `id` (integer)

**Request Body:**
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "description": "Updated Description",
  "stock": 15,
  "cover_url": "https://example.com/cover.jpg",
  "category_id": 2
}
```

### Delete a Book
* **URL:** `/books/:id`
* **Method:** `DELETE`
* **Auth required:** Yes
* **Description:** Delete a book by its ID.

**Path Parameters:**
* `id` (integer)

### Upload Book Cover
* **URL:** `/books/:id/cover`
* **Method:** `POST`
* **Auth required:** Yes
* **Description:** Upload a cover image for a book. Uses `multipart/form-data`.

**Path Parameters:**
* `id` (integer)

**Request Body:**
* `form-data` with a file field (e.g., `cover`)

---

## Borrow Routes

### Get All Borrow Requests
* **URL:** `/borrows`
* **Method:** `GET`
* **Auth required:** Yes (Admin Only)
* **Description:** Retrieve all borrow requests.

### Get My Borrows
* **URL:** `/borrows/me`
* **Method:** `GET`
* **Auth required:** Yes
* **Description:** Get all borrow requests belonging to the logged-in user.

### Get Borrow by ID
* **URL:** `/borrows/:id`
* **Method:** `GET`
* **Auth required:** Yes
* **Description:** Get detail of a specific borrow (useful for QR scan).

**Path Parameters:**
* `id` (integer)

### Create Borrow Request
* **URL:** `/borrows`
* **Method:** `POST`
* **Auth required:** Yes
* **Description:** Submit a new borrow request for a book.

**Request Body:**
```json
{
  "book_id": 1,
  "due_date": "2026-12-31T00:00:00.000Z"
}
```

### Update Borrow Status
* **URL:** `/borrows/:id/status`
* **Method:** `PUT`
* **Auth required:** Yes (Admin Only)
* **Description:** Update the status of a specific borrow request.

**Path Parameters:**
* `id` (integer)

**Request Body:**
```json
{
  "status": "approved" 
  // Enum: 'pending', 'approved', 'borrowed', 'returned', 'overdue', 'lost'
}
```

---

## Category Routes

### Get All Categories
* **URL:** `/categories`
* **Method:** `GET`
* **Auth required:** No
* **Description:** Retrieve all book categories.

### Get Category by ID
* **URL:** `/categories/:id`
* **Method:** `GET`
* **Auth required:** No
* **Description:** Get a single category's details by ID.

**Path Parameters:**
* `id` (integer)

### Add a Category
* **URL:** `/categories`
* **Method:** `POST`
* **Auth required:** Yes
* **Description:** Add a new book category.

**Request Body:**
```json
{
  "category_name": "Fiction"
}
```

### Update a Category
* **URL:** `/categories/:id`
* **Method:** `PUT`
* **Auth required:** Yes
* **Description:** Update an existing category by its ID.

**Path Parameters:**
* `id` (integer)

**Request Body:**
```json
{
  "category_name": "Non-Fiction"
}
```

### Delete a Category
* **URL:** `/categories/:id`
* **Method:** `DELETE`
* **Auth required:** Yes
* **Description:** Delete a book category.

**Path Parameters:**
* `id` (integer)

---

## Community Routes

### Get All Messages
* **URL:** `/community`
* **Method:** `GET`
* **Auth required:** Yes
* **Description:** Read all top-level messages along with their replies count.

**Query Parameters:**
* `cursor` (integer, optional)
* `limit` (integer, default: 10, max: 50)

### Get Message by ID
* **URL:** `/community/:id`
* **Method:** `GET`
* **Auth required:** Yes
* **Description:** Read a detailed message along with its replies.

**Path Parameters:**
* `id` (integer)

**Query Parameters:**
* `cursor` (integer, optional)
* `limit` (integer, default: 10, max: 50)

### Create a Message
* **URL:** `/community`
* **Method:** `POST`
* **Auth required:** Yes
* **Description:** Post a new message in the community.

**Request Body:**
```json
{
  "message_text": "This is a great book!",
  "parent_id": 2, // Optional, for replying to another message
  "book_id": 1    // Optional, for linking to a book
}
```

### Update a Message
* **URL:** `/community/:id`
* **Method:** `PUT`
* **Auth required:** Yes (Owner Only)
* **Description:** Update a specific message.

**Path Parameters:**
* `id` (integer)

**Request Body:**
```json
{
  "message_text": "Updated message content"
}
```

### Delete a Message
* **URL:** `/community/:id`
* **Method:** `DELETE`
* **Auth required:** Yes (Owner Only)
* **Description:** Delete a specific message.

**Path Parameters:**
* `id` (integer)

---

## Saved List Routes

### Get My Saved Lists
* **URL:** `/saved-lists/me`
* **Method:** `GET`
* **Auth required:** Yes
* **Description:** Get all saved lists for the logged-in user.

### Create a Saved List
* **URL:** `/saved-lists`
* **Method:** `POST`
* **Auth required:** Yes
* **Description:** Create a new saved list.

**Request Body:**
```json
{
  "list_name": "My Favorites",
  "book_id": 1 
}
```

### Update a Saved List
* **URL:** `/saved-lists/:id`
* **Method:** `PUT`
* **Auth required:** Yes
* **Description:** Update the name/details of a saved list.

**Path Parameters:**
* `id` (integer)

**Request Body:**
```json
{
  "list_name": "New List Name"
}
```

### Delete a Saved List
* **URL:** `/saved-lists/:id`
* **Method:** `DELETE`
* **Auth required:** Yes
* **Description:** Delete a saved list.

**Path Parameters:**
* `id` (integer)
