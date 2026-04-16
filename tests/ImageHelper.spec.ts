import { test, expect } from "@playwright/test";
import { decode } from "fast-png";
import { createSolidColorImage, encodeImage } from "../src";

test("ImageHelper encodes solid RGB images as valid PNGs", async () => {
    const image = createSolidColorImage(3, 2, [12, 34, 56]);
    const encoded = encodeImage(image);
    const decoded = decode(encoded);

    expect(Array.from(encoded.subarray(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    expect(decoded.width).toBe(3);
    expect(decoded.height).toBe(2);
    expect(decoded.channels).toBe(3);
    expect(decoded.depth).toBe(8);
    expect(Array.from(decoded.data.subarray(0, 3))).toEqual([12, 34, 56]);
    expect(Array.from(decoded.data.subarray(3, 6))).toEqual([12, 34, 56]);
});
