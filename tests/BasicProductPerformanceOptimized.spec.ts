import { test } from '../src';

test('Create 300K basic products', { tag: '@Product' }, async ({
    TestDataService,
}) => {
    test.setTimeout(1440000000); // Set timeout to around 24h  for this large operation

    await TestDataService.setCleanUp(false);


    const TOTAL_PRODUCTS = 200000;
    const START_INDEX = 258180;            // your nextBatchStartIndex
    const CONCURRENCY = 25;                 // try 10–50 depending on your API
    const COOLDOWN_EVERY_MS = 60_000;       // 60s
    const COOLDOWN_PAUSE_MS = 1_000;        // 1s
    const MAX_RETRIES = 12;                  // exponential backoff
    const LOG_EVERY = 1_000;                // progress log cadence

// Helpers
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function isRetryable(err) {
        const status = err?.response?.status ?? err?.status;
        // Retry on 429 & 5xx; you can expand this list if needed
        return status === 429 || (status >= 500 && status < 600) || !status; // network/timeouts
    }

    async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
        let attempt = 0;
        while (true) {
            try {
                return await fn();
            } catch (err) {
                attempt++;
                if (!isRetryable(err) || attempt > MAX_RETRIES) {
                    console.error(`[FAIL] ${label} after ${attempt} attempts`, err?.message || err);
                    throw err;
                }
                // Exponential backoff with jitter
                const delay = Math.min(30_000, (250 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 250));
                console.warn(`[RETRY] ${label} attempt ${attempt} in ${delay}ms`);
                await sleep(delay);
            }
        }
    }

    await (async () => {
        const startTime = Date.now();

        // Prepare shared media once (you already do this)
        const productMediaId = TestDataService.IdProvider.getIdPair().uuid;
        const randomMedia = await withRetry(() => TestDataService.createMediaPNG(), 'createMediaPNG');

        console.log(`Creating ${TOTAL_PRODUCTS} products with concurrency=${CONCURRENCY} ...`);

        // Shared counters/state
        let produced = 0;
        let nextIndex = START_INDEX; // will be incremented by workers
        const endIndex = START_INDEX + TOTAL_PRODUCTS; // exclusive

        // Cooldown coordination (so only one pause happens for all workers)
        let lastCooldownTime = Date.now();
        let cooldownInProgress = null; // Promise or null

        async function maybeCooldown() {
            const now = Date.now();
            if (now - lastCooldownTime < COOLDOWN_EVERY_MS) {
                // If someone else is already cooling down, briefly await it to align workers
                if (cooldownInProgress) await cooldownInProgress;
                return;
            }
            if (!cooldownInProgress) {
                cooldownInProgress = (async () => {
                    console.log('Cooling down 1s to prevent system overload...');
                    await sleep(COOLDOWN_PAUSE_MS);
                    lastCooldownTime = Date.now();
                    cooldownInProgress = null;
                })();
            }
            await cooldownInProgress;
        }

        function makePayload(i) {
            return {
                name: `Performance Basic Product ${i}`,
                productNumber: `PBP${i}`,
                stock: 10,
                coverId: productMediaId,
                media: [
                    {
                        id: productMediaId,
                        media: { id: randomMedia.id },
                    },
                ],
                visibilities: [
                    {
                        salesChannelId: '0198887c74677161a70f4d5cb21a5e2d', // Default sales channel ID
                        visibility: 30,
                    },
                ],
                categories: [
                    {
                        id: '0198987a9f1f71789f89cc484cef51e2', // basic product category ID
                    },
                ],
            };
        }

        async function worker(wid) {
            while (true) {
                // Grab the next index (single-threaded JS makes this safe)
                const i = nextIndex++;
                if (i >= endIndex) break;

                // Optional: progress log
                if ((i - START_INDEX) % LOG_EVERY === 0) {
                    const elapsed = (Date.now() - startTime) / 1000;
                    const rate = (produced / Math.max(elapsed, 1)).toFixed(1);
                    console.log(`[${wid}] Progress: ${produced}/${TOTAL_PRODUCTS} | ${rate} req/s | i=${i}`);
                }

                await maybeCooldown();

                try {
                    await withRetry(
                        () => TestDataService.createBasicProduct(makePayload(i)),
                        `createBasicProduct#${i}`
                    );

                    produced++;

                }catch (err) {
                    // Log the error but continue processing
                    console.error(`[ERROR] Worker ${wid} failed at index ${i}:`, err?.message || err);
                    console.error(`[SKIP] Skipping product #${i} due to persistent failure`);
                    // continue with the next product
                }

            }
        }

        // Spin up a fixed-size pool
        const workers = Array.from({ length: CONCURRENCY }, (_, k) => worker(k + 1));
        await Promise.all(workers);

        const totalSec = (Date.now() - startTime) / 1000;
        const rps = (produced / totalSec).toFixed(2);
        console.log(`Completed ${produced} products in ${totalSec.toFixed(2)}s (${rps} req/s).`);
    })();
});
