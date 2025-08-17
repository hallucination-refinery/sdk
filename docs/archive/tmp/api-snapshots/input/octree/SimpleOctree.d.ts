import * as THREE from 'three';
export declare class SimpleOctree {
    private root;
    constructor(objects: THREE.Object3D[]);
    queryRay(ray: THREE.Ray): THREE.Object3D[];
}
//# sourceMappingURL=SimpleOctree.d.ts.map