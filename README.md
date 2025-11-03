# 🗝️ IMECC Key Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20%2B%20Google%20Apps%20Script-lightgrey)]()
[![Build](https://img.shields.io/badge/build-passing-brightgreen)]()

---

## 📘 Overview
A lightweight digital key-management system built for **IMECC/Unicamp**, combining a **PWA-style HTML frontend** with a **Google Apps Script backend** connected to Google Sheets.  
The system manages key check-outs, returns, and user registration, fully functional even when offline.

---

## 🧠 Interesting Techniques

- **Offline Queue Management** using `localStorage` for both registration and return requests  
  → See [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- **AbortController with Fetch Timeout** for resilient network requests  
  → [AbortController on MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- **Graceful Offline Recovery** via `window.addEventListener('online', ...)`  
  → [Online/offline events](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/Online_and_offline_events)
- **FormData Emulation** by manually encoding POST bodies (`Content-Type: text/plain`) to avoid CORS issues with Apps Script  
- **Dynamic UI updates** through DOM manipulation and modal rendering without frameworks  
- **CSS variable theme** with responsive layout and adaptive blur states (`backdrop-filter`, `prefers-reduced-motion`)  
- **Modal accessibility patterns** with focus trapping and Escape-key closure  

---

## 🧩 Technologies & Libraries

- **Frontend:** Vanilla HTML, CSS, JavaScript  
- **Backend:** [Google Apps Script](https://developers.google.com/apps-script) (deployed as Web App)  
- **Auth:** [Google Identity Services](https://developers.google.com/identity/gsi/web) (OAuth domain restriction to `@unicamp.br`)  
- **Storage:** Google Sheets (Input / Data sheets)  
- **Fonts:** System UI stack (Segoe UI, Roboto, Inter) — no external font dependencies  
- **Optional:** Service Worker for offline caching (PWA ready)

---

## 🏗️ Project Structure

```bash
/
├── frontend/
│   └── index.html        # Web app interface and logic
├── backend/
│   └── Code.gs           # Google Apps Script backend
└── README.md             # Project documentation

```
---

## 📂 Directories

- **Frontend:** handles UI, forms, and local queue persistence
- **Backend:** Apps Script endpoint logic, spreadsheet integration, and authentication

---

## ⚙️ Architecture Summary

- **Frontend (index.html)**
- **Collects user input (RA, key, name)**
- **Stores pending operations locally if offline**
- **Uses queued retry via exponential backoff**
- **Calls the GAS endpoint with fetch() and manual body encoding**
- **Backend (Code.gs)**
- **Receives plain-text POST data**
- **Routes requests based on form parameters**
- **Reads/writes to “Input” and “Data” sheets**
- **Handles authentication via Google OAuth (id_token)**
