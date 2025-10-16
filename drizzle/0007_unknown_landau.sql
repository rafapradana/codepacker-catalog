CREATE TABLE "project_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"assessor_id" uuid NOT NULL,
	"code_quality" integer NOT NULL,
	"functionality" integer NOT NULL,
	"ui_design" integer NOT NULL,
	"user_experience" integer NOT NULL,
	"responsiveness" integer NOT NULL,
	"documentation" integer NOT NULL,
	"creativity" integer NOT NULL,
	"technology_implementation" integer NOT NULL,
	"performance" integer NOT NULL,
	"deployment" integer NOT NULL,
	"total_score" integer NOT NULL,
	"final_grade" varchar(2) NOT NULL,
	"notes" text,
	"status" varchar(20) DEFAULT 'completed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_assessments_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
ALTER TABLE "project_assessments" ADD CONSTRAINT "project_assessments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_assessments" ADD CONSTRAINT "project_assessments_assessor_id_admins_id_fk" FOREIGN KEY ("assessor_id") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;