import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './ImageGallery/Modal/Modal';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { fetchImages } from 'components/services/fetchImages';

export  const App =() => {
   
    const [searchRequest, setSearchRequest] = useState('')
    const [images, setImages] = useState([])
    const [galleryPage,setGalleryPage] = useState (1)
    const [error,setError] = useState (null)
    const [isLoading,setIsLoading] = useState (false)
    const [showModal,setShowModal] = useState (null)

useEffect(()=>{
  const updateImages = async (searchRequest,galleryPage) =>{
    setIsLoading(true);
    try{
      fetchImages(searchRequest, galleryPage).then(data=>{
        const hitsArray = data.data.hits
        if (!hitsArray.length){
          return toast.error(
            'There are no images found by your search request'
          )
        }
        const mappedImages = hitsArray.map(
          ({id,webformatURL,tags,largeImageURL}) => ({
            id,webformatURL,tags,largeImageURL,
          })
        )
        setImages(i=>[...i,...mappedImages])
      })
    } catch(error){
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }
if (searchRequest !== '' || galleryPage !==1){
  updateImages(searchRequest,galleryPage)
}  
},[searchRequest,galleryPage])
const handleSearchSubmit = value => {
  if (value !== searchRequest){
    setSearchRequest(value)
    setImages([])
    setGalleryPage(1)
    return
  }
}
const loadMore = () => {
  setGalleryPage(galleryPage + 1)
}

const openModalImage = id => {
  const image = images.find(image => image.id === id)
  setShowModal({
    largeImageURL:image.largeImageURL,
    tags:image.tags,
  })
}

const closeModalImage = () => {
  setShowModal(null)
}

return(
  <>
  <Searchbar onSearch={handleSearchSubmit}/>
  {error && toast.error(`Whoops,something went wrong: ${error.message}`)}
  {images.length > 0 && (
    <>
    <ImageGallery images={images} handlePreview ={openModalImage}/>
    {images.length >=12 && <Button loadMore={loadMore}/>}
  </>
  )}
  {isLoading && <Loader color ={'#3f51b5'}size={200}/>}
  {showModal && (
    <Modal
    lgImage={showModal.largeImageURL}
    tags={showModal.tags}
    closeModal={closeModalImage}/>
  )}
  <ToastContainer autoClose={2500}/>
  </>
)

  };
