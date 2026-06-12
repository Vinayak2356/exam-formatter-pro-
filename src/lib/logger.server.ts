import { promises as fs } from "fs";
import { join } from "path";

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
  await ensureFileExists(LOGS_FILE);
  try {
    const data = await fs.readFile(LOGS_FILE, "utf-8");
    return JSON.parse(data) as LogEntry[];
  } catch {
    return [];
  }
}

export async function addLog(userEmail: string, action: string, details: string): Promise<LogEntry> {
  const logs = await getLogs();
  const entry: LogEntry = {
    id: Math.random().toString(36).substring(2, 11),
    timestamp: new Date().toISOString(),
    userEmail,
    action,
    details,
  };
  logs.unshift(entry); // Add to the top
  await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  return entry;
}

export async function getAddedUsers(): Promise<UserEntry[]> {
  await ensureFileExists(USERS_FILE);
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data) as UserEntry[];
  } catch {
    return [];
  }
}

export async function addAddedUser(email: string): Promise<UserEntry> {
  const users = await getAddedUsers();
  // Avoid duplicate registrations in our local users list
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase())!;
  }
  const entry: UserEntry = {
    email,
    createdAt: new Date().toISOString(),
  };
  users.unshift(entry);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  return entry;
}
