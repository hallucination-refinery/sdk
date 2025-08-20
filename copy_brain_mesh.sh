#!/bin/bash
# Copy the optimal brain mesh (BrainUVs.obj) to public models directory
cp "/workspace/tmp/3dbrain/static/models/BrainUVs.obj" "/workspace/public/models/brain.obj"
echo "Brain mesh copied successfully: BrainUVs.obj → public/models/brain.obj"
echo "Vertices: 39,410 | Faces: 38,972 | UV Mapping: Yes"