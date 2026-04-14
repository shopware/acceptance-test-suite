import { encode, Image } from "image-js";

export function createRandomImage(width = 800, height = 600) {
    const channels = 3; // RGB
    const data = new Uint8Array(width * height * channels);

    // Fill the buffer with random bytes 0..255
    for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 256) | 0;
    }

    // Construct the image from your data
    return new Image(width, height, {
        colorModel: "RGB",
        bitDepth: 8,
        data,
    });
}

export function createSolidColorImage(width = 800, height = 600, color: [number, number, number] = [255, 0, 0]) {
    const channels = 3; // RGB
    const data = new Uint8Array(width * height * channels);
    const [r, g, b] = color;

    for (let i = 0; i < data.length; i += channels) {
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }

    return new Image(width, height, {
        colorModel: "RGB",
        bitDepth: 8,
        data,
    });
}

export function encodeImage(image: Image) {
    return Buffer.from(encode(image));
}
