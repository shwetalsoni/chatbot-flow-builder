import { useState, useRef, useLayoutEffect, useEffect } from 'react'

import './index.css'
import { IoIosArrowRoundBack } from 'react-icons/io'

// for updating the node text

type PropsType = {
  selectedNode: Node<any, string | undefined>
  updateNode: (id: string, data: { text: string }) => void
  closeSetting: () => void
}

export function SettingsPanel(props: PropsType) {
  const [message, setMessage] = useState(props.selectedNode.data.text)
  const inputFieldRef = useRef<HTMLTextAreaElement>(null)

  console.log(props.selectedNode)

  // for adjusting height of textarea
  useLayoutEffect(() => {
    if (!inputFieldRef.current) return
    const MIN_TEXTAREA_HEIGHT = 50
    // Reset height - important to shrink on delete
    inputFieldRef.current.style.height = 'inherit'
    // Set height
    inputFieldRef.current.style.height = `${Math.max(
      inputFieldRef.current.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    )}px`
  }, [message])

  useEffect(() => {
    // updating node when text input changes
    props.updateNode(props.selectedNode.id, { text: message })
  }, [message])

  return (
    <aside>
      <div className="settings-header">
        <div onClick={props.closeSetting} className="back-btn">
          <IoIosArrowRoundBack size={25} />
        </div>
        <p>Message</p>
      </div>
      <div className="settings-form">
        <p>Text</p>
        <form>
          <textarea
            id="message-node"
            name="text"
            ref={inputFieldRef}
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            value={message}
            rows={1}
          >
            {message}
          </textarea>
        </form>
      </div>
    </aside>
  )
}
