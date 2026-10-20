// Creates the first admin account (there is no public registration).
// Dev:  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='secret123' pnpm create-admin
// Prod: pnpm build && ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm create-admin:prod
// Safe to re-run: does nothing if the email already exists.
import "dotenv/config";
import argon2 from "argon2";
import mongoose from "mongoose";
import User from "../module/users/user.model.js";
import { createUserSchema } from "../module/users/user.schema.js";

const run = async () => {
  const parsed = createUserSchema.safeParse({
    firstName: process.env.ADMIN_FIRST_NAME ?? "Admin",
    lastName: process.env.ADMIN_LAST_NAME ?? "User",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });
  if (!parsed.success) {
    console.error(parsed.error.issues.map((i) => i.message).join("\n"));
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI!);
  try {
    if (await User.exists({ email: parsed.data.email })) {
      console.log("Admin already exists, nothing to do");
      return;
    }
    const password = await argon2.hash(parsed.data.password);
    await User.create({ ...parsed.data, password });
    console.log(`Admin created: ${parsed.data.email}`);
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
