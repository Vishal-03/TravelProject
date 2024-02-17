"use client";
import { TripForm, TripSchema } from "@/schemas/createtrip";
import { Image } from "@nextui-org/react";
import { trips } from "@prisma/client";
import { useRouter } from "next/navigation";

interface TripProps {
  trip: any;
}
const ViewTrips = (props: TripProps) => {
  console.log(props.trip);
  const start_date = new Date(props.trip?.start!);
  const start = `${start_date.getDate()}-${
    start_date.getMonth() + 1
  }-${start_date.getFullYear()}`;
  const end_date = new Date(props.trip?.end!);
  const end = `${end_date.getDate()}-${
    end_date.getMonth() + 1
  }-${end_date.getFullYear()}`;
  return (
    <>
      <div className="p-6">
        <div className="w-full bg-white shadow-xl rounded-xl p-4 flex flex-col md:flex-row gap-4">
          <Image
            removeWrapper
            alt="error"
            src={props.trip.image!}
            className=" w-full h-60 md:w-60 md:h-60 rounded-lg object-cover object-center"
          />
          <div className="grow flex flex-col">
            <h1 className="text-black font-semibold text-2xl">
              {props.trip?.name}
            </h1>
            <div className=" mt-2">
              <p>{props.trip?.description}</p>
            </div>
            <div className="grow"></div>
            <div className="flex bg-blue-500 p-2 rounded-lg bg-opacity-20 gap-2 mt-4 md:m-0  ">
              <Image
                alt="error"
                src={props.trip.create.agency.logo}
                className="w-14 h-14 rounded-lg object-cover object-center"
              />
              <div>
                <p className="text-black text-xl font-semibold">
                  {props.trip.create.agency.name}
                </p>
                <p className="text-black">{props.trip.create.agency.contact}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-white shadow-xl rounded-xl p-4 flex gap-4 mt-4 flex-wrap justify-between px-6">
          <div className="mx-4">
            <h1 className="text-center font-normal text-sm">Start Time</h1>
            <p className="text-center font-semibold text-lg">{start}</p>
          </div>
          <div className="mx-4">
            <h1 className="text-center font-normal text-sm">End Time</h1>
            <p className="text-center font-semibold text-lg">{end}</p>
          </div>
          <div className="mx-4">
            <h1 className="text-center font-normal text-sm">Price</h1>
            <p className="text-center font-semibold text-lg">
              {props.trip?.price}
            </p>
          </div>
          <div className="mx-4">
            <h1 className="text-center font-normal text-sm">Trip Type</h1>
            <p className="text-center font-semibold text-lg">
              {props.trip?.category}
            </p>
          </div>
          <div className="mx-4">
            <h1 className="text-center font-normal text-sm">Trip Type</h1>
            <p className="text-center font-semibold text-lg">
              {props.trip?.trip_type}
            </p>
          </div>
        </div>
        <div className="w-full bg-white shadow-xl rounded-xl p-4 mt-4">
          <p className="text-lg font-normal">{props.trip?.location}</p>
          <p className="text-gray-500">{props.trip?.location_description}</p>
        </div>
        {props.trip?.trips_images.length > 0 && (
          <div className="w-full bg-white shadow-xl rounded-xl p-4 mt-4">
            <h1 className="text-2xl mb-4 font-semibold text-center">Gallery</h1>
            <div className=" flex flex-wrap gap-4 justify-center">
              {props.trip?.trips_images.map((image: any, index: number) => (
                <Image
                  key={index}
                  removeWrapper
                  alt="error"
                  src={image.image}
                  className="w-60 h-60 rounded-lg object-cover object-center"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ViewTrips;
