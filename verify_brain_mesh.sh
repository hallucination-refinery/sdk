#!/bin/bash
# Verify brain mesh deployment and properties

echo "=== Brain Mesh Verification ==="
echo "File: /workspace/public/models/brain.obj"

if [ -f "/workspace/public/models/brain.obj" ]; then
    echo "✅ File exists"
    
    # Count vertices
    vertex_count=$(grep -c "^v " "/workspace/public/models/brain.obj")
    echo "Vertices: $vertex_count"
    
    # Count faces  
    face_count=$(grep -c "^f " "/workspace/public/models/brain.obj")
    echo "Faces: $face_count"
    
    # Check file size
    file_size=$(ls -lh "/workspace/public/models/brain.obj" | awk '{print $5}')
    echo "File size: $file_size"
    
    # Check if under 50k vertex limit
    if [ "$vertex_count" -le 50000 ]; then
        echo "✅ Vertex count under 50k limit"
    else
        echo "❌ Vertex count exceeds 50k limit"
    fi
    
    # Check if has faces (proper mesh)
    if [ "$face_count" -gt 0 ]; then
        echo "✅ Proper mesh topology (has faces)"
    else
        echo "❌ Point cloud only (no faces)"
    fi
    
    echo "✅ Brain mesh verification complete"
else
    echo "❌ Brain mesh file not found"
fi