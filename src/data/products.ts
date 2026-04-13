import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  fabric: string;
  occasion: string;
  description: string;
  careInstructions: string;
  fit: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Teal Embroidered Silk Kurti",
    price: 2499,
    originalPrice: 3999,
    image: product1,
    images: [product1, product1, product1, product1],
    category: "Kurtis",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Teal", "Navy"],
    fabric: "Silk Blend",
    occasion: "Festive",
    description: "Exquisite teal silk kurti adorned with intricate gold block print embroidery. Perfect for festive occasions and celebrations.",
    careInstructions: "Dry clean only. Store in a cool, dry place.",
    fit: "Regular Fit",
    isNew: true,
    inStock: true,
  },
  {
    id: "2",
    name: "Dusty Pink Anarkali Dress",
    price: 3999,
    originalPrice: 5999,
    image: product2,
    images: [product2, product2, product2, product2],
    category: "Ethnic Dresses",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Dusty Pink", "Peach"],
    fabric: "Georgette",
    occasion: "Wedding",
    description: "Stunning dusty pink anarkali dress with delicate silver embroidery work. A showstopper for weddings and grand celebrations.",
    careInstructions: "Dry clean only.",
    fit: "Flared Fit",
    isBestSeller: true,
    inStock: true,
  },
  {
    id: "3",
    name: "Navy Embroidered Set with Dupatta",
    price: 4499,
    originalPrice: 6499,
    image: product3,
    images: [product3, product3, product3, product3],
    category: "Ethnic Sets with Dupatta",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy Blue"],
    fabric: "Rayon",
    occasion: "Festive",
    description: "Elegant navy blue kurta set with matching palazzo and dupatta. Gold embroidery adds a touch of luxury.",
    careInstructions: "Machine wash cold. Do not bleach.",
    fit: "Relaxed Fit",
    isNew: true,
    isBestSeller: true,
    inStock: true,
  },
  {
    id: "4",
    name: "Olive Block Print Cotton Kurti",
    price: 1499,
    originalPrice: 2199,
    image: product4,
    images: [product4, product4, product4, product4],
    category: "Kurtis",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Olive Green"],
    fabric: "Cotton",
    occasion: "Casual",
    description: "Comfortable olive green cotton kurti with beautiful block print pattern. Perfect for everyday elegance.",
    careInstructions: "Machine wash cold. Tumble dry low.",
    fit: "Regular Fit",
    inStock: true,
  },
  {
    id: "5",
    name: "Ivory Chikankari Kurti",
    price: 2999,
    originalPrice: 4499,
    image: product5,
    images: [product5, product5, product5, product5],
    category: "Kurtis",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ivory", "White"],
    fabric: "Cotton",
    occasion: "Casual",
    description: "Timeless ivory chikankari kurti with delicate hand embroidery. A wardrobe essential for the modern woman.",
    careInstructions: "Hand wash recommended. Do not wring.",
    fit: "Straight Fit",
    isBestSeller: true,
    inStock: true,
  },
  {
    id: "6",
    name: "Mustard Printed Ethnic Dress",
    price: 2799,
    originalPrice: 3999,
    image: product6,
    images: [product6, product6, product6, product6],
    category: "Ethnic Dresses",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Mustard Yellow"],
    fabric: "Rayon",
    occasion: "Casual",
    description: "Vibrant mustard yellow ethnic dress with intricate print details. Perfect for brunches and casual outings.",
    careInstructions: "Machine wash cold.",
    fit: "A-Line Fit",
    isNew: true,
    inStock: true,
  },
  {
    id: "7",
    name: "Purple Silk Kurta Set with Dupatta",
    price: 5499,
    originalPrice: 7999,
    image: product7,
    images: [product7, product7, product7, product7],
    category: "Ethnic Sets with Dupatta",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Purple"],
    fabric: "Silk",
    occasion: "Wedding",
    description: "Regal deep purple silk kurta set with matching dupatta and palazzo. Exquisite gold embroidery for a luxurious look.",
    careInstructions: "Dry clean only.",
    fit: "Regular Fit",
    isBestSeller: true,
    inStock: true,
  },
  {
    id: "8",
    name: "Rust Orange Handblock Kurti",
    price: 1799,
    originalPrice: 2499,
    image: product8,
    images: [product8, product8, product8, product8],
    category: "Kurtis",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Rust Orange"],
    fabric: "Cotton",
    occasion: "Casual",
    description: "Beautiful rust orange kurti with handblock print work. A blend of tradition and contemporary style.",
    careInstructions: "Machine wash cold. Do not bleach.",
    fit: "Regular Fit",
    isNew: true,
    inStock: true,
  },
];

export const categories = [
  "Kurtis",
  "Ethnic Dresses",
  "Ethnic Sets with Dupatta",
  "Ethnic Sets",
  "Co-ord Sets",
  "Festive Collection",
  "New Arrivals",
  "Best Sellers",
];
