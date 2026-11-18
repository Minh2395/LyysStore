# Backend

NestJS API backed by MySQL through TypeORM.

## Setup

1. If `.env` does not exist, copy `.env.example` to `.env`. Otherwise, merge
   the MySQL variables from `.env.example` into the existing file so its
   authentication and mail settings are preserved. Set `MYSQL_PASSWORD` and
   `MYSQL_ROOT_PASSWORD`.
2. Start the database from this directory:

   ```bash
   docker compose up -d
   ```

3. Install dependencies and start the API:

   ```bash
   npm install
   npm run start:dev
   ```

`MYSQL_SYNCHRONIZE=true` creates and updates tables automatically for local
development. For production, use a managed schema or migrations and disable
synchronization. Existing MongoDB data must be migrated separately before
switching application traffic to MySQL.
