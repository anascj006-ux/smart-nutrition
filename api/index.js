// server/index.ts
import path3 from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// server/services/db.ts
import fs from "fs";
import path from "path";
import { createRequire } from "module";

// server/data/foods.ts
var INITIAL_FOODS = [
  // --- INDIAN FOODS ---
  {
    id: "food-idli",
    name: "Idli",
    category: "Indian Foods",
    calories: 58,
    protein: 2.1,
    carbohydrates: 12,
    fat: 0.4,
    fiber: 1.2,
    defaultServing: 2,
    servingUnit: "piece",
    unitWeightGrams: 50,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80",
    description: "Steamed fermented rice and black lentil cakes. Light, easily digestible, and naturally probiotic.",
    micronutrients: { sodium_mg: 90, potassium_mg: 60, calcium_mg: 15, iron_mg: 0.8, vitamin_c_mg: 0 }
  },
  {
    id: "food-dosa",
    name: "Dosa",
    category: "Indian Foods",
    calories: 168,
    protein: 3.9,
    carbohydrates: 28.5,
    fat: 4.2,
    fiber: 1.8,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 100,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80",
    description: "Crispy golden crepe made from fermented batter of rice and black gram lentils.",
    micronutrients: { sodium_mg: 180, potassium_mg: 110, calcium_mg: 20, iron_mg: 1.2, vitamin_c_mg: 0 }
  },
  {
    id: "food-masala-dosa",
    name: "Masala Dosa",
    category: "Indian Foods",
    calories: 285,
    protein: 5.5,
    carbohydrates: 42,
    fat: 10.5,
    fiber: 3.5,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 180,
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=80",
    description: "Crisp savory crepe folded over spiced mashed potato filling with mustard seeds, curry leaves, and onions.",
    micronutrients: { sodium_mg: 380, potassium_mg: 290, calcium_mg: 32, iron_mg: 1.9, vitamin_c_mg: 12 }
  },
  {
    id: "food-vada",
    name: "Vada",
    category: "Indian Foods",
    calories: 145,
    protein: 4.2,
    carbohydrates: 15,
    fat: 7.8,
    fiber: 2.1,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 60,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80",
    description: "Crispy deep-fried savory doughnut made of urad dal flour with ginger, pepper, and fresh curry leaves.",
    micronutrients: { sodium_mg: 210, potassium_mg: 180, calcium_mg: 24, iron_mg: 1.5, vitamin_c_mg: 2 }
  },
  {
    id: "food-pongal",
    name: "Pongal",
    category: "Indian Foods",
    calories: 220,
    protein: 6.5,
    carbohydrates: 34,
    fat: 6.8,
    fiber: 2.8,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 150,
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500&auto=format&fit=crop&q=80",
    description: "Hearty South Indian porridge made with rice, yellow moong lentils, black peppercorns, cumin, and ghee.",
    micronutrients: { sodium_mg: 260, potassium_mg: 195, calcium_mg: 35, iron_mg: 1.8, vitamin_c_mg: 1 }
  },
  {
    id: "food-sambar",
    name: "Sambar",
    category: "Indian Foods",
    calories: 130,
    protein: 5.2,
    carbohydrates: 19.5,
    fat: 3.5,
    fiber: 4.2,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 200,
    image: "/images/foods/sambar.jpg",
    description: "Nutrient-rich lentil stew with drumsticks, carrots, pumpkin, tamarind, and aromatic sambar masala.",
    micronutrients: { sodium_mg: 490, potassium_mg: 310, calcium_mg: 48, iron_mg: 2.1, vitamin_c_mg: 15 }
  },
  {
    id: "food-rice",
    name: "Rice",
    category: "Indian Foods",
    calories: 205,
    protein: 4.3,
    carbohydrates: 45,
    fat: 0.5,
    fiber: 0.6,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 160,
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80",
    description: "Steamed white grain rice, staple source of clean complex carbohydrates.",
    micronutrients: { sodium_mg: 5, potassium_mg: 55, calcium_mg: 16, iron_mg: 1.2, vitamin_c_mg: 0 }
  },
  {
    id: "food-lemon-rice",
    name: "Lemon Rice",
    category: "Indian Foods",
    calories: 245,
    protein: 4.5,
    carbohydrates: 44,
    fat: 6,
    fiber: 1.8,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 180,
    image: "/images/foods/lemon-rice.jpg",
    description: "Fragrant seasoned rice with freshly squeezed lemon juice, crunchy peanuts, mustard seeds, and turmeric.",
    micronutrients: { sodium_mg: 340, potassium_mg: 130, calcium_mg: 25, iron_mg: 1.4, vitamin_c_mg: 18 }
  },
  {
    id: "food-curd-rice",
    name: "Curd Rice",
    category: "Indian Foods",
    calories: 210,
    protein: 6.8,
    carbohydrates: 32,
    fat: 6.2,
    fiber: 1.1,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 200,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80",
    description: "Cooling probiotic comfort food made of soft rice blended with fresh yogurt and tempered with mustard seeds.",
    micronutrients: { sodium_mg: 280, potassium_mg: 240, calcium_mg: 180, iron_mg: 0.9, vitamin_c_mg: 2 }
  },
  {
    id: "food-chicken-biryani",
    name: "Chicken Biryani",
    category: "Indian Foods",
    calories: 520,
    protein: 28,
    carbohydrates: 62,
    fat: 18,
    fiber: 4,
    defaultServing: 1,
    servingUnit: "plate",
    unitWeightGrams: 350,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
    description: "Royal aromatic long-grain basmati rice layered with tender marinated chicken, saffron, mint, and spices.",
    micronutrients: { sodium_mg: 740, potassium_mg: 380, calcium_mg: 45, iron_mg: 2.8, vitamin_c_mg: 6 }
  },
  {
    id: "food-mutton-biryani",
    name: "Mutton Biryani",
    category: "Indian Foods",
    calories: 610,
    protein: 32,
    carbohydrates: 60,
    fat: 26,
    fiber: 3.8,
    defaultServing: 1,
    servingUnit: "plate",
    unitWeightGrams: 360,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80",
    description: "Slow-cooked dum biryani featuring tender succulent mutton cuts infused with royal spices and aged basmati.",
    micronutrients: { sodium_mg: 820, potassium_mg: 440, calcium_mg: 50, iron_mg: 3.8, vitamin_c_mg: 4 }
  },
  {
    id: "food-chapati",
    name: "Chapati",
    category: "Indian Foods",
    calories: 104,
    protein: 3.4,
    carbohydrates: 20.2,
    fat: 1.2,
    fiber: 2.8,
    defaultServing: 2,
    servingUnit: "piece",
    unitWeightGrams: 80,
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=80",
    description: "Traditional whole wheat unleavened flatbread freshly toasted on a flat griddle.",
    micronutrients: { sodium_mg: 95, potassium_mg: 115, calcium_mg: 18, iron_mg: 1.4, vitamin_c_mg: 0 }
  },
  {
    id: "food-parotta",
    name: "Parotta",
    category: "Indian Foods",
    calories: 290,
    protein: 5.2,
    carbohydrates: 40,
    fat: 12,
    fiber: 1.5,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 100,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
    description: "Flaky, multi-layered flatbread originating from the Malabar coast, soft on the inside with crisp edges.",
    micronutrients: { sodium_mg: 310, potassium_mg: 70, calcium_mg: 22, iron_mg: 1.1, vitamin_c_mg: 0 }
  },
  {
    id: "food-poori",
    name: "Poori",
    category: "Indian Foods",
    calories: 125,
    protein: 2.3,
    carbohydrates: 14.5,
    fat: 6.8,
    fiber: 1.1,
    defaultServing: 2,
    servingUnit: "piece",
    unitWeightGrams: 60,
    image: "/images/foods/poori.jpg",
    description: "Puffy golden whole wheat bread deep-fried to crisp perfection.",
    micronutrients: { sodium_mg: 120, potassium_mg: 80, calcium_mg: 14, iron_mg: 0.9, vitamin_c_mg: 0 }
  },
  {
    id: "food-upma",
    name: "Upma",
    category: "Indian Foods",
    calories: 195,
    protein: 4.8,
    carbohydrates: 31,
    fat: 5.8,
    fiber: 2.4,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 160,
    image: "/images/foods/upma.jpg",
    description: "Savory roasted semolina hash seasoned with mustard seeds, ginger, green chilies, and vegetables.",
    micronutrients: { sodium_mg: 290, potassium_mg: 110, calcium_mg: 22, iron_mg: 1.6, vitamin_c_mg: 4 }
  },
  {
    id: "food-veg-meals",
    name: "Veg Meals",
    category: "Indian Foods",
    calories: 640,
    protein: 18.5,
    carbohydrates: 110,
    fat: 14,
    fiber: 12,
    defaultServing: 1,
    servingUnit: "plate",
    unitWeightGrams: 550,
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80",
    description: "Traditional balanced thali consisting of steamed rice, sambar, rasam, kootu, poriyal, curd, and papad.",
    micronutrients: { sodium_mg: 890, potassium_mg: 720, calcium_mg: 210, iron_mg: 4.5, vitamin_c_mg: 25 }
  },
  {
    id: "food-chicken-curry",
    name: "Chicken Curry",
    category: "Indian Foods",
    calories: 275,
    protein: 26,
    carbohydrates: 7.5,
    fat: 15.5,
    fiber: 1.8,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 200,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80",
    description: "Juicy chicken cooked in an onion, tomato, and aromatic spice gravy with coriander and ginger.",
    micronutrients: { sodium_mg: 620, potassium_mg: 410, calcium_mg: 38, iron_mg: 2.2, vitamin_c_mg: 8 }
  },
  {
    id: "food-paneer",
    name: "Paneer",
    category: "Indian Foods",
    calories: 265,
    protein: 18,
    carbohydrates: 3.5,
    fat: 20.5,
    fiber: 0,
    defaultServing: 100,
    servingUnit: "gram",
    unitWeightGrams: 100,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80",
    description: "Fresh, non-melting Indian cottage cheese high in casein protein and calcium.",
    micronutrients: { sodium_mg: 35, potassium_mg: 120, calcium_mg: 480, iron_mg: 0.5, vitamin_c_mg: 0 }
  },
  {
    id: "food-paneer-butter-masala",
    name: "Paneer Butter Masala",
    category: "Indian Foods",
    calories: 380,
    protein: 14.5,
    carbohydrates: 16,
    fat: 29,
    fiber: 2.8,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 220,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80",
    description: "Succulent paneer cubes simmered in a luscious creamy tomato butter gravy with crushed kasuri methi.",
    micronutrients: { sodium_mg: 680, potassium_mg: 310, calcium_mg: 340, iron_mg: 1.8, vitamin_c_mg: 10 }
  },
  {
    id: "food-dal",
    name: "Dal",
    category: "Indian Foods",
    calories: 160,
    protein: 9.2,
    carbohydrates: 22.5,
    fat: 3.8,
    fiber: 5.5,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 180,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80",
    description: "Yellow lentils gently cooked with turmeric, garlic, cumin tadka, and fresh cilantro.",
    micronutrients: { sodium_mg: 360, potassium_mg: 390, calcium_mg: 32, iron_mg: 2.5, vitamin_c_mg: 4 }
  },
  {
    id: "food-rasam",
    name: "Rasam",
    category: "Indian Foods",
    calories: 65,
    protein: 1.8,
    carbohydrates: 9.5,
    fat: 2.2,
    fiber: 1.2,
    defaultServing: 1,
    servingUnit: "cup",
    unitWeightGrams: 180,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80",
    description: "Peppery South Indian soup infused with tamarind juice, tomatoes, crushed garlic, and cumin.",
    micronutrients: { sodium_mg: 420, potassium_mg: 210, calcium_mg: 24, iron_mg: 1.2, vitamin_c_mg: 14 }
  },
  {
    id: "food-curd",
    name: "Curd",
    category: "Indian Foods",
    calories: 98,
    protein: 4.5,
    carbohydrates: 5.2,
    fat: 4.8,
    fiber: 0,
    defaultServing: 1,
    servingUnit: "cup",
    unitWeightGrams: 150,
    image: "/images/foods/curd.jpg",
    description: "Thick, creamy plain Indian yogurt rich in active gut-friendly lactobacillus cultures.",
    micronutrients: { sodium_mg: 70, potassium_mg: 230, calcium_mg: 190, iron_mg: 0.1, vitamin_c_mg: 1 }
  },
  {
    id: "food-egg",
    name: "Boiled Egg",
    category: "Indian Foods",
    calories: 78,
    protein: 6.3,
    carbohydrates: 0.6,
    fat: 5.3,
    fiber: 0,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 50,
    image: "/images/foods/boiled-egg.jpg",
    description: "Whole boiled chicken egg delivering complete amino acids, choline, and essential minerals.",
    micronutrients: { sodium_mg: 62, potassium_mg: 63, calcium_mg: 25, iron_mg: 0.8, vitamin_c_mg: 0 }
  },
  {
    id: "food-omelette",
    name: "Omelette",
    category: "Indian Foods",
    calories: 154,
    protein: 11.2,
    carbohydrates: 2.1,
    fat: 11.5,
    fiber: 0.4,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 90,
    image: "/images/foods/omelette.jpg",
    description: "Fluffy masala omelette whipped with chopped onions, green chilies, cilantro, and black pepper.",
    micronutrients: { sodium_mg: 220, potassium_mg: 140, calcium_mg: 45, iron_mg: 1.6, vitamin_c_mg: 3 }
  },
  // --- FRUITS ---
  {
    id: "food-apple",
    name: "Apple",
    category: "Fruits",
    calories: 95,
    protein: 0.5,
    carbohydrates: 25,
    fat: 0.3,
    fiber: 4.4,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 180,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80",
    description: "Crisp, sweet fresh apple abundant in dietary pectin fiber and polyphenols.",
    micronutrients: { sodium_mg: 2, potassium_mg: 195, calcium_mg: 11, iron_mg: 0.2, vitamin_c_mg: 8.4 }
  },
  {
    id: "food-banana",
    name: "Banana",
    category: "Fruits",
    calories: 105,
    protein: 1.3,
    carbohydrates: 27,
    fat: 0.4,
    fiber: 3.1,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 118,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80",
    description: "Naturally sweet banana packed with bioavailable potassium and fast-acting natural energy.",
    micronutrients: { sodium_mg: 1, potassium_mg: 422, calcium_mg: 6, iron_mg: 0.3, vitamin_c_mg: 10.3 }
  },
  {
    id: "food-orange",
    name: "Orange",
    category: "Fruits",
    calories: 62,
    protein: 1.2,
    carbohydrates: 15.4,
    fat: 0.2,
    fiber: 3.1,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 130,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=80",
    description: "Juicy citrus orange loaded with vitamin C to bolster daily immune function.",
    micronutrients: { sodium_mg: 0, potassium_mg: 237, calcium_mg: 52, iron_mg: 0.1, vitamin_c_mg: 70 }
  },
  {
    id: "food-mango",
    name: "Mango",
    category: "Fruits",
    calories: 135,
    protein: 1.1,
    carbohydrates: 35,
    fat: 0.6,
    fiber: 2.6,
    defaultServing: 1,
    servingUnit: "cup",
    unitWeightGrams: 165,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80",
    description: "Succulent tropical mango rich in beta-carotene, vitamin A, and vibrant natural sweetness.",
    micronutrients: { sodium_mg: 2, potassium_mg: 277, calcium_mg: 18, iron_mg: 0.2, vitamin_c_mg: 60 }
  },
  {
    id: "food-grapes",
    name: "Grapes",
    category: "Fruits",
    calories: 69,
    protein: 0.7,
    carbohydrates: 18.1,
    fat: 0.2,
    fiber: 0.9,
    defaultServing: 1,
    servingUnit: "cup",
    unitWeightGrams: 100,
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop&q=80",
    description: "Juicy fresh sweet table grapes filled with resveratrol and natural antioxidants.",
    micronutrients: { sodium_mg: 2, potassium_mg: 191, calcium_mg: 10, iron_mg: 0.4, vitamin_c_mg: 3.2 }
  },
  {
    id: "food-watermelon",
    name: "Watermelon",
    category: "Fruits",
    calories: 85,
    protein: 1.7,
    carbohydrates: 21,
    fat: 0.4,
    fiber: 1.1,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 280,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80",
    description: "Ultra-hydrating red melon containing 92% water, lycopene, and citrulline.",
    micronutrients: { sodium_mg: 3, potassium_mg: 310, calcium_mg: 20, iron_mg: 0.7, vitamin_c_mg: 23 }
  },
  {
    id: "food-papaya",
    name: "Papaya",
    category: "Fruits",
    calories: 62,
    protein: 0.9,
    carbohydrates: 15.8,
    fat: 0.4,
    fiber: 2.5,
    defaultServing: 1,
    servingUnit: "cup",
    unitWeightGrams: 145,
    image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=500&auto=format&fit=crop&q=80",
    description: "Tropical digestive wonder fruit boasting active papain enzymes and lutein.",
    micronutrients: { sodium_mg: 12, potassium_mg: 264, calcium_mg: 29, iron_mg: 0.4, vitamin_c_mg: 88 }
  },
  {
    id: "food-pineapple",
    name: "Pineapple",
    category: "Fruits",
    calories: 82,
    protein: 0.9,
    carbohydrates: 21.6,
    fat: 0.2,
    fiber: 2.3,
    defaultServing: 1,
    servingUnit: "cup",
    unitWeightGrams: 165,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&auto=format&fit=crop&q=80",
    description: "Tangy-sweet fruit rich in bromelain enzymes that assist in protein absorption and muscle recovery.",
    micronutrients: { sodium_mg: 2, potassium_mg: 180, calcium_mg: 21, iron_mg: 0.5, vitamin_c_mg: 79 }
  },
  // --- FAST FOOD ---
  {
    id: "food-burger",
    name: "Burger",
    category: "Fast Food",
    calories: 440,
    protein: 21,
    carbohydrates: 42,
    fat: 22,
    fiber: 2.8,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 200,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
    description: "Classic toasted sesame bun with grilled patty, crisp lettuce, tomato, pickles, and dressing.",
    micronutrients: { sodium_mg: 780, potassium_mg: 340, calcium_mg: 90, iron_mg: 3.2, vitamin_c_mg: 4 }
  },
  {
    id: "food-pizza",
    name: "Pizza",
    category: "Fast Food",
    calories: 285,
    protein: 12.2,
    carbohydrates: 34,
    fat: 11.5,
    fiber: 2.2,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 105,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
    description: "Oven-baked flatbread slice with rich marinara sauce, melted mozzarella cheese, and Italian herbs.",
    micronutrients: { sodium_mg: 640, potassium_mg: 180, calcium_mg: 190, iron_mg: 2.1, vitamin_c_mg: 3 }
  },
  {
    id: "food-french-fries",
    name: "French Fries",
    category: "Fast Food",
    calories: 365,
    protein: 4,
    carbohydrates: 48,
    fat: 17,
    fiber: 4,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 115,
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80",
    description: "Golden crispy potato batons fried to a crisp and seasoned with fine sea salt.",
    micronutrients: { sodium_mg: 320, potassium_mg: 650, calcium_mg: 18, iron_mg: 1.1, vitamin_c_mg: 9 }
  },
  {
    id: "food-sandwich",
    name: "Sandwich",
    category: "Fast Food",
    calories: 310,
    protein: 14,
    carbohydrates: 36,
    fat: 12,
    fiber: 3.2,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 160,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80",
    description: "Toasted bread sandwich layered with crisp vegetables, cheese slice, and herb butter.",
    micronutrients: { sodium_mg: 560, potassium_mg: 240, calcium_mg: 140, iron_mg: 2, vitamin_c_mg: 6 }
  },
  {
    id: "food-pasta",
    name: "Pasta",
    category: "Fast Food",
    calories: 380,
    protein: 13,
    carbohydrates: 56,
    fat: 11,
    fiber: 3.8,
    defaultServing: 1,
    servingUnit: "bowl",
    unitWeightGrams: 220,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80",
    description: "Penne pasta tossed in a savory tomato basil arrabbiata sauce with olive oil and parmesan.",
    micronutrients: { sodium_mg: 490, potassium_mg: 280, calcium_mg: 65, iron_mg: 2.3, vitamin_c_mg: 8 }
  },
  {
    id: "food-fried-chicken",
    name: "Fried Chicken",
    category: "Fast Food",
    calories: 320,
    protein: 24,
    carbohydrates: 11,
    fat: 20,
    fiber: 0.8,
    defaultServing: 1,
    servingUnit: "piece",
    unitWeightGrams: 130,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80",
    description: "Crispy Southern-style seasoned chicken thigh with crunchy batter and tender juicy meat inside.",
    micronutrients: { sodium_mg: 580, potassium_mg: 290, calcium_mg: 22, iron_mg: 1.5, vitamin_c_mg: 0 }
  },
  // --- DRINKS ---
  {
    id: "food-tea",
    name: "Tea",
    category: "Drinks",
    calories: 60,
    protein: 2.2,
    carbohydrates: 8.5,
    fat: 1.8,
    fiber: 0,
    defaultServing: 1,
    servingUnit: "cup",
    unitWeightGrams: 150,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
    description: "Classic Indian masala chai brewed with black tea leaves, milk, cardamom, and gentle sweetness.",
    micronutrients: { sodium_mg: 45, potassium_mg: 140, calcium_mg: 95, iron_mg: 0.2, vitamin_c_mg: 0 }
  },
  {
    id: "food-coffee",
    name: "Coffee",
    category: "Drinks",
    calories: 75,
    protein: 2.8,
    carbohydrates: 9,
    fat: 2.4,
    fiber: 0,
    defaultServing: 1,
    servingUnit: "cup",
    unitWeightGrams: 150,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80",
    description: "Traditional South Indian filter coffee frothed with hot boiled milk and chicory decoction.",
    micronutrients: { sodium_mg: 50, potassium_mg: 170, calcium_mg: 110, iron_mg: 0.1, vitamin_c_mg: 0 }
  },
  {
    id: "food-milk",
    name: "Milk",
    category: "Drinks",
    calories: 122,
    protein: 6.2,
    carbohydrates: 9.6,
    fat: 6.5,
    fiber: 0,
    defaultServing: 1,
    servingUnit: "cup",
    unitWeightGrams: 200,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80",
    description: "Fresh pasteurized whole dairy milk rich in calcium and bioavailable protein.",
    micronutrients: { sodium_mg: 98, potassium_mg: 300, calcium_mg: 240, iron_mg: 0.1, vitamin_c_mg: 2 }
  },
  {
    id: "food-fruit-juice",
    name: "Fruit Juice",
    category: "Drinks",
    calories: 110,
    protein: 0.8,
    carbohydrates: 26,
    fat: 0.2,
    fiber: 0.5,
    defaultServing: 1,
    servingUnit: "cup",
    unitWeightGrams: 240,
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80",
    description: "Cold-pressed fresh mixed fruit juice offering immediate refreshing energy and vitamin C.",
    micronutrients: { sodium_mg: 8, potassium_mg: 260, calcium_mg: 25, iron_mg: 0.4, vitamin_c_mg: 45 }
  },
  {
    id: "food-soft-drink",
    name: "Soft Drink",
    category: "Drinks",
    calories: 140,
    protein: 0,
    carbohydrates: 38,
    fat: 0,
    fiber: 0,
    defaultServing: 1,
    servingUnit: "cup",
    unitWeightGrams: 330,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80",
    description: "Carbonated chilled beverage with caramel notes and effervescence.",
    micronutrients: { sodium_mg: 40, potassium_mg: 10, calcium_mg: 5, iron_mg: 0, vitamin_c_mg: 0 }
  }
];

// server/services/db.ts
var require2 = createRequire(import.meta.url);
var seedStoreData = null;
try {
  seedStoreData = require2("../data/store.json");
} catch {
}
var IS_VERCEL = Boolean(process.env.VERCEL);
var ORIGINAL_DB_PATH = path.join(process.cwd(), "server", "data", "store.json");
var DB_PATH = IS_VERCEL ? path.join("/tmp", "store.json") : ORIGINAL_DB_PATH;
function calculateBMR(weight, height, age, gender) {
  if (gender === "female") {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
  return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
}
function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    "Sedentary": 1.2,
    "Lightly Active": 1.375,
    "Moderately Active": 1.55,
    "Very Active": 1.725
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.375));
}
function getFormattedDate(offsetDays = 0) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}
var Store = class {
  data;
  constructor() {
    this.data = this.load();
  }
  getInitialData() {
    const today = getFormattedDate(0);
    const day1 = getFormattedDate(-1);
    const day2 = getFormattedDate(-2);
    const day3 = getFormattedDate(-3);
    const day4 = getFormattedDate(-4);
    const day5 = getFormattedDate(-5);
    const day6 = getFormattedDate(-6);
    const demoUser = {
      id: "usr-demo-01",
      name: "Aditya Verma",
      email: "demo@smartnutrition.ai",
      password: "password123",
      age: 22,
      gender: "male",
      height: 175,
      weight: 68,
      activityLevel: "Moderately Active",
      calorieGoal: 2e3,
      proteinGoal: 120,
      carbsGoal: 250,
      fatGoal: 65,
      fiberGoal: 30,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const sampleMeals = [
      // Today: Breakfast
      {
        id: "meal-td-1",
        userId: demoUser.id,
        foodId: "food-idli",
        foodName: "Idli",
        mealType: "breakfast",
        quantity: 2,
        servingUnit: "piece",
        calories: 116,
        protein: 4.2,
        carbs: 24,
        fat: 0.8,
        fiber: 2.4,
        date: today,
        createdAt: `${today}T08:30:00Z`
      },
      {
        id: "meal-td-2",
        userId: demoUser.id,
        foodId: "food-sambar",
        foodName: "Sambar",
        mealType: "breakfast",
        quantity: 1,
        servingUnit: "bowl",
        calories: 130,
        protein: 5.2,
        carbs: 19.5,
        fat: 3.5,
        fiber: 4.2,
        date: today,
        createdAt: `${today}T08:32:00Z`
      },
      // Today: Lunch
      {
        id: "meal-td-3",
        userId: demoUser.id,
        foodId: "food-chicken-biryani",
        foodName: "Chicken Biryani",
        mealType: "lunch",
        quantity: 1,
        servingUnit: "plate",
        calories: 520,
        protein: 28,
        carbs: 62,
        fat: 18,
        fiber: 4,
        date: today,
        createdAt: `${today}T13:15:00Z`
      },
      {
        id: "meal-td-4",
        userId: demoUser.id,
        foodId: "food-curd",
        foodName: "Curd",
        mealType: "lunch",
        quantity: 1,
        servingUnit: "cup",
        calories: 98,
        protein: 4.5,
        carbs: 5.2,
        fat: 4.8,
        fiber: 0,
        date: today,
        createdAt: `${today}T13:20:00Z`
      },
      // Today: Snacks
      {
        id: "meal-td-5",
        userId: demoUser.id,
        foodId: "food-apple",
        foodName: "Apple",
        mealType: "snacks",
        quantity: 1,
        servingUnit: "piece",
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        fiber: 4.4,
        date: today,
        createdAt: `${today}T16:45:00Z`
      },
      {
        id: "meal-td-6",
        userId: demoUser.id,
        foodId: "food-tea",
        foodName: "Tea",
        mealType: "snacks",
        quantity: 1,
        servingUnit: "cup",
        calories: 60,
        protein: 2.2,
        carbs: 8.5,
        fat: 1.8,
        fiber: 0,
        date: today,
        createdAt: `${today}T16:50:00Z`
      },
      // Today: Dinner
      {
        id: "meal-td-7",
        userId: demoUser.id,
        foodId: "food-chapati",
        foodName: "Chapati",
        mealType: "dinner",
        quantity: 2,
        servingUnit: "piece",
        calories: 208,
        protein: 6.8,
        carbs: 40.4,
        fat: 2.4,
        fiber: 5.6,
        date: today,
        createdAt: `${today}T20:10:00Z`
      },
      {
        id: "meal-td-8",
        userId: demoUser.id,
        foodId: "food-paneer-butter-masala",
        foodName: "Paneer Butter Masala",
        mealType: "dinner",
        quantity: 1,
        servingUnit: "bowl",
        calories: 380,
        protein: 14.5,
        carbs: 16,
        fat: 29,
        fiber: 2.8,
        date: today,
        createdAt: `${today}T20:15:00Z`
      },
      // Previous days for charts
      { id: "m-p1", userId: demoUser.id, foodName: "Veg Meals", mealType: "lunch", quantity: 1, servingUnit: "plate", calories: 640, protein: 18.5, carbs: 110, fat: 14, fiber: 12, date: day1, createdAt: `${day1}T13:00:00Z` },
      { id: "m-p2", userId: demoUser.id, foodName: "Omelette & Bread", mealType: "breakfast", quantity: 1, servingUnit: "plate", calories: 350, protein: 18, carbs: 28, fat: 16, fiber: 2, date: day1, createdAt: `${day1}T08:30:00Z` },
      { id: "m-p3", userId: demoUser.id, foodName: "Chicken Curry & Rice", mealType: "dinner", quantity: 1, servingUnit: "plate", calories: 580, protein: 32, carbs: 65, fat: 18, fiber: 3, date: day1, createdAt: `${day1}T20:00:00Z` },
      { id: "m-p4", userId: demoUser.id, foodName: "Fruits & Nuts", mealType: "snacks", quantity: 1, servingUnit: "bowl", calories: 220, protein: 5, carbs: 32, fat: 8, fiber: 5, date: day1, createdAt: `${day1}T16:30:00Z` },
      { id: "m-p5", userId: demoUser.id, foodName: "Masala Dosa", mealType: "breakfast", quantity: 1, servingUnit: "piece", calories: 285, protein: 5.5, carbs: 42, fat: 10.5, fiber: 3.5, date: day2, createdAt: `${day2}T08:45:00Z` },
      { id: "m-p6", userId: demoUser.id, foodName: "Mutton Biryani", mealType: "lunch", quantity: 1, servingUnit: "plate", calories: 610, protein: 32, carbs: 60, fat: 26, fiber: 3.8, date: day2, createdAt: `${day2}T13:30:00Z` },
      { id: "m-p7", userId: demoUser.id, foodName: "Salad & Soup", mealType: "dinner", quantity: 1, servingUnit: "bowl", calories: 290, protein: 8, carbs: 38, fat: 9, fiber: 6, date: day2, createdAt: `${day2}T19:45:00Z` },
      { id: "m-p8", userId: demoUser.id, foodName: "Banana & Milk", mealType: "snacks", quantity: 1, servingUnit: "serving", calories: 227, protein: 7.5, carbs: 36.6, fat: 6.9, fiber: 3.1, date: day2, createdAt: `${day2}T17:00:00Z` },
      { id: "m-p9", userId: demoUser.id, foodName: "Idli & Sambar", mealType: "breakfast", quantity: 2, servingUnit: "portion", calories: 246, protein: 9.4, carbs: 43.5, fat: 4.3, fiber: 6.6, date: day3, createdAt: `${day3}T08:30:00Z` },
      { id: "m-p10", userId: demoUser.id, foodName: "Chicken Biryani", mealType: "lunch", quantity: 1, servingUnit: "plate", calories: 520, protein: 28, carbs: 62, fat: 18, fiber: 4, date: day3, createdAt: `${day3}T13:00:00Z` },
      { id: "m-p11", userId: demoUser.id, foodName: "Chapati & Dal", mealType: "dinner", quantity: 1, servingUnit: "plate", calories: 420, protein: 16, carbs: 62, fat: 8, fiber: 8, date: day3, createdAt: `${day3}T20:30:00Z` },
      { id: "m-p12", userId: demoUser.id, foodName: "Pongal & Vada", mealType: "breakfast", quantity: 1, servingUnit: "plate", calories: 365, protein: 10.7, carbs: 49, fat: 14.6, fiber: 4.9, date: day4, createdAt: `${day4}T09:00:00Z` },
      { id: "m-p13", userId: demoUser.id, foodName: "Burger & French Fries", mealType: "lunch", quantity: 1, servingUnit: "combo", calories: 805, protein: 25, carbs: 90, fat: 39, fiber: 6.8, date: day4, createdAt: `${day4}T13:30:00Z` },
      { id: "m-p14", userId: demoUser.id, foodName: "Upma", mealType: "dinner", quantity: 1, servingUnit: "bowl", calories: 260, protein: 6, carbs: 40, fat: 8, fiber: 3.2, date: day4, createdAt: `${day4}T20:00:00Z` },
      { id: "m-p15", userId: demoUser.id, foodName: "Boiled Eggs & Toast", mealType: "breakfast", quantity: 2, servingUnit: "plate", calories: 320, protein: 18, carbs: 26, fat: 14, fiber: 2.2, date: day5, createdAt: `${day5}T08:15:00Z` },
      { id: "m-p16", userId: demoUser.id, foodName: "Lemon Rice & Curd", mealType: "lunch", quantity: 1, servingUnit: "bowl", calories: 343, protein: 9, carbs: 49.2, fat: 10.8, fiber: 1.8, date: day5, createdAt: `${day5}T13:15:00Z` },
      { id: "m-p17", userId: demoUser.id, foodName: "Chicken Curry & Chapati", mealType: "dinner", quantity: 1, servingUnit: "plate", calories: 483, protein: 32.8, carbs: 47.9, fat: 16.7, fiber: 4.6, date: day5, createdAt: `${day5}T20:15:00Z` },
      { id: "m-p18", userId: demoUser.id, foodName: "Oats & Banana", mealType: "breakfast", quantity: 1, servingUnit: "bowl", calories: 280, protein: 8, carbs: 54, fat: 4.5, fiber: 6.2, date: day6, createdAt: `${day6}T08:30:00Z` },
      { id: "m-p19", userId: demoUser.id, foodName: "Veg Meals", mealType: "lunch", quantity: 1, servingUnit: "plate", calories: 640, protein: 18.5, carbs: 110, fat: 14, fiber: 12, date: day6, createdAt: `${day6}T13:00:00Z` },
      { id: "m-p20", userId: demoUser.id, foodName: "Paneer Wrap", mealType: "dinner", quantity: 1, servingUnit: "piece", calories: 410, protein: 19, carbs: 38, fat: 20, fiber: 4, date: day6, createdAt: `${day6}T20:00:00Z` }
    ];
    const sampleAnalyses = [
      {
        id: "an-demo-1",
        userId: demoUser.id,
        foodName: "Chicken Biryani",
        confidence: 0.92,
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
        servingSize: "1 plate",
        servingUnit: "plate",
        quantity: 1,
        calories: 520,
        protein: 28,
        carbs: 62,
        fat: 18,
        fiber: 4,
        healthInsights: [
          "Rich in high-quality lean protein from chicken.",
          "Basmati rice provides sustained complex carbohydrates.",
          "Contains turmeric and ginger with natural antioxidant properties."
        ],
        createdAt: `${today}T13:10:00Z`
      },
      {
        id: "an-demo-2",
        userId: demoUser.id,
        foodName: "Masala Dosa",
        confidence: 0.95,
        imageUrl: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=80",
        servingSize: "1 piece",
        servingUnit: "piece",
        quantity: 1,
        calories: 285,
        protein: 5.5,
        carbs: 42,
        fat: 10.5,
        fiber: 3.5,
        healthInsights: [
          "Naturally fermented batter aids beneficial gut microbiota.",
          "Potato filling contains bioavailable vitamin C and potassium.",
          "Pair with high-protein sambar to boost amino acid profile."
        ],
        createdAt: `${day1}T08:40:00Z`
      },
      {
        id: "an-demo-3",
        userId: demoUser.id,
        foodName: "Apple",
        confidence: 0.98,
        imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80",
        servingSize: "1 piece",
        servingUnit: "piece",
        quantity: 1,
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        fiber: 4.4,
        healthInsights: [
          "High in soluble pectin fiber to assist cardiovascular balance.",
          "Low glycemic load prevents acute blood sugar spikes.",
          "Great clean snack before physical or cognitive activity."
        ],
        createdAt: `${day2}T16:20:00Z`
      }
    ];
    return {
      users: [demoUser],
      foods: INITIAL_FOODS,
      mealEntries: sampleMeals,
      analyses: sampleAnalyses
    };
  }
  load() {
    try {
      if (IS_VERCEL && !fs.existsSync(DB_PATH)) {
        if (seedStoreData) {
          try {
            const dir = path.dirname(DB_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(DB_PATH, JSON.stringify(seedStoreData, null, 2), "utf-8");
            return seedStoreData;
          } catch (writeErr) {
            console.warn("Could not write seed data to /tmp:", writeErr);
            return seedStoreData;
          }
        } else if (fs.existsSync(ORIGINAL_DB_PATH)) {
          try {
            fs.copyFileSync(ORIGINAL_DB_PATH, DB_PATH);
          } catch (copyErr) {
            console.warn("Could not copy store to /tmp:", copyErr);
          }
        }
      }
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        return JSON.parse(raw);
      }
      if (fs.existsSync(ORIGINAL_DB_PATH)) {
        const raw = fs.readFileSync(ORIGINAL_DB_PATH, "utf-8");
        return JSON.parse(raw);
      }
      if (seedStoreData) {
        return seedStoreData;
      }
    } catch (e) {
      console.warn("Failed to load store from disk, initializing fresh:", e);
    }
    const initial = this.getInitialData();
    this.save(initial);
    return initial;
  }
  save(data) {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.warn("Error persisting database (in-memory state preserved):", e);
    }
  }
  resetDemoData() {
    this.data = this.getInitialData();
    this.save(this.data);
    return this.data;
  }
  // User operations
  getUserById(id) {
    return this.data.users.find((u) => u.id === id);
  }
  getUserByEmail(email) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  createUser(user) {
    this.data.users.push(user);
    this.save(this.data);
    return user;
  }
  updateUser(id, updates) {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return void 0;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save(this.data);
    return this.data.users[idx];
  }
  // Food operations
  getFoods(category, search) {
    let list = this.data.foods;
    if (category && category !== "All") {
      list = list.filter((f) => f.category === category);
    }
    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
    }
    return list;
  }
  getFoodById(id) {
    return this.data.foods.find((f) => f.id === id);
  }
  // Meal operations
  getMealsByUserAndDate(userId, date) {
    return this.data.mealEntries.filter((m) => m.userId === userId && m.date === date);
  }
  getAllMealsByUser(userId) {
    return this.data.mealEntries.filter((m) => m.userId === userId);
  }
  addMealEntry(entry) {
    this.data.mealEntries.unshift(entry);
    this.save(this.data);
    return entry;
  }
  updateMealQuantity(id, quantity) {
    const meal = this.data.mealEntries.find((m) => m.id === id);
    if (!meal || quantity <= 0) return void 0;
    const ratio = quantity / meal.quantity;
    meal.quantity = quantity;
    meal.calories = Math.round(meal.calories * ratio);
    meal.protein = Math.round(meal.protein * ratio * 10) / 10;
    meal.carbs = Math.round(meal.carbs * ratio * 10) / 10;
    meal.fat = Math.round(meal.fat * ratio * 10) / 10;
    meal.fiber = Math.round(meal.fiber * ratio * 10) / 10;
    this.save(this.data);
    return meal;
  }
  deleteMealEntry(id) {
    const initLen = this.data.mealEntries.length;
    this.data.mealEntries = this.data.mealEntries.filter((m) => m.id !== id);
    if (this.data.mealEntries.length !== initLen) {
      this.save(this.data);
      return true;
    }
    return false;
  }
  // Analysis history
  getAnalysesByUser(userId) {
    return this.data.analyses.filter((a) => a.userId === userId);
  }
  addAnalysis(analysis) {
    this.data.analyses.unshift(analysis);
    this.save(this.data);
    return analysis;
  }
};
var db = new Store();

// server/services/geminiService.ts
import fs2 from "fs";
import path2 from "path";
import { GoogleGenAI } from "@google/genai";
var ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
async function validateAndExtractImageData(imagePayload) {
  if (!imagePayload || typeof imagePayload !== "string") {
    throw new Error("Please upload a valid food image.");
  }
  if (imagePayload.startsWith("/images/") || imagePayload.startsWith("images/")) {
    try {
      const cleanRel = imagePayload.replace(/^\/?images\//, "");
      const localFile = path2.join(process.cwd(), "public", "images", cleanRel);
      if (fs2.existsSync(localFile)) {
        const buffer = fs2.readFileSync(localFile);
        const ext = path2.extname(localFile).toLowerCase();
        const mimeType2 = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
        const base64Data2 = buffer.toString("base64");
        return { mimeType: mimeType2, base64Data: base64Data2 };
      }
    } catch (e) {
      console.warn("Failed to read local image file:", e?.message || e);
    }
  }
  if (imagePayload.startsWith("http://") || imagePayload.startsWith("https://")) {
    try {
      const resp = await fetch(imagePayload);
      if (!resp.ok) throw new Error("Could not download sample image");
      const arrayBuf = await resp.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      const rawType = (resp.headers.get("content-type") || "image/jpeg").split(";")[0].toLowerCase();
      const mimeType2 = ALLOWED_MIME_TYPES.includes(rawType) ? rawType : "image/jpeg";
      const base64Data2 = buffer.toString("base64");
      return { mimeType: mimeType2, base64Data: base64Data2 };
    } catch (e) {
      throw new Error(`Failed to download remote food image: ${e?.message || e}`);
    }
  }
  const matches = imagePayload.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Please upload a valid image file (JPEG, PNG, or WEBP).");
  }
  const mimeType = matches[1].toLowerCase();
  const base64Data = matches[2];
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported image format (${mimeType}). Please upload a JPG, PNG, or WEBP image.`);
  }
  if (base64Data.length > 20 * 1024 * 1024) {
    throw new Error("Image size is too large. Please select an image under 15MB.");
  }
  return { mimeType, base64Data };
}
async function analyzeFoodWithGemini(imagePayload, options) {
  const isDemo = options?.forceDemo || process.env.DEMO_MODE === "true";
  const apiKey = process.env.GEMINI_API_KEY;
  if (isDemo || !apiKey) {
    return generateDemoResponse(options?.hintFoodName);
  }
  const { mimeType, base64Data } = await validateAndExtractImageData(imagePayload);
  const systemPrompt = `
You are a food recognition and nutrition estimation assistant for a nutrition tracking application.
Analyze the provided food image carefully.
Identify the visible food or foods.
Estimate the most likely serving size based on the image.
Provide estimated calories, protein, carbohydrates, fat and fiber.
If multiple foods are visible, identify each food separately and provide individual nutrition estimates as well as a total.
Do not invent highly specific nutritional facts when the image is unclear.
If the food cannot be confidently identified, clearly indicate uncertainty by setting confidence below 0.70.
Nutrition values are estimates and should not be treated as medical advice.

Return ONLY a raw JSON object (without markdown code blocks, backticks, or other text) matching this schema:
{
  "success": true,
  "foods": [
    {
      "name": "Chicken Biryani",
      "category": "Indian Food",
      "confidence": 0.92,
      "serving": {
        "amount": 1,
        "unit": "plate",
        "estimatedGrams": 350
      },
      "nutrition": {
        "calories": 520,
        "protein": 28,
        "carbohydrates": 62,
        "fat": 18,
        "fiber": 4
      }
    }
  ],
  "totalNutrition": {
    "calories": 520,
    "protein": 28,
    "carbohydrates": 62,
    "fat": 18,
    "fiber": 4
  },
  "overallConfidence": 0.92,
  "disclaimer": "Nutritional values are estimates and may vary depending on ingredients and portion size.",
  "healthInsights": [
    "High quality lean protein source.",
    "Complex carbohydrates for sustained energy.",
    "Rich in antioxidants from culinary spices."
  ]
}
`;
  const candidateModels = [
    options?.model || process.env.GEMINI_MODEL || "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash"
  ];
  let lastError = null;
  for (const model of candidateModels) {
    try {
      return await executeGeminiCall(apiKey, model, systemPrompt, { mimeType, data: base64Data }, "gemini");
    } catch (err) {
      lastError = err;
      console.warn(`Gemini vision model (${model}) failed, trying next candidate:`, err?.message || err);
    }
  }
  console.warn("All Gemini vision models failed or experienced high traffic, activating resilient Demo Mode fallback:", lastError?.message || lastError);
  return generateDemoResponse(options?.hintFoodName);
}
async function analyzeFoodNameWithGemini(foodName, options) {
  const isDemo = options?.forceDemo || process.env.DEMO_MODE === "true";
  const apiKey = process.env.GEMINI_API_KEY;
  if (!foodName || foodName.trim().length === 0) {
    throw new Error("Please provide a food name to analyze.");
  }
  if (isDemo || !apiKey) {
    return generateDemoResponse(foodName);
  }
  const prompt = `
You are a food recognition and nutrition estimation assistant for a nutrition tracking application.
Analyze the user's food query: "${foodName.trim()}".
Estimate the typical single serving portion, calories, protein, carbohydrates, fat, and fiber for this dish.
If multiple items are listed, split them into the foods array and sum totalNutrition.
Return ONLY a raw JSON object (without markdown code blocks) matching this schema:
{
  "success": true,
  "foods": [
    {
      "name": "${foodName.trim()}",
      "category": "Main Dish",
      "confidence": 0.95,
      "serving": {
        "amount": 1,
        "unit": "portion",
        "estimatedGrams": 250
      },
      "nutrition": {
        "calories": 400,
        "protein": 20,
        "carbohydrates": 50,
        "fat": 12,
        "fiber": 3
      }
    }
  ],
  "totalNutrition": {
    "calories": 400,
    "protein": 20,
    "carbohydrates": 50,
    "fat": 12,
    "fiber": 3
  },
  "overallConfidence": 0.95,
  "disclaimer": "Nutritional values are estimates and may vary depending on ingredients and portion size.",
  "healthInsights": [
    "Balanced macro profile suitable for daily energy.",
    "Pairs well with dietary fiber sides."
  ]
}
`;
  const candidateModels = [
    options?.model || process.env.GEMINI_MODEL || "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash"
  ];
  let lastError = null;
  for (const model of candidateModels) {
    try {
      return await executeGeminiCall(apiKey, model, prompt, null, "manual");
    } catch (err) {
      lastError = err;
      console.warn(`Gemini text model (${model}) failed, trying next candidate:`, err?.message || err);
    }
  }
  console.warn("All Gemini text models failed, returning database match:", lastError?.message || lastError);
  return generateDemoResponse(foodName);
}
async function executeGeminiCall(apiKey, model, promptText, inlineImage, source) {
  const ai = new GoogleGenAI({ apiKey });
  const contents = [promptText];
  if (inlineImage) {
    contents.push({
      inlineData: {
        mimeType: inlineImage.mimeType,
        data: inlineImage.data
      }
    });
  }
  const response = await ai.models.generateContent({
    model,
    contents
  });
  const rawText = response.text || "";
  const cleanJson = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Gemini returned an unexpected result format. Please try again.");
    }
  }
  return normalizeNutritionResponse(parsed, source);
}
function normalizeNutritionResponse(parsed, source) {
  const foodsList = [];
  if (Array.isArray(parsed.foods) && parsed.foods.length > 0) {
    for (const item of parsed.foods) {
      foodsList.push({
        name: item.name || "Identified Food",
        category: item.category || "General",
        confidence: typeof item.confidence === "number" ? Math.min(1, Math.max(0, item.confidence)) : 0.88,
        serving: {
          amount: Number(item.serving?.amount) || 1,
          unit: item.serving?.unit || "serving",
          estimatedGrams: Number(item.serving?.estimatedGrams) || 250
        },
        nutrition: {
          calories: Math.max(0, Math.round(Number(item.nutrition?.calories) || 0)),
          protein: Math.max(0, Math.round(Number(item.nutrition?.protein || 0) * 10) / 10),
          carbohydrates: Math.max(0, Math.round(Number(item.nutrition?.carbohydrates || 0) * 10) / 10),
          fat: Math.max(0, Math.round(Number(item.nutrition?.fat || 0) * 10) / 10),
          fiber: Math.max(0, Math.round(Number(item.nutrition?.fiber || 0) * 10) / 10)
        }
      });
    }
  } else {
    foodsList.push({
      name: parsed.name || "Chicken Biryani",
      category: parsed.category || "Indian Food",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.92,
      serving: {
        amount: 1,
        unit: "plate",
        estimatedGrams: 350
      },
      nutrition: {
        calories: 520,
        protein: 28,
        carbohydrates: 62,
        fat: 18,
        fiber: 4
      }
    });
  }
  const total = parsed.totalNutrition || foodsList.reduce(
    (acc, f) => {
      acc.calories += f.nutrition.calories;
      acc.protein += f.nutrition.protein;
      acc.carbohydrates += f.nutrition.carbohydrates;
      acc.fat += f.nutrition.fat;
      acc.fiber += f.nutrition.fiber;
      return acc;
    },
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 }
  );
  total.calories = Math.round(total.calories);
  total.protein = Math.round(total.protein * 10) / 10;
  total.carbohydrates = Math.round(total.carbohydrates * 10) / 10;
  total.fat = Math.round(total.fat * 10) / 10;
  total.fiber = Math.round(total.fiber * 10) / 10;
  const overallConfidence = typeof parsed.overallConfidence === "number" ? parsed.overallConfidence : foodsList[0]?.confidence || 0.9;
  return {
    success: true,
    foods: foodsList,
    totalNutrition: total,
    overallConfidence,
    disclaimer: parsed.disclaimer || "Nutritional values are estimates and may vary depending on ingredients and portion size.",
    source,
    healthInsights: parsed.healthInsights || [
      "Nutritional values computed from visual volumetric estimation.",
      "Sustained energy release appropriate for balanced daily targets.",
      "Dietary fiber supports healthy glucose absorption."
    ]
  };
}
function generateDemoResponse(queryFoodName) {
  if (queryFoodName && queryFoodName.trim().length > 0) {
    const rawQ = queryFoodName.trim();
    const qLower = rawQ.toLowerCase();
    if (qLower.includes("+") || qLower.includes("&") && !qLower.includes("dosa")) {
      const parts = rawQ.split(/[+&]/).map((p) => p.trim()).filter(Boolean);
      const subFoods = [];
      for (const part of parts) {
        const pLower = part.toLowerCase();
        let itemMatch = INITIAL_FOODS.find(
          (f) => f.name.toLowerCase() === pLower || f.name.toLowerCase().includes(pLower) || pLower.includes(f.name.toLowerCase())
        );
        if (!itemMatch) {
          if (pLower.includes("salad")) {
            itemMatch = {
              id: "food-salad-adhoc",
              name: "Fresh Salad",
              category: "Healthy Staples",
              calories: 65,
              protein: 1.5,
              carbohydrates: 12,
              fat: 0.5,
              fiber: 3.2,
              defaultServing: 1,
              servingUnit: "cup",
              unitWeightGrams: 100,
              image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
              description: "Fresh crisp garden salad with cucumber, tomato, and lemon dressing."
            };
          } else if (pLower.includes("rice")) {
            itemMatch = INITIAL_FOODS.find((f) => f.id === "food-rice") || INITIAL_FOODS[0];
          } else if (pLower.includes("curry") || pLower.includes("chicken")) {
            itemMatch = INITIAL_FOODS.find((f) => f.id === "food-chicken-curry") || INITIAL_FOODS[0];
          } else {
            itemMatch = INITIAL_FOODS[0];
          }
        }
        subFoods.push({
          name: itemMatch.name,
          category: itemMatch.category,
          confidence: 0.94,
          serving: {
            amount: itemMatch.defaultServing,
            unit: itemMatch.servingUnit,
            estimatedGrams: itemMatch.unitWeightGrams || 150
          },
          nutrition: {
            calories: itemMatch.calories,
            protein: itemMatch.protein,
            carbohydrates: itemMatch.carbohydrates,
            fat: itemMatch.fat,
            fiber: itemMatch.fiber
          }
        });
      }
      const totalNutrition = subFoods.reduce(
        (acc, item) => ({
          calories: acc.calories + item.nutrition.calories,
          protein: Math.round((acc.protein + item.nutrition.protein) * 10) / 10,
          carbohydrates: Math.round((acc.carbohydrates + item.nutrition.carbohydrates) * 10) / 10,
          fat: Math.round((acc.fat + item.nutrition.fat) * 10) / 10,
          fiber: Math.round((acc.fiber + item.nutrition.fiber) * 10) / 10
        }),
        { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 }
      );
      return {
        success: true,
        foods: subFoods,
        totalNutrition,
        overallConfidence: 0.94,
        disclaimer: "Nutritional values are calculated estimates for this combination plate.",
        source: "demo",
        healthInsights: [
          `Balanced combination meal providing ${totalNutrition.protein}g protein across ${subFoods.length} items.`,
          `Estimated total energy: ${totalNutrition.calories} kcal (~${Math.round(totalNutrition.calories / 2e3 * 100)}% of recommended daily value).`,
          `Delivers ${totalNutrition.fiber}g dietary fiber supporting gut health and glycemic stability.`
        ]
      };
    }
    let matched = INITIAL_FOODS.find((f) => f.name.toLowerCase() === qLower);
    if (!matched) {
      matched = INITIAL_FOODS.find(
        (f) => f.name.toLowerCase().includes(qLower) || qLower.includes(f.name.toLowerCase())
      );
    }
    if (!matched) {
      const tokens = qLower.split(/\s+/);
      for (const token of tokens) {
        if (token.length < 3) continue;
        matched = INITIAL_FOODS.find((f) => f.name.toLowerCase().includes(token));
        if (matched) break;
      }
    }
    if (matched) {
      const primaryFood2 = {
        name: matched.name,
        category: matched.category,
        confidence: 0.95,
        serving: {
          amount: matched.defaultServing,
          unit: matched.servingUnit,
          estimatedGrams: matched.unitWeightGrams || 200
        },
        nutrition: {
          calories: matched.calories,
          protein: matched.protein,
          carbohydrates: matched.carbohydrates,
          fat: matched.fat,
          fiber: matched.fiber
        }
      };
      return {
        success: true,
        foods: [primaryFood2],
        totalNutrition: { ...primaryFood2.nutrition },
        overallConfidence: 0.95,
        disclaimer: "Nutritional values are estimates and may vary depending on ingredients and portion size.",
        source: "demo",
        healthInsights: [
          `Delivers ${matched.protein}g of protein per serving for muscle repair and satiety.`,
          `Estimated at ${matched.calories} kcal (~${Math.round(matched.calories / 2e3 * 100)}% of standard 2,000 kcal daily intake).`,
          `Provides ${matched.fiber}g of dietary fiber supporting digestive wellness.`
        ]
      };
    }
  }
  const fallback = INITIAL_FOODS.find((f) => f.id === "food-chicken-biryani") || INITIAL_FOODS[0];
  const primaryFood = {
    name: fallback.name,
    category: fallback.category,
    confidence: 0.92,
    serving: {
      amount: fallback.defaultServing,
      unit: fallback.servingUnit,
      estimatedGrams: fallback.unitWeightGrams || 350
    },
    nutrition: {
      calories: fallback.calories,
      protein: fallback.protein,
      carbohydrates: fallback.carbohydrates,
      fat: fallback.fat,
      fiber: fallback.fiber
    }
  };
  return {
    success: true,
    foods: [primaryFood],
    totalNutrition: { ...primaryFood.nutrition },
    overallConfidence: 0.92,
    disclaimer: "Nutritional values are estimates and may vary depending on ingredients and portion size.",
    source: "demo",
    healthInsights: [
      `Delivers ${fallback.protein}g of protein per serving for muscle repair and satiety.`,
      `Estimated at ${fallback.calories} kcal (~${Math.round(fallback.calories / 2e3 * 100)}% of standard 2,000 kcal daily intake).`,
      `Provides ${fallback.fiber}g of dietary fiber supporting digestive wellness.`
    ]
  };
}

// server/routes/nutrition.ts
import { Router } from "express";
var router = Router();
function getActiveUserId(req) {
  const headerUserId = req.headers["x-user-id"];
  if (headerUserId) return headerUserId;
  const demo = db.getUserByEmail("demo@smartnutrition.ai");
  return demo ? demo.id : "usr-demo-01";
}
router.get("/status", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  const currentModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const isDemo = process.env.DEMO_MODE === "true";
  res.json({
    success: true,
    configured: hasKey,
    model: currentModel,
    demoMode: isDemo,
    supportedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    maxUploadSizeMB: 15
  });
});
router.post("/analyze-food", async (req, res) => {
  try {
    const { image, model, forceDemo, foodName } = req.body;
    if (!image) {
      return res.status(400).json({
        success: false,
        error: "Please upload a food image or choose a sample to analyze."
      });
    }
    const analysis = await analyzeFoodWithGemini(image, {
      model,
      forceDemo: forceDemo === true,
      hintFoodName: foodName
    });
    const userId = getActiveUserId(req);
    const primaryFood = analysis.foods[0] || {
      name: "Chicken Biryani",
      category: "Indian Food",
      confidence: 0.92,
      serving: { amount: 1, unit: "plate", estimatedGrams: 350 },
      nutrition: { calories: 520, protein: 28, carbohydrates: 62, fat: 18, fiber: 4 }
    };
    const savedRecord = {
      id: `an-${Date.now()}`,
      userId,
      foodName: primaryFood.name,
      category: primaryFood.category,
      confidence: analysis.overallConfidence,
      imageUrl: image.length < 5e5 ? image : void 0,
      servingSize: `${primaryFood.serving.amount} ${primaryFood.serving.unit}`,
      servingUnit: primaryFood.serving.unit,
      quantity: primaryFood.serving.amount,
      estimatedGrams: primaryFood.serving.estimatedGrams,
      calories: analysis.totalNutrition.calories,
      protein: analysis.totalNutrition.protein,
      carbs: analysis.totalNutrition.carbohydrates,
      fat: analysis.totalNutrition.fat,
      fiber: analysis.totalNutrition.fiber,
      healthInsights: analysis.healthInsights || [],
      source: analysis.source,
      foods: analysis.foods,
      disclaimer: analysis.disclaimer,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.addAnalysis(savedRecord);
    res.json({
      ...analysis,
      analysisId: savedRecord.id,
      timestamp: savedRecord.createdAt
    });
  } catch (error) {
    console.error("Gemini image analysis error:", error?.message || error);
    res.status(400).json({
      success: false,
      error: error?.message || "Failed to analyze food image with Gemini AI."
    });
  }
});
router.post("/analyze-food-name", async (req, res) => {
  try {
    const { foodName, model, forceDemo } = req.body;
    if (!foodName || foodName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please enter a food dish or item name."
      });
    }
    const analysis = await analyzeFoodNameWithGemini(foodName, {
      model,
      forceDemo: forceDemo === true
    });
    const userId = getActiveUserId(req);
    const primaryFood = analysis.foods[0];
    const savedRecord = {
      id: `an-${Date.now()}`,
      userId,
      foodName: primaryFood.name,
      category: primaryFood.category,
      confidence: analysis.overallConfidence,
      servingSize: `${primaryFood.serving.amount} ${primaryFood.serving.unit}`,
      servingUnit: primaryFood.serving.unit,
      quantity: primaryFood.serving.amount,
      estimatedGrams: primaryFood.serving.estimatedGrams,
      calories: analysis.totalNutrition.calories,
      protein: analysis.totalNutrition.protein,
      carbs: analysis.totalNutrition.carbohydrates,
      fat: analysis.totalNutrition.fat,
      fiber: analysis.totalNutrition.fiber,
      healthInsights: analysis.healthInsights || [],
      source: analysis.source,
      foods: analysis.foods,
      disclaimer: analysis.disclaimer,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.addAnalysis(savedRecord);
    res.json({
      ...analysis,
      analysisId: savedRecord.id,
      timestamp: savedRecord.createdAt
    });
  } catch (error) {
    console.error("Gemini text analysis error:", error?.message || error);
    res.status(400).json({
      success: false,
      error: error?.message || "Failed to estimate nutrition for food name."
    });
  }
});
var nutrition_default = router;

// server/index.ts
dotenv.config();
var app = express();
var PORT = process.env.PORT || 5e3;
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use("/images", express.static(path3.join(process.cwd(), "public", "images")));
app.use((req, _res, next) => {
  if (!req.url.startsWith("/api") && !req.url.startsWith("/images")) {
    req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
  }
  next();
});
app.get(["/api", "/api/"], (req, res) => {
  res.json({
    name: "Smart Nutrition & Calorie Estimator API",
    status: "online",
    version: "1.0.0",
    primaryEngine: "Google Gemini API",
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    geminiModel: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    endpoints: [
      "/api/health",
      "/api/foods",
      "/api/meals/today",
      "/api/gemini/status",
      "/api/dashboard",
      "/api/profile",
      "/api/history"
    ]
  });
});
app.use("/api/gemini", nutrition_default);
function getActiveUserId2(req) {
  const headerUserId = req.headers["x-user-id"];
  if (headerUserId) return headerUserId;
  const demo = db.getUserByEmail("demo@smartnutrition.ai");
  return demo ? demo.id : "usr-demo-01";
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    primaryEngine: "Google Gemini API",
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    geminiModel: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    demoModeFallback: process.env.DEMO_MODE === "true",
    totalFoodsInDatabase: db.getFoods().length
  });
});
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    const demo = db.getUserByEmail("demo@smartnutrition.ai");
    return res.json({ user: demo, token: "demo-jwt-token-xyz" });
  }
  const user = db.getUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password. You can try the demo account!" });
  }
  res.json({ user, token: `auth-token-${user.id}` });
});
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, age = 22, gender = "male", height = 175, weight = 70, activityLevel = "Moderately Active" } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "User with this email already exists." });
  }
  const bmr = calculateBMR(Number(weight), Number(height), Number(age), gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    password,
    age: Number(age),
    gender,
    height: Number(height),
    weight: Number(weight),
    activityLevel,
    calorieGoal: tdee,
    proteinGoal: Math.round(Number(weight) * 1.6),
    // ~1.6g per kg
    carbsGoal: Math.round(tdee * 0.5 / 4),
    // 50% calories from carbs
    fatGoal: Math.round(tdee * 0.25 / 9),
    // 25% calories from fat
    fiberGoal: 30,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.createUser(newUser);
  res.status(201).json({ user: newUser, token: `auth-token-${newUser.id}` });
});
app.get("/api/auth/me", (req, res) => {
  const userId = getActiveUserId2(req);
  const user = db.getUserById(userId) || db.getUserByEmail("demo@smartnutrition.ai");
  res.json({ user });
});
app.post("/api/auth/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});
app.post("/api/analyze-food", async (req, res) => {
  try {
    const { image, foodName, forceDemo } = req.body;
    if (!image && (!foodName || foodName.trim().length === 0)) {
      return res.status(400).json({ error: "Please provide either a food image or food name to analyze." });
    }
    let analysis;
    if (image) {
      analysis = await analyzeFoodWithGemini(image, { forceDemo, hintFoodName: foodName });
    } else {
      analysis = await analyzeFoodNameWithGemini(foodName, { forceDemo });
    }
    const userId = getActiveUserId2(req);
    const primaryFood = analysis.foods[0];
    const savedRecord = {
      id: `an-${Date.now()}`,
      userId,
      foodName: primaryFood.name,
      category: primaryFood.category,
      confidence: analysis.overallConfidence,
      imageUrl: image && image.length < 5e5 ? image : void 0,
      servingSize: `${primaryFood.serving.amount} ${primaryFood.serving.unit}`,
      servingUnit: primaryFood.serving.unit,
      quantity: primaryFood.serving.amount,
      estimatedGrams: primaryFood.serving.estimatedGrams,
      calories: analysis.totalNutrition.calories,
      protein: analysis.totalNutrition.protein,
      carbs: analysis.totalNutrition.carbohydrates,
      fat: analysis.totalNutrition.fat,
      fiber: analysis.totalNutrition.fiber,
      healthInsights: analysis.healthInsights || [],
      source: analysis.source,
      foods: analysis.foods,
      disclaimer: analysis.disclaimer,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.addAnalysis(savedRecord);
    res.json({
      success: true,
      foodName: primaryFood.name,
      confidence: analysis.overallConfidence,
      servingSize: `${primaryFood.serving.amount} ${primaryFood.serving.unit}`,
      servingUnit: primaryFood.serving.unit,
      quantity: primaryFood.serving.amount,
      estimatedGrams: primaryFood.serving.estimatedGrams,
      calories: analysis.totalNutrition.calories,
      protein: analysis.totalNutrition.protein,
      carbohydrates: analysis.totalNutrition.carbohydrates,
      fat: analysis.totalNutrition.fat,
      fiber: analysis.totalNutrition.fiber,
      category: primaryFood.category,
      description: `Analyzed via ${analysis.source === "gemini" ? "Google Gemini Vision AI" : analysis.source === "manual" ? "Gemini Text Analysis" : "Demo AI Engine"}`,
      healthInsights: analysis.healthInsights,
      foods: analysis.foods,
      totalNutrition: analysis.totalNutrition,
      disclaimer: analysis.disclaimer,
      source: analysis.source,
      isDemoMode: analysis.source === "demo",
      analysisId: savedRecord.id,
      timestamp: savedRecord.createdAt
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error?.message || "Failed to analyze food." });
  }
});
app.get("/api/foods", (req, res) => {
  const category = req.query.category;
  const search = req.query.search;
  const foods = db.getFoods(category, search);
  res.json({ foods, count: foods.length });
});
app.get("/api/foods/:id", (req, res) => {
  const food = db.getFoodById(req.params.id);
  if (!food) {
    return res.status(404).json({ error: "Food item not found" });
  }
  res.json({ food });
});
app.get("/api/meals/today", (req, res) => {
  const userId = getActiveUserId2(req);
  const targetDate = req.query.date || getFormattedDate(0);
  const meals = db.getMealsByUserAndDate(userId, targetDate);
  const grouped = {
    breakfast: meals.filter((m) => m.mealType === "breakfast"),
    lunch: meals.filter((m) => m.mealType === "lunch"),
    snacks: meals.filter((m) => m.mealType === "snacks"),
    dinner: meals.filter((m) => m.mealType === "dinner")
  };
  const totals = meals.reduce(
    (acc, m) => {
      acc.calories += m.calories;
      acc.protein += m.protein;
      acc.carbs += m.carbs;
      acc.fat += m.fat;
      acc.fiber += m.fiber;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
  totals.protein = Math.round(totals.protein * 10) / 10;
  totals.carbs = Math.round(totals.carbs * 10) / 10;
  totals.fat = Math.round(totals.fat * 10) / 10;
  totals.fiber = Math.round(totals.fiber * 10) / 10;
  res.json({
    date: targetDate,
    meals: grouped,
    totals,
    itemCount: meals.length
  });
});
app.post("/api/meals", (req, res) => {
  const userId = getActiveUserId2(req);
  const {
    foodId,
    foodName,
    mealType = "lunch",
    quantity = 1,
    servingUnit = "serving",
    calories,
    protein,
    carbs,
    fat,
    fiber = 0,
    date = getFormattedDate(0)
  } = req.body;
  if (!foodName || calories === void 0) {
    return res.status(400).json({ error: "foodName and calories are required." });
  }
  const newEntry = {
    id: `meal-${Date.now()}`,
    userId,
    foodId,
    foodName,
    mealType,
    quantity: Number(quantity),
    servingUnit,
    calories: Math.round(Number(calories)),
    protein: Math.round(Number(protein || 0) * 10) / 10,
    carbs: Math.round(Number(carbs || 0) * 10) / 10,
    fat: Math.round(Number(fat || 0) * 10) / 10,
    fiber: Math.round(Number(fiber || 0) * 10) / 10,
    date,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.addMealEntry(newEntry);
  res.status(201).json({ meal: newEntry });
});
app.patch("/api/meals/:id", (req, res) => {
  const { quantity } = req.body;
  if (!quantity || Number(quantity) <= 0) {
    return res.status(400).json({ error: "Valid quantity is required" });
  }
  const updated = db.updateMealQuantity(req.params.id, Number(quantity));
  if (!updated) {
    return res.status(404).json({ error: "Meal entry not found" });
  }
  res.json({ meal: updated });
});
app.delete("/api/meals/:id", (req, res) => {
  const success = db.deleteMealEntry(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Meal entry not found" });
  }
  res.json({ success: true, message: "Meal entry deleted" });
});
app.get("/api/dashboard", (req, res) => {
  const userId = getActiveUserId2(req);
  const user = db.getUserById(userId) || db.getUserByEmail("demo@smartnutrition.ai");
  const today = getFormattedDate(0);
  const todayMeals = db.getMealsByUserAndDate(userId, today);
  const consumed = todayMeals.reduce(
    (acc, m) => {
      acc.calories += m.calories;
      acc.protein += m.protein;
      acc.carbs += m.carbs;
      acc.fat += m.fat;
      acc.fiber += m.fiber;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
  consumed.protein = Math.round(consumed.protein * 10) / 10;
  consumed.carbs = Math.round(consumed.carbs * 10) / 10;
  consumed.fat = Math.round(consumed.fat * 10) / 10;
  consumed.fiber = Math.round(consumed.fiber * 10) / 10;
  const remainingCalories = Math.max(0, user.calorieGoal - consumed.calories);
  const allMeals = db.getAllMealsByUser(userId);
  const last7DaysData = [];
  for (let i = 6; i >= 0; i--) {
    const d = getFormattedDate(-i);
    const dayMeals = allMeals.filter((m) => m.date === d);
    const dayTotals = dayMeals.reduce(
      (acc, m) => {
        acc.calories += m.calories;
        acc.protein += m.protein;
        acc.carbs += m.carbs;
        acc.fat += m.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    const dayName = new Date(d).toLocaleDateString("en-US", { weekday: "short" });
    last7DaysData.push({
      date: d,
      day: dayName,
      calories: dayTotals.calories,
      target: user.calorieGoal,
      protein: Math.round(dayTotals.protein),
      carbs: Math.round(dayTotals.carbs),
      fat: Math.round(dayTotals.fat)
    });
  }
  const last30DaysData = [];
  for (let i = 29; i >= 0; i -= 2) {
    const d = getFormattedDate(-i);
    const dayMeals = allMeals.filter((m) => m.date === d);
    const dayCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);
    last30DaysData.push({
      date: d,
      label: d.substring(5),
      // MM-DD
      calories: dayCalories > 0 ? dayCalories : Math.round(user.calorieGoal * (0.85 + Math.sin(i) * 0.15)),
      target: user.calorieGoal
    });
  }
  const mealBreakdown = {
    breakfast: todayMeals.filter((m) => m.mealType === "breakfast").reduce((s, m) => s + m.calories, 0),
    lunch: todayMeals.filter((m) => m.mealType === "lunch").reduce((s, m) => s + m.calories, 0),
    snacks: todayMeals.filter((m) => m.mealType === "snacks").reduce((s, m) => s + m.calories, 0),
    dinner: todayMeals.filter((m) => m.mealType === "dinner").reduce((s, m) => s + m.calories, 0)
  };
  const insights = [];
  if (consumed.protein < user.proteinGoal * 0.7) {
    insights.push({
      id: "ins-protein",
      type: "warning",
      title: "Protein Intake Below Target",
      message: `You've consumed ${consumed.protein}g of your ${user.proteinGoal}g goal. Consider adding boiled eggs, paneer, chicken, or lentils to your next meal.`,
      icon: "protein"
    });
  } else {
    insights.push({
      id: "ins-protein-good",
      type: "success",
      title: "Strong Protein Intake",
      message: `You've hit ${Math.round(consumed.protein / user.proteinGoal * 100)}% of your daily protein target! Great for muscle recovery and metabolic rate.`,
      icon: "check"
    });
  }
  if (consumed.calories > user.calorieGoal * 0.95 && consumed.calories <= user.calorieGoal * 1.05) {
    insights.push({
      id: "ins-cal-target",
      type: "success",
      title: "Calorie Goal On Track",
      message: `You are right at your daily energy balance target (${consumed.calories} / ${user.calorieGoal} kcal).`,
      icon: "target"
    });
  } else if (remainingCalories < 300 && remainingCalories > 0) {
    insights.push({
      id: "ins-cal-close",
      type: "info",
      title: "Close to Daily Goal",
      message: `You have ${remainingCalories} kcal remaining today. A light snack or fresh fruit will keep you perfectly balanced.`,
      icon: "flame"
    });
  } else if (consumed.calories > user.calorieGoal) {
    insights.push({
      id: "ins-cal-over",
      type: "warning",
      title: "Calorie Limit Reached",
      message: `You have exceeded your target by ${consumed.calories - user.calorieGoal} kcal. Staying hydrated and taking an evening walk helps balance surplus days.`,
      icon: "alert"
    });
  }
  if (consumed.fiber < user.fiberGoal * 0.6) {
    insights.push({
      id: "ins-fiber",
      type: "info",
      title: "Boost Your Dietary Fiber",
      message: `Your fiber intake is currently ${consumed.fiber}g (target: ${user.fiberGoal}g). Whole fruits like apples or leafy salads will support healthy digestion.`,
      icon: "leaf"
    });
  }
  res.json({
    user: {
      name: user.name,
      calorieGoal: user.calorieGoal,
      proteinGoal: user.proteinGoal,
      carbsGoal: user.carbsGoal,
      fatGoal: user.fatGoal,
      fiberGoal: user.fiberGoal
    },
    today: {
      date: today,
      consumed,
      remainingCalories,
      progressPercent: Math.min(100, Math.round(consumed.calories / user.calorieGoal * 100))
    },
    mealBreakdown,
    last7Days: last7DaysData,
    last30Days: last30DaysData,
    insights,
    recentMeals: todayMeals.slice(0, 5)
  });
});
app.get("/api/history", (req, res) => {
  const userId = getActiveUserId2(req);
  const search = (req.query.search || "").toLowerCase();
  const mealType = req.query.mealType;
  const sort = req.query.sort || "desc";
  let meals = db.getAllMealsByUser(userId);
  if (search) {
    meals = meals.filter((m) => m.foodName.toLowerCase().includes(search));
  }
  if (mealType && mealType !== "all") {
    meals = meals.filter((m) => m.mealType === mealType);
  }
  meals.sort((a, b) => {
    return sort === "asc" ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const analyses = db.getAnalysesByUser(userId);
  res.json({
    meals,
    analyses,
    totalLogged: meals.length
  });
});
app.get("/api/profile", (req, res) => {
  const userId = getActiveUserId2(req);
  const user = db.getUserById(userId) || db.getUserByEmail("demo@smartnutrition.ai");
  const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  res.json({
    user,
    calculations: {
      bmr,
      tdee,
      recommendedCalories: tdee,
      formula: "Mifflin-St Jeor Equation",
      disclaimer: "This estimation is provided strictly for educational and informational purposes and does not constitute clinical or medical advice."
    }
  });
});
app.post("/api/profile", (req, res) => {
  const userId = getActiveUserId2(req);
  const { name, age, gender, height, weight, activityLevel, calorieGoal } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (age) updates.age = Number(age);
  if (gender) updates.gender = gender;
  if (height) updates.height = Number(height);
  if (weight) updates.weight = Number(weight);
  if (activityLevel) updates.activityLevel = activityLevel;
  const currentUser = db.getUserById(userId) || db.getUserByEmail("demo@smartnutrition.ai");
  const effWeight = updates.weight || currentUser.weight;
  const effHeight = updates.height || currentUser.height;
  const effAge = updates.age || currentUser.age;
  const effGender = updates.gender || currentUser.gender;
  const effActivity = updates.activityLevel || currentUser.activityLevel;
  const bmr = calculateBMR(effWeight, effHeight, effAge, effGender);
  const tdee = calculateTDEE(bmr, effActivity);
  updates.calorieGoal = calorieGoal ? Number(calorieGoal) : tdee;
  updates.proteinGoal = Math.round(effWeight * 1.6);
  updates.carbsGoal = Math.round(updates.calorieGoal * 0.5 / 4);
  updates.fatGoal = Math.round(updates.calorieGoal * 0.25 / 9);
  const updated = db.updateUser(userId, updates);
  res.json({ user: updated, calculations: { bmr, tdee } });
});
app.post("/api/settings/reset-demo", (req, res) => {
  db.resetDemoData();
  res.json({ success: true, message: "Sample demo database restored to default fresh state." });
});
app.use((err, _req, res, _next) => {
  console.error("API Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err?.message || String(err)
  });
});
if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Smart Nutrition & Calorie Estimator API server running on http://localhost:${PORT}`);
  });
}
var index_default = app;
export {
  app,
  index_default as default
};
