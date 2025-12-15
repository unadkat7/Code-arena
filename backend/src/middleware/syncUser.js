import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/User.model.js";

export const syncUser = async (req, res, next) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return next();

    // Check if user already exists
    let user = await User.findOne({ clerkId: clerkUserId });
    if (user) return next();

    // Fetch user from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    console.log("req.auth:", req.auth);


    await User.create({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`,
      profileImage: clerkUser.imageUrl,
    });

    console.log("✅ User synced:", clerkUser.id);
    next();
  } catch (err) {
    console.error("❌ User sync failed:", err);
    next(); // do not block request
  }
};
