import * as Automerge from '@automerge/automerge';
export type DocShape = {
    memories: Record<string, any>[];
    concepts: Record<string, any>[];
    edges: Record<string, any>[];
    [key: string]: any;
};
/**
 * Creates a new, empty Automerge document for the graph store.
 * Initializes with empty arrays for memories, concepts, and edges.
 */
export declare function createGraphDoc(): Automerge.Doc<DocShape>;
/**
 * Applies a set of binary changes to a document.
 * @param doc The Automerge document to apply changes to.
 * @param changes An array of Uint8Array changes.
 * @returns A new Automerge document with the changes applied.
 */
export declare function applyChanges(doc: Automerge.Doc<DocShape>, changes: Uint8Array[]): Automerge.Doc<DocShape>;
/**
 * Saves the entire Automerge document to a compact binary format.
 * @param doc The Automerge document to save.
 * @returns A Uint8Array representing the saved document.
 */
export declare function saveBinary(doc: Automerge.Doc<DocShape>): Uint8Array;
/**
 * Loads an Automerge document from its binary format.
 * @param binary The Uint8Array to load the document from.
 * @returns A new Automerge document instance.
 */
export declare function loadBinary(binary: Uint8Array): Automerge.Doc<DocShape>;
/**
 * A helper to make transactional changes and capture the resulting binary patch.
 * @param doc The document to change.
 * @param callback A function that receives a mutable proxy of the doc's contents.
 * @returns An object containing the new document state and the binary changes.
 */
export declare function changeDoc<T>(doc: Automerge.Doc<T>, callback: (d: T) => void): {
    newDoc: Automerge.Doc<T>;
    changes: Uint8Array[];
};
//# sourceMappingURL=index.d.ts.map