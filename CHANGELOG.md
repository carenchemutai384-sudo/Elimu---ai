# Changelog

All notable changes to Mwalimu AI are documented here.

## v1.1 — Dark Mode & Subject Selection

**Added**
- 🌙 Dark mode toggle in the header, with theme preference saved in the browser (localStorage) so it's remembered on return visits
- Subject dropdown above the question box — when a subject is selected, the AI is prompted to respond as an expert KCSE teacher for that specific subject
- Version number displayed in the footer

**Changed**
- Refactored `style.css` to use CSS variables for colors, enabling the light/dark theme switch
- All four AI features (Ask AI, Generate Quiz, Revision Notes, Daily Challenge) now use subject context when one is selected

**Unchanged**
- All existing Q&A, Quiz, Revision Notes, and Daily Challenge functionality
- Gemini API integration (`gemini-flash-latest`)
- Overall page layout and subject card grid

---

## v1.0 — Initial Release

- Core AI Q&A tutor powered by Google Gemini API
- Subject cards for all 12 KCSE subjects (display only)
- Generate Quiz, Revision Notes, and Daily Challenge features
- Mobile-friendly layout
