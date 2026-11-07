# schoolManagementFE
schoolManagement front end
# schoolManagementFE

Mobile and web front end for a school management system, built with **Expo (React Native)**. One codebase serves students, parents, teachers, accountants and school admins, and it can be re-branded for each school.

**Live demo:** https://kalyangogu.github.io/schoolManagementFE/ (runs on sample data, no server needed)

## Contents

- [Demo logins](#demo-logins)
- [Who can see what](#who-can-see-what)
- [Features](#features)
  - [1. Login](#1-login)
  - [2. Forgot password](#2-forgot-password)
  - [3. Security questions (students)](#3-security-questions-students)
  - [4. Home and profile switcher](#4-home-and-profile-switcher)
  - [5. Students](#5-students)
  - [6. Classes](#6-classes)
  - [7. Staff users](#7-staff-users)
  - [8. Fees](#8-fees)
  - [9. Student attendance](#9-student-attendance)
  - [10. Staff attendance](#10-staff-attendance)
  - [11. Diary](#11-diary)
  - [12. Inventory](#12-inventory)
  - [13. Exams](#13-exams)
  - [14. Circulars](#14-circulars)
  - [15. Events](#15-events)
  - [16. Holiday SMS](#16-holiday-sms)
  - [Built-in behaviour](#built-in-behaviour)
- [Branding for each school](#branding-for-each-school)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Backend integration](#backend-integration)
- [Deploying the web demo](#deploying-the-web-demo)
- [Status and known gaps](#status-and-known-gaps)

## Demo logins

Mock mode, identifier / password:

| Who | Identifier | Password |
|---|---|---|
| Student (has security questions) | `ADM001` | `student123` |
| Student (no questions yet) | `ADM002` | `student123` |
| Staff, school admin + accountant (2 profiles) | `admin@school.com` or `admin01` | `admin123` |
| Staff, teacher | `teacher01` | `teacher123` |
| Parent | `parent@mail.com` | `parent123` |

OTP (staff/parent only) and the reset OTP: `123456`. `ADM001` recovery answers: pet `tommy`, birthplace `hyderabad`, favourite teacher `meena`.

Log in as the admin to see every module. Log in as the other users to see how the Home screen changes by role.

## Who can see what

The Home screen shows only the tiles a person's role allows. Staff who hold more than one role get one profile per role and can switch between them.

| Module | Admin | Teacher | Accountant | Student | Parent |
|---|:-:|:-:|:-:|:-:|:-:|
| Students | ✅ | ✅ | | | |
| Classes | ✅ | ✅ | | | |
| Users (staff) | ✅ | | | | |
| Fees | ✅ | | ✅ | | |
| Student attendance | ✅ | ✅ | | | |
| Staff attendance | ✅ | | | | |
| Diary | ✅ | ✅ | | ✅ | ✅ |
| Inventory | ✅ | | ✅ | | |
| Exams | ✅ | ✅ | | results only | results only |
| Circulars | ✅ | ✅ | ✅ | ✅ | ✅ |
| Events | ✅ | ✅ | | ✅ | ✅ |
| Holiday SMS | ✅ | | | | |

## Features

### 1. Login

One login screen for everyone.

- **ID & Password tab.** Choose **Student**, **Staff** or **Parent**. The ID field changes to match: admission number for students, email or user ID for staff, email for parents. The password field has a show/hide button.
- **OTP tab.** Staff and parents can log in with a one-time code sent to their email or mobile number. Students cannot use OTP and are told to use their ID and password.
- Wrong details show a clear message on the form.
- The session is remembered on the device, so users stay logged in until they log out or the session expires.

### 2. Forgot password

Reached from the login screen. The steps depend on who is resetting.

- **Students (3 steps):**
  1. Enter the admission number.
  2. Choose the same 3 security questions picked earlier and answer them.
  3. Set a new password.

  If a student forgets the questions or the answers, they are told to ask the school admin, who can reset the password.
- **Staff and parents (2 steps):**
  1. Enter the email or user ID.
  2. Enter the OTP received and choose a new password.

### 3. Security questions (students)

Students open this from the shield icon on the Home screen.

- Choose **3 of 6** questions: date of birth, favourite teacher, favourite family member, first pet's name, birthplace, favourite destination.
- Type an answer for each. Answers are stored as hashes by the backend.
- Saving again replaces the earlier questions.
- These are the questions used by "Forgot password". Students must remember which 3 they chose.

### 4. Home and profile switcher

- A grid of tiles for the modules the person's role can use.
- A welcome card showing the school name, the person's name and their role.
- **Profile switcher.** Tap the name at the top to switch between roles (for example admin and accountant) without logging in again.
- **Log out.** Shows a confirmation popup before ending the session.
- Students also see the shield icon for their security questions.

### 5. Students

*Admin and teachers.*

- A searchable list of all students with admission number, phone and class.
- **Add student.** The student name is compulsory. Parent phone number is optional (used for school messages), and the message language can be English, Telugu or Hindi.
- **Reset password (admin only).** The lock icon on a student's row lets the admin set a new password, for example when a student has forgotten their security answers. This also clears the student's security questions.
- Pull down to refresh.

### 6. Classes

*Admin and teachers.*

- A list of classes showing the class teacher and academic year.
- **Add class.** Class name is required. A teacher ID is optional and can be added later.
- Tap a class to see the students in it.

### 7. Staff users

*Admin only.*

- Everyone who can log in to the app, with their roles.
- Search by name or phone, and filter by **All staff**, **Teachers** or **Accountants**.
- **Stop access / Allow.** Switch a person's access off or back on at any time.
- **Add staff user.** Name and mobile number are required, and the work role is Teacher or Accountant.
- **Reset password.** The lock icon sets a new password for a staff member.

### 8. Fees

*Admin and accountants.* Four sections in one screen.

- **Set class fee.** Choose a class and fee period (for example Term 1), then enter the amount each student must pay. A switch applies the fee to every active student in the class. Fees already set are listed, and tapping one fills the form for editing.
- **Collect payment.** Choose a class and period, search and pick a student, then enter the amount received and how it was paid (Cash, UPI, Card or Cheque), with an optional note. The student's past payments for that period are shown below.
- **Student account.** Search for a student to see their ledger: total assigned, paid and due, with a line for each fee period.
- **Collection report.** Pick a class (or all classes) and a period to see total fee, received and pending, plus each student's assigned and paid amounts.

### 9. Student attendance

*Admin and teachers.* Four tabs.

- **Mark.** Choose a class and date. Everyone starts as present. Tick the students who are absent, or use **All present** and **All absent**. A live count shows present and absent numbers. Saving again for the same day replaces the earlier entry.
- **Absent.** Load the list of absent students for a class and day.
- **Student.** Choose a class, a student and a date range to see that student's attendance day by day.
- **Summary.** Choose a class and date range to see school days marked, total absences, and the absentees for each day (tap a day to expand it).

### 10. Staff attendance

*Admin only.* A monthly calendar for each teacher.

- Choose a teacher and move between months.
- **Month summary:** attendance percentage and counts for Present, Absent, Holidays, Late, Half day and Leave, plus working days and calendar days.
- **Day list:** every day with its status and the holiday name where there is one. Tap a day to see the entry and exit times.
- **Correct this day.** Change a day's status (Present, Late, Half day, Absent, Leave, Holiday) with a required reason. Corrected days are marked.
- Future days are shown as upcoming and cannot be corrected.

### 11. Diary

*Admin, teachers, students and parents.*

- Choose a class and date.
- **Add an entry:** pick the subject and entry type (Learn, Write, Read, Practice or Revision), then write the description.
- Below the form, all diary entries for that class and day are listed with their subject and type.

### 12. Inventory

*Admin and accountants.* Two tabs.

- **Items.** Search the stock list, which shows quantity and unit price. Tap an item to record **Stock in** or **Stock out** (stock out is blocked if there isn't enough). Create new items with name, description, starting quantity and unit price.
- **Logs.** Pick an item and filter its movements by All, In or Out.

### 13. Exams

*Admin and teachers have all four tabs. Students and parents see results only.*

- **Plan exams.** Choose an exam group and class, tick the subjects, and set a date and maximum marks for each. Already scheduled subjects load back for editing.
- **Enter marks.** Choose the group, class and subject exam. Each student shows **Pending** or **Recorded**. Marks above the maximum are rejected.
- **See results.** Class average, highest score and pass rate (35% and above), a bar for each subject's average, and a ranked list of students with grades (A+, A, B, C, D, F).
- **Exam setup.** Create exam groups such as Unit Test, Mid Term or Final Exam.

### 14. Circulars

*Everyone.*

- A searchable list of school notices. Tap one to read the full text.
- **Create** (admin and teachers): title, date and content.

### 15. Events

*Admin, teachers, students and parents.*

- **Gallery.** All events with their date and photo count. Tap an event to see its summary and photo grid, and tap a photo to view it full screen.
- **Create** (admin and teachers): event name, date, summary, which classes can see it, and up to 10 photos from the device.

### 16. Holiday SMS

*Admin only.* Tell parents about a holiday in three steps.

1. Choose the date, or turn on **Multi-day holiday** for a date range.
2. Write the reason.
3. Choose which classes. **All** and **Clear** help with quick selection.

A banner shows how many parent phone numbers will receive the message. A confirmation popup appears before sending. The **Past messages** tab lists everything sent earlier.

### Built-in behaviour

- **Role-based menus.** Each person sees only the tiles their role allows.
- **Popups instead of browser alerts.** Confirmations use an in-app dialog, so they work the same on phones and on the web.
- **Toast messages** confirm saves and show errors.
- **Pull to refresh** on lists.
- **Session expiry.** If the server rejects the login token, the user is sent back to the login screen with a message.
- **Phone-friendly forms.** Date pickers are simple previous/next steppers, and dropdowns open as bottom sheets.

## Branding for each school

Colours and names live in one small file per school, so a new school needs no code changes.

1. Copy `src/config/schools/greenvalley.json` to a new file, for example `myschool.json`.
2. Change the name, tagline, logo letters, bundle ID and colours. `cornerScale` makes the whole app more rounded (1) or squarer (0.5).
3. Register it in `src/config/schools/index.js`.
4. Run it with that school selected:

```bash
EXPO_PUBLIC_SCHOOL=sunrise npx expo start
```

Two examples are included: **Green Valley** (teal) and **Sunrise** (orange, squarer corners). All screens read their colours from the theme, so nothing else changes.

Icons come from one place, `src/components/ui/Icon.jsx`, so the whole icon set can be swapped in one file.

## Getting started

```bash
npm install
npx expo start        # then press a / i / w, or scan the QR code in Expo Go
npm run web           # open in the browser
```

The app starts in **mock mode**, so every screen works with sample data and no backend.

## Project structure

```
App.jsx                     providers: theme, dialog, toast, auth, navigation
src/
  config/schools/           one JSON file per school (name, colours, logo)
  config/securityQuestions.js   the 6 question keys and their wording
  theme/                    colours, spacing, useTheme and useStyles
  components/ui/            reusable pieces: Screen, Card, Button, TextField, Select,
                            DateField, Dialog, Toast, BottomSheet, Icon, ...
  services/
    api.jsx                 the only file that talks to the backend
    mockDb.js               sample data used in mock mode
  context/AuthContext.jsx   login session, profile switching, logout
  navigation/
    modules.js              list of modules: Home tile, route and allowed roles
    RootNavigator.jsx
  hooks/                    useAsync, useAction, useDebounce
  features/                 one folder per module
```

To add a module: create its screen in `src/features/`, add one line to `MODULES` in `src/navigation/modules.js`, and add its calls to `src/services/api.jsx`.

## Backend integration

Every screen calls `api.<module>.<action>()` in `src/services/api.jsx`. In mock mode these are answered from sample data. To use a real server, set these environment values:

```
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_API_URL=https://your-server/api
```

Then fix each path and response shape in `api.jsx`. No screen needs to change.

The login and password-reset calls already follow the backend's auth routes (`/auth/login`, `/auth/send-otp`, `/auth/verify-otp`, the forgot-password routes, the student security-question routes and `/auth/admin/reset-password`). The paths and request fields are in the block labelled "AUTH CONTRACT" near the top of `api.jsx`. The other modules still use placeholder paths until their backend routes exist.

The browser demo needs the API to be served over HTTPS with CORS allowing `https://kalyangogu.github.io`.

## Deploying the web demo

The site is built and published by GitHub Actions (`.github/workflows/pages.yml`) every time `main` is pushed.

- In the repo, **Settings → Pages → Source** must be set to **GitHub Actions**.
- The build uses `EXPO_BASE_URL=/schoolManagementFE`, because the site is served from a sub-path.
- The demo is built with `EXPO_PUBLIC_USE_MOCK=true`, so it never needs a server and shows only sample data. Do not put real student data in a public build.

## Status and known gaps

- Built and working on sample data: everything listed above.
- Not built yet: RFID card linking and RFID attendance suggestions.
- Holiday SMS and OTP delivery depend on the backend actually sending messages. The screens are complete, but nothing is sent until a provider is connected.
- Event photos stay on the device in mock mode. With a real backend they are uploaded as `multipart/form-data`.
- Only the auth routes are matched to the backend so far. The remaining modules need their routes connected in `api.jsx`.