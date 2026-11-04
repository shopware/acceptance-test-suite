/**
 * Generates product document files in memory, so tests can control what they
 * upload and clean it up afterwards without committing binary fixtures.
 *
 * Mirrors `ImageHelper`: everything is produced as a `Buffer` and handed
 * straight to `fileChooser.setFiles({ name, mimeType, buffer })` - nothing ever
 * touches disk.
 */

export type ProductDocumentType = "pdf" | "txt";

export interface GeneratedDocument {
    extension: string;
    mimeType: string;
    buffer: Buffer;
}

export interface CreateDocumentOptions {
    /**
     * Pads the file so it reaches at least this many bytes. Use it to produce an
     * oversized document for the file-size validation case. The result may
     * overshoot the target by a few bytes; it never undershoots.
     */
    sizeInBytes?: number;
}

/**
 * Creates a document of the given type. Defaults to a small, valid PDF, which is
 * the representative supported format for the acceptance tests.
 */
export function createDocument(type: ProductDocumentType = "pdf", options: CreateDocumentOptions = {}): GeneratedDocument {
    switch (type) {
        case "pdf":
            return createPdfDocument(options.sizeInBytes);
        case "txt":
            return createTextDocument(options.sizeInBytes);
    }
}

/**
 * Builds a minimal but structurally valid single-page PDF. The cross-reference
 * offsets are computed from the actual content, so the file stays valid at any
 * padded size.
 */
export function createPdfDocument(sizeInBytes?: number): GeneratedDocument {
    let buffer = buildPdf(0);

    if (sizeInBytes && sizeInBytes > buffer.length) {
        buffer = buildPdf(sizeInBytes - buffer.length);
    }

    return {
        extension: "pdf",
        mimeType: "application/pdf",
        buffer,
    };
}

/**
 * Builds a plain text file. Not an allowed product document format, so it is
 * handy for the "unsupported file type is rejected" case.
 */
export function createTextDocument(sizeInBytes?: number): GeneratedDocument {
    const base = "This is a generated acceptance-test document.\n";
    let content = base;

    if (sizeInBytes && sizeInBytes > content.length) {
        content += "x".repeat(sizeInBytes - content.length);
    }

    return {
        extension: "txt",
        mimeType: "text/plain",
        buffer: Buffer.from(content, "latin1"),
    };
}

function buildPdf(paddingBytes: number): Buffer {
    const header = "%PDF-1.4\n";
    // A PDF comment (a line starting with "%") is ignored by readers, so we use
    // one as filler. It shifts every object offset, but those are recomputed
    // below, so the file remains valid.
    const padding = paddingBytes > 0 ? `%${"0".repeat(paddingBytes)}\n` : "";
    const preamble = header + padding;

    const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>"];

    const offsets: number[] = [];
    let body = "";
    objects.forEach((object, index) => {
        offsets.push(preamble.length + body.length);
        body += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefOffset = preamble.length + body.length;
    const size = objects.length + 1; // +1 for the mandatory free object 0

    let xref = `xref\n0 ${size}\n`;
    xref += "0000000000 65535 f \n";
    for (const offset of offsets) {
        xref += `${offset.toString().padStart(10, "0")} 00000 n \n`;
    }

    const trailer = `trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    // The content is pure ASCII, so latin1 keeps one char == one byte and the
    // computed offsets line up with the real byte positions.
    return Buffer.from(preamble + body + xref + trailer, "latin1");
}
