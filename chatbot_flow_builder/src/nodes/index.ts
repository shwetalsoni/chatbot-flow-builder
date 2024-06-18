import type { Node, NodeTypes } from 'reactflow'
import { MessageNode } from './MessageNode'

// initial nodes on canvas
export const initialNodes = [
  {
    id: 'node_0',
    type: 'message-node',
    position: { x: 0, y: 0 },
    data: { text: 'Welcome message' },
  },
] satisfies Node[]

export const nodeTypes = {
  'message-node': MessageNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes
