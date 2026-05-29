# Tarot-Card-Reading
 Astro Annie — Full-stack tarot reading booking platform. Django REST backend + HTML/CSS admin portal + user-facing booking site. Features: slot management, inquiry handling, booking system with no-slot fallback form.


# 🔮 Tarot Reading Business — Full Stack Admin Panel

**Built:** May 19 – May 29, 2026 (10 days)  
**Stack:** Django · DRF · PostgreSQL · Vanilla JS · HTML/CSS 

## Overview
A complete admin panel + client booking system built for a real tarot reading business. The admin manages bookings, inquiries, and available time slots — all connected to a live Django REST API backed by PostgreSQL.

## Features

### 🖥️ Dashboard
- Live stats: total bookings, confirmed, pending, open slots
- Bar chart — reading type distribution
- Donut chart — booking status breakdown
- Recent bookings & recent inquiries feed

### 📅 Bookings
- Full CRUD (Create / Read / Update / Delete)
- Filter by: status, date, reading type
- Search by client name, email, phone
- Quick status toggle
- Paginated table (10 per page)

### 💌 Inquiries
- All client messages in table view
- Status workflow: New → Replied → Archived
- Detail view modal with one-click email reply
- Filter + search

### 🗓️ Slot Management
- Admin adds available date+time slots (up to 3 days)
- Morning / Afternoon / Evening / Full Day presets
- Client booking form fetches only open slots in real-time
- Slot auto-locks when booked

### 🔐 Auth
- JWT-based admin login
- Session guard on every protected page
- Secure logout

## Tech Stack
| Layer | Technology |
|-------|------------|
| Backend | Django 5.2 + Django REST Framework |
| Database | PostgreSQL |
| Frontend | HTML, CSS, Vanilla JavaScript |
| Auth | JWT / Session tokens |
| CORS | django-cors-headers |

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/bookings/` | List & create bookings |
| GET/PUT/DELETE | `/api/bookings/<id>/` | Single booking |
| GET/POST | `/api/inquiries/` | List & create inquiries |
| PATCH/DELETE | `/api/inquiries/<id>/` | Update inquiry status |
| GET/POST | `/api/slots/` | List & create slots |
| DELETE | `/api/slots/<id>/` | Remove a slot |

## Setup
```bash
cd admin-backend
pip install -r requirements.txt
# Configure PostgreSQL in settings.py
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Then open `admin-frontend/dashboard.html` via Live Server on port 5500.
