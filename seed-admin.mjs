// @ts-nocheck
import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "./drizzle/schema.js";

async function seedAdmin() {
  try {
    const sqlite = new Database('sqlite.db');
    const db = drizzle(sqlite);

    // Admin credentials
    const adminData = {
      openId: "admin-aras-2025",
      name: "Administrateur ARAS",
      email: "admin@aras.local",
      loginMethod: "manual",
      role: "admin",
    };

    // Check if admin already exists
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where((u) => u.openId === adminData.openId);

    if (existingAdmin.length > 0) {
      console.log("✓ Admin account already exists");
      console.log(`  OpenID: ${adminData.openId}`);
      console.log(`  Email: ${adminData.email}`);
      console.log(`  Name: ${adminData.name}`);
    } else {
      // Create admin user
      await db.insert(users).values({
        openId: adminData.openId,
        name: adminData.name,
        email: adminData.email,
        loginMethod: adminData.loginMethod,
        role: "admin",
        lastSignedIn: new Date(),
      });

      console.log("✓ Admin account created successfully!");
      console.log(`\n📋 Admin Credentials:`);
      console.log(`  OpenID: ${adminData.openId}`);
      console.log(`  Email: ${adminData.email}`);
      console.log(`  Name: ${adminData.name}`);
      console.log(`  Role: Admin`);
      console.log(`\n⚠️  Important: Use the Manus OAuth login system to access the admin panel.`);
      console.log(`  Admin Panel URL: /admin`);
    }

    // connection.end() not needed for better-sqlite3 as process exit handles it, or verify explicit close.
    // sqlite.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
