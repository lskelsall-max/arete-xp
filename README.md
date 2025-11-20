# Komorebi OS 🌿 — Master Protocol

**A complete Operating System for Mind, Body, Career and Legacy.**

Komorebi OS is a gamified personal dashboard designed to align daily actions with long-term mastery. It combines habit tracking, gamification (XP system), and a "Second Brain" knowledge retrieval system into a single, lightning-fast web application.

🔗 **[LIVE APP LINK](https://arete.leekelsall.com/)**

---

## 🎯 Key Features

### 1. Daily Protocol & Gamification
- **XP System:** Earn XP for completing habits across Health, Mindset, Wisdom and Mastery.
- **Fully Customisable:** Configure habits, add key details and adjust the scoring to trigger at different thresholds.  
- **Day Ratings:** Real-time feedback (Red Zone ➝ Survival ➝ Strong ➝ Elite).
- **Streaks:** Visual tracking of consistency.

### 2. "Ask the Komorebi OS Brain" (AI Brain)
- **Vector Search:** A search bar connected to a Supabase Vector Store.
- **Knowledge Retrieval:** Instantly pulls insights from your uploaded PDFs (Superinvestor letters, health protocols, self-help and other productivity hacks, Mental Models and any other personalised notes).
- **Local Library:** Simultaneously searches your manual entries (Quotes, Protocols etc.).

### 3. Investor of the Week
- **Weekly Rotation:** Automatically highlights a specific Superinvestor (e.g., Buffett, Druckenmiller) every Monday.
- **Deep Dive:** Displays their track record and the specific resource/letter to study for that week.

### 4. Built-in CMS (No Coding Required)
- **Visual Editor (✏️):** Add, edit, delete, or reorder Checkboxes, Workouts, and Library items directly in the browser.
- **Workouts:** Customize your daily fitness rotation.
- **Library:** Manage your collection of Mental Models, Productivity Hacks, Superinvestors and Quotes.

### 5. Cloud Sync & Privacy
- **Supabase Backend:** Data is synced across devices (Desktop ↔ iPhone).
- **Google Auth:** One-click secure login.
- **Local-First:** Works offline and syncs when the connection is restored.

---

## Tech Stack 

Github repository for code base. 
Supabase for database (user and documents for RAG)
OpenAI (user needs secret key) for RAG 
Google Drive for knowledge base storage
Google Collab to run vector ingestion 
ChatGpt and Google Gemini Pro 3 for coding assistance

## 🛠️ Setup Guide

This app runs as a single `index.html` file hosted on GitHub Pages, connected to a free Supabase backend.

### 1. Hosting
1. Upload `index.html` to a GitHub repository.
2. Go to **Settings > Pages**.
3. Set **Source** to `main` branch and save.

### 2. Backend (Supabase)
1. Create a project at [Supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the following to set up the database:

```sql
-- Enable Vector Search
create extension if not exists vector;

-- Create User Data Table (Config + History)
create table user_data (
  user_id uuid primary key references auth.users not null,
  config jsonb,
  history jsonb,
  updated_at timestamptz default now()
);

-- Create Documents Table (PDF Knowledge Base)
create table documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(1536)
);

-- Enable Search Function
create or replace function search_documents (
  query_text text,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb
)
language plpgsql
as $$
begin
  return query
  select id, content, metadata
  from documents
  where content ilike '%' || query_text || '%'
  limit match_count;
end;
$$;

-- Set Security Policies (RLS)
alter table user_data enable row level security;
create policy "Users manage their own data" on user_data
  for all using (auth.uid() = user_id);
