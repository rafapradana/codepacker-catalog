CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admins" DROP CONSTRAINT "admins_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "project_media" DROP CONSTRAINT "project_media_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "project_techstacks" DROP CONSTRAINT "project_techstacks_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "project_techstacks" DROP CONSTRAINT "project_techstacks_techstack_id_techstacks_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "student_skills" DROP CONSTRAINT "student_skills_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "student_skills" DROP CONSTRAINT "student_skills_skill_id_skills_id_fk";
--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_class_id_classes_id_fk";
--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "full_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "bg_hex" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "bg_hex" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "border_hex" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "border_hex" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "text_hex" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "text_hex" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_media" ALTER COLUMN "media_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_media" ALTER COLUMN "media_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "thumbnail_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "github_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "github_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "live_demo_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "icon_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "bg_hex" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "bg_hex" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "border_hex" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "border_hex" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "text_hex" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "text_hex" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "full_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "profile_photo_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "github_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "linkedin_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "techstacks" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "techstacks" ALTER COLUMN "icon_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "techstacks" ALTER COLUMN "bg_hex" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "techstacks" ALTER COLUMN "bg_hex" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "techstacks" ALTER COLUMN "border_hex" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "techstacks" ALTER COLUMN "border_hex" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "techstacks" ALTER COLUMN "text_hex" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "techstacks" ALTER COLUMN "text_hex" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'student';--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media" ADD CONSTRAINT "project_media_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_techstacks" ADD CONSTRAINT "project_techstacks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_techstacks" ADD CONSTRAINT "project_techstacks_techstack_id_techstacks_id_fk" FOREIGN KEY ("techstack_id") REFERENCES "public"."techstacks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_skills" ADD CONSTRAINT "student_skills_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_skills" ADD CONSTRAINT "student_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE set null ON UPDATE no action;