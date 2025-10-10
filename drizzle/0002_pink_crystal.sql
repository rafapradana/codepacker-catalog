CREATE TABLE "grading_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"max_score" integer DEFAULT 10 NOT NULL,
	"weight" numeric(3, 2) DEFAULT '1.00',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_grade_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_grade_id" uuid NOT NULL,
	"metric_id" uuid NOT NULL,
	"score" numeric(4, 2) NOT NULL,
	"feedback" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_grade_details_project_grade_id_metric_id_unique" UNIQUE("project_grade_id","metric_id")
);
--> statement-breakpoint
CREATE TABLE "project_grades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"graded_by" uuid NOT NULL,
	"total_score" numeric(5, 2) NOT NULL,
	"max_possible_score" numeric(5, 2) NOT NULL,
	"percentage" numeric(5, 2) NOT NULL,
	"grade" varchar(2),
	"feedback" text,
	"graded_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_grades_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
ALTER TABLE "project_grade_details" ADD CONSTRAINT "project_grade_details_project_grade_id_project_grades_id_fk" FOREIGN KEY ("project_grade_id") REFERENCES "public"."project_grades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_grade_details" ADD CONSTRAINT "project_grade_details_metric_id_grading_metrics_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."grading_metrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_grades" ADD CONSTRAINT "project_grades_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_grades" ADD CONSTRAINT "project_grades_graded_by_admins_id_fk" FOREIGN KEY ("graded_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;