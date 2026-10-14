import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

// Cloud storage (SaaS) uploads to a presigned URL and then calls finalize-upload instead of upload.
const MEDIA_UPLOAD_URL_PATTERN = /\/api\/_action\/media\/(?<mediaId>[0-9a-f]{32})\/(?:finalize-)?upload/;

/**
 * Uploads a file into the "Files" card of a digital product.
 *
 * A digital product cannot be saved without at least one file, so this runs before saving
 * a newly created one. The uploaded media is registered for test data cleanup, because
 * deleting the product only removes its download, not the media behind it.
 */
export const UploadProductDownloadFile = base.extend<{ UploadProductDownloadFile: Task }, FixtureTypes>({
    UploadProductDownloadFile: async ({ AdminProductDetail, TestDataService }, use) => {
        const task = (fileName: string) => {
            return async function UploadProductDownloadFile() {
                const page = AdminProductDetail.page;

                const fileChooserPromise = page.waitForEvent("filechooser");
                await AdminProductDetail.uploadDownloadFileButton.click();
                const fileChooser = await fileChooserPromise;

                const fileUpload = page.waitForResponse((response) => MEDIA_UPLOAD_URL_PATTERN.test(response.url()) && response.ok());

                await fileChooser.setFiles({
                    name: `${fileName}.txt`,
                    mimeType: "text/plain",
                    buffer: Buffer.from(`Digital product file of ${fileName}.`),
                });

                const uploadResponse = await fileUpload;
                const mediaId = MEDIA_UPLOAD_URL_PATTERN.exec(uploadResponse.url())?.groups?.["mediaId"];
                TestDataService.addCreatedRecord("media", mediaId as string);
            };
        };

        await use(task);
    },
});
