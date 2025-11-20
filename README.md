# Komorebi OS — Master Protocol

A personal operating system for **Health, Wealth, and Wisdom**.

Komorebi OS is a single-page, gamified daily protocol tracker and knowledge hub. It helps you align each day around your core habits while cycling through a curated library of mental models, productivity ideas, and investing wisdom.

---

## 🔗 Open the App

If you’re hosting via GitHub Pages, your app URL will look like:

`https://YOUR_GITHUB_USERNAME.github.io/komorebi-os/`

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username and open the link in your browser.

---

## 🎯 What Komorebi OS Does

- **Daily Alignment Engine**  
  Each day, the app rotates through a curated set of:
  - 300+ **Mental Models**
  - **Productivity / Execution Hacks**
  - **Philosophical Quotes**  

  You get a fresh, pre-selected “stack” to reflect on and act against.

- **Investor of the Week**  
  A weekly, rotating **Superinvestor focus** (e.g. Buffett, Druckenmiller).  
  Each investor comes with a core study pack: letters, books, talks, and key ideas.

- **Gamified Protocol Tracking (XP System)**  
  Complete daily protocols and earn XP across three domains:
  - **Health** – Supplements, workouts, recovery, aesthetics  
  - **Mind** – Meditation, slow thinking, gratitude, stillness  
  - **Mastery** – Deep work, second brain, ultralearning, long-form study  

  The scoring rules and categories are fully configurable.

- **Knowledge Library**  
  A searchable library containing:
  - Mental models
  - Quotes and prompts
  - Book and resource summaries  
  All mapped back to the daily protocol system, so reading and action stay connected.

- **Privacy-First by Design**  
  - No accounts, no backend, no tracking
  - All data is stored **locally in your browser** via `localStorage`
  - Clear/reset options are built-in

---

## 🧠 Architecture Overview

Komorebi OS is intentionally simple:

- **Frontend Only**  
  - Plain HTML/CSS/JS (no build step required)
  - All logic lives in `index.html` and supporting JS files

- **Headless Content Layer**  
  - All **content, configuration, and scoring rules** live in a single file: `komorebi-data.js`
  - Think of it as a lightweight, file-based CMS:
    - Mental models
    - Quotes
    - Daily protocol definitions
    - XP values and category weights
    - Investor-of-the-week rotation

Updating the app rarely requires changing UI logic—just update the data file.

---

## ⚙️ Customising the Content (Lightweight CMS)

Most changes happen in **one file**: `komorebi-data.js`.

### 1. Add a New Mental Model or Quote

1. Open `komorebi-data.js`.
2. Find the relevant library section (e.g. mental models, quotes, productivity, etc.).
3. Add a new object following the existing structure, for example:

   ```js
   {
     id: "inversion",
     type: "mentalModel",
     title: "Inversion",
     summary: "Think about what you want to avoid or prevent, then solve from there.",
     source: "Charlie Munger",
   }
