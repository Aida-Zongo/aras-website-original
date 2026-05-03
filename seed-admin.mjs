// @ts-nocheck
import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not defined");
    }

    const connection = await mysql.createConnection({
      uri: databaseUrl,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      }
    });
    const db = drizzle(connection);

    // Admin credentials
    const adminData = {
      openId: "admin-aras-2025",
      name: "Administrateur ARAS",
      email: "admin@aras.local",
      loginMethod: "manual",
      role: "admin",
    };

    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.openId, adminData.openId));

    if (existingAdmin.length > 0) {
      console.log("✓ Admin account already exists");
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
    }

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
