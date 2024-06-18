import { BiMessageRoundedDetail } from 'react-icons/bi'
import './index.css'

// node panel to allow dragable nodes to be used

export function SidePanel() {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the canvas on the left.
      </div>
      {/* add your custom node here using the type set in nodes (index.ts) */}
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'message-node')}
        draggable
      >
        <div className="icon">
          <BiMessageRoundedDetail size={20} />
        </div>
        <p className="message">Message</p>
      </div>
    </aside>
  )
}
