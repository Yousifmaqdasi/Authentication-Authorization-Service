ALTER TABLE "reset_tokens" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reset_tokens" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "reset_tokens" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;