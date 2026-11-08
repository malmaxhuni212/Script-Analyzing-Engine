# ScriptVision AI 🎬

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An advanced, AI-driven script analysis engine designed for filmmakers, screenwriters, and producers. ScriptVision replaces subjective reads with objective data, breaking down screenplays across structural, narrative, and logistical dimensions to provide comprehensive, actionable feedback.

This project uses a minimal **React + Vite** setup optimized for high performance and fast hot-module replacement, ensuring a smooth experience when processing large screenplay files.

## 🚀 Core Features

*   **Narrative Structure Mapping:** Automatically identifies key plot points (Inciting Incident, Plot Point 1, Midpoint, Climax) and compares the script's rhythm against classic three-act or alternative structural models.
*   **Character Arc & Voice Analysis:** Tracks character screen time, dialogue distribution, sentiment shifts, and consistency in character voice to ensure multi-dimensional development.
*   **Pacing & Tone Evaluation:** Generates a scene-by-scene heat map of action vs. dialogue, highlighting pacing lulls, tonal inconsistencies, and tension progression.
*   **Logistical & Budget Breakdown:** Extracts data crucial for producers, including location counts (INT/EXT, Day/Night), speaking roles, estimated page-to-minute screen time, and potential VFX-heavy sequences.
*   **Subtext & Theme Extraction:** Analyzes recurring motifs and subtext within dialogue to see if the core theme of the film is effectively communicated on the page.

## 🛠 Tech Stack

*   **Frontend:** React 18, Vite, Tailwind CSS
*   **Backend / Database:** Node.js, Supabase (PostgreSQL)
*   **AI / Inference:** Integrated LLM API (e.g., Claude 3.5 / Groq) for deep contextual natural language processing
*   **Parsing:** custom `.fdx` (Final Draft) and PDF parsing utilities

## 📦 Getting Started

### Prerequisites
Ensure you have Node.js (v18+) and npm installed on your machine.
