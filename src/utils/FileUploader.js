// import {CircularProgress} from '@mui/material'
import {useState} from 'react'
import styles from './FileUploader.module.css'
import {API_URL} from '../const'

const FileUploader = ({setImages, setImagesId}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [dragEnter, setDragEnter] = useState(false)

  const dragEnterHandler = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragEnter(true)
  }

  const dragLeaveHandler = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragEnter(false)
  }

  const postFiles = async file => {
    const formData = new FormData()
    formData.append('photo', file)

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: localStorage.authToken
          ? {Authorization: 'Bearer ' + JSON.parse(localStorage.authToken).token}
          : {},
        body: formData,
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('File upload error:', error)
    }
  }

  const filesUpload = async files => {
    setIsLoading(true)

    try {
      const uploadedImages = []
      const uploadedIds = []

      for (const file of files) {
        const response = await postFiles(file)
        uploadedImages.push(response)
        uploadedIds.push({_id: response._id})
      }

      setImages(arrImages => [...arrImages, ...uploadedImages])
      setImagesId(arrIds => [...arrIds, ...uploadedIds])
    } catch (error) {
      console.error('File upload error:', error)
    }

    setIsLoading(false)
  }

  const dropHandler = async e => {
    e.preventDefault()
    e.stopPropagation()
    setDragEnter(false)
    setIsLoading(true)
    const files = e.dataTransfer.files
    await filesUpload(files)
  }

  const fileUploadHandler = async e => {
    const files = e.target.files
    await filesUpload(files)
  }

  return (
    <div>
      {!dragEnter ? (
        <div
          onDragEnter={e => dragEnterHandler(e)}
          onDragLeave={e => dragLeaveHandler(e)}
          onDragOver={e => dragEnterHandler(e)}
          className={styles.labelFile}
        >
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <label>
              Загрузка (перетащить сюда)
              <br />
              (png, jpg, pdf)
              <input
                accept=".jpg,.jpeg,.png,.pdf"
                multiple={true}
                onChange={e => fileUploadHandler(e)}
                type="file"
                className={styles.inputFile}
              />
            </label>
          )}
        </div>
      ) : (
        <div
          onDragEnter={e => dragEnterHandler(e)}
          onDragOver={e => dragEnterHandler(e)}
          onDragLeave={e => dragLeaveHandler(e)}
          onDrop={e => dropHandler(e)}
          className={styles.dropFile}
        >
          Drop files here
        </div>
      )}
    </div>
  )
}

export default FileUploader
