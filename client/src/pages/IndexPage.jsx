import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/places').then(({data}) => {
      setPlaces([...data , ...data]);
    })
  },[])

  if(!places){
    return <div>Loading....</div>
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8 h-auto w-[1200px] overflow-hidden">
       {places.length > 0 && places.map(place => (
        <Link to={'/place/' + place._id} key={place.title}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
          {place.photos?.[0] && (
            <img className="rounded-2xl object-cover aspect-square "  src={`http://localhost:4000/uploads/${place.photos?.[0]}`} alt='' />
          )}
          </div>  
          <h3 className="text-sm font-bold">{place.address}</h3>
          <h2 className="text-sm  text-gray-500 ">{place.title}</h2>
          <div className="mt-1">
            <span className="font-bold">${place.price}</span> per night
          </div>
        </Link>
       ))}
    </div>
  )
}

export default IndexPage
