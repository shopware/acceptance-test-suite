import { expect } from '@playwright/test';
import { createRandomImage, encodeImage } from '../services/ImageHelper';

type FileChooserLike = {
  setFiles(files: {
    name: string;
    mimeType: string;
    buffer: Buffer;
  }): Promise<void>;
};

type ResponseLike = {
  ok(): boolean;
};

export type UploadMediaTarget = {
  page: {
    waitForEvent(event: 'filechooser'): Promise<FileChooserLike>;
    waitForResponse(
      urlOrPredicate: string | ((response: { url(): string; ok(): boolean }) => boolean),
    ): Promise<ResponseLike>;
  };
  uploadMediaButton: {
    click(): Promise<void>;
  };
};

export async function uploadRandomPngMedia(
  target: UploadMediaTarget,
  imageName: string,
): Promise<void> {
  const image = createRandomImage();

  const fileChooserPromise = target.page.waitForEvent('filechooser');
  await target.uploadMediaButton.click();
  const fileChooser = await fileChooserPromise;

  await fileChooser.setFiles({
    name: `${imageName}.png`,
    mimeType: 'image/png',
    buffer: encodeImage(image),
  });

  const response = await target.page.waitForResponse(
    (response) => response.url().includes('/api/search/media') && response.ok(),
  );

  expect(response.ok()).toBeTruthy();
}
