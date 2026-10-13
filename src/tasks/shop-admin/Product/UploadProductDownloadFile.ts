import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

/**
 * Uploads a file into the "Files" card of a digital product.
 *
 * A digital product cannot be saved without at least one file, so this runs before saving
 * a newly created one.
 */
export const UploadProductDownloadFile = base.extend<{ UploadProductDownloadFile: Task }, FixtureTypes>({
    UploadProductDownloadFile: async ({ AdminProductDetail }, use) => {
        const task = (fileName: string) => {
            return async function UploadProductDownloadFile() {
                const page = AdminProductDetail.page;

                const fileChooserPromise = page.waitForEvent("filechooser");
                await AdminProductDetail.uploadDownloadFileButton.click();
                const fileChooser = await fileChooserPromise;

                // Cloud storage (SaaS) uploads to a presigned URL and then calls finalize-upload instead of upload.
                const fileUpload = page.waitForResponse((response) => /\/api\/_action\/media\/[0-9a-f]{32}\/(?:finalize-)?upload/.test(response.url()) && response.ok());

                await fileChooser.setFiles({
                    name: `${fileName}.txt`,
                    mimeType: "text/plain",
                    buffer: Buffer.from(`Digital product file of ${fileName}.`),
                });

                await fileUpload;
            };
        };

        await use(task);
    },
});
