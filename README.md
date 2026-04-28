# Exercise Tracker 💪

A simple, user-friendly web application to track your daily workouts and monitor your fitness progress.

## Features

-**Change Your Profile Picture**: Add the link to any JPEG to your home page and customize your profile
- **Log Exercises**: Record exercise name, duration, calories burned, and date
- **View Statistics**: Track total exercises, total minutes worked out, and total calories burned
- **Persistent Storage**: Your exercise data is saved in the browser's local storage, so your data persists even after closing the browser
- **Delete Exercises**: Remove exercises from your log if needed
- **Responsive Design**: Works smoothly on desktop, tablet, and mobile devices
- **Modern UI**: Clean and intuitive interface with a beautiful gradient design
- **Follow Friends**: Go to the People Search page to follow your friends and see their activity in your feed
**Start your fitness journey today!** 🏃‍♂️🏋️‍♀️🚴‍♂️


## Developed in my Web & Server Programming class

We use Vue and Bulma for ease of modification in our frontend. In the backend we use SupaBase to host our database. The whole site is kept up and running by Render.

## Deploy on Render + Supabase

This repo is configured to deploy with Render Blueprint using [render.yaml](render.yaml):

- Static site: `client` (Vue/Vite)
- Web service: `server` (Express API)
- External database: Supabase Postgres via `DATABASE_URL`

### 1) Prepare Supabase

- Create a Supabase project.
- In Supabase SQL editor, run [server/db/schema.sql](server/db/schema.sql).
- Copy the Postgres connection string (Session pooler or direct URL).

### 2) Deploy from GitHub on Render

- In Render, create a new **Blueprint** and select this repository.
- Render will detect [render.yaml](render.yaml) and create both services.

### 3) Set environment variables in Render

For `webserverproject-api` service:

- `DATABASE_URL` = your Supabase Postgres URL
- `JWT_SECRET` = a long random secret string
- `NODE_ENV` is already set to `production` in [render.yaml](render.yaml)

For `webserverproject-client` service:

- `VITE_API_BASE_URL` = your API URL, for example `https://webserverproject-api.onrender.com`

### 4) Redeploy

- Trigger a deploy for both services after env vars are saved.
- Verify API health endpoint: `https://<your-api-service>.onrender.com/healthz`

### Notes

- Client-side routing is supported in production via [client/public/_redirects](client/public/_redirects).
- CORS is enabled in the API and allows requests from deployed frontend origins.

## Sample Account to Showcase Admin features

- **Username**:test
- **Login**: test


