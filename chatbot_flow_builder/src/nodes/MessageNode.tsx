import type { NodeProps } from 'reactflow'
import { Handle, Position } from 'reactflow'
import { BiMessageRoundedDetail } from 'react-icons/bi'
import Whatsapp from '../assets/whatsapp.png'

// custom message node
export type MessageNodeData = {
  text?: string
}

export function MessageNode({ data }: NodeProps<MessageNodeData>) {
  return (
    <div className="message-node">
      <Handle type="target" position={Position.Left} />
      <div className="message-box">
        <div className="label-div">
          <div className="left">
            <BiMessageRoundedDetail size={15} />
            <label className="right" htmlFor="text">
              <b>Send message</b>
            </label>
          </div>
          <div>
            <img src={Whatsapp} className="whatsapp-icon" />
          </div>
        </div>
        <div className="main-text">{data.text}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
