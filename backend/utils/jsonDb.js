import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '../data/db.json');

// Ensure data folder exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial default state
const initialData = {
  users: [],
  products: [
  {
    "id": "prod-1",
    "title": "iPhone 16 Pro Max",
    "description": "Featuring a stunning titanium design, the new Camera Control, and the ultra-powerful A18 Pro chip for high-end intelligence.",
    "category": "electronics",
    "price": 239000,
    "discount": 5,
    "stock": 15,
    "images": [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-2",
    "title": "Samsung Galaxy S26 Ultra",
    "description": "Experience the ultimate smartphone camera with 200MP, Galaxy AI features, and built-in S Pen inside a sleek armor aluminum frame.",
    "category": "electronics",
    "price": 259000,
    "discount": 10,
    "stock": 20,
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-13",
    "title": "MacBook Pro M5 Max",
    "description": "Unprecedented speed and graphics capability with the revolutionary M5 Max chip, 120Hz Liquid Retina XDR screen, and 30-hour battery life.",
    "category": "electronics",
    "price": 499000,
    "discount": 8,
    "stock": 10,
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-14",
    "title": "Dell XPS 15 OLED Laptop",
    "description": "Stunning 3.5K OLED InfinityEdge touch screen powered by Intel Core i9 processor, NVIDIA GeForce RTX graphics, and CNC aluminum casing.",
    "category": "electronics",
    "price": 359000,
    "discount": 12,
    "stock": 12,
    "images": [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-23",
    "title": "Sony WH-1000XM6 Headphones",
    "description": "Industry-leading active noise cancellation, smart adaptive sound control, 45 hours battery life, and crystal-clear high-resolution audio.",
    "category": "electronics",
    "price": 80000,
    "discount": 15,
    "stock": 35,
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-25",
    "title": "Pro Sound Max Wireless Headphones",
    "description": "Experience premium sound quality with active noise cancellation, 40-hour battery life, and comfortable memory foam earcups.",
    "category": "electronics",
    "price": 38000,
    "discount": 10,
    "stock": 25,
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-26",
    "title": "Minimalist Leather Smart Watch",
    "description": "A sleek, premium smart watch with heart rate tracking, fitness features, and a hand-crafted genuine leather band.",
    "category": "electronics",
    "price": 50000,
    "discount": 15,
    "stock": 15,
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-7",
    "title": "Ultra Vision 4K Smart Projector",
    "description": "Transform your living room into a premium home cinema with 5000 lumens, HDR10 support, and built-in Android OS.",
    "category": "electronics",
    "price": 120000,
    "discount": 20,
    "stock": 8,
    "images": [
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-27",
    "title": "Horizon Wireless Charging Pad",
    "description": "Sleek aluminum wireless charger wrapped in genuine Italian leather. Multi-device compatible with fast charging capabilities.",
    "category": "electronics",
    "price": 15000,
    "discount": 0,
    "stock": 80,
    "images": [
      "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.5,
    "reviews": []
  },
  {
    "id": "prod-28",
    "title": "StudioPro Mechanical Keyboard",
    "description": "Hot-swappable custom mechanical keyboard with gasket-mounted design, pre-lubed linear switches, and triple-mode wireless connectivity.",
    "category": "electronics",
    "price": 36000,
    "discount": 10,
    "stock": 30,
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-3",
    "title": "Classic Cotton Bomber Jacket",
    "description": "Premium cotton bomber jacket designed for comfort and style. Water-resistant outer shell with thermal inner lining.",
    "category": "fashion",
    "price": 18000,
    "discount": 10,
    "stock": 50,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.5,
    "reviews": []
  },
  {
    "id": "prod-8",
    "title": "Urban Fit Waterproof Backpack",
    "description": "An elegant, anti-theft laptop backpack with integrated USB charging port, card slots, and waterproof fabric lining.",
    "category": "fashion",
    "price": 15000,
    "discount": 5,
    "stock": 40,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-15",
    "title": "Sartorial Wool Blend Trench Coat",
    "description": "An elegant, double-breasted trench coat tailored from a premium heavyweight wool blend. Features classic lapels and adjustable waist belt.",
    "category": "fashion",
    "price": 44000,
    "discount": 15,
    "stock": 25,
    "images": [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-16",
    "title": "ActiveDry Premium Athletic Hoodie",
    "description": "Engineered for training and leisure. High-performance, moisture-wicking fabric with four-way stretch and zippered utility pockets.",
    "category": "fashion",
    "price": 16000,
    "discount": 0,
    "stock": 60,
    "images": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.5,
    "reviews": []
  },
  {
    "id": "prod-24",
    "title": "Chrono Classic Gold Pocket Watch",
    "description": "Exquisite hand-wound mechanical pocket watch finished in polished 18k gold plating. Visible skeleton dial movements.",
    "category": "fashion",
    "price": 70000,
    "discount": 25,
    "stock": 10,
    "images": [
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-29",
    "title": "Premium Minimalist Sneakers",
    "description": "Clean, low-top sneakers crafted from full-grain leather, featuring a comfortable OrthoLite insole and custom durable rubber cupsole.",
    "category": "fashion",
    "price": 26000,
    "discount": 10,
    "stock": 30,
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-30",
    "title": "Leather Chelsea Boots",
    "description": "Handcrafted suede Chelsea boots featuring elasticated side panels, custom pull tabs, and robust Goodyear welted soles.",
    "category": "fashion",
    "price": 38000,
    "discount": 0,
    "stock": 20,
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-31",
    "title": "Designer Sunglasses Aviator",
    "description": "Classic aviator sunglasses featuring polarized scratch-resistant lenses, a lightweight titanium frame, and 100% UV protection.",
    "category": "fashion",
    "price": 30000,
    "discount": 15,
    "stock": 35,
    "images": [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.5,
    "reviews": []
  },
  {
    "id": "prod-32",
    "title": "Cashmere Scarf Charcoal",
    "description": "Luxurious, lightweight scarf woven from 100% pure Himalayan cashmere. Unmatched softness and warmth for cold seasons.",
    "category": "fashion",
    "price": 15000,
    "discount": 5,
    "stock": 45,
    "images": [
      "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-33",
    "title": "Tailored Slim Fit Suit",
    "description": "Premium Italian wool two-piece suit. Perfect tailoring featuring modern slim lapels, dual vents, and breathable inner lining.",
    "category": "fashion",
    "price": 100000,
    "discount": 20,
    "stock": 15,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-4",
    "title": "Ergonomic Office Desk Chair",
    "description": "Fully adjustable ergonomic desk chair with breathable mesh back, lumber support, and customizable 3D armrests.",
    "category": "home-living",
    "price": 60000,
    "discount": 10,
    "stock": 10,
    "images": [
      "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-9",
    "title": "Luxe Hand-Poured Soy Candle Set",
    "description": "A premium set of three soy wax candles scented with lavender, sandalwood, and vanilla oak wood essences.",
    "category": "home-living",
    "price": 15000,
    "discount": 0,
    "stock": 35,
    "images": [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-17",
    "title": "Nordic Ceramic Vase Collection",
    "description": "Set of three minimal, matte-finished ceramic vases in earthy tones. Perfect for dried flowers or standalone structural styling.",
    "category": "home-living",
    "price": 15000,
    "discount": 15,
    "stock": 45,
    "images": [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-18",
    "title": "Solace Weighted Bamboo Blanket",
    "description": "Premium cooling weighted blanket woven from organic bamboo fabric and filled with hypoallergenic micro-glass beads.",
    "category": "home-living",
    "price": 28000,
    "discount": 10,
    "stock": 20,
    "images": [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-34",
    "title": "Smart Wi-Fi LED Ambient Lamp",
    "description": "Voice-controlled smart desk lamp featuring 16 million colors, custom presets, schedules, and seamless Apple HomeKit/Google Assistant sync.",
    "category": "home-living",
    "price": 16000,
    "discount": 12,
    "stock": 40,
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-35",
    "title": "Premium Espresso Coffee Machine",
    "description": "Professional-grade 15 bar pressure espresso maker with built-in steam wand for perfect micro-foam lattes and cappuccinos.",
    "category": "home-living",
    "price": 90000,
    "discount": 15,
    "stock": 14,
    "images": [
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-36",
    "title": "Modern Oak Wood Coffee Table",
    "description": "Minimalist Scandinavian design table crafted from solid white oak, featuring built-in storage drawers and hidden wire managers.",
    "category": "home-living",
    "price": 40000,
    "discount": 0,
    "stock": 12,
    "images": [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.5,
    "reviews": []
  },
  {
    "id": "prod-37",
    "title": "Abstract Wall Art Canvas",
    "description": "Premium hand-painted abstract oil canvas depicting natural earth tones. Signed by artist and pre-stretched on a pine wood frame.",
    "category": "home-living",
    "price": 18000,
    "discount": 20,
    "stock": 18,
    "images": [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-38",
    "title": "Ultrasonic Cool Mist Humidifier",
    "description": "Whisper-quiet air humidifier featuring 3L large capacity, automatic dry safety switch-off, and integrated aromatherapy essential oil diffuser.",
    "category": "home-living",
    "price": 15000,
    "discount": 10,
    "stock": 50,
    "images": [
      "https://images.unsplash.com/photo-1519183071298-a2962feb14f4?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-39",
    "title": "Premium Chef Knife Set",
    "description": "High-carbon German steel kitchen knife block set. Hand-sharpened double-bevel blades with ergonomic full-tang handles.",
    "category": "home-living",
    "price": 26000,
    "discount": 5,
    "stock": 25,
    "images": [
      "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-5",
    "title": "Pure Glow Organic Face Oil",
    "description": "Infused with natural rosehip oil, vitamin E, and jojoba extract for clean, hydrated, and radiant skin.",
    "category": "beauty",
    "price": 15000,
    "discount": 0,
    "stock": 100,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-11",
    "title": "Hyaluronic Acid Glow Serum",
    "description": "A concentrated, fast-absorbing hydrating serum that plumps skin, smooths fine lines, and restores hydration.",
    "category": "beauty",
    "price": 15000,
    "discount": 10,
    "stock": 85,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.5,
    "reviews": []
  },
  {
    "id": "prod-19",
    "title": "Botanical Detox Clay Mask",
    "description": "Purifying face mask formulated with French green clay, active charcoal, organic tea tree oil, and soothing aloe extract.",
    "category": "beauty",
    "price": 15000,
    "discount": 0,
    "stock": 120,
    "images": [
      "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-20",
    "title": "Velvet Petal Hydrating Lip Balm",
    "description": "Nourishing lip treatment infused with rich organic shea butter, cold-pressed coconut oil, and a delicate vanilla rose aroma.",
    "category": "beauty",
    "price": 15000,
    "discount": 5,
    "stock": 200,
    "images": [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-40",
    "title": "Radiant Glow Liquid Foundation",
    "description": "Weightless full-coverage liquid foundation featuring hyaluronic acid for a dewy, non-cakey natural finish. 24h wear.",
    "category": "beauty",
    "price": 15000,
    "discount": 15,
    "stock": 90,
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-41",
    "title": "Luxury Makeup Brush Set",
    "description": "12 professional-grade makeup brushes crafted with premium synthetic fibers and sleek birchwood handles in a leather case.",
    "category": "beauty",
    "price": 15000,
    "discount": 20,
    "stock": 60,
    "images": [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-42",
    "title": "Youth Elixir Anti-Aging Cream",
    "description": "Revitalizing night cream loaded with retinol, peptides, and CoQ10 to boost skin firmness and smooth expression lines.",
    "category": "beauty",
    "price": 15000,
    "discount": 10,
    "stock": 40,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-43",
    "title": "Rose Water Hydrating Face Mist",
    "description": "Organic cooling mist formulated with pure Damask rose hydrosol to set makeup, soothe irritation, and revive skin on-the-go.",
    "category": "beauty",
    "price": 15000,
    "discount": 0,
    "stock": 150,
    "images": [
      "https://images.unsplash.com/photo-1556229174-5e42a09e45af?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-6",
    "title": "Advanced Carbon Fiber Road Bike",
    "description": "Ultralight carbon fiber frame with Shimano components, designed for fast road races and weekend mountain adventures.",
    "category": "sports",
    "price": 259000,
    "discount": 10,
    "stock": 5,
    "images": [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.4,
    "reviews": []
  },
  {
    "id": "prod-10",
    "title": "Deep Tissue Muscle Massage Gun",
    "description": "Equipped with 30 speed levels and 6 specialized massage heads to relieve muscle stiffness and accelerate body recovery.",
    "category": "sports",
    "price": 24000,
    "discount": 15,
    "stock": 20,
    "images": [
      "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-12",
    "title": "Vapor Running Shoes v2",
    "description": "Ultralight responsive running shoes engineered with carbon fiber plate inserts and breathable knit mesh.",
    "category": "sports",
    "price": 32000,
    "discount": 10,
    "stock": 12,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-21",
    "title": "Apex Smart Fitness Kettlebell",
    "description": "Dynamic smart kettlebell with adjustable weight selector (10 to 40 lbs) and built-in motion sensors for rep and form tracking via Bluetooth app.",
    "category": "sports",
    "price": 30000,
    "discount": 0,
    "stock": 15,
    "images": [
      "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-22",
    "title": "HydroShield Insulated Water Bottle",
    "description": "Double-walled vacuum insulated stainless steel flask. Keeps beverages ice-cold for up to 24 hours or steaming hot for 12 hours.",
    "category": "sports",
    "price": 15000,
    "discount": 5,
    "stock": 150,
    "images": [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-44",
    "title": "Premium Eco-Friendly Yoga Mat",
    "description": "6mm non-slip thick yoga mat made from certified biodegradable TPE. Dual-sided textures for superior cushioning and grip during workouts.",
    "category": "sports",
    "price": 15000,
    "discount": 12,
    "stock": 70,
    "images": [
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-45",
    "title": "Smart Fitness Tracker Band",
    "description": "Waterproof fitness band monitor featuring heart rate, blood oxygen monitoring, sleep tracking, and real-time smartphone message logs.",
    "category": "sports",
    "price": 18000,
    "discount": 20,
    "stock": 45,
    "images": [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-46",
    "title": "High-Performance Tennis Racket",
    "description": "Unstrung carbon graphite tennis racket designed for professional baseline spin. High responsiveness with custom vibration dampener.",
    "category": "sports",
    "price": 36000,
    "discount": 15,
    "stock": 30,
    "images": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-47",
    "title": "PlayStation 5 Pro Console",
    "description": "Play your favorite PS5 games with enhanced ray tracing, advanced SSD loading speeds, and immersive 3D spatial audio.",
    "category": "gaming",
    "price": 140000,
    "discount": 5,
    "stock": 10,
    "images": [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-48",
    "title": "Xbox Series X Elite Bundle",
    "description": "The fastest, most powerful Xbox ever. Includes Xbox Wireless Controller Series 2, 1TB SSD custom chip, and Game Pass access.",
    "category": "gaming",
    "price": 110000,
    "discount": 10,
    "stock": 12,
    "images": [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-49",
    "title": "Pro Wireless Gaming Mouse",
    "description": "25k DPI optical sensor mouse featuring sub-micron movement tracking, custom programmable macros, and lightspeed wireless latency.",
    "category": "gaming",
    "price": 26000,
    "discount": 15,
    "stock": 50,
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-50",
    "title": "RGB Gasket Mechanical Keyboard",
    "description": "Hot-swappable custom linear switch gaming keyboard with gasket mounting, sound dampening foam, and customizable 16.8M RGB backlighting.",
    "category": "gaming",
    "price": 30000,
    "discount": 10,
    "stock": 35,
    "images": [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-51",
    "title": "Surround Sound Gaming Headset",
    "description": "DTS Headphone:X 2.0 7.1 surround sound headset featuring 50mm premium drivers, flip-to-mute mic, and comfortable memory foam cups.",
    "category": "gaming",
    "price": 20000,
    "discount": 20,
    "stock": 40,
    "images": [
      "https://images.unsplash.com/photo-1599669454699-248893623440?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-52",
    "title": "Premium Ergonomic Gaming Desk",
    "description": "Large Carbon fiber texture desktop featuring integrated cable management net, headset hooks, cup holder, and heavy-duty steel frame.",
    "category": "gaming",
    "price": 50000,
    "discount": 0,
    "stock": 15,
    "images": [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.5,
    "reviews": []
  },
  {
    "id": "prod-53",
    "title": "Titanium Automatic Chronograph Watch",
    "description": "Exquisite automatic timepiece featuring a lightweight titanium case, scratch-resistant sapphire crystal, and high-precision mechanical movement.",
    "category": "accessories",
    "price": 120000,
    "discount": 10,
    "stock": 15,
    "images": [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-54",
    "title": "Luxury Minimalist Leather Wallet",
    "description": "Slim bi-fold wallet handcrafted from full-grain Italian leather, featuring RFID blocking technology and multiple card slots.",
    "category": "accessories",
    "price": 15000,
    "discount": 5,
    "stock": 120,
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-55",
    "title": "Classic Aviator Polarized Sunglasses",
    "description": "Timeless aviator sunglasses with polarized UV400 lenses, lightweight stainless steel frames, and comfortable silicone nose pads.",
    "category": "accessories",
    "price": 26000,
    "discount": 15,
    "stock": 80,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-56",
    "title": "Italian Leather Briefcase",
    "description": "Sophisticated professional briefcase made from hand-stained vegetable-tanned leather, featuring padded laptop sleeve and adjustable strap.",
    "category": "accessories",
    "price": 50000,
    "discount": 8,
    "stock": 25,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-57",
    "title": "Gold-Plated Cufflinks & Tie Bar Set",
    "description": "Premium brass cufflinks and matching tie bar finished with polished 18k yellow gold plating. Comes in an elegant velvet gift box.",
    "category": "accessories",
    "price": 16000,
    "discount": 0,
    "stock": 40,
    "images": [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-58",
    "title": "Executive Walnut Desk Organizer",
    "description": "Solid American walnut organizer tray with designated spaces for smartphones, writing utensils, paper clips, and luxury pens.",
    "category": "office",
    "price": 18000,
    "discount": 10,
    "stock": 50,
    "images": [
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-59",
    "title": "Sleek Aluminum Laptop Stand",
    "description": "Ergonomic notebook riser constructed from sandblasted anodized aluminum, designed to match Apple laptops and promote optimal cooling.",
    "category": "office",
    "price": 15000,
    "discount": 0,
    "stock": 110,
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-60",
    "title": "Smart Writing Set & Digital Notebook",
    "description": "Digitize your handwritten notes in real-time. Includes active smart pen, specially coded paper notebook, and companion synchronization app.",
    "category": "office",
    "price": 40000,
    "discount": 12,
    "stock": 30,
    "images": [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-61",
    "title": "Dimmable LED Screen Monitor Light Bar",
    "description": "Asymmetric optical design illuminates only your desk space without creating screen glare. Features touch controls and adjustable color temperatures.",
    "category": "office",
    "price": 15000,
    "discount": 5,
    "stock": 65,
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-62",
    "title": "Acoustic Desk Privacy Divider Panel",
    "description": "Sound-absorbing polyester fiber desk divider, reducing ambient workspace noise and enhancing visual boundaries in home offices.",
    "category": "office",
    "price": 24000,
    "discount": 15,
    "stock": 18,
    "images": [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.5,
    "reviews": []
  }
],
  orders: [],
  carts: {},
  wishlists: {}
};

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

export const readDb = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return initialData;
  }
};

export const writeDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};
