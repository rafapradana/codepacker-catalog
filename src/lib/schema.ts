import { pgTable, uuid, varchar, text, timestamp, boolean, integer, unique, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  role: varchar('role', { length: 50 }).notNull(), // 'student' or 'admin'
  isOnline: boolean('is_online').default(false).notNull(),
  lastSeen: timestamp('last_seen').defaultNow().notNull(),
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

// Student Follows table - for follow system
export const studentFollows = pgTable('student_follows', {
  id: uuid('id').primaryKey().defaultRandom(),
  followerId: uuid('follower_id').references(() => students.id).notNull(), // Who is following
  followingId: uuid('following_id').references(() => students.id).notNull(), // Who is being followed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Composite unique constraint to prevent duplicate follows
  uniqueFollow: unique().on(table.followerId, table.followingId),
}));

// Project Likes table - for project like system
export const projectLikes = pgTable('project_likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(), // Which project is liked
  studentId: uuid('student_id').references(() => students.id).notNull(), // Who liked the project
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Composite unique constraint to prevent duplicate likes from same student
  uniqueProjectLike: unique().on(table.projectId, table.studentId),
}));

// Project Like History table
export const projectLikeHistory = pgTable('project_like_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(), // Which project
  studentId: uuid('student_id').references(() => students.id).notNull(), // Who performed the action
  action: varchar('action', { length: 10 }).notNull(), // 'like' or 'unlike'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Feedback table
export const feedback = pgTable('feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => students.id).notNull(), // Who gave the feedback
  feedbackText: text('feedback_text').notNull(), // The feedback content
  status: varchar('status', { length: 50 }).default('belum ditanggapi').notNull(), // 'belum ditanggapi', 'sudah ditanggapi', 'ditolak'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Project Assessments table
export const projectAssessments = pgTable('project_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  assessorId: uuid('assessor_id').references(() => admins.id).notNull(), // Admin who assessed
  // Assessment criteria scores (1-10 each)
  codeQuality: integer('code_quality').notNull(), // Kualitas Kode
  functionality: integer('functionality').notNull(), // Fungsionalitas
  uiDesign: integer('ui_design').notNull(), // Desain UI
  userExperience: integer('user_experience').notNull(), // User Experience
  responsiveness: integer('responsiveness').notNull(), // Responsivitas
  documentation: integer('documentation').notNull(), // Dokumentasi
  creativity: integer('creativity').notNull(), // Kreativitas & Inovasi
  technologyImplementation: integer('technology_implementation').notNull(), // Implementasi Teknologi
  performance: integer('performance').notNull(), // Performa & Optimisasi
  deployment: integer('deployment').notNull(), // Deployment & Live Demo
  // Calculated fields
  totalScore: integer('total_score').notNull(), // Sum of all criteria
  finalGrade: varchar('final_grade', { length: 2 }).notNull(), // A, B, C, D, E based on total score
  notes: text('notes'), // Additional assessment notes
  status: varchar('status', { length: 20 }).default('completed').notNull(), // 'completed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Ensure one assessment per project
  uniqueProjectAssessment: unique().on(table.projectId),
}));

// AI Project Ideas table
export const aiProjectIdeas = pgTable('ai_project_ideas', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => students.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  techStack: text('tech_stack').notNull(), // JSON array as text
  difficulty: varchar('difficulty', { length: 50 }).notNull(), // 'easy', 'medium', 'hard'
  estimatedHours: integer('estimated_hours'),
  category: varchar('category', { length: 100 }),
  features: text('features'), // JSON array as text
  isBookmarked: boolean('is_bookmarked').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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
  // Follow relations
  followers: many(studentFollows, { relationName: 'followers' }), // Students who follow this student
  following: many(studentFollows, { relationName: 'following' }), // Students this student follows
  feedback: many(feedback), // Feedback given by this student
  aiProjectIdeas: many(aiProjectIdeas), // AI generated project ideas for this student
}));

export const adminsRelations = relations(admins, ({ one, many }) => ({
  user: one(users, {
    fields: [admins.userId],
    references: [users.id],
  }),
  assessments: many(projectAssessments), // Assessments done by this admin
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
  projectLikes: many(projectLikes), // Likes for this project
  projectLikeHistory: many(projectLikeHistory), // Like history for this project
  assessment: one(projectAssessments), // Assessment for this project
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

// Student Follows relations
export const studentFollowsRelations = relations(studentFollows, ({ one }) => ({
  follower: one(students, {
    fields: [studentFollows.followerId],
    references: [students.id],
    relationName: 'followers',
  }),
  following: one(students, {
    fields: [studentFollows.followingId],
    references: [students.id],
    relationName: 'following',
  }),
}));







// Project Likes Relations
export const projectLikesRelations = relations(projectLikes, ({ one }) => ({
  project: one(projects, {
    fields: [projectLikes.projectId],
    references: [projects.id],
  }),
  student: one(students, {
    fields: [projectLikes.studentId],
    references: [students.id],
  }),
}));

// Project Like History Relations
export const projectLikeHistoryRelations = relations(projectLikeHistory, ({ one }) => ({
  project: one(projects, {
    fields: [projectLikeHistory.projectId],
    references: [projects.id],
  }),
  student: one(students, {
    fields: [projectLikeHistory.studentId],
    references: [students.id],
  }),
}));

// Feedback relations
export const feedbackRelations = relations(feedback, ({ one }) => ({
  student: one(students, {
    fields: [feedback.studentId],
    references: [students.id],
  }),
}));

// Project Assessment relations
export const projectAssessmentsRelations = relations(projectAssessments, ({ one }) => ({
  project: one(projects, {
    fields: [projectAssessments.projectId],
    references: [projects.id],
  }),
  assessor: one(admins, {
    fields: [projectAssessments.assessorId],
    references: [admins.id],
  }),
}));

// AI Project Ideas Relations
export const aiProjectIdeasRelations = relations(aiProjectIdeas, ({ one }) => ({
  student: one(students, {
    fields: [aiProjectIdeas.studentId],
    references: [students.id],
  }),
}));