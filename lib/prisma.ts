import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Caps how long the driver waits on Atlas (defaults are often ~30s+), and bounds
 * pool size so a flaky connection is less likely to stall every route at once.
 */
function mergeMongoConnectionOptions(urlStr: string): string {
  if (
    !urlStr.startsWith("mongodb://") &&
    !urlStr.startsWith("mongodb+srv://")
  ) {
    return urlStr;
  }
  const qIndex = urlStr.indexOf("?");
  const base = qIndex === -1 ? urlStr : urlStr.slice(0, qIndex);
  const existing = qIndex === -1 ? "" : urlStr.slice(qIndex + 1);
  const params = new URLSearchParams(existing);
  const defaults: Record<string, string> = {
    serverSelectionTimeoutMS: "12000",
    connectTimeoutMS: "12000",
    socketTimeoutMS: "60000",
    maxPoolSize: "10",
    maxIdleTimeMS: "60000",
  };
  for (const [k, v] of Object.entries(defaults)) {
    if (!params.has(k)) params.set(k, v);
  }
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

function prismaClientOptions(): ConstructorParameters<typeof PrismaClient>[0] {
  const raw = process.env.DATABASE_URL;
  const log: ("error" | "warn")[] =
    process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

  if (!raw) {
    return { log };
  }
  try {
    return {
      log,
      datasources: { db: { url: mergeMongoConnectionOptions(raw) } },
    };
  } catch {
    return { log, datasources: { db: { url: raw } } };
  }
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions());

/** One client per Node process (dev HMR + Next bundling). */
globalForPrisma.prisma = prisma;