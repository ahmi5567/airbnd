import { useEffect, useState } from "react";
import Labels from "../components/Labels";
import axios from "axios";
import PhotoUploader from "../components/PhotoUploader";
import AccountNav from "../components/AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
  const {id} = useParams();
  console.log(id); 
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(''); 
  const [price , setPrice] = useState('')
  const [redirect, setRedirect] = useState(false);

  useEffect(()=>{
    if(!id) {
      return;
    }
    axios.get('/places/' +id).then(response => {
      const {data} = response;
      setTitle(data.title);
      setAddress(data.address);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
      setAddedPhotos(data.photos);
    })
  } ,[id])

  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    )
  }
  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    )
  }

  function preInput(header, description) {
    return (
      <div>
        {inputHeader(header) }
        {inputDescription(description) }
      </div>
    )
  }

  async function addPhotoByLink(e){
    e.preventDefault();
    const {data:filename} = await axios.post('/upload-by-link' , {link:photoLink})
    setAddedPhotos(prev => {
      return [...prev , filename]
    })
    setPhotoLink('')
  }

  // FUNCTION TO UPLOAD PHOTO FROM DEVICE
  function uploadPhoto(e) {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('photos', files[i]);
    }
    axios.post('/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      const { data: filenames } = response;
      setAddedPhotos(prev => {
        return [...prev, ...filenames];
      });
    });
  }

  async function addNewPlace(e){
    e.preventDefault();
    const placeData = { title , address , description , perks , extraInfo , checkIn , checkOut , maxGuests ,price, addedPhotos}
    if(id){
      // update
      await axios.put('/places' , {id , ...placeData}) 
      setRedirect(true);
    }else{
      
      await axios.post('/places', placeData)
      setRedirect(true);
    }
    
  }
  return (
    <>
    {redirect && <Navigate to="/account/places" />}
    <AccountNav /> 
    <div>
          <form onSubmit={addNewPlace}>
            {preInput('Title' , 'Title for your place, should be short and catchy as in advertisement')}
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            {preInput('Address' , 'Address to this place')}
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Title" />
            {preInput('Photos' , 'Photos for your place')}
            <PhotoUploader addedPhotos={addedPhotos} photoLink={photoLink} setAddedPhotos={setAddedPhotos} setPhotoLink={setPhotoLink} addPhotoByLink={addPhotoByLink} uploadPhoto={uploadPhoto} />
            {preInput('Description' , 'Description of the place')}
            <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            {preInput('Perks' , 'Select all the perks of your place')}
            <div className="grid grid-cols-2 mt-4 md:grid-cols-3 lg:grid-cols-6 gap-2">
              <Labels selected={perks} onChange={setPerks} />
            </div>
            {preInput('Extra Info' , 'House rules ...etc')}
            <textarea rows={5} value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)}></textarea>
            {preInput('Check in&out times' , 'add check in and out  times, remember to have some time window for cleaning the room between guests')}
            <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
              <div>
                <h2>Check in time</h2>
                <input type="text" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} placeholder="Check in time" />
              </div>
              <div>
                <h2>Check out time</h2>
                <input type="text" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} placeholder="Check out time" />
              </div>
              <div>
                <h2>Max guests</h2>
                <input type="number" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} placeholder="Max guests" />
              </div>
              <div>
                <h2>Price per night</h2>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
              </div>
            </div>
              <button className="primary my-4" type="submit">Save</button>
          </form>
        </div>
        </>
  )
}