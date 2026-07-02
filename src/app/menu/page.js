"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AuthPanel from "../components/AuthPanel";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const COMPANY = "ACME2024";

const MONTH_IDX = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
function isClosed(dateStr) {
  const now = new Date();
  const [dayNum, monthStr] = dateStr.split(" ");
  const mealDate = new Date(2026, MONTH_IDX[monthStr], parseInt(dayNum));
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Delivery day is today or already past
  if (mealDate <= todayMidnight) return true;
  // It's the evening before — past 10pm cut-off
  const prevDay = new Date(mealDate);
  prevDay.setDate(mealDate.getDate() - 1);
  if (prevDay.getTime() === todayMidnight.getTime() && now.getHours() >= 22) return true;
  return false;
}

const WEEKLY_MENU = [
  {
    day: "MON", date: "30 Jun", closed: isClosed("30 Jun"), theme: "Asian Kitchen",
    dishes: [
      {
        name: "Chicken Katsu Curry", price: 8.50,
        desc: "Crispy panko-crusted chicken, house-made Japanese curry sauce, jasmine rice and pickled daikon.",
        kcal: 620, protein: 38, carbs: 72, fat: 18,
        tags: ["Chef's Pick", "High Protein"], allergens: "Gluten · Soy · Eggs",
        img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
        addons: [{ name: "Extra curry sauce", price: 0.50 }, { name: "Side salad", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Sesame Poke Bowl", price: 9.00,
        desc: "Sushi rice, edamame, cucumber, mango, avocado with a sesame-soy drizzle.",
        kcal: 520, protein: 22, carbs: 68, fat: 14,
        tags: ["Vegan", "Light"], allergens: "Soy · Sesame",
        img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
        addons: [{ name: "Tofu topping", price: 1.00 }, { name: "Spicy mayo", price: 0.50 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Miso Salmon & Quinoa", price: 10.50,
        desc: "Miso-glazed salmon on tricolour quinoa with wilted spinach and yuzu dressing.",
        kcal: 680, protein: 48, carbs: 52, fat: 24,
        tags: ["Omega-3 Rich", "Gluten Free"], allergens: "Fish · Soy",
        img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
        addons: [{ name: "Extra salmon", price: 2.50 }, { name: "Side salad", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Thai Green Curry", price: 9.00,
        desc: "Fragrant coconut green curry with jasmine rice, Thai basil, bamboo shoots and sugar snap peas.",
        kcal: 560, protein: 28, carbs: 64, fat: 20,
        tags: ["Spicy", "Dairy Free"], allergens: "Soy · Shellfish",
        img: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80",
        addons: [{ name: "Chicken add-on", price: 1.50 }, { name: "Extra rice", price: 0.75 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Crispy Tofu Noodles", price: 8.00,
        desc: "Wok-tossed rice noodles, crispy golden tofu, pak choi, spring onion and a hoisin-ginger glaze.",
        kcal: 480, protein: 20, carbs: 70, fat: 14,
        tags: ["Vegan", "High Fibre"], allergens: "Soy · Gluten · Sesame",
        img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
        addons: [{ name: "Extra tofu", price: 1.00 }, { name: "Chilli oil", price: 0.50 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Prawn & Mango Rice", price: 11.00,
        desc: "Garlic butter king prawns, coconut jasmine rice, fresh mango salsa and crispy shallots.",
        kcal: 530, protein: 34, carbs: 60, fat: 12,
        tags: ["Gluten Free", "Low Cal"], allergens: "Shellfish · Dairy",
        img: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80",
        addons: [{ name: "Extra prawns", price: 2.00 }, { name: "Side salad", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
    ],
  },
  {
    day: "TUE", date: "1 Jul", closed: isClosed("1 Jul"), theme: "Mediterranean",
    dishes: [
      {
        name: "Peri Peri Chicken Rice", price: 8.50,
        desc: "Flame-grilled peri peri chicken thighs over saffron rice with roasted peppers and yoghurt drizzle.",
        kcal: 650, protein: 42, carbs: 68, fat: 16,
        tags: ["Spicy", "High Protein"], allergens: "Dairy · Gluten",
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
        addons: [{ name: "Extra peri sauce", price: 0.50 }, { name: "Side salad", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Falafel Mezze Plate", price: 8.00,
        desc: "Crispy chickpea falafel, hummus, tabbouleh, warm flatbread and lemon tahini drizzle.",
        kcal: 490, protein: 18, carbs: 62, fat: 20,
        tags: ["Vegan"], allergens: "Gluten · Sesame",
        img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
        addons: [{ name: "Extra hummus", price: 0.75 }, { name: "Warm pita", price: 0.50 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Grilled Halloumi Salad", price: 9.50,
        desc: "Grilled halloumi, rocket, roasted cherry tomatoes, olives and pomegranate with balsamic glaze.",
        kcal: 440, protein: 24, carbs: 24, fat: 28,
        tags: ["Vegetarian", "Low Carb"], allergens: "Dairy",
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
        addons: [{ name: "Extra halloumi", price: 1.50 }, { name: "Side of bread", price: 0.75 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Chicken Shawarma Wrap", price: 8.50,
        desc: "Spiced chicken shawarma, garlic sauce, pickled turnip and crisp lettuce in a toasted flatbread.",
        kcal: 590, protein: 38, carbs: 58, fat: 18,
        tags: ["Popular", "High Protein"], allergens: "Gluten · Dairy · Sesame",
        img: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80",
        addons: [{ name: "Extra sauce", price: 0.50 }, { name: "Side chips", price: 1.25 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Lamb Kofta Rice Bowl", price: 10.00,
        desc: "Herb-spiced lamb koftas, saffron rice, roasted aubergine, tzatziki and pomegranate seeds.",
        kcal: 680, protein: 44, carbs: 58, fat: 26,
        tags: ["Chef's Pick", "High Protein"], allergens: "Dairy · Gluten",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
        addons: [{ name: "Extra kofta", price: 2.00 }, { name: "Extra tzatziki", price: 0.75 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Greek Chicken Salad", price: 9.00,
        desc: "Grilled lemon chicken, mixed greens, feta, kalamata olives, cucumber and house Greek dressing.",
        kcal: 420, protein: 36, carbs: 18, fat: 22,
        tags: ["Low Carb", "Gluten Free"], allergens: "Dairy",
        img: "https://images.unsplash.com/photo-1512852939750-1305098529bf?w=600&q=80",
        addons: [{ name: "Extra feta", price: 1.00 }, { name: "Warm pita", price: 0.75 }, { name: "Soft drink", price: 1.50 }],
      },
    ],
  },
  {
    day: "WED", date: "2 Jul", closed: isClosed("2 Jul"), theme: "Italian Kitchen",
    dishes: [
      {
        name: "Chicken Pasta", price: 8.00,
        desc: "Pulled chicken in a rich tomato basil sauce with al dente penne and parmesan.",
        kcal: 580, protein: 35, carbs: 78, fat: 14,
        tags: ["Comfort Food"], allergens: "Gluten · Dairy · Eggs",
        img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80",
        imgs: [
          "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80",
          "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=600&q=80",
          "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80",
        ],
        addons: [{ name: "Extra parmesan", price: 0.50 }, { name: "Garlic bread", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Margherita Focaccia Pizza", price: 8.50,
        desc: "Hand-stretched focaccia, San Marzano tomato, buffalo mozzarella and fresh basil.",
        kcal: 620, protein: 22, carbs: 82, fat: 18,
        tags: ["Vegetarian", "Popular"], allergens: "Gluten · Dairy",
        img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
        imgs: [
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80",
          "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80",
        ],
        addons: [{ name: "Extra cheese", price: 1.00 }, { name: "Rocket topping", price: 0.75 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Tuscan Bean Soup", price: 7.00,
        desc: "Hearty cannellini beans, cavolo nero, roasted tomatoes and herbs with crusty sourdough.",
        kcal: 380, protein: 16, carbs: 56, fat: 8,
        tags: ["Vegan", "Low Cal"], allergens: "Gluten",
        img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
        addons: [{ name: "Extra bread", price: 0.75 }, { name: "Side salad", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Mushroom Risotto", price: 9.50,
        desc: "Creamy arborio risotto with wild mushrooms, truffle oil, aged parmesan and fresh thyme.",
        kcal: 540, protein: 18, carbs: 72, fat: 20,
        tags: ["Vegetarian", "Chef's Pick"], allergens: "Dairy · Gluten",
        img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
        imgs: [
          "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
          "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
        ],
        addons: [{ name: "Extra truffle oil", price: 1.50 }, { name: "Side salad", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Pesto Gnocchi", price: 8.50,
        desc: "Pillowy potato gnocchi tossed in basil pesto, cherry tomatoes, pine nuts and shaved pecorino.",
        kcal: 610, protein: 20, carbs: 80, fat: 24,
        tags: ["Vegetarian"], allergens: "Gluten · Dairy · Nuts",
        img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80",
        addons: [{ name: "Grilled chicken", price: 2.00 }, { name: "Extra pesto", price: 0.75 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Prosciutto Arugula Flatbread", price: 9.00,
        desc: "Thin-crust flatbread with prosciutto crudo, rocket, shaved parmesan and a lemon drizzle.",
        kcal: 520, protein: 26, carbs: 52, fat: 22,
        tags: ["Popular", "Low Cal"], allergens: "Gluten · Dairy",
        img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80",
        addons: [{ name: "Extra prosciutto", price: 1.75 }, { name: "Burrata add-on", price: 2.00 }, { name: "Soft drink", price: 1.50 }],
      },
    ],
  },
  {
    day: "THU", date: "3 Jul", closed: isClosed("3 Jul"), theme: "Street Food",
    dishes: [
      {
        name: "Beef Burrito Bowl", price: 9.00,
        desc: "Seasoned beef, black beans, pico de gallo, corn, cheddar and chipotle crema over cilantro rice.",
        kcal: 710, protein: 45, carbs: 80, fat: 22,
        tags: ["Most Popular", "High Protein"], allergens: "Dairy · Gluten",
        img: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&q=80",
        addons: [{ name: "Guacamole", price: 1.00 }, { name: "Jalapeños", price: 0.50 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Korean BBQ Chicken", price: 9.50,
        desc: "Gochujang chicken thighs, sticky jasmine rice, pickled cucumbers and kimchi.",
        kcal: 660, protein: 44, carbs: 72, fat: 18,
        tags: ["Spicy", "Chef's Special"], allergens: "Gluten · Soy",
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
        addons: [{ name: "Extra kimchi", price: 0.75 }, { name: "Sesame slaw", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Halloumi Wrap", price: 8.00,
        desc: "Grilled halloumi, roasted peppers, za'atar chickpeas and herb yoghurt in a soft wrap.",
        kcal: 510, protein: 24, carbs: 58, fat: 22,
        tags: ["Vegetarian"], allergens: "Gluten · Dairy",
        img: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600&q=80",
        addons: [{ name: "Extra halloumi", price: 1.50 }, { name: "Side of crisps", price: 0.75 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Fish Tacos", price: 9.00,
        desc: "Beer-battered cod, chipotle slaw, pickled jalapeños and avocado crema in soft corn tortillas.",
        kcal: 570, protein: 30, carbs: 64, fat: 20,
        tags: ["Popular"], allergens: "Gluten · Fish · Dairy",
        img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
        addons: [{ name: "Extra taco", price: 1.50 }, { name: "Salsa verde", price: 0.50 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Tandoori Chicken Flatbread", price: 8.50,
        desc: "Marinated tandoori chicken strips, mint chutney, red onion and cucumber on a warm naan flatbread.",
        kcal: 590, protein: 40, carbs: 56, fat: 16,
        tags: ["High Protein"], allergens: "Gluten · Dairy",
        img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80",
        addons: [{ name: "Extra chicken", price: 1.75 }, { name: "Mango chutney", price: 0.50 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Veggie Quesadilla", price: 7.50,
        desc: "Crispy flour tortilla filled with roasted peppers, black beans, sweetcorn, guacamole and melted cheese.",
        kcal: 490, protein: 18, carbs: 62, fat: 18,
        tags: ["Vegetarian", "Low Cal"], allergens: "Gluten · Dairy",
        img: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=600&q=80",
        addons: [{ name: "Sour cream", price: 0.50 }, { name: "Extra guacamole", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
    ],
  },
  {
    day: "FRI", date: "4 Jul", closed: isClosed("4 Jul"), theme: "Comfort Classics",
    dishes: [
      {
        name: "Chicken Tikka Rice Bowl", price: 8.50,
        desc: "Tandoor-marinated chicken tikka, basmati rice, cucumber raita and mango chutney.",
        kcal: 640, protein: 42, carbs: 70, fat: 15,
        tags: ["Fan Favourite"], allergens: "Dairy · Gluten",
        img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
        addons: [{ name: "Extra raita", price: 0.50 }, { name: "Naan bread", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Mac & Cheese", price: 7.50,
        desc: "Creamy four-cheese sauce and cavatappi pasta with a golden breadcrumb crust.",
        kcal: 720, protein: 28, carbs: 84, fat: 32,
        tags: ["Comfort Food", "Vegetarian"], allergens: "Gluten · Dairy · Eggs",
        img: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=600&q=80",
        addons: [{ name: "Crispy bacon", price: 1.25 }, { name: "Side salad", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "BBQ Pulled Pork Bun", price: 9.00,
        desc: "Slow-cooked pulled pork in smoky BBQ sauce, brioche bun, coleslaw and pickles.",
        kcal: 680, protein: 38, carbs: 76, fat: 24,
        tags: ["Most Popular"], allergens: "Gluten · Mustard",
        img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
        addons: [{ name: "Extra BBQ sauce", price: 0.50 }, { name: "Curly fries", price: 1.75 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Honey Garlic Salmon", price: 11.00,
        desc: "Pan-seared salmon fillet with honey garlic butter glaze, wilted greens and crushed new potatoes.",
        kcal: 620, protein: 46, carbs: 44, fat: 26,
        tags: ["Gluten Free", "Omega-3 Rich"], allergens: "Fish · Dairy",
        img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
        addons: [{ name: "Extra potatoes", price: 0.75 }, { name: "Side greens", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Shepherd's Pie", price: 8.50,
        desc: "Slow-braised lamb mince with root vegetables, rich gravy and a golden mashed potato crust.",
        kcal: 660, protein: 36, carbs: 66, fat: 24,
        tags: ["Comfort Food", "Hearty"], allergens: "Dairy · Celery",
        img: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80",
        addons: [{ name: "Extra gravy", price: 0.50 }, { name: "Mushy peas", price: 0.75 }, { name: "Soft drink", price: 1.50 }],
      },
      {
        name: "Grilled Cheese & Tomato Soup", price: 7.50,
        desc: "Thick-cut sourdough toastie with mature cheddar and a rich roasted tomato and basil soup.",
        kcal: 560, protein: 22, carbs: 62, fat: 26,
        tags: ["Vegetarian", "Comfort Food"], allergens: "Gluten · Dairy",
        img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
        addons: [{ name: "Extra toastie", price: 2.00 }, { name: "Side salad", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
      },
    ],
  },
];

export default function MenuPage() {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [selected, setSelected] = useState({});
  const [portions, setPortions] = useState({});
  const [quantities, setQuantities] = useState({});
  const [addons, setAddons] = useState({});
  const [expandedDish, setExpandedDish] = useState(null);
  const [detailDish, setDetailDish] = useState(null); // { d, di }
  const [detailTab, setDetailTab] = useState("overview");
  const [weekly, setWeekly] = useState(false);
  const [selectedDay, setSelectedDay] = useState(() => {
    const idx = WEEKLY_MENU.findIndex(d => !d.closed);
    return idx >= 0 ? idx : 0;
  });
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const router = useRouter();

  const setA = (k, v) => { setAuthForm(f => ({ ...f, [k]: v })); if (k === "email") { setOtpSent(false); setOtp(["","","",""]); setOtpError(""); } };

  const sendOtp = () => {
    if (!authForm.email || !/\S+@\S+\.\S+/.test(authForm.email)) { setAuthError("Enter a valid email first."); return; }
    setAuthError("");
    setOtpSending(true);
    setTimeout(() => { setOtpSending(false); setOtpSent(true); }, 1200);
  };

  const handleOtpInput = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setOtpError("");
    if (val && i < 3) document.getElementById(`otp-${i+1}`)?.focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`otp-${i-1}`)?.focus();
  };

  const verifyOtp = () => {
    const code = otp.join("");
    if (code.length < 4) { setOtpError("Enter the 4-digit code."); return; }
    setOtpVerifying(true);
    setTimeout(() => { setOtpVerifying(false); setShowAuth(false); localStorage.setItem("sk_authed", "1"); router.push("/review"); }, 1200);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password) { setAuthError("Please fill in all fields."); return; }
    setAuthError("");
    setAuthLoading(true);
    setTimeout(() => { setAuthLoading(false); setShowAuth(false); localStorage.setItem("sk_authed", "1"); router.push("/review"); }, 1500);
  };

  // Composite key helpers
  const getKey = (d, di) => `${d}_${di}`;
  const isSelectedDish = (d, di) => !!selected[getKey(d, di)];
  const getPortion = (d, di) => portions[getKey(d, di)] || "regular";
  const getQty = (d, di) => quantities[getKey(d, di)] || 1;
  const getAddonSet = (d, di) => addons[getKey(d, di)] || new Set();

  const toggleDish = (d, di) => {
    if (!user) { setAuthOpen(true); return; }
    if (WEEKLY_MENU[d].closed) return;
    const k = getKey(d, di);
    setSelected(s => {
      const next = { ...s };
      next[k] ? delete next[k] : (next[k] = true);
      return next;
    });
    if (!portions[k]) setPortions(p => ({ ...p, [k]: "regular" }));
    if (!quantities[k]) setQuantities(q => ({ ...q, [k]: 1 }));
    setExpandedDish(null);
  };

  const setPortion = (d, di, v) => setPortions(p => ({ ...p, [getKey(d, di)]: v }));

  const toggleAddon = (d, di, name) => {
    const k = getKey(d, di);
    setAddons(a => {
      const s = new Set(a[k] || []);
      s.has(name) ? s.delete(name) : s.add(name);
      return { ...a, [k]: s };
    });
  };

  const incrQty = (d, di) => setQuantities(q => ({ ...q, [getKey(d, di)]: getQty(d, di) + 1 }));
  const decrQty = (d, di) => setQuantities(q => ({ ...q, [getKey(d, di)]: Math.max(1, getQty(d, di) - 1) }));

  const dayHasItems = (d) => WEEKLY_MENU[d].dishes.some((_, di) => isSelectedDish(d, di));

  const openDetail = (d, di) => { setDetailDish({ d, di }); setDetailTab("overview"); };
  const closeDetail = () => setDetailDish(null);

  const getDishPrice = (d, di) => {
    const dish = WEEKLY_MENU[d].dishes[di];
    const addonSet = getAddonSet(d, di);
    const addonTotal = [...addonSet].reduce((s, name) => s + (dish.addons.find(a => a.name === name)?.price || 0), 0);
    return dish.price + (getPortion(d, di) === "large" ? 1.50 : 0) + addonTotal;
  };

  const orderItems = Object.keys(selected).map(k => {
    const [d, di] = k.split("_").map(Number);
    const dish = WEEKLY_MENU[d].dishes[di];
    return { k, d, di, dish, portion: getPortion(d, di), qty: getQty(d, di), price: getDishPrice(d, di) };
  });

  const subtotal = orderItems.reduce((s, x) => s + x.price * x.qty, 0);

  return (
    <div className={styles.root}>
      <Navbar onSignIn={() => setAuthOpen(true)} />

      {/* ── Main ── */}
      <div className={styles.mainWrap}>
        <div className={styles.menuListHeader}>
          <div className={styles.orderDeadlineBanner}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Order before <strong>10:00 PM</strong> for next-day delivery
          </div>
          <h1 className={styles.heading}>This week&apos;s menu</h1>
          <p className={styles.subtext}>Pick the days you want lunch. Each day has multiple dishes to choose from.</p>
        </div>

        {/* Day picker — full width above flex row */}
        <div className={styles.dayPicker}>
          {WEEKLY_MENU.map((day, i) => (
            <button
              key={i}
              className={`${styles.dayTab} ${selectedDay === i ? styles.dayTabActive : ""} ${day.closed ? styles.dayTabClosed : ""}`}
              onClick={() => setSelectedDay(i)}
            >
              {dayHasItems(i) && <span className={styles.dayTabDot} />}
              <span className={styles.dayTabDay}>{day.day}</span>
              <span className={styles.dayTabDate}>{day.date.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Day date label — full width above flex row */}
        <div className={styles.dayTheme}>
          <span className={styles.dayThemeLabel}>
            {WEEKLY_MENU[selectedDay].date.replace(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/, m => ({Jan:"January",Feb:"February",Mar:"March",Apr:"April",May:"May",Jun:"June",Jul:"July",Aug:"August",Sep:"September",Oct:"October",Nov:"November",Dec:"December"})[m])}
          </span>
          <span className={styles.dayThemeDate}>{WEEKLY_MENU[selectedDay].dishes.length} dishes</span>
        </div>

      <div className={styles.main}>
        <div className={styles.menuList}>
          {/* Dish cards */}
          <div className={styles.dishGrid}>
            {WEEKLY_MENU[selectedDay].dishes.map((dish, di) => {
              const sel = isSelectedDish(selectedDay, di);
              const closed = WEEKLY_MENU[selectedDay].closed;

              return (
                <div key={di} className={`${styles.dishCard} ${sel ? styles.dishCardAdded : ""}`}>
                  {/* Image — click to open detail modal */}
                  <div className={styles.dishImgWrap} onClick={() => openDetail(selectedDay, di)}>
                    {dish.imgs ? (
                      <DishImgCarousel imgs={dish.imgs} />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={dish.img} alt={dish.name} className={styles.dishImg} />
                    )}
                    <div className={styles.dishImgOverlay} />
                    <div className={styles.dishImgViewHint}>View details</div>
                    <div className={styles.dishTagsWrap}>
                      {dish.tags.map(t => <span key={t} className={styles.dishTag}>{t}</span>)}
                    </div>
                    {closed && <div className={styles.dishClosedBanner}><strong>Ordering Closed</strong><br />This meal can no longer be ordered. Please place orders by 10:00 PM the day before delivery.</div>}
                    {sel && !closed && <div className={styles.dishAddedBadge}>✓ Added</div>}
                  </div>

                  {/* Body */}
                  <div className={styles.dishBody}>
                    <div className={styles.dishTop}>
                      <h3 className={styles.dishName}>{dish.name}</h3>
                      <span className={styles.dishPrice}>£{dish.price.toFixed(2)}</span>
                    </div>
                    <p className={styles.dishDesc}>{dish.desc}</p>

                    {/* Macros */}
                    <div className={styles.dishMacros}>
                      {[
                        { label: "kcal", val: dish.kcal },
                        { label: "protein", val: `${dish.protein}g` },
                        { label: "carbs", val: `${dish.carbs}g` },
                        { label: "fat", val: `${dish.fat}g` },
                      ].map(m => (
                        <div key={m.label} className={styles.dishMacro}>
                          <span className={styles.dishMacroVal}>{m.val}</span>
                          <span className={styles.dishMacroLabel}>{m.label}</span>
                        </div>
                      ))}
                    </div>

                    {!closed && (
                      <button
                        className={`${styles.dishAddBtn} ${sel ? styles.dishAddBtnActive : ""}`}
                        onClick={() => openDetail(selectedDay, di)}
                      >
                        {sel ? "✓ Added" : `Add £${dish.price.toFixed(2)}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Premium sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            {/* Black header */}
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarTitleRow}>
                <h2 className={styles.sidebarTitle}>Your order</h2>
                <div className={styles.sidebarCartIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  {orderItems.length > 0 && <span className={styles.cartCount}>{orderItems.length}</span>}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className={styles.sidebarBody}>
              {orderItems.length === 0 ? (
                <div className={styles.emptyOrder}>
                  <div className={styles.emptyIcon}>🛒</div>
                  <p className={styles.emptyText}>No meals selected yet.<br />Pick dishes above to build your order.</p>
                </div>
              ) : (
                <div className={styles.basketList}>
                  {orderItems.map(({ k, d, di, dish, portion, qty, price }) => {
                    const addonSet = getAddonSet(d, di);
                    const addonNames = [...addonSet];
                    return (
                    <div key={k} className={styles.basketItem}>
                      <div className={styles.basketItemLeft}>
                        <div className={styles.basketDay}>
                          <span className={styles.basketDayNum}>{WEEKLY_MENU[d].date.split(" ")[0]}</span>
                          <span className={styles.basketDayMon}>{WEEKLY_MENU[d].date.split(" ")[1]}</span>
                        </div>
                        <div className={styles.basketDetails}>
                          <p className={styles.basketName}>{dish.name}</p>
                          <p className={styles.basketMeta}>
                            {portion.charAt(0).toUpperCase() + portion.slice(1)}
                            {qty > 1 && ` · ×${qty}`}
                          </p>
                          {addonNames.length > 0 && (
                            <div className={styles.basketAddons}>
                              {addonNames.map(name => (
                                <span key={name} className={styles.basketAddonTag}>+ {name}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.basketItemRight}>
                        <span className={styles.basketPrice}>£{(price * qty).toFixed(2)}</span>
                        <button
                          className={styles.basketRemoveBtn}
                          onClick={() => toggleDish(d, di)}
                          aria-label="Remove"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                  })}
                </div>
              )}

              <div className={styles.orderTotals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Delivery</span>
                  <span className={styles.freeTag}>FREE</span>
                </div>
                <div className={`${styles.totalRow} ${styles.totalFinal}`}>
                  <span>Total</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                className={`${styles.reviewBtn} ${orderItems.length === 0 ? styles.reviewBtnDisabled : ""}`}
                disabled={orderItems.length === 0}
                onClick={() => orderItems.length > 0 && router.push("/review")}
              >
                Review order
              </button>


            </div>
          </div>
        </div>
      </div>
      </div>{/* /mainWrap */}

      {/* ── Dish Detail Modal ── */}
      {detailDish && (() => {
        const { d, di } = detailDish;
        const dish = WEEKLY_MENU[d].dishes[di];
        const sel = isSelectedDish(d, di);
        const portion = getPortion(d, di);
        const qty = getQty(d, di);
        const dishPrice = getDishPrice(d, di);
        return (
          <div className={styles.dishDetailOverlay} onClick={e => e.target === e.currentTarget && closeDetail()}>
            <div className={styles.dishDetailModal}>
              {/* Close button — top-right of whole modal */}
              <button className={styles.dishDetailClose} onClick={closeDetail}>✕</button>

              {/* Left: image */}
              <div className={styles.dishDetailLeft}>
                {dish.imgs ? (
                  <DishImgCarousel imgs={dish.imgs} />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={dish.img} alt={dish.name} className={styles.dishDetailImg} />
                )}
              </div>

              {/* Right: content */}
              <div className={styles.dishDetailRight}>
                <div className={styles.dishDetailTop}>
                  <h2 className={styles.dishDetailName}>{dish.name}</h2>
                  <span className={styles.dishDetailPrice}>£{dish.price.toFixed(2)}</span>
                </div>

                {/* Tabs */}
                <div className={styles.dishDetailTabs}>
                  {["overview", "nutritional", "allergens"].map(tab => (
                    <button
                      key={tab}
                      className={`${styles.dishDetailTab} ${detailTab === tab ? styles.dishDetailTabActive : ""}`}
                      onClick={() => setDetailTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className={styles.dishDetailContent}>
                  {detailTab === "overview" && (
                    <>
                      <p className={styles.dishDetailDesc}>{dish.desc}</p>
                      <div className={styles.dishDetailTagPills}>
                        {dish.tags.map(t => <span key={t} className={styles.dishDetailTagPill}>{t}</span>)}
                      </div>
                    </>
                  )}
                  {detailTab === "nutritional" && (
                    <div className={styles.dishDetailNutrition}>
                      {[
                        { label: "Calories", val: dish.kcal, unit: "kcal" },
                        { label: "Protein",  val: dish.protein, unit: "g" },
                        { label: "Carbohydrates", val: dish.carbs, unit: "g" },
                        { label: "Fat",      val: dish.fat, unit: "g" },
                      ].map(n => (
                        <div key={n.label} className={styles.nutritionRow}>
                          <span className={styles.nutritionRowLabel}>{n.label}</span>
                          <span className={styles.nutritionRowVal}>{n.val}{n.unit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {detailTab === "allergens" && (
                    <div className={styles.dishDetailAllergenBlock}>
                      <p className={styles.dishDetailAllergenTitle}>⚠ Contains allergens</p>
                      <p className={styles.dishDetailAllergenText}>{dish.allergens}</p>
                    </div>
                  )}
                </div>

                {/* Portion selector */}
                <div className={styles.dishDetailPortionRow}>
                  <span className={styles.dishDetailPortionLabel}>Portion</span>
                  <div className={styles.optionBtns}>
                    <button className={`${styles.optionBtn} ${portion === "regular" ? styles.optionBtnActive : ""}`} onClick={() => setPortion(d, di, "regular")}>Regular</button>
                    <button className={`${styles.optionBtn} ${portion === "large" ? styles.optionBtnActive : ""}`} onClick={() => setPortion(d, di, "large")}>Large <span className={styles.optionExtra}>(+£1.50)</span></button>
                  </div>
                </div>

                {/* Add-ons */}
                {dish.addons.length > 0 && (
                  <div className={styles.dishDetailAddonsSection}>
                    <p className={styles.dishDetailAddonsTitle}>Add-ons <span className={styles.optionalTag}>Optional</span></p>
                    <div className={styles.dishDetailAddonList}>
                      {dish.addons.map(a => {
                        const addonSet = getAddonSet(d, di);
                        const active = addonSet.has(a.name);
                        return (
                          <button
                            key={a.name}
                            className={`${styles.dishDetailAddonItem} ${active ? styles.dishDetailAddonItemActive : ""}`}
                            onClick={() => toggleAddon(d, di, a.name)}
                          >
                            <div className={`${styles.dishDetailAddonCheck} ${active ? styles.dishDetailAddonCheckActive : ""}`}>
                              {active && "✓"}
                            </div>
                            <span className={styles.dishDetailAddonName}>{a.name}</span>
                            <span className={styles.dishDetailAddonPrice}>+£{a.price.toFixed(2)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer */}
                {WEEKLY_MENU[d].closed ? (
                  <div className={styles.dishDetailClosedFooter}>
                    <strong>Ordering Closed</strong>
                    <p>This meal can no longer be ordered. Please place orders by 10:00 PM the day before delivery.</p>
                  </div>
                ) : (
                  <div className={styles.dishDetailFooter}>
                    <div className={styles.qtyCtrl}>
                      <button className={styles.qtyBtn} onClick={() => decrQty(d, di)} disabled={qty <= 1}>−</button>
                      <span className={styles.qtyNum}>{qty}</span>
                      <button className={styles.qtyBtn} onClick={() => incrQty(d, di)}>+</button>
                    </div>
                    <button
                      className={`${styles.dishDetailAddBtn} ${sel ? styles.dishDetailAddBtnActive : ""}`}
                      onClick={() => { toggleDish(d, di); if (!sel) closeDetail(); }}
                    >
                      {sel ? "✓ Remove from order" : `Add to order · £${(dishPrice * qty).toFixed(2)}`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}
    </div>
  );
}

function DishImgCarousel({ imgs }) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(i => {
        const next = (i + 1) % imgs.length;
        setPrev(i);
        return next;
      });
    }, 2800);
    return () => clearInterval(t);
  }, [imgs.length]);

  return (
    <div className={styles.carousel}>
      {imgs.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt=""
          className={`${styles.carouselImg} ${i === idx ? styles.carouselImgActive : i === prev ? styles.carouselImgPrev : ""}`}
        />
      ))}
      <div className={styles.carouselDots}>
        {imgs.map((_, i) => (
          <span key={i} className={`${styles.carouselDot} ${i === idx ? styles.carouselDotActive : ""}`} onClick={e => { e.stopPropagation(); setIdx(i); setPrev(null); }} />
        ))}
      </div>
    </div>
  );
}
