-- 001_create_tables.sql
-- Migration to create the tables for the models:
-- Users, Messages, Teams, and Requests

-- Create the users table.
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  usn TEXT NOT NULL,
  mobile TEXT NOT NULL,
  program TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  about TEXT,
  props TEXT,
  verified BOOLEAN NOT NULL DEFAULT false
);

-- Create the messages table.
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  subject TEXT,
  message TEXT
);

-- Create the teams table.
CREATE TABLE IF NOT EXISTS teams (
  team_id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_type TEXT NOT NULL,
  leader_id INTEGER NOT NULL,
  member1_id INTEGER,
  member2_id INTEGER,
  filled BOOLEAN,
  CONSTRAINT fk_leader
    FOREIGN KEY (leader_id)
      REFERENCES users (id)
      ON DELETE CASCADE,
  CONSTRAINT fk_member1
    FOREIGN KEY (member1_id)
      REFERENCES users (id)
      ON DELETE SET NULL,
  CONSTRAINT fk_member2
    FOREIGN KEY (member2_id)
      REFERENCES users (id)
      ON DELETE SET NULL
);

-- Create the requests table.
CREATE TABLE IF NOT EXISTS requests (
  request_id INTEGER PRIMARY KEY AUTOINCREMENT,
  receiver_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  CONSTRAINT fk_receiver
    FOREIGN KEY (receiver_id)
      REFERENCES users (id)
      ON DELETE CASCADE,
  CONSTRAINT fk_sender
    FOREIGN KEY (sender_id)
      REFERENCES users (id)
      ON DELETE CASCADE
);
