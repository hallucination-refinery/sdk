import { Dispatch, ReactNode, FC } from 'react';
import { InteractionState, InteractionAction } from './types';
interface InteractionContextType {
    state: InteractionState;
    dispatch: Dispatch<InteractionAction>;
}
export declare function parseDialParams(search: string): {
    interwingleMode: 0 | 1 | 2;
    searchDepth: 1 | 2 | 3;
};
export declare function updateUrlFromDial(mode: number, depth: number): void;
export declare const InteractionProvider: FC<{
    children: ReactNode;
}>;
export declare function useInteractionState(): InteractionState;
export declare function useInteractionDispatch(): Dispatch<InteractionAction>;
export declare function useActiveLens(): 'causal' | 'affinity' | 'temporal';
export declare function useTimeIndex(): number;
export { InteractionContextType };
//# sourceMappingURL=InteractionProvider.d.ts.map