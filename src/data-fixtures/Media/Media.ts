import { test as base, expect } from '@playwright/test';
import type { FixtureTypes } from '../../types/FixtureTypes';
import { createRandomImage } from '../../services/ImageHelper';
import type { components } from '@shopware/api-client/admin-api-types';
import fs from 'fs';

/**
 * @deprecated - Use TestDataService.createMediaPNG() instead.
 */
export const MediaData = base.extend<FixtureTypes>({
    MediaData: async ({ AdminApiContext, IdProvider }, use) => {

        const imageId = IdProvider.getIdPair().id;
        const imageFilePath = `./tmp/image-${imageId}.png`;

        // Create random image
        const image = createRandomImage();

        if (!fs.existsSync('./tmp/')) {
            try {
                fs.mkdirSync('./tmp/');
            } catch (err) {
                console.error(err);
            }
        }

        fs.writeFileSync(imageFilePath, image.toBuffer());

        // Create empty media and use the mediaId for Upload
        const mediaResponse = await AdminApiContext.post('media?_response', {
            data: {
                private: false,
            },
        });

        expect(mediaResponse.ok()).toBeTruthy();

        // Allow access to new media in test
        const { data: media } = (await mediaResponse.json()) as { data: components['schemas']['Media'] };

        // Upload binary png media
        const mediaCreationResponse = await AdminApiContext.post(`_action/media/${media.id}/upload?extension=png&fileName=${media.id}`, {
            data: fs.readFileSync(imageFilePath),
            headers: {
                'content-type': 'image/png',
            },
        });

        expect(mediaCreationResponse.ok()).toBeTruthy();

        // Define Tags and make tag definitions available in media object
        const altTag = media.alt = `alt-${media.id}`;
        const titleTag = media.title = `title-${media.id}`;

        // Provide alt and title tag to media
        const editMediaResponse = await AdminApiContext.patch(`media/${media.id}`, {
            data: {
                alt: altTag,
                title: titleTag,
            },
        });
        expect(editMediaResponse.ok()).toBeTruthy();

        // Use media data in the test
        await use(media);

        // Delete image from dir
        fs.unlink(imageFilePath, (err) => {
            if (err) {
                throw err;
            }
        });

        // Delete media after the test is done
        const cleanupResponse = await AdminApiContext.delete(`media/${media.id}`);
        expect(cleanupResponse.ok()).toBeTruthy();
    },
});
