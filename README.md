# TaskFlow — Mini SaaS Task Management

Production-style full-stack app: **React + Tailwind**, **Node + Express + Sequelize + PostgreSQL**, **JWT + bcrypt**. Each user has private tasks (no shared task list).

## Project layout

`backend/` REST API, Sequelize models, JWT auth, validation, centralized errors 
`frontend/`  Vite + React SPA, Tailwind, protected routes, axios client 

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## 1. Database

Create a database and user (example):

```sql
CREATE DATABASE task_saas;
```

## 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials and a strong JWT_SECRET
npm install
npm start
```

API runs at `http://localhost:5000` by default.

- `POST /api/auth/signup` — register
- `POST /api/auth/login` — login, returns JWT
- `GET /api/tasks` — list **current user’s** tasks (query: `page`, `limit`, `search`, `status`, `priority`)
- `POST /api/tasks` — create task
- `PUT /api/tasks/:id` — update task (must belong to user)
- `DELETE /api/tasks/:id` — delete task

Protected routes expect: `Authorization: Bearer <token>`.

### Sequelize sync vs migrations

For local development, tables are created on startup via `sequelize.sync()`. For production, prefer [Sequelize migrations](https://sequelize.org/docs/v6/other-topics/migrations/) and turn off `sync` / `alter`.

Optional dev flag in `.env`:

```env
DB_SYNC_ALTER=true
```

## 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`. Vite proxies `/api` to `http://localhost:5000`.

For production builds served separately from the API, set in `frontend/.env`:

```env
VITE_API_URL=https://your-api.example.com
```

Leave `VITE_API_URL` empty when using the dev proxy.

## 4. Production build

```bash
cd frontend && npm run build
```

Serve `frontend/dist` with any static host or CDN. Point `VITE_API_URL` at your API and configure `FRONTEND_URL` / CORS on the backend.

## Security notes

- JWT is stored in **localStorage** for this SPA (simple deployment). For stricter setups, consider **httpOnly** cookies and CSRF strategy.
- Use long random `JWT_SECRET` and HTTPS in production.

## Bonus features included

- Task **priority** (low / medium / high) and **due date**
- **Search**, **filters**, **pagination**
- **Toast** notifications, **dark mode**

## Login

email:test@gmail.com
password:123456789

## License

MIT

<img width="957" height="497" alt="image" src="https://github.com/user-attachments/assets/19245505-a6f7-4cff-8383-1b0f65fd6f4c" />
<img width="701" height="488" alt="image" src="https://github.com/user-attachments/assets/1cb10957-21fd-4c80-b0ab-aec94133270c" />
<img width="706" height="473" alt="image" src="https://github.com/user-attachments/assets/ae454db1-a7ba-4989-8b62-3e2c54dcf775" />
<img width="713" height="479" alt="image" src="https://github.com/user-attachments/assets/2c05d4d2-eef5-45ba-9a3d-02a3488c9fa3" />
<img width="959" height="566" alt="image" src="https://github.com/user-attachments/assets/531a0a19-77de-4f7f-bd03-9be2683f5aef" />
<img width="959" height="563" alt="image" src="https://github.com/user-attachments/assets/32e985d2-a081-49ca-9093-ef43b9f5e472" />





