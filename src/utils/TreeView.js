import React, {useState} from 'react'

const TreeNode = ({node}) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = node.child.length > 0

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <span onClick={toggleOpen}>{hasChildren ? (isOpen ? '▼' : '►') : '•'}</span> {node.name}
      {hasChildren && isOpen && (
        <div style={{marginLeft: '20px'}}>
          {node.child.map(childNode => (
            <TreeNode key={childNode._id} node={childNode} />
          ))}
        </div>
      )}
    </div>
  )
}

const TreeView = ({data}) => {
  return (
    <div>
      {data.map(node => (
        <TreeNode key={node._id} node={node} />
      ))}
    </div>
  )
}

export default TreeView
