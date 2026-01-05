export async function runSync(source: string, fn: () => Promise<void>) {
  const syncId = await sourceSyncRepo.start(source);
  try {
    await fn();
    await sourceSyncRepo.success(syncId);
  }
  catch (e) {
    await sourceSyncRepo.fail(syncId, e);
    throw e;
  }
}
