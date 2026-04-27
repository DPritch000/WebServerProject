-- Supabase/Postgres schema for the backend models in this project.
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists users (
	id uuid primary key default gen_random_uuid(),
	email text not null unique,
	name text,
	password_hash text not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists exercise_types (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	description text,
	owner_id uuid references users(id) on delete set null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists activities (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references users(id) on delete cascade,
	exercise_id uuid not null references exercise_types(id) on delete restrict,
	duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
	notes text,
	performed_at timestamptz not null default now(),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists idx_exercise_types_owner_id on exercise_types(owner_id);
create index if not exists idx_activities_user_id on activities(user_id);
create index if not exists idx_activities_exercise_id on activities(exercise_id);
create index if not exists idx_activities_performed_at on activities(performed_at desc);

