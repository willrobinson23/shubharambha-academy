

# Shubharambha Academy — School Website & Admin Dashboard

## Overview
A premium, conversion-focused school website with a secure admin dashboard, built on Lovable Cloud (Supabase) for database, auth, and storage.

---

## Phase 1: Database & Auth Setup (Lovable Cloud)

**Tables:**
- `events` — title, description, image_url, date, created_at
- `admissions` — student_name, parent_name, class, phone, message, status (new/contacted), created_at
- `contact_messages` — name, email, message, created_at
- `testimonials` — name, role (parent/student), quote, image_url
- `site_stats` — key (students/teachers/years), value
- `gallery_images` — image_url, caption, created_at

**Auth:** Email/password admin login via Supabase Auth with RLS policies. Admin role stored in `user_roles` table.

**Storage:** Buckets for event images and gallery photos.

---

## Phase 2: Public Website (7 Pages)

**Design:** Blue (#1e40af) + White + Gold (#d4a843) accents. Clean, modern typography. Smooth scroll-reveal animations. Sticky navbar with mobile hamburger menu. Sticky "Apply for Admission" CTA.

### 1. Homepage
- **Hero:** Large banner with "Admission Open 2083", emotional subtext, "Apply Now" and "Visit School" CTAs
- **Stats:** Animated counters (students, teachers, years) from database
- **Why Choose Us:** Icon cards (labs, transport, teachers, etc.)
- **Featured Events:** Latest 3 events from database
- **Testimonials:** Parent/student reviews carousel
- **Footer CTA:** "Apply for Admission"

### 2. About Page
- School introduction, mission & vision
- Principal's message section
- Achievements (SEE results, awards)

### 3. Academics Page
- Programs from Playgroup to higher classes
- Curriculum details
- Facilities: Lab, Library, Sports with icons

### 4. Events Page
- Dynamic event listing from database (title, image, description, date)

### 5. Gallery Page
- Image grid from database with lightbox preview on click

### 6. Contact Page
- Contact form (name, email, message) → saves to database
- Embedded map placeholder, phone & email display

### 7. Admission Page
- Admission form (student name, parent name, class, phone, message) → saves to database
- Success toast/message after submission

---

## Phase 3: Admin Dashboard

**Separate login page** at `/admin/login` → redirects to dashboard on success.

### Admin Pages:
1. **Dashboard Overview** — Total admissions, events count, recent inquiries
2. **Event Management** — CRUD: create/edit/delete events with image upload
3. **Admission Forms** — View submissions, mark as "contacted", delete
4. **Contact Messages** — View all, delete
5. **Site Settings** — Edit homepage stats (students, teachers, years)

Sidebar navigation, clean data tables, confirmation dialogs for destructive actions.

---

## Phase 4: Polish
- Scroll-reveal animations (fade-in, slide-up)
- Loading skeleton screens
- Hover effects on cards and buttons
- Mobile-optimized responsive design
- Real Nepali-context content (no lorem ipsum)
- Lucide icons throughout

