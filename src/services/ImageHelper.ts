import { encode } from "fast-png";

export interface Image {
    width: number;
    height: number;
    data: Uint8Array;
    channels: 3;
    depth: 8;
}

export function createRandomImage(width = 800, height = 600): Image {
    const channels = 3; // RGB
    const data = new Uint8Array(width * height * channels);

    // Fill the buffer with random bytes 0..255
    for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 256) | 0;
    }

    return {
        width,
        height,
        data,
        channels: 3 as const,
        depth: 8 as const,
    };
}

export function createSolidColorImage(width = 800, height = 600, color: [number, number, number] = [255, 0, 0]): Image {
    const channels = 3; // RGB
    const data = new Uint8Array(width * height * channels);
    const [r, g, b] = color;

    for (let i = 0; i < data.length; i += channels) {
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }

    return {
        width,
        height,
        data,
        channels: 3 as const,
        depth: 8 as const,
    };
}

export function encodeImage(image: Image) {
    return Buffer.from(
        encode({
            width: image.width,
            height: image.height,
            data: image.data,
            channels: image.channels,
            depth: image.depth,
        })
    );
}
