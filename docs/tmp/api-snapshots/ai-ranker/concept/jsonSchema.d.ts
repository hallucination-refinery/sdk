import { z } from 'zod';
/**
 * Schema for individual concept nodes
 * Used for GPT-4o function calling and runtime validation
 */
export declare const ConceptNodeSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    summary: z.ZodString;
    searchTerms: z.ZodArray<z.ZodString, "many">;
    parentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    summary: string;
    id: string;
    label: string;
    searchTerms: string[];
    parentId?: string | undefined;
}, {
    summary: string;
    id: string;
    label: string;
    searchTerms: string[];
    parentId?: string | undefined;
}>;
/**
 * Schema for complete concept trees
 * Enforces exactly 6 children as per plan requirements
 */
export declare const ConceptTreeSchema: z.ZodObject<{
    root: z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        summary: z.ZodString;
        searchTerms: z.ZodArray<z.ZodString, "many">;
        parentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        id: string;
        label: string;
        searchTerms: string[];
        parentId?: string | undefined;
    }, {
        summary: string;
        id: string;
        label: string;
        searchTerms: string[];
        parentId?: string | undefined;
    }>;
    children: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        summary: z.ZodString;
        searchTerms: z.ZodArray<z.ZodString, "many">;
        parentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        id: string;
        label: string;
        searchTerms: string[];
        parentId?: string | undefined;
    }, {
        summary: string;
        id: string;
        label: string;
        searchTerms: string[];
        parentId?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    root: {
        summary: string;
        id: string;
        label: string;
        searchTerms: string[];
        parentId?: string | undefined;
    };
    children: {
        summary: string;
        id: string;
        label: string;
        searchTerms: string[];
        parentId?: string | undefined;
    }[];
}, {
    root: {
        summary: string;
        id: string;
        label: string;
        searchTerms: string[];
        parentId?: string | undefined;
    };
    children: {
        summary: string;
        id: string;
        label: string;
        searchTerms: string[];
        parentId?: string | undefined;
    }[];
}>;
/**
 * TypeScript types derived from Zod schemas
 * These provide type safety throughout the application
 */
export type ConceptNode = z.infer<typeof ConceptNodeSchema>;
export type ConceptTree = z.infer<typeof ConceptTreeSchema>;
/**
 * Validation function for concept trees
 * Throws detailed error messages if validation fails
 */
export declare function validateConceptTree(data: unknown): ConceptTree;
/**
 * Validation function for individual concept nodes
 * Used when working with concept arrays
 */
export declare function validateConceptNode(data: unknown): ConceptNode;
//# sourceMappingURL=jsonSchema.d.ts.map