import { PropertyGroup, test } from '../src';
test('Create 10K variants', { tag: '@Product' }, async ({
    TestDataService,
}) => {
    test.setTimeout(1440000000); // Set timeout to around 60 minutes for this large operation

    await TestDataService.setCleanUp(false);


    const TOTAL_PRODUCTS = 40; //180 partent products
    const START_INDEX = 200;                // your nextBatchStartIndex
    const CONCURRENCY = 10;                 // try 10–50 depending on your API
    const COOLDOWN_EVERY_MS = 60_000;       // 60s
    const COOLDOWN_PAUSE_MS = 1_000;        // 1s
    const MAX_RETRIES = 100;                  // exponential backoff
    const LOG_EVERY = 1_000;                // progress log cadence

// Helpers
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function isRetryable(err) {
        const status = err?.response?.status ?? err?.status;
        // Retry on 429 & 5xx; you can expand this list if needed
        return status === 429 || (status >= 500 && status < 600) || !status; // network/timeouts
    }

    async function withRetry(fn, label) {
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
        const randomMedia = await TestDataService.createMediaPNG();
        const propertyGroupColor = await TestDataService.createColorPropertyGroup(makeColorPayload(1));
        const propertyGroupSize = await TestDataService.createTextPropertyGroup(makeSizePayload(1));
        const propertyGroupMaterial = await TestDataService.createTextPropertyGroup(makeMaterialPayload(1));
        const propertyGroupOccasion = await TestDataService.createTextPropertyGroup(makeOccasionPayload(1));
        const propertyGroupStyle = await TestDataService.createTextPropertyGroup(makeStylePayload(1));
        const propertyGroups: PropertyGroup[] = [];
        propertyGroups.push(propertyGroupColor);
        propertyGroups.push(propertyGroupSize);
        propertyGroups.push(propertyGroupMaterial);
        propertyGroups.push(propertyGroupOccasion);
        propertyGroups.push(propertyGroupStyle);


        console.log(`Creating ${TOTAL_PRODUCTS} Variant parent products (with 1250 variant products each) with concurrency=${CONCURRENCY} ...`);

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

        function makeColorPayload(i) {
            return {
                name: `PBPVariantColor${i}`,
                description: 'Color',
                displayType: 'color',
                sortingType: 'name',
                options: [
                    { 'name': 'Violet', 'colorHexCode': '#7fae6a' },
                    { 'name': 'Purple', 'colorHexCode': '#157ba6' },
                    { 'name': 'Chartreuse', 'colorHexCode': '#3c3c2f' },
                    { 'name': 'Copper', 'colorHexCode': '#8ef719' },
                    { 'name': 'Slate', 'colorHexCode': '#f64e0f' },


                ],
            };
        }

        function makeSizePayload(i) {
            return {
                name: `PBPVariantSize${i}`,
                description: 'Size',
                displayType: 'text',
                sortingType: 'name',
                options: [
                    { 'name': 'XX-Large' },
                    { 'name': 'Huge' },
                    { 'name': 'Pro' },
                    { 'name': 'Prince' },
                    { 'name': 'Medium' },

                ],
            };
        }

        function makeMaterialPayload(i) {
            return {
                name: `PBPVariantMaterial${i}`,
                description: 'Material',
                displayType: 'text',
                sortingType: 'name',
                options: [
                    { 'name': 'Leather' },
                    { 'name': 'Cotton' },
                    { 'name': 'Stainless Steel' },
                    { 'name': 'Plastic' },
                    { 'name': 'Glass' },

                ],
            };
        }

        function makeStylePayload(i) {
            return {
                name: `PBPVariantStyle${i}`,
                description: 'Style',
                displayType: 'text',
                sortingType: 'name',
                options: [
                    { 'name': 'Classic' },
                    { 'name': 'Modern' },
                    { 'name': 'Sport' },
                    { 'name': 'Luxury' },
                    { 'name': 'Minimalist' },

                ],
            };
        }

        function makeOccasionPayload(i) {
            return {
                name: `PBPVariantOccasion${i}`,
                description: 'Occasion',
                displayType: 'text',
                sortingType: 'name',
                options: [
                    { 'name': 'Casual' },
                    { 'name': 'Formal' },
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

                // Create the parent product

                const parentProduct = await withRetry(
                    () => TestDataService.createBasicProduct({
                        name: `PBPVariantParent${i}`,
                        productNumber: `PBPVariant${i}`,
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
                                id: '0198a4d11c7c79b1af14a8ed76cef727', // variant product category ID
                            },
                        ],
                        variantListingConfig: {
                            'displayParent': null,
                            'configuratorGroupConfig': [
                                {'id': propertyGroupColor.id, 'representation': 'box', 'expressionForListings': true},
                                {'id': propertyGroupSize.id, 'representation': 'box', 'expressionForListings': true},
                                {'id': propertyGroupMaterial.id, 'representation': 'box', 'expressionForListings': true},
                                {'id': propertyGroupOccasion.id, 'representation': 'box', 'expressionForListings': true},
                                {'id': propertyGroupStyle.id, 'representation': 'box', 'expressionForListings': true},
                            ],
                        },
                    }),
                    `createParentProduct#${i}`
                );

                try {
                    await withRetry(
                        () => TestDataService.createVariantProducts(parentProduct, propertyGroups, {
                            visibilities: [
                                {
                                    salesChannelId: '0198887c74677161a70f4d5cb21a5e2d', // Default sales channel ID
                                    visibility: 30,
                                },
                            ],
                            categories: [
                                {
                                    id: '0198a4d11c7c79b1af14a8ed76cef727', // variant product category ID
                                },
                            ],
                        }),
                        `createVariantProducts#${i}`
                    );

                    produced++;
                } catch (err) {
                    // Log the error but continue processing
                    console.error(`[ERROR] Worker ${wid} failed at index ${i}:`, err?.message || err);
                    console.error(`[SKIP] Skipping  variant product #${i} due to persistent failure`);
                    // continue with the next product
                }
            }
        }

        // Spin up a fixed-size pool
        const workers = Array.from({ length: CONCURRENCY }, (_, k) => worker(k + 1));
        await Promise.all(workers);

        const totalSec = (Date.now() - startTime) / 1000;
        const rps = (produced / totalSec).toFixed(2);
        console.log(`Completed ${produced} VariantParentProducts with 1250 variants each in ${totalSec.toFixed(2)}s (${rps} req/s).`);
    })();
});
