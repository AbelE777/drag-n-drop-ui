import { createContext, useState } from "react";
import Swal from "sweetalert2";


export const FilesContext = createContext()


export const FileProvider = ({children}) => {
  const [fileList, setFileList] = useState([]);

  const reorder = (list, startIndex, endIndex) => {
    // console.log(list)
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    return result;
  };
  const handleDragEnd = (res)=>{
    const {source, destination} = res
    
    if(!destination) return
    if(source.index === destination.index && source.droppableId === destination.droppableId) return

    const x = reorder([...fileList], source.index, destination.index ).map((item, idx) => {
      item.id = (idx).toString()
      return item
    })
    setFileList(x)
  }
  
  const handleSubmit = (fileList)=>{
    let msg = `Error de envío, `
    let err = false
    fileList.map((file, idx, fileList) => {
      if(fileList.length===1 && idx===0) msg+=` el archivo: `
      else if(fileList.length>1 && idx===0) msg += ` los archivos: `
      
      if(fileList.length===1 && file.url === 'no-url') {
        msg += `${file.name}`
        err = true 
      }
      else if(file.url === 'no-url' && idx+1 < fileList.length) {
        msg += `${file.name}, `
        err = true  
      }
      else if (file.url === 'no-url'&& idx+1===fileList.length) {
        msg += ` y ${file.name}`
        err = true 
      }   
      
      return file
    })
    if(err === true && fileList.length===1) handleAlert('error', msg+' no tiene un enlace adjunto.')
    else if(err === true && fileList.length>1) handleAlert('error', msg+' no tienen un enlace adjunto.')
    else if(err === false) {
      console.log(fileList)
    }
  }

  const handleAlert = (typeAlert, alertMsg) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: typeAlert,
      title: alertMsg
    })
  }

  return (
    <FilesContext.Provider 
      value={{
        fileList, 
        setFileList, 
        handleSubmit, 
        handleAlert,
        reorder,
        handleDragEnd
      }}
    >
      {children}
    </FilesContext.Provider>
  )
}