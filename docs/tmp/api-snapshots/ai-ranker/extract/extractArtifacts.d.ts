/**
 * Extract textual artifacts from an array of strings or File objects.
 *
 * Plain strings are returned as-is. Image files are converted to a marker
 * string of the form `[IMAGE:<objectURL>]`. PDF files are converted to
 * their plain text (first 10 pages) via `extractPdf`. Unrecognized types are
 * skipped.
 *
 * Example:
 * ```ts
 * const results = await extractArtifacts([new File(['hi'], 'note.txt', {type:'text/plain'})]);
 * ```
 */
export declare function extractArtifacts(items: (File | string)[]): Promise<string[]>;
//# sourceMappingURL=extractArtifacts.d.ts.map