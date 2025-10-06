import { pgTable, uuid, varchar, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  role: varchar('role', { length: 50 }).notNull(), // 'student' or 'admin'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login'),
});

// Classes table
export const classes = pgTable('classes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Students table
export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  bio: text('bio'),
  profilePhotoUrl: varchar('profile_photo_url', { length: 500 }),
  githubUrl: varchar('github_url', { length: 500 }),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  classId: uuid('class_id').references(() => classes.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Admins table
export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  bgHex: varchar('bg_hex', { length: 7 }).notNull(),
  borderHex: varchar('border_hex', { length: 7 }).notNull(),
  textHex: varchar('text_hex', { length: 7 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Skills table
export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  iconUrl: varchar('icon_url', { length: 500 }),
  bgHex: varchar('bg_hex', { length: 7 }).notNull(),
  borderHex: varchar('border_hex', { length: 7 }).notNull(),
  textHex: varchar('text_hex', { length: 7 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tech stacks table
export const techstacks = pgTable('techstacks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  iconUrl: varchar('icon_url', { length: 500 }),
  bgHex: varchar('bg_hex', { length: 7 }).notNull(),
  borderHex: varchar('border_hex', { length: 7 }).notNull(),
  textHex: varchar('text_hex', { length: 7 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => students.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  githubUrl: varchar('github_url', { length: 500 }).notNull(),
  liveDemoUrl: varchar('live_demo_url', { length: 500 }),
  categoryId: uuid('category_id').references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Student Skills junction table
export const studentSkills = pgTable('student_skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => students.id).notNull(),
  skillId: uuid('skill_id').references(() => skills.id).notNull(),
});

// Project Tech stacks junction table
export const projectTechstacks = pgTable('project_techstacks', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  techstackId: uuid('techstack_id').references(() => techstacks.id).notNull(),
});

// Project Media table
export const projectMedia = pgTable('project_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  mediaUrl: varchar('media_url', { length: 500 }).notNull(),
  mediaType: varchar('media_type', { length: 50 }).notNull(), // 'image'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  admin: one(admins, {
    fields: [users.id],
    references: [admins.userId],
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [students.classId],
    references: [classes.id],
  }),
  projects: many(projects),
  studentSkills: many(studentSkills),
}));

export const adminsRelations = relations(admins, ({ one }) => ({
  user: one(users, {
    fields: [admins.userId],
    references: [users.id],
  }),
}));

export const classesRelations = relations(classes, ({ many }) => ({
  students: many(students),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  student: one(students, {
    fields: [projects.studentId],
    references: [students.id],
  }),
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
  }),
  projectTechstacks: many(projectTechstacks),
  projectMedia: many(projectMedia),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  projects: many(projects),
}));

export const skillsRelations = relations(skills, ({ many }) => ({
  studentSkills: many(studentSkills),
}));

export const techstacksRelations = relations(techstacks, ({ many }) => ({
  projectTechstacks: many(projectTechstacks),
}));

export const studentSkillsRelations = relations(studentSkills, ({ one }) => ({
  student: one(students, {
    fields: [studentSkills.studentId],
    references: [students.id],
  }),
  skill: one(skills, {
    fields: [studentSkills.skillId],
    references: [skills.id],
  }),
}));

export const projectTechstacksRelations = relations(projectTechstacks, ({ one }) => ({
  project: one(projects, {
    fields: [projectTechstacks.projectId],
    references: [projects.id],
  }),
  techstack: one(techstacks, {
    fields: [projectTechstacks.techstackId],
    references: [techstacks.id],
  }),
}));

export const projectMediaRelations = relations(projectMedia, ({ one }) => ({
  project: one(projects, {
    fields: [projectMedia.projectId],
    references: [projects.id],
  }),
}));