# Product Requirements Document (PRD)
## Library Loan Transaction Management System

| Field | Detail |
|---|---|
| Project Name | Library Loan Transaction Management System |
| Version | 1.0 |
| Status | Draft |
| Date | July 02, 2026 |

---

## 1. Background

Book data and loan transaction management in the library is currently done manually (paper-based), making it difficult for both borrowers (USER) and library staff (ADMIN) to access information, process transactions, or monitor book availability in real time. This project aims to build a digital platform (Web & Mobile) backed by a single API backend to digitize the entire process.

---

## 2. Personas

| Persona | Description | Key Needs |
|---|---|---|
| **USER** | Library book borrower | Easy book search, stock transparency, remote transactions, return reminders, community space |
| **ADMIN** | Librarian / Supervisor / Book Manager | Easy book & stock management, transaction monitoring, fast loan/return validation |

---

## 3. Problem Statement

1. Library transaction data management is still manual, not digitized.
2. Library book data is still manual, not digitized.
3. USER finds it hard to search for books without visiting the library in person.
4. USER must visit the library physically to process loan transactions.
5. USER often forgets book return deadlines.
6. No community/chat space exists for book lovers and borrowers to interact.

---

## 4. Goals

- Digitize all library book data and loan transactions.
- Provide real-time book data transparency so USER doesn't need to visit in person.
- Simplify the loan & return process via a two-way transaction system (USER ↔ ADMIN).
- Provide a Community Chat space for book lovers and borrowers.
- Give ADMIN easy stock and transaction monitoring.

---

## 5. Solution

- Build Web & Mobile apps sharing a single API Backend to solve all issues above.
- Full transparency of library book data so USER can check availability remotely.
- Two-way loan transaction system so both USER and ADMIN can track ongoing transaction status.
- Community Chat feature as an interaction space for library users.

---

## 6. Business Rules

- **Borrow limit:** No maximum number of books a USER can borrow at once (unlimited borrowing).
- Every loan transaction requires ADMIN approval (Approve/Reject).
- Every book return is validated by ADMIN via QR scan from the USER's device.
- Transaction status changes (Pending → Approved/Rejected → Borrowed → Returned) are timestamped.

> Note: Since there's no borrow limit, it's recommended to still provide non-blocking visibility — e.g., return reminders and a list of the USER's active loans on the ADMIN Dashboard — so stock stays monitored even without a system-enforced cap.

---

## 7. MVP Scope

### A. Authentication
- **Login**
  - Different navigation for USER vs ADMIN.
  - Checks if profile data is complete; if not, redirects to **Complete Profile** (Name, Gender, Profile Photo form).
- **Register as User**
- **Logout**

### B. USER Dashboard
- Book suggestions/recommendations.
- List of ongoing transactions.

### B. ADMIN Dashboard
- Ongoing transactions overview.
- Low-stock books alert.
- Most-borrowed books.

### C. Library — USER
- Search field for finding books.
- Filter by genre.
- Book list (Title, Cover, Stock, Author).
- Book detail page (synopsis, etc.) with **Borrow** action.

### C. Library — ADMIN Panel
- Search field for finding books.
- Filter by genre.
- Book list (Title, Cover, Stock, Author) — Update & Delete actions (supports multi-select delete).
- Book detail page — Update & Delete actions.
- Create new book action.

### C. Transaction — USER
- Tabs for different loan statuses (e.g., Pending, Approved, Borrowed, Returned, Rejected).
- Book list per selected tab.
- Transaction detail page: borrowed book info, creation timestamp, Approve/Reject status, return time, Bottom Sheet QR (for ADMIN to scan).

### C. Transaction — ADMIN Panel
- Camera to scan QR from USER's device.
- Tabs for different loan statuses.
- Book list per selected tab.
- Transaction detail page: borrowed book info, borrower profile, creation timestamp, Approve/Reject, return time, status change log.

### D. Community Chat *(New)*
- **Chat Room/Channel:** shared space for all USERs (book lovers) to discuss.
- **Send Message:** basic real-time text messaging between USERs.
- **Room List:** shows available rooms/channels.
- **Chat History:** messages persist and can be scrolled through.
- **Basic ADMIN Moderation:** ADMIN can delete messages that violate community rules.

> Note: For MVP, Community Chat is limited to 1 global room. Advanced features (genre-based rooms, private chat, reactions, attachments) go into the next phase roadmap.

---

## 8. Tech Stack

### A. Web Frontend
- **React JS + Vite**
- React 19, Vite, React Router DOM, Axios, Tailwind CSS, TanStack Query, Zustand

### B. Mobile App
- **Flutter**
- GetX, Dio, Hive, MVC architecture

### C. Backend API
- **Node.js + Express.js**
- MVC architecture, JWT (auth), Zod (validation)

### D. Database
- **PostgreSQL** (managed via **Supabase**)

### E. Storage
- **Supabase Storage** — used for:
  - Profile photos (USER/ADMIN)
  - Book covers
  - (Optional) Community Chat attachments in a future phase

### F. Realtime (Community Chat support)
- Leverages **Supabase Realtime** (PostgreSQL replication-based) for live chat, consistent with using Supabase as the primary database.

---

## 9. MVP Module Summary

| Module | USER | ADMIN |
|---|---|---|
| Auth | Login, Register, Logout, Complete Profile | Login, Logout |
| Dashboard | Book Suggestions, Ongoing Transactions | Ongoing Transactions, Low Stock, Top Borrowed Books |
| Library | Search, Filter, List, Detail + Borrow | Search, Filter, List, Detail, Create/Update/Delete |
| Transaction | Status Tabs, List, Detail, QR (Bottom Sheet) | Scan QR, Status Tabs, List, Detail, Change Status |
| Community Chat | Send/Read Messages, Room List | Message Moderation |

---

## 10. Out of Scope (MVP)

- Automatic push/email return reminder notifications (future phase).
- Genre-based rooms or private chat between USERs.
- Late return penalty/fine system.
- Book rating & review by USER.
- Payment integration (in case of paid fines later).

---

## 11. Next Phase Recommendations

- Return reminder notifications (push/email).
- Book rating & review feature.
- Advanced Community Chat: genre-based rooms, reactions, image attachments.
- Late-return penalty system (optional, given unlimited borrowing).
- Advanced ADMIN Dashboard analytics (loan trends over time).