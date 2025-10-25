# B2B Organizations Management System

A full-stack web application for managing B2B organizations and their users.

## Technology Stack

### Frontend
- React.js 18
- Tailwind CSS 3
- React Router DOM 6
- Axios for API calls
- Vite for build tooling

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite Database
- Pydantic for validation

## Project Structure

```
b2b-organizations-management/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # CRUD operations
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── OrganizationsList.jsx
│   │   │   ├── OrganizationDetails.jsx
│   │   │   ├── AddOrganizationModal.jsx
│   │   │   ├── AddUserModal.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── api.js           # API client
│   │   ├── App.jsx          # Main App component
│   │   ├── index.jsx        # React entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the backend server:
```bash
python main.py
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Organizations
- `GET /api/organizations` - List all organizations
- `GET /api/organizations/{id}` - Get organization details
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations/{id}` - Update organization
- `DELETE /api/organizations/{id}` - Delete organization

### Users
- `GET /api/organizations/{id}/users` - List users for an organization
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Database Schema

### Organizations Table
- id (Primary Key)
- name, slug, organization_mail, contact
- website_url, primary_admin_name, primary_admin_email
- support_email, phone_no, alternative_phone_no
- max_coordinators, timezone_name, timezone_region
- language, status, logo_url
- created_at, updated_at

### Users Table
- id (Primary Key)
- name, email, role
- organization_id (Foreign Key)
- created_at, updated_at

### Pending Requests Table
- id (Primary Key)
- organization_id (Foreign Key)
- request_type, status
- created_at, updated_at

## Features

✅ Organization Management (CRUD)
✅ User Management per Organization (CRUD)
✅ Responsive UI with Tailwind CSS
✅ Loading and Error States
✅ RESTful API Architecture
✅ SQL Database with Relationships
✅ Status Management (Active/Blocked/Inactive)
✅ Modal Forms for Create Operations
✅ Breadcrumb Navigation
✅ Tab-based Organization Details View

## Testing

1. Start the backend server
2. Start the frontend development server
3. Open `http://localhost:3000` in your browser
4. Create organizations using the "+ Add Organization" button
5. Click on an organization to view/edit details
6. Switch to Users tab to manage organization users

## Deployment

### Backend Deployment
- Can be deployed to Heroku, Railway, or any Python hosting service
- Update CORS_ORIGINS in .env for production frontend URL
- Use PostgreSQL for production instead of SQLite

### Frontend Deployment
- Build: `npm run build`
- Deploy the `dist` folder to Netlify, Vercel, or any static hosting
- Update API_BASE_URL in src/api.js to production backend URL

## ER Diagram

See the included ER diagram PDF for the database schema visualization showing:
- Organization entity with all attributes
- User entity with role (Admin/Co-ordinator)
- PendingRequest entity
- Relationships between entities

## License

MIT License

## Author

BTech Student - Full Stack Development Project
