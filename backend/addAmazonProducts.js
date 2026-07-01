import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');
const jsonDbPath = path.join(process.cwd(), 'utils', 'jsonDb.js');

const amazonProducts = [
  {
    "id": "prod-amazon-1",
    "title": "Amazon Echo Dot (5th Gen) Smart Speaker",
    "description": "Compact smart speaker with Alexa featuring vibrant sound, motion detection, and ambient temperature sensor integrations.",
    "category": "electronics",
    "price": 8500,
    "discount": 10,
    "stock": 45,
    "images": [
      "https://images.unsplash.com/photo-1543510473-ac2c35329a28?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-amazon-2",
    "title": "Kindle Paperwhite (16 GB) E-reader",
    "description": "6.8\" glare-free paperwhite display with adjustable warm light, up to 10 weeks of battery life, and IPX8 waterproof casing.",
    "category": "electronics",
    "price": 24500,
    "discount": 5,
    "stock": 30,
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-amazon-3",
    "title": "Sony Alpha 7 IV Mirrorless Camera",
    "description": "Full-frame hybrid mirrorless camera featuring a 33MP Exmor R sensor, advanced real-time autofocus tracking, and professional 4K video recording.",
    "category": "electronics",
    "price": 389000,
    "discount": 5,
    "stock": 8,
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-amazon-4",
    "title": "Anker 737 140W Fast Charger Power Bank",
    "description": "Ultra-high capacity 24,000mAh external battery pack featuring a smart digital power display and multi-port charging distribution.",
    "category": "electronics",
    "price": 28500,
    "discount": 15,
    "stock": 50,
    "images": [
      "https://images.unsplash.com/photo-1609592424085-f5df2369656b?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-amazon-5",
    "title": "Bose QuietComfort Ultra Wireless Earbuds",
    "description": "World-class active noise canceling wireless earbuds with CustomTune audio profiling technology and groundbreaking immersive spatial audio.",
    "category": "electronics",
    "price": 46500,
    "discount": 8,
    "stock": 25,
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-amazon-6",
    "title": "Levi's Men's 511 Slim Jeans",
    "description": "Classic, tailored slim-cut raw indigo denim jeans crafted from premium stretch cotton twill for all-day comfort.",
    "category": "fashion",
    "price": 12500,
    "discount": 10,
    "stock": 60,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.5,
    "reviews": []
  },
  {
    "id": "prod-amazon-7",
    "title": "Ray-Ban Classic Wayfarer Sunglasses",
    "description": "Iconic, hand-polished black acetate sunglasses featuring robust green G-15 crystal lenses for 100% UV protection.",
    "category": "fashion",
    "price": 26500,
    "discount": 5,
    "stock": 20,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-amazon-8",
    "title": "Adidas Ultraboost Light Performance Sneakers",
    "description": "High-performance sportswear running sneakers constructed with ultra-lightweight Boost midsoles and breathable Primeknit mesh uppers.",
    "category": "fashion",
    "price": 31500,
    "discount": 12,
    "stock": 40,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-amazon-9",
    "title": "Tommy Hilfiger Leather Ranger Wallet",
    "description": "Hand-stitched genuine cowhide leather wallet showcasing signature ribbon inlays, multiple card slots, and integrated bill dividers.",
    "category": "fashion",
    "price": 7500,
    "discount": 10,
    "stock": 70,
    "images": [
      "https://images.unsplash.com/photo-1627124118303-624c8f5d2d4d?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.4,
    "reviews": []
  },
  {
    "id": "prod-amazon-10",
    "title": "Dyson Airwrap Multi-Styler Complete Edition",
    "description": "Curated luxury styling kit that utilizes custom aerodynamic Coanda airflow physics to curl, wave, smooth, and dry hair safely.",
    "category": "beauty",
    "price": 98500,
    "discount": 5,
    "stock": 15,
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-amazon-11",
    "title": "CeraVe Hydrating Gentle Facial Cleanser",
    "description": "Daily non-foaming facial wash packed with 3 essential skin ceramides and hyaluronic acid to preserve protective barriers.",
    "category": "beauty",
    "price": 3800,
    "discount": 5,
    "stock": 120,
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-amazon-12",
    "title": "The Ordinary Niacinamide 10% Zinc Serum",
    "description": "Mineral-rich blemish formula optimized with high concentration niacinamide and zinc to target skin congestion and visible pores.",
    "category": "beauty",
    "price": 2800,
    "discount": 0,
    "stock": 150,
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-amazon-13",
    "title": "L'Oreal Paris Telescopic Lengthening Mascara",
    "description": "Classic lash-defining mascara equipped with a flexible, high-precision brush comb for dramatic telescopic length.",
    "category": "beauty",
    "price": 3200,
    "discount": 10,
    "stock": 80,
    "images": [
      "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.5,
    "reviews": []
  },
  {
    "id": "prod-amazon-14",
    "title": "Laneige Lip Sleeping Mask (Berry Essence)",
    "description": "Premium leave-on lip treatment formulated with powerful antioxidants, vitamin C, and rich coconut butter elements.",
    "category": "beauty",
    "price": 4800,
    "discount": 5,
    "stock": 90,
    "images": [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-amazon-15",
    "title": "Instant Pot Duo Plus 9-in-1 Cooker",
    "description": "Electric pressure cooker combining robust slow cooking, steaming, sauteing, sterilizing, and sous vide options in a sleek pot.",
    "category": "home",
    "price": 28500,
    "discount": 15,
    "stock": 30,
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-amazon-16",
    "title": "Keurig K-Elite Single-Serve Brewer",
    "description": "Single cup pod brewer featuring customizable brew strengths, hot water controls, and an extra-large 75oz water reservoir.",
    "category": "home",
    "price": 32000,
    "discount": 10,
    "stock": 18,
    "images": [
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.6,
    "reviews": []
  },
  {
    "id": "prod-amazon-17",
    "title": "Ninja Professional Plus Blender 1400W",
    "description": "Heavy-duty countertop blender with Auto-iQ programs and total crushing blades to pulverize ice and frozen fruits instantly.",
    "category": "home",
    "price": 24500,
    "discount": 8,
    "stock": 22,
    "images": [
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.7,
    "reviews": []
  },
  {
    "id": "prod-amazon-18",
    "title": "Philips Hue White & Color Smart LED Kit",
    "description": "Set of three dimmable light bulbs with wireless control capabilities via the included smart Hue hub controller unit.",
    "category": "home",
    "price": 34000,
    "discount": 12,
    "stock": 35,
    "images": [
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.5,
    "reviews": []
  },
  {
    "id": "prod-amazon-19",
    "title": "iRobot Roomba j7+ Self-Emptying Vacuum",
    "description": "Self-emptying smart robot vacuum featuring advanced camera-based object avoidance, custom map scheduling, and high suction.",
    "category": "home",
    "price": 125000,
    "discount": 20,
    "stock": 10,
    "images": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-amazon-20",
    "title": "Yeti Rambler 30 oz Insulated Tumbler",
    "description": "Premium travel mug made of double-walled food grade stainless steel, finished with sweat-free powder coating layers.",
    "category": "home",
    "price": 9500,
    "discount": 5,
    "stock": 100,
    "images": [
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  }
];

// Append to db.json
if (fs.existsSync(dbPath)) {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const existingIds = new Set(dbData.products.map(p => p.id));
  const filteredNew = amazonProducts.filter(p => !existingIds.has(p.id));
  dbData.products.push(...filteredNew);
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
  console.log(`Successfully added ${filteredNew.length} Amazon products to db.json!`);
}

// Append to jsonDb.js
if (fs.existsSync(jsonDbPath)) {
  let content = fs.readFileSync(jsonDbPath, 'utf8');
  const newProductsStr = amazonProducts.map(p => JSON.stringify(p, null, 4)).join(',\n    ') + ',\n    ';
  content = content.replace(/"products":\s*\[/, `"products": [\n    ${newProductsStr}`);
  fs.writeFileSync(jsonDbPath, content);
  console.log(`Successfully appended products to jsonDb.js default state.`);
}
