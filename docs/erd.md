title Codepacker Catalog Data Model
notation chen
// title
title Codepacker Catalog Data Model

// define tables

users [icon: user, color: blue]{
  id uuid pk
  username string unique
  password_hash string
  email string unique
  role string // 'student' or 'admin'
  created_at timestamp
  updated_at timestamp
  last_login timestamp
}

students [icon: graduation-cap, color: yellow]{
  id uuid pk
  user_id uuid fk
  full_name string
  bio text
  profile_photo_url string
  github_url string
  linkedin_url string
  profile_complete boolean
  class_id uuid fk
  created_at timestamp
  updated_at timestamp
}

admins [icon: shield, color: red]{
  id uuid pk
  user_id uuid fk
  full_name string
  created_at timestamp
  updated_at timestamp
}

classes [icon: layers, color: green]{
  id uuid pk
  name string unique
  created_at timestamp
  updated_at timestamp
}

projects [icon: folder, color: blue]{
  id uuid pk
  student_id uuid fk
  title string
  description text
  thumbnail_url string
  github_url string
  live_demo_url string
  category_id uuid fk
  created_at timestamp
  updated_at timestamp
  views_internal int
  views_external int
}

categories [icon: tag, color: purple]{
  id uuid pk
  name string unique
  bg_hex string
  border_hex string
  text_hex string
  created_at timestamp
  updated_at timestamp
}

skills [icon: activity, color: orange]{
  id uuid pk
  name string unique
  icon_url string
  bg_hex string
  border_hex string
  text_hex string
  created_at timestamp
  updated_at timestamp
}

student_skills [icon: link, color: orange]{
  id uuid pk
  student_id uuid fk
  skill_id uuid fk
}

techstacks [icon: cpu, color: teal]{
  id uuid pk
  name string unique
  icon_url string
  bg_hex string
  border_hex string
  text_hex string
  created_at timestamp
  updated_at timestamp
}

project_techstacks [icon: link, color: teal]{
  id uuid pk
  project_id uuid fk
  techstack_id uuid fk
}

project_media [color: Blue] {
  id uuid pk
  project_id uuid fk
  media_url string
  media_type string // image
  created_at timestamp
}

// define relationships

students.user_id > users.id
admins.user_id > users.id
students.class_id > classes.id
projects.student_id > students.id
projects.category_id > categories.id
student_skills.student_id > students.id
student_skills.skill_id > skills.id
project_techstacks.project_id > projects.id
project_techstacks.techstack_id > techstacks.id
project_media.project_id > projects.id