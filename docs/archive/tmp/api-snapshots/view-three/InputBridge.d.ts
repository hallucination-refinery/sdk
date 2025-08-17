import type { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls.js';
interface DreiOrbitControls extends OrbitControlsImpl {
    rotateLeft: (angle: number) => void;
    rotateUp: (angle: number) => void;
    dollyIn: (zoomScale: number) => void;
    dollyOut: (zoomScale: number) => void;
}
interface Props {
    controlsRef: React.RefObject<DreiOrbitControls | null>;
}
export default function InputBridge({ controlsRef }: Props): null;
export {};
