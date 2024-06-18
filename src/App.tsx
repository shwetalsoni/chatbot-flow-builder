import { useState, useRef, useCallback, useEffect } from 'react'
import type { OnConnect } from 'reactflow'

import {
  Background,
  Panel,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  ReactFlowInstance,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow'

import 'reactflow/dist/style.css'
import { SidePanel } from './components/SidePanel'
import { SettingsPanel } from './components/SettingsPanel'

import { initialNodes, nodeTypes } from './nodes'
import { initialEdges, edgeTypes } from './edges'

// key to store local storage
const flowKey = 'chatbot-flow'

export default function App() {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)

  // to identify current node to be edited
  const [selectedNode, setSelectedNode] =
    useState<Node<any, string | undefined>>(undefined)

  // error state
  const [error, setError] = useState('')
  const [savedMsg, setSavedMsg] = useState('')

  // restoring previous flow state
  useEffect(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey) || '{}')

      if (flow) {
        setNodes(flow.nodes || [])
        setEdges(flow.edges || [])
      }
    }

    restoreFlow()
  }, [])

  useEffect(() => {
    console.log('nodes', nodes)
    console.log('edges', edges)
  }, [nodes, edges])

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  )

  // for dragging nodes
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // for dropping nodes
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }) || { x: 0, y: 0 }

      const newNode = {
        id: `node_${nodes.length + 1}`,
        type,
        position,
        data: { text: `New message ${nodes.length + 1}` },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, nodes]
  )

  // function to update node text
  function updateNode(id: string, data: { text: string }) {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            text: data.text,
          }
        }
        return node
      })
    )
  }

  // back button
  function closeSetting() {
    setSelectedNode(undefined)
  }

  // saving flow function
  function saveChanges() {
    const mp = new Map()

    nodes.forEach((node) => {
      mp.set(node.id, 0)
    })
    // iterate on edges and increase source_count in map
    edges.forEach((edge) => {
      let cnt = mp.get(edge.source)
      cnt++
      mp.set(edge.source, cnt)
    })
    // loop over map to verify each value is 1 and but one value is 0
    let cnt_0 = 0

    for (const [_, value] of mp) {
      if (cnt_0 > 1) {
        setError('Only one node should have empty target')
        return
      }

      if (value === 0) {
        cnt_0++
      } else if (value !== 1) {
        setError("One node can't connect to multiple nodes")
        return
      }
      setTimeout(() => setError(''), 3000)
    }

    if (cnt_0 > 1) {
      setError('Only one node should have empty target')
      return
    }

    setTimeout(() => setError(''), 3000)

    // saving flow to local storage
    const flow = reactFlowInstance?.toObject()
    localStorage.setItem(flowKey, JSON.stringify(flow))

    setSavedMsg('Successfully saved')

    setTimeout(() => setSavedMsg(''), 3000)
  }

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={(e, node) => setSelectedNode(node)}
            fitView
          >
            {error && (
              <Panel position="top-center" className="error">
                {error}
              </Panel>
            )}
            {savedMsg && (
              <Panel position="top-center" className="saved">
                {savedMsg}
              </Panel>
            )}
            <Panel position="top-right">
              <button onClick={saveChanges}>Save Changes</button>
            </Panel>
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>

        {!selectedNode ? (
          <SidePanel />
        ) : (
          <SettingsPanel
            selectedNode={selectedNode}
            updateNode={updateNode}
            closeSetting={closeSetting}
          />
        )}
      </ReactFlowProvider>
    </div>
  )
}
