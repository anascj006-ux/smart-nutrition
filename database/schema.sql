-- =========================================================================
-- SMART NUTRITION & CALORIE ESTIMATOR
-- Production Database Schema (PostgreSQL & Supabase Compatible)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    age INT CHECK (age > 0 AND age < 130),
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
    height_cm NUMERIC(5, 2) CHECK (height_cm > 0),
    weight_kg NUMERIC(5, 2) CHECK (weight_kg > 0),
    activity_level VARCHAR(50) DEFAULT 'Moderately Active' CHECK (activity_level IN ('Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active')),
    calorie_goal INT DEFAULT 2000,
    protein_goal_g NUMERIC(5, 1) DEFAULT 120.0,
    carbs_goal_g NUMERIC(5, 1) DEFAULT 250.0,
    fat_goal_g NUMERIC(5, 1) DEFAULT 65.0,
    fiber_goal_g NUMERIC(5, 1) DEFAULT 30.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. FOODS NUTRITIONAL MASTER TABLE
CREATE TABLE IF NOT EXISTS foods (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    calories INT NOT NULL CHECK (calories >= 0),
    protein NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    carbohydrates NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    fat NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    fiber NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    default_serving NUMERIC(6, 2) NOT NULL DEFAULT 1.0,
    serving_unit VARCHAR(50) NOT NULL,
    unit_weight_grams NUMERIC(6, 2),
    image_url TEXT,
    description TEXT,
    sodium_mg NUMERIC(6, 2),
    potassium_mg NUMERIC(6, 2),
    calcium_mg NUMERIC(6, 2),
    iron_mg NUMERIC(6, 2),
    vitamin_c_mg NUMERIC(6, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. MEAL ENTRIES TABLE
CREATE TABLE IF NOT EXISTS meal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    food_id VARCHAR(100) REFERENCES foods(id) ON DELETE SET NULL,
    food_name VARCHAR(255) NOT NULL,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'snacks', 'dinner')),
    quantity NUMERIC(5, 2) NOT NULL DEFAULT 1.0 CHECK (quantity > 0),
    serving_unit VARCHAR(50) NOT NULL,
    calories INT NOT NULL,
    protein NUMERIC(6, 2) NOT NULL,
    carbs NUMERIC(6, 2) NOT NULL,
    fat NUMERIC(6, 2) NOT NULL,
    fiber NUMERIC(6, 2) DEFAULT 0.00,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. FOOD ANALYSES (AI VISION AUDIT LOG)
CREATE TABLE IF NOT EXISTS food_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    food_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    confidence NUMERIC(4, 3) NOT NULL CHECK (confidence >= 0.00 AND confidence <= 1.00),
    image_url TEXT,
    serving_amount NUMERIC(5, 2) DEFAULT 1.0,
    serving_unit VARCHAR(50) DEFAULT 'serving',
    estimated_grams NUMERIC(6, 2),
    calories INT NOT NULL,
    protein NUMERIC(6, 2) NOT NULL,
    carbs NUMERIC(6, 2) NOT NULL,
    fat NUMERIC(6, 2) NOT NULL,
    fiber NUMERIC(6, 2) NOT NULL,
    source VARCHAR(20) DEFAULT 'gemini' CHECK (source IN ('gemini', 'manual', 'demo')),
    disclaimer TEXT,
    health_insights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR ACCELERATED QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_meal_entries_user_date ON meal_entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_food_analyses_user ON food_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);
