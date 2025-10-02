import { pgTable, text, timestamp, boolean, integer, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Main application tables (sesuai ERD)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("student"), // 'student' or 'admin'
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  last_login: timestamp("last_login"),
});

// Better Auth tables (menggunakan users table yang sudah ada)
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  full_name: text("full_name").notNull(),
  bio: text("bio"),
  profile_photo_url: text("profile_photo_url"),
  github_url: text("github_url"),
  linkedin_url: text("linkedin_url"),
  profile_complete: boolean("profile_complete").default(false).notNull(),
  class_id: uuid("class_id").references(() => classes.id, { onDelete: "set null" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  full_name: text("full_name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  bg_hex: text("bg_hex"),
  border_hex: text("border_hex"),
  text_hex: text("text_hex"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  icon_url: text("icon_url"),
  bg_hex: text("bg_hex"),
  border_hex: text("border_hex"),
  text_hex: text("text_hex"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const techstacks = pgTable("techstacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  icon_url: text("icon_url"),
  bg_hex: text("bg_hex"),
  border_hex: text("border_hex"),
  text_hex: text("text_hex"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  student_id: uuid("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail_url: text("thumbnail_url"),
  github_url: text("github_url"),
  live_demo_url: text("live_demo_url"),
  category_id: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  views_internal: integer("views_internal").default(0).notNull(),
  views_external: integer("views_external").default(0).notNull(),
});

export const student_skills = pgTable("student_skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  student_id: uuid("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
  skill_id: uuid("skill_id").references(() => skills.id, { onDelete: "cascade" }).notNull(),
});

export const project_techstacks = pgTable("project_techstacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  project_id: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  techstack_id: uuid("techstack_id").references(() => techstacks.id, { onDelete: "cascade" }).notNull(),
});

export const project_media = pgTable("project_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  project_id: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  media_url: text("media_url").notNull(),
  media_type: text("media_type").notNull(), // image
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.user_id],
  }),
  admin: one(admins, {
    fields: [users.id],
    references: [admins.user_id],
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.user_id],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [students.class_id],
    references: [classes.id],
  }),
  projects: many(projects),
  skills: many(student_skills),
}));

export const adminsRelations = relations(admins, ({ one }) => ({
  user: one(users, {
    fields: [admins.user_id],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  student: one(students, {
    fields: [projects.student_id],
    references: [students.id],
  }),
  category: one(categories, {
    fields: [projects.category_id],
    references: [categories.id],
  }),
  techstacks: many(project_techstacks),
  media: many(project_media),
}));

export const project_techstacksRelations = relations(project_techstacks, ({ one }) => ({
  project: one(projects, {
    fields: [project_techstacks.project_id],
    references: [projects.id],
  }),
  techstack: one(techstacks, {
    fields: [project_techstacks.techstack_id],
    references: [techstacks.id],
  }),
}));

export const project_mediaRelations = relations(project_media, ({ one }) => ({
  project: one(projects, {
    fields: [project_media.project_id],
    references: [projects.id],
  }),
}));

export const student_skillsRelations = relations(student_skills, ({ one }) => ({
  student: one(students, {
    fields: [student_skills.student_id],
    references: [students.id],
  }),
  skill: one(skills, {
    fields: [student_skills.skill_id],
    references: [skills.id],
  }),
}));

export const classesRelations = relations(classes, ({ many }) => ({
  students: many(students),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  projects: many(projects),
}));

export const techstacksRelations = relations(techstacks, ({ many }) => ({
  projects: many(project_techstacks),
}));

export const skillsRelations = relations(skills, ({ many }) => ({
  students: many(student_skills),
}));