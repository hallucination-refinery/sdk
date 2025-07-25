#!/usr/bin/env bash
# Script to add timing instrumentation to track data mutations
# Part of comprehensive-investigation.md

set -e

echo "🔧 Adding mutation timeline instrumentation..."

# Create backup directory
mkdir -p scripts/backups
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Backup original files
echo "📦 Backing up original files..."
cp apps/legacy-import/cryptic-vault-demo/components/CrypticVaultScene.tsx scripts/backups/CrypticVaultScene.tsx.$TIMESTAMP
cp apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx scripts/backups/CrypticAnimusScene.tsx.$TIMESTAMP
cp packages/canvas-r3f/src/adapters/ForceGraphAdapter.tsx scripts/backups/ForceGraphAdapter.tsx.$TIMESTAMP

echo "🎯 Adding instrumentation..."

# Instrument CrypticVaultScene.tsx
cat > scripts/instrument-patches/CrypticVaultScene.patch << 'EOF'
--- a/apps/legacy-import/cryptic-vault-demo/components/CrypticVaultScene.tsx
+++ b/apps/legacy-import/cryptic-vault-demo/components/CrypticVaultScene.tsx
@@ -289,6 +289,7 @@
 
   const graphData = useMemo(
     () => {
+      console.time('[Mutation] graphData creation')
       const result = {
         nodes: allNodes as any,
         links: [...rawEdgesCausal, ...rawEdgesAffinity, ...rawEdgesTemporal],
@@ -296,6 +297,8 @@
         edges_affinity: rawEdgesAffinity,
         edges_temporal: rawEdgesTemporal,
       }
+      console.timeEnd('[Mutation] graphData creation')
+      console.log('[Mutation] graphData nodes:', result.nodes.length, 'links:', result.links.length)
       return result
     },
     [allNodes, rawEdgesCausal, rawEdgesAffinity, rawEdgesTemporal]
@@ -302,7 +305,10 @@
   // --- Compute visibility set based on current slider time ---
   const visibleIdSet: Set<string> = useMemo(() => {
+    console.time('[Mutation] visibleIdSet computation')
     const ids = new Set<string>(
       rawNodes
         .filter((n: any) => new Date(n.firstDate) <= new Date(dates[timeIndex]))
         .map((n: any) => n.id)
     )
+    console.timeEnd('[Mutation] visibleIdSet computation')
+    console.log('[Mutation] visibleIdSet size:', ids.size)
     return ids
   }, [timeIndex])
@@ -350,6 +356,7 @@
     const { nodes: nodesMap, edges: edgesMap } = arraysToMaps(nodeArray, edgeArray)
 
     // Batch add nodes and edges to store
+    console.time('[Mutation] Store initialization')
     graphStore.batchAddNodes(nodeArray)
     graphStore.batchAddEdges(edgeArray)
+    console.timeEnd('[Mutation] Store initialization')
 
EOF

# Instrument CrypticAnimusScene.tsx
cat > scripts/instrument-patches/CrypticAnimusScene.patch << 'EOF'
--- a/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx
+++ b/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx
@@ -80,10 +80,13 @@
     nodeMap,
   } = useMemo(() => {
     // Use structuredClone to ensure fresh objects, replacing shallow spreads
+    console.time('[Mutation] CrypticAnimus data clone')
     const nodes = structuredClone(data.nodes)
     const links = structuredClone(data.links)
     const nodeMap = new Map(nodes.map((node) => [node.id, node]))
+    console.timeEnd('[Mutation] CrypticAnimus data clone')
+    console.log('[Mutation] Cloned nodes:', nodes.length, 'links:', links.length)
     return { nodes, links, nodeMap }
   }, [data])
 
@@ -101,6 +104,7 @@
   useEffect(() => {
     if (!fgRef.current || !fgRef.current.d3Force) return
 
+    console.time('[Mutation] Physics configuration')
     console.log('[CrypticAnimusScene] Configuring physics forces!')
 
     // Configure physics for a very spread-out layout with rigid links
@@ -117,6 +121,7 @@
     fgRef.current.d3Force('center')?.strength(0.1)
 
+    console.timeEnd('[Mutation] Physics configuration')
     // Let the simulation run continuously; we will let ForceGraph manage alpha decay
   }, [fgRef.current]) // Run when ref changes from null to ForceGraph instance
EOF

# Instrument ForceGraphAdapter.tsx
cat > scripts/instrument-patches/ForceGraphAdapter.patch << 'EOF'
--- a/packages/canvas-r3f/src/adapters/ForceGraphAdapter.tsx
+++ b/packages/canvas-r3f/src/adapters/ForceGraphAdapter.tsx
@@ -123,7 +123,11 @@
 const ForceGraphAdapter = forwardRef<ForceGraphAdapterRef, ForceGraphAdapterProps>((props, ref) => {
   console.log('[FGAdapter] mounted')
   const { graphData, dataVersion = 0, disableLinkForce, ...restProps } = props
-  const safeGraphData = useMemo(() => structuredClone(graphData), [dataVersion])
+  const safeGraphData = useMemo(() => {
+    console.time('[Mutation] ForceGraphAdapter data clone')
+    const cloned = structuredClone(graphData)
+    console.timeEnd('[Mutation] ForceGraphAdapter data clone')
+    console.log('[Mutation] ForceGraphAdapter cloned nodes:', cloned.nodes.length, 'links:', cloned.links.length)
+    return cloned
+  }, [dataVersion, graphData])
   // --- freeze-crash guard ----------------------------------------------
   useEffect(() => {
     if (disableLinkForce) {
EOF

echo "📝 Creating instrument-patches directory..."
mkdir -p scripts/instrument-patches

echo "✅ Instrumentation patches created!"
echo ""
echo "To apply instrumentation:"
echo "  patch -p0 < scripts/instrument-patches/CrypticVaultScene.patch"
echo "  patch -p0 < scripts/instrument-patches/CrypticAnimusScene.patch"
echo "  patch -p0 < scripts/instrument-patches/ForceGraphAdapter.patch"
echo ""
echo "To restore originals:"
echo "  cp scripts/backups/CrypticVaultScene.tsx.$TIMESTAMP apps/legacy-import/cryptic-vault-demo/components/CrypticVaultScene.tsx"
echo "  cp scripts/backups/CrypticAnimusScene.tsx.$TIMESTAMP apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx"
echo "  cp scripts/backups/ForceGraphAdapter.tsx.$TIMESTAMP packages/canvas-r3f/src/adapters/ForceGraphAdapter.tsx"