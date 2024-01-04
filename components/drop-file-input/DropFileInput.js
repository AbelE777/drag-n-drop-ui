import React, { useRef, useContext, useEffect } from 'react'
import './drop-file-input.css'
import uploadImg from '../../assets/down.png'
import Swal from "sweetalert2";

import { FilesContext } from '../../context/FilesContext'
import {DragDropContext} from 'react-beautiful-dnd'

// components
import DropFileDetail from '../drop-file-list/DropFileList'


const DropFileInput = ({onFileChange}) => {
  const {fileList, setFileList, handleAlert} = useContext(FilesContext)

  const fileRemove = (file)=>{    
    const updatedList = [...fileList]
    // console.log({updatedList, fileList: fileList.indexOf(file), file})
    updatedList.splice(fileList.indexOf(file), 1)
    setFileList(updatedList)
    onFileChange(updatedList)
  }
  async function fileEdit(file) {
    const { value: url } = await Swal.fire({
      input: 'url',
      inputLabel: `URL archivo: ${file.name}`,
      inputPlaceholder: 'Ingresa la URL',
      showCancelButton: true,
      confirmButtonText: file.url==='no-url'?'Agregar URL':'Actualizar URL',
      inputValue: file.url==='no-url'?'':file.url
    })
    
    if (url) {
      const FileListUpdated = [...fileList].map( f => {
        if(file.name === f.name) f.url = url
        return f
      })
      
      setFileList(FileListUpdated)
    }
  }
  const getUniqueFilesBy = (arr, key) => {
    const uniqueValues = new Set(arr.map(v => v.name));
    if (uniqueValues.size < arr.length) {
      const msg = 'No se admiten archivos duplicados.'
      handleAlert('warning', msg)
    }

    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  const wrapperRef = useRef(null);
  const onDragEnter = ()=> wrapperRef.current.classList.add('dragover');  
  const onDragLeave = ()=> wrapperRef.current.classList.remove('dragover');  
  const onDragOver = (e) => e.preventDefault();
  
  const onDrop = e => {
    e.preventDefault();
    wrapperRef.current.classList.remove('dragover');
    const files = [...e.dataTransfer.files]
    
    const updatedList = files.filter( (file, idx) => {
      const fileExtension = file.name.split('.').pop()
      // agrego propiedad url
      file.url= 'no-url'
      if(file.name.includes(' ')) {
        const msg = `Error '${file.name}', no se admiten espacios en el nombre de archivo.`
        handleAlert('error', msg)
      }
      else if(file && (fileExtension==='png' || fileExtension==='jpg' || fileExtension==='jpeg')) {
        // const updatedList = [...fileList, file];
        file.id = file.lastModified.toString()
        return file
      }
      else {
        const msg = 'Se admiten únicamente archivos de extension png, jpg o jpeg.'
        handleAlert('error', msg)
      }

    })

    // filtrar repetidos
    const merged = [...fileList, ...updatedList]
    const noDuplicatedFiles = getUniqueFilesBy(merged, 'name')    

    setFileList(noDuplicatedFiles)
    onFileChange(noDuplicatedFiles)
    
  }    
  
  return (
    <>
      <div 
        ref={wrapperRef}
        className='drop-file-input'
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onDragOver={onDragOver} 
      >
        <div className="drop-file-input__label">
          <img src={uploadImg} alt="upload logo" className='bounce'/>

          <p>Arrastra y suelta tus Banners aqui</p>
        </div>

        {/* <input type="file" value="" onChange={onFileDrop}/> */}
      </div>
      
      {
        fileList.length > 0 ? (
          <DropFileDetail fileList={fileList} fileRemove={fileRemove} fileEdit={fileEdit}/>          
        )
        : null
      }
      
    </>
  )
}

export default DropFileInput