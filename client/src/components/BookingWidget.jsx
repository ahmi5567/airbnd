/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import {differenceInCalendarDays} from 'date-fns'
import {Navigate} from 'react-router-dom'
import axios from "axios";
import {UserContext} from './UserContext.jsx'

/* eslint-disable react/prop-types */
export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name , setName] = useState('')
  const [phone , setPhone] = useState('')
  const [redirect , setRedirect] = useState()
  const {user} = useContext(UserContext)

  useEffect(()=>{
    if(user){
      setName(user.name)
    }
  }, [user])

  let numberofNights  = 0;
  if(checkIn && checkOut){
    numberofNights  = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
  }

  async function bookThisPlace() {
    const bookingData = {
      place:place._id, price:numberofNights*place.price, checkIn , checkOut , numberOfGuests, name ,phone

    }
    const response = await axios.post('/bookings', bookingData)
    const bookingId = response.data._id;
    setRedirect(`/account/booking/${bookingId}`)
  }

  if(redirect){
    return  <Navigate to={redirect} />
  }

  return (
    <div className="bg-white shadow  p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price:${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4 ">
            <label>Check in: </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l ">
            <label>Check out: </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t ">
          <label>Number of guests: </label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
          />
        </div>
        {numberofNights > 0 && (
          <div className="py-3 px-4 border-t ">
          <label>Your full name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Your phone number: </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        )}
      </div>

      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberofNights  > 0 && (
          <span> ${numberofNights * place.price}</span>
        )}
      </button>
    </div>
  );
}
