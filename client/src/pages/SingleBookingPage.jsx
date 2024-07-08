import { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import AddressLink from '../components/AddressLink'
import PlaceGallery from '../components/PlaceGallery'
import BookingDates from '../components/BookingDates'
import { differenceInCalendarDays } from 'date-fns'

export default function SingleBookingPage() {
  const {id} = useParams()
  const [booking , setBooking] = useState(null)
  useEffect(()=>{
    if(id) {
      axios.get('/bookings').then(response =>{
        const foundBooking =  response.data.find(({_id}) => _id === id);
        if(foundBooking) {
          setBooking(foundBooking)
        }
      })
    }
  },[id])

  if (!booking) {
    return <div>Loading....</div>
  }
  return (
    <div className='my-8'>
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className=''>{booking.place.address}</AddressLink>
      <div className="bg-gray-200  py-4 mb-4 rounded-2xl">
        <h2 className='text-xl ml-3'>Your Booking Information:</h2>
        <div className="ml-3">
        <BookingDates booking={booking}/>
        <div className="flex gap-1 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                      </svg>
                    Total Price: ${booking.price}
                    </div>
        <div className="flex gap-1 mt-1">
                      <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                      >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                      />
                      </svg>
                      {differenceInCalendarDays(
                      new Date(booking.checkOut),
                      new Date(booking.checkIn)
                      )}{" "} nights
                       </div>
                     
        </div>
      </div>
      <PlaceGallery place={booking.place}/>
    </div>
  )
}