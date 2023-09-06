import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {isAdmin} from '../api'
import Button from '../components/UI/Button'
import {actionPromise} from '../store/PromiseReducer'
import {gqlFunc} from '.'
import {categoryDelete, queryAllCategories} from '../const'
import InputCategoryChange from '../components/content/InputCategoryChange'
import styles from './TreeOfCats.module.css'

const TreeNode = ({id, node, level, onToggle}) => {
  const {name, child, parent} = node
  const parentId = parent ? parent._id : null

  const [expanded, setExpanded] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleCategoryDelete = async (name, id) => {
    if (window.confirm(`Вы действительно хотите удалить категорию ${name}?`)) {
      await dispatch(
        actionPromise('getAllCategories', gqlFunc(categoryDelete, {categoryDelete: {_id: id}}))
      )
      await dispatch(actionPromise('getAllCategories', gqlFunc(queryAllCategories, {})))
    }
  }

  const handleToggle = () => {
    setExpanded(!expanded)
    onToggle(node._id)
  }

  return (
    <div className={styles.catList}>
      <li key={id}>
        <div className={styles.oneCategory} onClick={handleToggle}>
          {child && child.length > 0 && (expanded ? '-' : '+')}
        </div>
        <Link to={`/category/${id}?categoryName=${encodeURIComponent(name)}`}>
          {isAdmin() ? (
            <InputCategoryChange
              currentCategory={{
                _id: id,
                name: name,
                parent: null,
              }}
              action={'editCurrentCat'}
            />
          ) : (
            <>{name}</>
          )}
        </Link>
        {isAdmin() && (
          <>
            <Button
              text={'\u2715'}
              width="18px"
              height="18px"
              border-radius="3px"
              onClick={() => handleCategoryDelete(name, id)}
            />
            <Button
              text={'\u002B т'}
              width="27px"
              height="18px"
              border-radius="3px"
              onClick={() => {
                navigate(`goodAction/newGood/category/${id}/${name}`)
              }}
            />
            {level > 1 && (
              <Button
                text={'\u002B к'}
                width="27px"
                height="18px"
                border-radius="3px"
                onClick={() => {
                  const inputValue = prompt('Введите название новой категории: ')

                  if (inputValue !== null) {
                    navigate(
                      `catAction/newCat/category/${id}/${encodeURIComponent(
                        inputValue
                      )}/parent/${parentId}`
                    )
                  }
                }}
              />
            )}
            <Button
              text={'\u002B пк'}
              width="30px"
              height="18px"
              border-radius="3px"
              onClick={() => {
                const inputValue = prompt('Введите название новой подкатегории: ')

                if (inputValue !== null) {
                  navigate(
                    `catAction/newSubCat/category/${id}/${encodeURIComponent(
                      inputValue
                    )}/parent/${parentId}`
                  )
                }
              }}
            />
          </>
        )}
      </li>

      {expanded && child && child.length > 0 && (
        <div className={styles.treeNode}>
          {child.map(childNode => (
            <TreeNode
              key={childNode._id}
              id={childNode._id}
              node={childNode}
              level={level + 1}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const TreeOfCats = ({data}) => {
  const [expandedNodes, setExpandedNodes] = useState([])

  const handleNodeToggle = nodeId => {
    if (expandedNodes.includes(nodeId)) {
      setExpandedNodes(expandedNodes.filter(id => id !== nodeId))
    } else {
      setExpandedNodes([...expandedNodes, nodeId])
    }
  }

  return (
    <div>
      {data.map(rootNode => (
        <TreeNode
          key={rootNode._id}
          id={rootNode._id}
          node={rootNode}
          level={1}
          onToggle={handleNodeToggle}
        />
      ))}
    </div>
  )
}

export default TreeOfCats
