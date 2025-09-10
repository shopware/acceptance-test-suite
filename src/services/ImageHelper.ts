import { encode, Image } from 'image-js';

export function createRandomImage(width = 800, height = 600) {

    const channels = 3; // RGB
    const data = new Uint8Array(width * height * channels);

    // Fill the buffer with random bytes 0..255
    for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 256) | 0;
    }

    // Construct the image from your data
    return new Image(width, height, {
        colorModel: 'RGB',
        bitDepth: 8,
        data,
    });
}

export function encodeImage(image: Image) {
    return Buffer.from(encode(image));
}

