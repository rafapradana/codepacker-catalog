-- Setup extensions for codepacker_catalog database
-- Run this after creating the database

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Optional: Enable pgcrypto for additional cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";