/* eslint-disable react/prop-types */
import { useState } from "react";

export default function PlaceGallery({place}) {

  const [showAllPhotos, setShowAllPhotos] = useState(false);
if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white  min-h-screen">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className="text-3xl mr-48">
              Photos of <span className="font-bold">{place.title}</span>
            </h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed right-5 top-10 bg-gray-700 text-white w-min px-3 py-1 rounded-full hover:transition-opacity cursor-pointer hover:bg-gray-300 hover:text-black shadow shadow-black "
            >
              X
            </button>
          </div>
          {place?.photos?.length > 0 &&
            place.photos.map((photo) => (
              // eslint-disable-next-line react/jsx-key
              <div>
                <img src={"http://localhost:4000/uploads/" + photo} alt="" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
          <div className="">
            {place.photos?.[0] && (
              <div className="">
                <img onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover cursor-pointer"
                  src={"http://localhost:4000/uploads/" + place.photos[0]}
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="grid ">
            {place.photos?.[1] && (
              <div className="">
                <img onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover cursor-pointer"
                  src={"http://localhost:4000/uploads/" + place.photos[1]}
                  alt=""
                />
              </div>
            )}
            {place.photos?.[2] && (
              <div className="overflow-hidden">
                <img onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover cursor-pointer relative top-2"
                  src={"http://localhost:4000/uploads/" + place.photos[2]}
                  alt=""
                />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="flex gap-1 text-center justify-center absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-gray-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 m-[2px]"
          >
            <path
              fillRule="evenodd"
              d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
              clipRule="evenodd"
            />
          </svg>
          Show more photos
        </button>
      </div>
  )
}