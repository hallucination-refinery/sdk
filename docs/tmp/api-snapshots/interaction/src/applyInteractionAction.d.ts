import { InteractionState, InteractionAction } from './types';
/**
 * Pure function to apply graph-mutating actions to the masterGraphData.
 * This is the ONLY place direct mutations to masterGraphData structure (nodes/links) should occur.
 * It MUST return a new state object with a new masterGraphData (nodes and links arrays cloned).
 * Other parts of the InteractionState (selectedNodeId, linkMode, etc.) are updated
 * by the main reducer AFTER this function returns the new graph data.
 */
export declare function applyInteraction(currentState: InteractionState, action: InteractionAction): InteractionState;
//# sourceMappingURL=applyInteractionAction.d.ts.map