import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Loader from './components/loader'
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactModal from 'react-modal';
import addIcon from "./assets/images/plus_icon.png"
import deleteIcon from "./assets/images/delete_icon.png"

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:5000/allimages");
      const sortedImages = response.data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setImages(sortedImages);
      // setImages(response.data);
    } catch (error) {
      console.error("Error fetching images: ", error);
      toast.error('Error fetching images');
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);


  const handleUpload = async (e) => {
    // const files = e.target.files[0];  //single file
    const files = Array.from(e.target.files); //multiple files
    if (files) {
      const formdata = new FormData();
      // formdata.append("avatar", files); //single file
      // multiple files
files.map(file =>{
      formdata.append("photos", file);
})
setIsLoading(true)
      try {
        await axios.post("http://localhost:5000/multipleimg", formdata);
        fetchImages()
        toast.success('Images uploaded successfully');
        document.getElementById('upload-input').value = ''; // Clear the input value when each successful update
      } catch (error) {
        console.error(error);
        toast.error('Error uploading images');
      }finally {
        setIsLoading(false);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("draggedIndex");
    if (dropIndex !== null) {
      const newImages = [...images];
      // splice(start,deletecount,itemadd)
      const [draggedImage] = newImages.splice(draggedIndex, 1); // Remove the dragged image
      newImages.splice(dropIndex, 0, draggedImage); // Insert the dragged image at the new position
      setImages(newImages);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true)
      await axios.delete(`http://localhost:5000/singleimg/${id}`);
      fetchImages(); // Refresh the images after deletion
      toast.success('Image deleted successfully');
      setIsLoading(false)
    } catch (error) {
      console.error("Error deleting image: ", error);
      toast.error('Error deleting image');
      setIsLoading(false)
    }
  };

  const imagePath = (url)=>{
    const trimmedPath = url?.split('upload\\')[1];
    return trimmedPath;
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const handleFileDrop = (e)=>{
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
  }
  const handleModal=(url)=>{
    setSelectedImage(url)
     setIsModalOpen(true)
   }

  const handleClearFile=()=>{
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  return (
    <div className="app">
      <h1>Drag and Drop Gallery</h1>
      <div
        className="drop-area"
        onDragOver={handleDragOver}
        onDrop={handleFileDrop}
      >
        Drag and drop files here to upload
      </div>
      <label htmlFor="upload-input" className="upload-label">
        Upload Images
      </label>
      <input
        type="file"
        id="upload-input"
        multiple
        onChange={handleUpload}
        className="upload-input"
        accept="image/*"  // Accept all image formats
      />
      
      <div className="gallery">
        {images.map((image, i) => (
          <div
            key={i}
            className="gallery-item"
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
          >
            <img
              src={'http://localhost:5000/' +imagePath(image.path) }
              alt={image.filename}
              className="gallery-image"
              onClick={()=>handleModal('http://localhost:5000/' +imagePath(image.path))}
            />
            <div> <img src={deleteIcon} alt="" className='delete_btn' onClick={()=>handleDelete(image._id)}/></div>
          </div>
        ))}
         <div
          className="gallery-items"
          onDragOver={handleDragOver}
          onDrop={handleFileDrop}
          style={{color:'gray', display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}
        >
          <h4 className='file-upload'> Drag and drop files here to upload</h4>
      <div style={{width:'100%', display:'flex',justifyContent:'center', alignItems:'center'}}>
          <input
        type="file"
        id="upload-input"
        multiple
        onChange={(e)=>handleUpload(e.target.files)}
        className="upload-input"
        accept="image/*"  // Accept all image formats
      /> 
         <label htmlFor="upload-input">
          <img src={addIcon} alt="upload_img" className='upload_img' />
          </label>
      </div>
        </div>
      </div>
      <ReactModal
      style={customStyles}
      isOpen={isModalOpen}
      onRequestClose={handleClearFile}>
      <img src={selectedImage} alt="img" className='selected-img'/>
      </ReactModal>
      <ToastContainer 
    position="top-right"
    autoClose={2000}
    hideProgressBar
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    transition={Slide}
/>
      <Loader loading={isLoading}/>
    </div>
  );
};

export default App;
