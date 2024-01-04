import React, { useContext } from "react";
import { MdCheckCircle } from "react-icons/md";
import { VscEdit } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { FilesContext } from "../../context/FilesContext";

import url_icon from "../../assets/url_icon.png";
import { DragDropContext } from "react-beautiful-dnd";

const DropFileList = ({ fileList, fileRemove, fileEdit }) => {
  const {handleSubmit, handleDragEnd} = useContext(FilesContext)
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
    <div className="drop-file-preview">
      <p className="drop-file-preview__title">
        <span>
          <MdCheckCircle className="ready-message"/>
          {fileList.length}{" "}
          {`${fileList.length === 1 ? "Banner listo" : "Banners listos"}`}{" "}
          para subir{" "}
        </span>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
          onClick={()=>handleSubmit(fileList)}
        >
          SUBIR
        </button>
      </p>

      <Droppable droppableId="files">
        {(droppableProvided) => (
          <div
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
          >
            {fileList
              .map((item, idx) => (
                <Draggable key={idx} draggableId={item.id.toString()} index={idx}>
                  {(draggebleProvided) => (
                    <div
                      ref={draggebleProvided.innerRef}
                      {...draggebleProvided.draggableProps}                      
                      {...draggebleProvided.dragHandleProps}
                      className="drop-file-preview__item"
                    >
                      <img src={URL.createObjectURL(item)} alt="" />
                      
                      <div className="drop-file-preview__item__info">
                        <p>{item.name}</p>
                        <p>{item.size}B</p>
                        <p>
                          <img
                            src={url_icon}
                            style={{ width: "16px", height: "16px" }}
                            alt="url_icon"
                          />
                          {item.url === "no-url" ? (
                            item.url
                          ) : (
                            <a
                              style={{ color: "-webkit-link" }}
                              rel="noreferrer"
                              target="_blank"
                              href={item.url}
                            >
                              {item.url}
                            </a>
                          )}
                        </p>
                      </div>
                      <span
                        onClick={() => fileRemove(item)}
                        className="drop-file-preview__item__del"
                      >
                        <MdDelete />
                      </span>
                      <span
                        className="drop-file-preview__item__edit"
                        onClick={() => fileEdit(item)}
                      >
                        <VscEdit />
                      </span>
                    </div>
                  )}
                </Draggable>
              ))
              }
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
    </DragDropContext>
  );
};

export default DropFileList;
