CREATE TABLE "student_follows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "student_follows_follower_id_following_id_unique" UNIQUE("follower_id","following_id")
);
--> statement-breakpoint
ALTER TABLE "student_follows" ADD CONSTRAINT "student_follows_follower_id_students_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_follows" ADD CONSTRAINT "student_follows_following_id_students_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "views_internal";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "views_external";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "profile_complete";