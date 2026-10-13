CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`email` text NOT NULL,
	`passwordHash` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'basic',
	`age` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);