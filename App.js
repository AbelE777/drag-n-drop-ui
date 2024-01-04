import './App.css';
import Swal from 'sweetalert2';
// componentes
import DropFileInput from './components/drop-file-input/DropFileInput.js';
import Header from './components/Header/Header';

import {FileProvider} from './context/FilesContext'


function App() {
  const onFileChange = (files) => {
    console.log(files)
  }

  
  return (
    <FileProvider>
      <Header/>
      
      <div className="box">
        <h2 className="header">
          Drag n Drop Promociones
        </h2>

        <DropFileInput
          onFileChange={(files) => onFileChange(files)}
          
        />

      </div>
    </FileProvider>
  );
}

export default App;
