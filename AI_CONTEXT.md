# ZEPHYR AI Boxing App - Context

## Project Mission
A professional-grade AI Boxing Coach that utilizes client-side computer vision (MediaPipe) to track athletic performance and a secure Node.js proxy to provide AI strategist insights (Gemini).

## Modern Architecture (Monorepo)
- **/frontend**: React 18, TypeScript, Vite. Handles all UI and real-time vision processing.
- **/backend**: Express, TypeScript. Secure proxy for Gemini API, deployed on Google Cloud Run.
- **/archive/v1**: Legacy vanilla HTML/JS version of the application.

## Core Stack
- **Frontend**: React + Framer Motion (Animations) + Supabase JS.
- **Database/Auth**: Supabase (PostgreSQL).
- **Inference**: MediaPipe Pose (Client-side).
- **LLM**: Google Gemini (Via Backend Proxy).

## Design System: "Cyber-Athletic"
- **Colors**: Neon Lime (#E2FF3B) on Deep Matte Black (#0A0A0A).
- **Aesthetics**: Glassmorphism, high-contrast typography, HUD-style overlays.

## Current Module: Onboarding
- **Status**: Initialized.
- **Components**: 9-page flow (Welcome -> Specs -> Goals -> Commitment -> Calibration -> Launch).
- **State**: Managed via `OnboardingContext`.
