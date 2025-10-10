# Reference Notes — Interactive Particles (Codrops, 2019-01-17)
- URL: https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/

Key Ideas to Borrow
- Use a Raycaster against an invisible plane matching the particle geometry to obtain screen-space UV coordinates of the pointer.
- Maintain a short trail of pointer positions by drawing onto an off-screen canvas; pass it to the shader as a texture uniform (e.g., `uTouch`).
- In the vertex shader, sample the touch texture and displace particles along randomised local directions (`cos(angle)`, `sin(angle)`) scaled by the sampled intensity.
- Apply easing/decay to the stroke radius/intensity on the CPU before drawing to the canvas to keep motion smooth.
- Threshold the source image/point cloud to decide which particles participate, mirroring scene orientation when sampling.

Applicability to Our Plan
- Phase A (M1) can emulate the displacement math with a single temporary uniform before adopting the texture approach.
- Phase B (M1) / future: replace temp uniform with the `uTouch` canvas texture to gain trail persistence without iterating over every particle on the CPU.
- Cascade work (M2) can reuse the same UV sampling infrastructure to seed palette selection.
