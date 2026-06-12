import { promises as fs } from "fs";
import { join } from "path";
import { Pool } from "pg";

const LOGS_FILE = join(process.cwd(), "dist", "logs.json");
const USERS_FILE = join(process.cwd(), "dist", "users.json");

export type LogEntry = {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  details: string;
};

export type UserEntry = {
  email: string;
  createdAt: string;
};

let pool: Pool | null = null;

export function getPool(): Pool | null {
  if (typeof window !== "undefined") return null; // Server only
  
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("[Database] DATABASE_URL env var is not set. Using local JSON files fallback.");
      return null;
    }
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("railway.internal") || connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
    });
  }
  return pool;
}

let initialized = false;
async function ensureTablesExist() {
  if (initialized) return;
  const db = getPool();
  if (!db) return;
  
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        user_email TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL
      );
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS registered_users (
        email TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS auth_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    initialized = true;
    console.log("[Postgres] Tables initialized successfully.");
  } catch (err) {
    console.error("[Postgres] Table initialization failed:", err);
  }
}

async function ensureFileExists(path: string, initialContent: string = "[]") {
  try {
    await fs.access(path);
  } catch {
    try {
      await fs.mkdir(join(path, ".."), { recursive: true });
    } catch {}
    await fs.writeFile(path, initialContent, "utf-8");
  }
}

export async function getLogs(): Promise<LogEntry[]> {
  const db = getPool();
  if (db) {
    try {
      await ensureTablesExist();
      const res = await db.query(
        `SELECT id, timestamp, user_email as "userEmail", action, details FROM activity_logs ORDER BY timestamp DESC LIMIT 100`
      );
      return res.rows.map(row => ({
        ...row,
        timestamp: new Date(row.timestamp).toISOString(),
      })) as LogEntry[];
    } catch (err) {
      console.error("[Postgres] Failed to query activity_logs, falling back to JSON:", err);
    }
  }

  await ensureFileExists(LOGS_FILE);
  try {
    const data = await fs.readFile(LOGS_FILE, "utf-8");
    return JSON.parse(data) as LogEntry[];
  } catch {
    return [];
  }
}

export async function addLog(userEmail: string, action: string, details: string): Promise<LogEntry> {
  const entryId = Math.random().toString(36).substring(2, 11);
  const entryTimestamp = new Date().toISOString();
  
  const db = getPool();
  if (db) {
    try {
      await ensureTablesExist();
      await db.query(
        "INSERT INTO activity_logs (id, timestamp, user_email, action, details) VALUES ($1, $2, $3, $4, $5)",
        [entryId, entryTimestamp, userEmail, action, details]
      );
      return {
        id: entryId,
        timestamp: entryTimestamp,
        userEmail,
        action,
        details,
      };
    } catch (err) {
      console.error("[Postgres] Failed to insert log, falling back to JSON:", err);
    }
  }

  const logs = await getLogs();
  const entry: LogEntry = {
    id: entryId,
    timestamp: entryTimestamp,
    userEmail,
    action,
    details,
  };
  logs.unshift(entry);
  await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  return entry;
}

export async function getAddedUsers(): Promise<UserEntry[]> {
  const db = getPool();
  if (db) {
    try {
      await ensureTablesExist();
      const res = await db.query(
        `SELECT email, created_at as "createdAt" FROM registered_users ORDER BY created_at DESC`
      );
      return res.rows.map(row => ({
        ...row,
        createdAt: new Date(row.createdAt).toISOString(),
      })) as UserEntry[];
    } catch (err) {
      console.error("[Postgres] Failed to query registered_users, falling back to JSON:", err);
    }
  }

  await ensureFileExists(USERS_FILE);
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data) as UserEntry[];
  } catch {
    return [];
  }
}

export async function addAddedUser(email: string): Promise<UserEntry> {
  const createdAt = new Date().toISOString();
  
  const db = getPool();
  if (db) {
    try {
      await ensureTablesExist();
      
      const checkRes = await db.query("SELECT email FROM registered_users WHERE LOWER(email) = LOWER($1)", [email]);
      if (checkRes.rows.length > 0) {
        return {
          email,
          createdAt: new Date().toISOString(),
        };
      }
      
      await db.query(
        "INSERT INTO registered_users (email, created_at) VALUES ($1, $2)",
        [email, createdAt]
      );
      return {
        email,
        createdAt,
      };
    } catch (err) {
      console.error("[Postgres] Failed to insert registered_user, falling back to JSON:", err);
    }
  }

  const users = await getAddedUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase())!;
  }
  const entry: UserEntry = {
    email,
    createdAt,
  };
  users.unshift(entry);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  return entry;
}
