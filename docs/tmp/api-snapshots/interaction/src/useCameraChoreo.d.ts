import { InteractionAction } from './types';
/**
 * Orchestrates a two-step camera and graph animation for expanding a node.
 * 1. Zoom out to fit the entire graph.
 * 2. Decompose the target node.
 *
 * @param nodeId The ID of the node to expand.
 * @param interactionDispatch A function to dispatch interaction actions.
 */
export declare function expandChoreo(nodeId: string, interactionDispatch: React.Dispatch<InteractionAction>): Promise<void>;
//# sourceMappingURL=useCameraChoreo.d.ts.map