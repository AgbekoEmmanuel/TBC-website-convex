import { ConvexHttpClient } from "convex/browser";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL);

const books = [
  {
    title: "Breaking Mediocrity",
    price: 100,
    desc: "An invitation to the contemplative life, exploring the silence that precedes the Word.",
    imgFile: "BREAKING MID.png"
  },
  {
    title: "Come Boldly",
    price: 100,
    desc: "Understanding the cadence of the Spirit in our daily labor and intentional rest.",
    imgFile: "photo_2026-04-21_22-32-55.jpg"
  },
  {
    title: "The Leadership Principles of Jesus",
    price: 100,
    desc: "A deep dive into ancient practices for the digital age. Reclaiming our sacred habits.",
    imgFile: "photo_2026-04-21_22-33-15.jpg"
  },
  {
    title: "The Force of Mentorship",
    price: 100,
    desc: "Building a life of impact through intentional faith and community leadership.",
    imgFile: "BREAKING MID.png"
  },
  {
    title: "Kingdom Prosperity",
    price: 100,
    desc: "Daily meditations for the modern seeker found in the quiet moments of dawn.",
    imgFile: "photo_2026-04-21_22-32-55.jpg"
  }
];

async function seed() {
  console.log("Seeding books to Convex...");
  for (const book of books) {
    console.log(`Processing: ${book.title}`);
    
    // 1. Get upload URL
    const uploadUrl = await client.mutation("storage:generateUploadUrl");

    // 2. Read image
    const imgPath = path.join(process.cwd(), "apps/website/src/assets/books", book.imgFile);
    if (!fs.existsSync(imgPath)) {
      console.error(`Image not found: ${imgPath}`);
      continue;
    }
    const buffer = fs.readFileSync(imgPath);
    const mimeType = book.imgFile.endsWith('.png') ? 'image/png' : 'image/jpeg';

    // 3. Upload file
    const uploadResult = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": mimeType },
      body: buffer,
    });
    const { storageId } = await uploadResult.json();

    // 4. Get URL for the uploaded file
    const imageUrl = await client.query("storage:getUrl", { storageId });

    // 5. Create product
    await client.mutation("products:create", {
      title: book.title,
      slug: book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: book.desc,
      price: book.price,
      category: "Books",
      imageStorageId: storageId,
      imageUrl: imageUrl,
      inStock: true,
      isPublished: true,
    });
    
    console.log(`Successfully added: ${book.title}`);
  }
  console.log("Done seeding.");
}

seed().catch(console.error);
