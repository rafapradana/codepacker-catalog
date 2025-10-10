import { pgTable, uuid, varchar, text, timestamp, boolean, integer, unique, decimal } from 'drizzle-orm/pg-core';
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

// Project Like History table - for tracking like/unlike actions
export const projectLikeHistory = pgTable('project_like_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(), // Which project
  studentId: uuid('student_id').references(() => students.id).notNull(), // Who performed the action
  action: varchar('action', { length: 10 }).notNull(), // 'like' or 'unlike'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Grading Metrics table - defines the metrics used for grading
export const gradingMetrics = pgTable('grading_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  maxScore: integer('max_score').notNull().default(10), // Maximum score for this metric
  weight: decimal('weight', { precision: 3, scale: 2 }).default('1.00'), // Weight multiplier for this metric
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Project Grades table - stores the overall grade for each project
export const projectGrades = pgTable('project_grades', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  gradedBy: uuid('graded_by').references(() => admins.id).notNull(), // Admin who graded the project
  totalScore: decimal('total_score', { precision: 5, scale: 2 }).notNull(), // Total calculated score
  maxPossibleScore: decimal('max_possible_score', { precision: 5, scale: 2 }).notNull(), // Maximum possible score
  percentage: decimal('percentage', { precision: 5, scale: 2 }).notNull(), // Percentage score
  grade: varchar('grade', { length: 2 }), // Letter grade (A, B, C, D, F)
  feedback: text('feedback'), // Overall feedback from grader
  gradedAt: timestamp('graded_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Ensure one grade per project
  uniqueProjectGrade: unique().on(table.projectId),
}));

// Project Grade Details table - stores individual metric scores
export const projectGradeDetails = pgTable('project_grade_details', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectGradeId: uuid('project_grade_id').references(() => projectGrades.id).notNull(),
  metricId: uuid('metric_id').references(() => gradingMetrics.id).notNull(),
  score: decimal('score', { precision: 4, scale: 2 }).notNull(), // Score for this specific metric
  feedback: text('feedback'), // Specific feedback for this metric
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Ensure one score per metric per grade
  uniqueMetricScore: unique().on(table.projectGradeId, table.metricId),
}));

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
}));

export const adminsRelations = relations(admins, ({ one, many }) => ({
  user: one(users, {
    fields: [admins.userId],
    references: [users.id],
  }),
  projectGrades: many(projectGrades), // Projects graded by this admin
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
  projectGrade: one(projectGrades), // Grade for this project
  projectLikes: many(projectLikes), // Likes for this project
  projectLikeHistory: many(projectLikeHistory), // Like history for this project
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

// Grading Metrics Relations
export const gradingMetricsRelations = relations(gradingMetrics, ({ many }) => ({
  projectGradeDetails: many(projectGradeDetails),
}));

// Project Grades Relations
export const projectGradesRelations = relations(projectGrades, ({ one, many }) => ({
  project: one(projects, {
    fields: [projectGrades.projectId],
    references: [projects.id],
  }),
  grader: one(admins, {
    fields: [projectGrades.gradedBy],
    references: [admins.id],
  }),
  gradeDetails: many(projectGradeDetails),
}));

// Project Grade Details Relations
export const projectGradeDetailsRelations = relations(projectGradeDetails, ({ one }) => ({
  projectGrade: one(projectGrades, {
    fields: [projectGradeDetails.projectGradeId],
    references: [projectGrades.id],
  }),
  metric: one(gradingMetrics, {
    fields: [projectGradeDetails.metricId],
    references: [gradingMetrics.id],
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