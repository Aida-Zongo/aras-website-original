CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`imageUrl` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdBy` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`summary` text,
	`imageUrl` text,
	`published` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdBy` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`targetType` text NOT NULL,
	`targetId` integer NOT NULL,
	`content` text NOT NULL,
	`authorName` text NOT NULL,
	`authorEmail` text,
	`userId` integer,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contactSubmissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`url` text NOT NULL,
	`fileKey` text NOT NULL,
	`mediaType` text NOT NULL,
	`category` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdBy` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `membershipSubmissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`membershipType` text NOT NULL,
	`motivation` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`targetType` text NOT NULL,
	`targetId` integer NOT NULL,
	`type` text DEFAULT 'like' NOT NULL,
	`ipAddress` text,
	`userId` integer,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`passwordHash` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`lastSignedIn` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);