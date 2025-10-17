CREATE TABLE "ai_project_ideas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"tech_stack" text NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"estimated_hours" integer,
	"category" varchar(100),
	"features" text,
	"is_bookmarked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_project_ideas" ADD CONSTRAINT "ai_project_ideas_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;