export async function runWithPool<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  concurrency = 6
): Promise<R[]> {
  const results: R[] = [];
  let i = 0;
  const workers = new Array(Math.min(concurrency, items.length))
    .fill(0)
    .map(async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await worker(items[idx]);
      }
    });
  await Promise.all(workers);
  return results;
}
