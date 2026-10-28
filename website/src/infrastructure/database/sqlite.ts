import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import Database from "better-sqlite3";

import {
  applications,
  notifications,
  opportunities,
  students,
  universities,
  users,
} from "@/infrastructure/mock-data";

const databaseDirectory = path.join(process.cwd(), "data");
fs.mkdirSync(databaseDirectory, { recursive: true });

const databasePath = path.join(databaseDirectory, "manhal.db");
const database = new Database(databasePath);

database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");

const tableNames = [
  "universities",
  "opportunities",
  "students",
  "applications",
  "users",
  "notifications",
] as const;

export type DatabaseTableName = (typeof tableNames)[number];

const tableMap: Record<DatabaseTableName, unknown[]> = {
  universities: [...universities],
  opportunities: [...opportunities],
  students: [...students],
  applications: [...applications],
  users: [...users],
  notifications: [...notifications],
};

for (const tableName of tableNames) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id TEXT PRIMARY KEY,
      source_id TEXT NOT NULL UNIQUE,
      payload TEXT NOT NULL
    );
  `);
}

function seedTable<T extends { id: string }>(tableName: DatabaseTableName, rows: T[]) {
  const count = database.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get() as { count: number };
  if (count.count > 0) return;

  const insert = database.prepare(`
    INSERT INTO ${tableName} (id, source_id, payload)
    VALUES (@id, @sourceId, @payload)
  `);

  for (const row of rows) {
    insert.run({
      id: randomUUID(),
      sourceId: row.id,
      payload: JSON.stringify(row),
    });
  }
}

for (const tableName of tableNames) {
  seedTable(tableName, tableMap[tableName] as Array<{ id: string }>);
}

export function listDatabaseTables() {
  return (tableNames as readonly string[]).map((tableName) => {
    const row = database.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get() as { count: number };
    return {
      name: tableName,
      rows: row.count,
    };
  });
}

export function listTableRecords<T>(tableName: DatabaseTableName): T[] {
  const rows = database
    .prepare(`SELECT payload FROM ${tableName} ORDER BY source_id ASC`)
    .all() as { payload: string }[];

  return rows.map((row) => JSON.parse(row.payload) as T);
}

export function findTableRecordBySourceId<T>(tableName: DatabaseTableName, sourceId: string): T | undefined {
  const row = database
    .prepare(`SELECT payload FROM ${tableName} WHERE source_id = @sourceId`)
    .get({ sourceId }) as { payload?: string } | undefined;

  return row?.payload ? (JSON.parse(row.payload) as T) : undefined;
}

export function saveTableRecord<T extends { id: string }>(tableName: DatabaseTableName, record: T) {
  const rowId = randomUUID();
  const statement = database.prepare(`
    INSERT INTO ${tableName} (id, source_id, payload)
    VALUES (@id, @sourceId, @payload)
    ON CONFLICT(source_id) DO UPDATE SET payload = excluded.payload
  `);

  statement.run({
    id: rowId,
    sourceId: record.id,
    payload: JSON.stringify(record),
  });
}

export function deleteTableRecordBySourceId(tableName: DatabaseTableName, sourceId: string) {
  database.prepare(`DELETE FROM ${tableName} WHERE source_id = @sourceId`).run({ sourceId });
}

export function getDatabaseSnapshot() {
  return listDatabaseTables().map((table) => ({
    name: table.name as DatabaseTableName,
    rows: table.rows,
    sample: listTableRecords<unknown>(table.name as DatabaseTableName).slice(0, 3),
  }));
}

export function getDatabaseFilePath() {
  return databasePath;
}
