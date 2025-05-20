import { mutation } from "@/convex/_generated/server";
import {
  agentImages,
  galleryImages,
  propertiesImages,
  reviewImages,
} from "../lib/data";
import { QueryCtx } from "@/convex/_generated/server";

// Helper function to get random items from an array
function getRandomSubset<T>(
  array: T[],
  minItems: number,
  maxItems: number
): T[] {
  if (minItems > maxItems) {
    throw new Error("minItems cannot be greater than maxItems");
  }
  if (minItems < 0 || maxItems > array.length) {
    throw new Error(
      "minItems or maxItems are out of valid range for the array"
    );
  }

  // Generate a random size for the subset within the range [minItems, maxItems]
  const subsetSize =
    Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

  // Create a copy of the array to avoid modifying the original
  const arrayCopy = [...array];

  // Shuffle the array copy using Fisher-Yates algorithm
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[i],
    ];
  }

  // Return the first `subsetSize` elements of the shuffled array
  return arrayCopy.slice(0, subsetSize);
}

// Property types and facilities
const propertyTypes = [
  "House",
  "Townhouse",
  "Apartment",
  "Condo",
  "Villa",
  "Duplex",
  "Studio",
  "Other",
];

const facilities = ["Gym", "Parking", "Laundry", "WiFi", "Pet Friendly"];

// Helper function to clear a collection
async function clearCollection(ctx: any, tableName: string) {
  const items = await ctx.db.query(tableName).collect();
  for (const item of items) {
    await ctx.db.delete(item._id);
  }
}

// Regular async function for seeding data
async function seedData(ctx: any) {
  // Clear existing data from all collections
  await clearCollection(ctx, "agents");
  await clearCollection(ctx, "properties");
  await clearCollection(ctx, "galleries");
  await clearCollection(ctx, "reviews");

  console.log("Cleared all existing data.");

  // Seed Agents
  const agentIds = [];
  for (let i = 1; i <= 5; i++) {
    const agentId = await ctx.db.insert("agents", {
      name: `Agent ${i}`,
      email: `agent${i}@example.com`,
      imageUrl: agentImages[Math.floor(Math.random() * agentImages.length)],
    });
    agentIds.push(agentId);
  }
  console.log(`Seeded ${agentIds.length} agents.`);

  // Seed Properties
  const propertyIds = [];
  for (let i = 1; i <= 20; i++) {
    const agentId = agentIds[Math.floor(Math.random() * agentIds.length)];

    // Select 1-5 random facilities
    const selectedFacilities = getRandomSubset(facilities, 1, 5) as any[];
    const propertyType =
      propertyTypes[Math.floor(Math.random() * propertyTypes.length)];

    const imageIndex =
      i < propertiesImages.length
        ? i
        : Math.floor(Math.random() * propertiesImages.length);
    const image = propertiesImages[imageIndex];

    // Create a price as BigInt for v.int64() validator
    const price = BigInt(Math.floor(Math.random() * 9000) + 1000);

    const propertyId = await ctx.db.insert("properties", {
      agentId,
      name: `Property ${i}`,
      type: propertyType as any,
      description: `This is the description for Property ${i}. A beautiful ${propertyType} with amazing views and modern amenities.`,
      address: `123 Property Street, City ${i}`,
      price, // Using BigInt for int64
      area: Math.floor(Math.random() * 3000) + 500,
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathroom: Math.floor(Math.random() * 5) + 1,
      rating: parseFloat((Math.random() * 4 + 1).toFixed(1)), // Rating between 1.0 and 5.0
      facilities: selectedFacilities,
      imageUrl: image,
      geoLocation: `${(Math.random() * 180 - 90).toFixed(6)}, ${(Math.random() * 360 - 180).toFixed(6)}`,
    });
    propertyIds.push(propertyId);
  }
  console.log(`Seeded ${propertyIds.length} properties.`);

  // Seed Reviews
  const reviewCount = 50; // Total number of reviews to create
  let createdReviews = 0;

  for (const propertyId of propertyIds) {
    // Add 2-5 reviews per property
    const reviewsPerProperty = Math.floor(Math.random() * 4) + 2;

    for (
      let i = 0;
      i < reviewsPerProperty && createdReviews < reviewCount;
      i++
    ) {
      await ctx.db.insert("reviews", {
        name: `Reviewer ${createdReviews + 1}`,
        imageUrl: reviewImages[Math.floor(Math.random() * reviewImages.length)],
        review: `This is a review of the property. The location was ${["perfect", "excellent", "convenient", "good", "decent"][Math.floor(Math.random() * 5)]} and the amenities were ${["amazing", "great", "good", "satisfactory", "adequate"][Math.floor(Math.random() * 5)]}.`,
        rating: parseFloat((Math.random() * 4 + 1).toFixed(1)), // Rating between 1.0 and 5.0
        propertyId,
      });
      createdReviews++;
    }
  }
  console.log(`Seeded ${createdReviews} reviews.`);

  // Seed Galleries
  let galleryCount = 0;
  for (const propertyId of propertyIds) {
    // Add 3-6 gallery images per property
    const imagesPerProperty = Math.floor(Math.random() * 4) + 3;
    const selectedImages = getRandomSubset(
      galleryImages,
      imagesPerProperty,
      imagesPerProperty
    );

    for (const image of selectedImages) {
      await ctx.db.insert("galleries", {
        imageUrl: image,
        propertyId,
      });
      galleryCount++;
    }
  }
  console.log(`Seeded ${galleryCount} gallery images.`);

  return {
    agents: agentIds.length,
    properties: propertyIds.length,
    reviews: createdReviews,
    galleries: galleryCount,
  };
}

// Function to run the seeding process - the main mutation to be called
export const runSeed = mutation({
  handler: async (ctx) => {
    return await seedData(ctx);
  },
});

export const backfillSearchText = mutation({
  handler: async (ctx) => {
    // Fetch all properties
    const properties = await ctx.db.query("properties").collect();

    for (const property of properties) {
      // Compute searchText
      const searchText = [property.name, property.address, property.type]
        .join(" ")
        .toLowerCase();

      // Only update if searchText is missing or incorrect
      if (property.searchText !== searchText) {
        await ctx.db.patch(property._id, { searchText });
      }
    }
    return "Backfill complete!";
  },
});

export const backFillingFeaturedAndRecommended = mutation({
  handler: async (ctx) => {
    const properties = await ctx.db.query("properties").collect();

    let randomArrayRecommended = getRandomSubset(properties, 5, 15);

    for (let property of randomArrayRecommended) {
      await ctx.db.patch(property._id, { isRecommended: true });
    }

    return "Backfill complete!";
  },
});
