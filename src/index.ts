import { syncRegistry } from "./sync/SyncRegistry";

async function main() {
  const source = process.argv[2];

  if (!source) {
    console.error("Usage: npm start -- <source>");
    console.error("Available sources:", Object.keys(syncRegistry).join(", "));
    process.exit(1);
  }

  const factory = syncRegistry[source];

  if (!factory) {
    console.error(`Unknown source: ${source}`);
    console.error("Available sources:", Object.keys(syncRegistry).join(", "));
    process.exit(1);
  }

  const sync = await factory();

  await sync.run();
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
