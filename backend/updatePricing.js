import fs from 'fs';
import path from 'path';

const jsonDbPath = path.join(process.cwd(), 'utils', 'jsonDb.js');
let jsonDbContent = fs.readFileSync(jsonDbPath, 'utf8');

// The file has a hardcoded array of products. We will replace the prices using a regex.
jsonDbContent = jsonDbContent.replace(/"price":\s*([\d.]+)/g, (match, price) => {
  let oldPrice = parseFloat(price);
  // Scale price to NPR and add luxury premium (approx $1 = Rs 133, but we add a massive premium for luxury)
  let newPrice = Math.round((oldPrice * 133 * 1.5) / 1000) * 1000;
  // Make sure minimum price is at least 15,000 for luxury feel
  if (newPrice < 15000) newPrice = 15000;
  return `"price": ${newPrice}`;
});

// Add new categories to the JSON string before it ends
const newProducts = [
  {
    "id": "prod-100",
    "title": "Rolex Submariner Date",
    "description": "Oystersteel and 18 kt yellow gold with a Cerachrom bezel insert in blue ceramic and a royal blue dial.",
    "category": "jewelry",
    "price": 2450000,
    "discount": 0,
    "stock": 3,
    "images": [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 5.0,
    "reviews": []
  },
  {
    "id": "prod-101",
    "title": "Cartier Love Bracelet",
    "description": "18K yellow gold iconic love bracelet. A universal symbol of love and commitment.",
    "category": "jewelry",
    "price": 850000,
    "discount": 0,
    "stock": 5,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  },
  {
    "id": "prod-102",
    "title": "Abstract Horizon Canvas",
    "description": "Original hand-painted oil on canvas by an acclaimed independent artist. 48x60 inches.",
    "category": "art",
    "price": 1200000,
    "discount": 0,
    "stock": 1,
    "images": [
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.8,
    "reviews": []
  },
  {
    "id": "prod-103",
    "title": "Limited Edition Designer Sneakers",
    "description": "Extremely rare collaborative designer sneakers. Premium Italian leather with unique hand-painted accents.",
    "category": "footwear",
    "price": 280000,
    "discount": 0,
    "stock": 12,
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80"
    ],
    "ratings": 4.9,
    "reviews": []
  }
];

// Insert new products into the array
const newProductsString = newProducts.map(p => JSON.stringify(p, null, 4)).join(',\n  ') + ',\n  ';
jsonDbContent = jsonDbContent.replace(/"products":\s*\[/, `"products": [\n  ${newProductsString}`);

fs.writeFileSync(jsonDbPath, jsonDbContent);
console.log('Successfully updated jsonDb.js with luxury pricing and new products.');

// Also update db.json if it exists
const dbPath = path.join(process.cwd(), 'data', 'db.json');
if (fs.existsSync(dbPath)) {
  const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  dbContent.products.forEach(p => {
    let oldPrice = parseFloat(p.price);
    let newPrice = Math.round((oldPrice * 133 * 1.5) / 1000) * 1000;
    if (newPrice < 15000) newPrice = 15000;
    p.price = newPrice;
  });
  dbContent.products.push(...newProducts);
  fs.writeFileSync(dbPath, JSON.stringify(dbContent, null, 2));
  console.log('Successfully updated db.json directly.');
}

