# SMART NUTRITION & CALORIE ESTIMATOR
### AI-Powered Food Recognition and Personalized Nutrition Analysis

> **Academic Project & Viva Voce Demonstration System (B.Tech Computer Science)**

---

## 🚀 Live Demo & Quick Launch

The application is running locally:
- **Web Client (Frontend)**: [http://localhost:5173](http://localhost:5173)
- **API Server (Backend)**: [http://localhost:5000](http://localhost:5000)

### 🔑 Demo Login Credentials
- **Email**: `demo@smartnutrition.ai`
- **Password**: `password123`
*(Or simply click **"Sign In with 1-Click Demo Account"** on the login page)*

---

## 🌟 Key Features

1. **AI Multimodal Food Recognition**:
   - Upload food photos via drag-and-drop or direct device camera snapshot.
   - Multimodal neural classification via **Google Gemini API** (`gemini-3.5-flash` / `gemini-3.8-flash`) with fallback to an offline **Demo AI Mode** (featuring 40+ pre-trained Indian dishes, fruits, and fast foods).
   - Staged live scanning animation: *Image Uploaded ➔ Food Detected ➔ Nutrition Calculated ➔ Complete*.

2. **Accurate Calorie & Macronutrient Estimator**:
   - Displays energy in kcal, alongside **Protein**, **Carbohydrates**, **Fats**, **Dietary Fiber**, and essential **Micronutrients** (Sodium, Potassium, Calcium, Iron, Vitamin C).
   - **Interactive Serving Size Multiplier** (`[-] 1 [+]` with units in *plate, bowl, cup, piece, gram*): dynamically updates all calories and macros in real-time.
   - Macronutrient energy ratio breakdown visualized with Recharts Donut Chart.

3. **Daily Meal Tracker**:
   - 4 daily meal slots: **Breakfast**, **Lunch**, **Snacks & Beverages**, and **Dinner**.
   - Running calorie and macro subtotals per meal slot and overall daily totals.
   - Quick quantity adjustment (`+` / `-`) and instant item removal.

4. **Interactive Daily Dashboard**:
   - **Calorie Circle Gauge**: Large animated circular progress meter (*Consumed vs Goal vs Remaining*).
   - Color-coded progress bars for Calories (Orange/Red), Protein (Blue), Carbs (Purple), Fat (Yellow), and Fiber (Green).
   - Interactive Recharts analytics toggleable between **Today**, **7 Days**, and **30 Days**.
   - **Personalized Dietary Insights**: Intelligent rule-based cards evaluating protein sufficiency, caloric budget proximity, and fiber intake.

5. **Certified Food Database**:
   - 40+ curated dishes with verified nutritional metrics.
   - Instant search and category filter tabs: *Indian Foods, Fruits, Fast Food, Drinks*.
   - One-click **"Add to Meal"** modal with animated celebration confetti.

6. **Biometric BMR & TDEE Engine**:
   - Incorporates the clinically validated **Mifflin-St Jeor formula** across age, biological gender, height, and weight.
   - Configurable physical activity factors (*Sedentary, Lightly Active, Moderately Active, Very Active*).
   - Prominent medical disclaimers adhering to AI healthcare ethics.

7. **B.Tech Project & Viva Handbook (`/about-project`)**:
   - Comprehensive problem statement, project objectives, tech stack, and module breakdown.
   - Visual system architecture flowchart.
   - Curated Viva-Voce oral examination questions and answers.

---

## 📁 Project Folder Structure

```
smart-nutrition-app/
├── database/
│   └── schema.sql                 # PostgreSQL & Supabase DDL schema with foreign keys and indexes
├── server/
│   ├── data/
│   │   ├── foods.ts               # 40+ curated Indian foods, fruits, fast food, and beverages
│   │   └── store.json             # Persistent JSON database with auto-seeding
│   ├── services/
│   │   ├── db.ts                  # Database abstraction layer & BMR/TDEE math
│   │   └── foodAnalysis.ts        # AI Vision service (Gemini SDK + Demo AI fallback)
│   └── index.ts                   # Express REST API with full endpoints
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AddToMealModal.tsx # Meal logging modal with confetti trigger
│   │   │   ├── CalorieCircle.tsx  # Animated circular SVG calorie meter
│   │   │   ├── CameraModal.tsx    # Live device camera preview & snapshot
│   │   │   ├── MacroProgressBar.tsx # Color-coded progress bars
│   │   │   └── Toast.tsx          # Floating notifications
│   │   └── layout/
│   │       ├── AppLayout.tsx      # Dashboard shell with disclaimer footer
│   │       ├── MobileNav.tsx      # Bottom navigation for mobile viewports
│   │       ├── Navbar.tsx         # Landing page top navigation
│   │       └── Sidebar.tsx        # Desktop/tablet collapsible sidebar
│   ├── context/
│   │   ├── AuthContext.tsx        # User authentication & demo session state
│   │   └── NutritionContext.tsx   # Food analysis state & serving multipliers
│   ├── pages/
│   │   ├── AboutProjectPage.tsx   # Viva Voce & Academic Guide (/about-project)
│   │   ├── AnalyzerPage.tsx       # AI Scanner & camera page (/analyze)
│   │   ├── DashboardPage.tsx      # Analytics & insights dashboard (/dashboard)
│   │   ├── FoodsPage.tsx          # Searchable food library (/foods)
│   │   ├── HistoryPage.tsx        # Meal log table & detail modal (/history)
│   │   ├── LandingPage.tsx        # Hero, How-It-Works, and FAQ (/ )
│   │   ├── LoginPage.tsx          # Sign-in with 1-click demo button (/login)
│   │   ├── MealsPage.tsx          # 4-slot daily meal tracker (/meals)
│   │   ├── ProfilePage.tsx        # BMR/TDEE biometric calculator (/profile)
│   │   ├── RegisterPage.tsx       # User registration onboarding (/register)
│   │   ├── ResultPage.tsx         # Detailed nutrition result breakdown (/result)
│   │   └── SettingsPage.tsx       # API key & demo reset (/settings)
│   ├── types/
│   │   └── index.ts               # TypeScript data definitions
│   ├── App.tsx                    # Main client-side router
│   ├── index.css                  # Tailwind CSS v4 & custom tokens
│   └── main.tsx                   # React 19 entrypoint
├── .env                           # Local environment config
├── .env.example                   # Environment template
├── package.json                   # Project scripts and dependencies
├── tsconfig.json                  # TypeScript configuration
└── vite.config.ts                 # Vite bundler with API proxying to port 5000
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti |
| **Data Visualization** | Recharts (Responsive Pie/Donut Chart, BarChart, AreaChart) |
| **Backend** | Node.js, Express 5, CORS, Dotenv, TSX |
| **AI Vision Layer** | Google GenAI SDK (`@google/genai`) with Gemini 2.5 Flash + Heuristic Demo Mode |
| **Persistence** | File-backed JSON store with auto-seeding + PostgreSQL/Supabase SQL DDL |

---

## ⚙️ How to Run Locally

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm

### 2. Start Both Backend & Frontend
In the project directory (`C:\Users\ANAS\.gemini\antigravity-ide\scratch\smart-nutrition-app`):

```bash
# Run both Express API and Vite Dev Server concurrently
npm run dev
```

Alternatively, you can run them in separate terminal windows:
```bash
# Terminal 1: Start Express Backend (Port 5000)
npm run server

# Terminal 2: Start Vite Client (Port 5173)
npm run client
```

### 3. Open in Browser
Visit **[http://localhost:5173](http://localhost:5173)**.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & AI provider status |
| `POST` | `/api/auth/login` | Email/password or demo login |
| `POST` | `/api/auth/register` | Create user profile & calculate BMR/TDEE |
| `GET` | `/api/auth/me` | Fetch active user session |
| `POST` | `/api/analyze-food` | AI vision food recognition and calorie estimation |
| `GET` | `/api/foods` | Search & filter foods database |
| `GET` | `/api/foods/:id` | Retrieve single food item details |
| `GET` | `/api/meals/today` | Fetch daily meals grouped by 4 diurnal slots |
| `POST` | `/api/meals` | Log a food item to a meal slot |
| `PATCH` | `/api/meals/:id` | Update portion quantity for a logged meal |
| `DELETE`| `/api/meals/:id` | Remove a logged meal entry |
| `GET` | `/api/dashboard` | Dashboard metrics, calorie circle, 7/30-day trends, and insights |
| `GET` | `/api/history` | Historical meal logs with search and date filters |
| `GET` | `/api/profile` | Retrieve biometric data and BMR/TDEE math |
| `POST` | `/api/profile` | Update user measurements and recalculate targets |
| `POST` | `/api/settings/reset-demo` | Restore sample database to default seed state |

---

## 🎓 Academic Viva Voce Quick Sheet

- **Computer Vision Paradigm**: Employs deep multimodal transformers capable of joint image-text reasoning to output structured JSON representations containing calorie, macro, and confidence figures.
- **Portion Dynamics**: Linear scaling model applied across baseline gram weights to ensure real-time recalculation of nutritional totals without round-trip network delays.
- **Energy Expenditure Equation**: Uses Mifflin-St Jeor:
  - Male: $\text{BMR} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} + 5$
  - Female: $\text{BMR} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} - 161$
- **Ethical Safeguards**: Explicitly marked as an educational lifestyle tool with persistent disclaimers to prevent medical misinterpretation.
