"use client"
import { createTrip, uploadtripLogo } from "@/actions/trip/createtrip";
import { ApiResponseType } from "@/models/responnse";
import { TripForm, TripSchema } from "@/schemas/createtrip";
import { Image } from "@nextui-org/react";
import { TripCategory, TripType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, SetStateAction, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

interface TripProps {
    id: number;
}
const CreateTrips = (props: TripProps) => {
    const router = useRouter();


    const name = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLTextAreaElement>(null);
    const location = useRef<HTMLInputElement>(null);
    const location_description = useRef<HTMLTextAreaElement>(null);

    const StartDate = useRef<HTMLInputElement>(null);
    const EndDate = useRef<HTMLInputElement>(null);

    const price = useRef<HTMLInputElement>(null);
    const number_of_people = useRef<HTMLInputElement>(null);

    const tripType = useRef<HTMLSelectElement>(null);
    const tripCategory = useRef<HTMLSelectElement>(null);

    const handleStartDateChange = () => {
        // end Date min value should be bigger then start date
        if (StartDate.current?.value) {
            EndDate.current!.min = StartDate.current.value;
        }
    }
    const handleEntDateChange = () => {
        // start Date max value should be smaller then end date
        if (EndDate.current?.value) {
            StartDate.current!.max = EndDate.current.value;
        }
    }

    const handlePriceInput = (e: ChangeEvent<HTMLInputElement>) => {
        price.current!.value = e.target.value.replace(/\D/g, "");
    }
    const handleNumberOfPeopleInput = (e: ChangeEvent<HTMLInputElement>) => {
        number_of_people.current!.value = e.target.value.replace(/\D/g, "");
    }

    const [logo, setLogo] = useState<File | null>(null);
    const cLogo = useRef<HTMLInputElement>(null);

    const handleLogoChange = (value: React.ChangeEvent<HTMLInputElement>, setFun: (value: SetStateAction<File | null>) => void) => {
        let file_size = parseInt(
            (value!.target.files![0].size / 1024 / 1024).toString()
        );
        if (file_size < 4) {
            if (value!.target.files![0].type.startsWith("image/")) {
                setFun((val) => value!.target.files![0]);
            } else {
                toast.error("Please select an image file.", { theme: "light" });
            }
        } else {
            toast.error("Image file size must be less then 4 mb", { theme: "light" });
        }
    };

    const submit = async () => {

        const result = safeParse(TripSchema, {
            name: name.current!.value,
            description: description.current!.value,
            location: location.current!.value,
            location_description: location_description.current!.value,
            start_date: StartDate.current!.value,
            end_date: EndDate.current!.value,
            price: parseInt(price.current!.value),
            number_of_people: parseInt(number_of_people.current!.value),
            trip_type: tripType.current!.value,
            category: tripCategory.current!.value,
            createdBy: props.id
        });

        if (result.success) {
            if (logo == null) return toast.error("Upload your trip logo first.");

            const imageBuffer = await logo.arrayBuffer();
            const image: string = Buffer.from(imageBuffer).toString("base64");

            const uploadimage: ApiResponseType<string | null> = await uploadtripLogo({
                name: logo.name,
                arrayBuffer: image
            });

            if (!uploadimage.status || uploadimage.data == null) return toast.error(uploadimage.message);

            const createdtrip = await createTrip({
                name: result.output.name,
                start: result.output.start_date,
                end: result.output.end_date,
                image: uploadimage.data,
                price: result.output.price,
                category: result.output.category as TripCategory,
                trip_type: result.output.trip_type as TripType,
                description: result.output.description,
                location: result.output.location,
                location_description: result.output.location_description,
                number_of_people: result.output.number_of_people,
                createdBy: result.output.createdBy,
            });

            if (!createdtrip.status) return toast.error(createdtrip.message);

            toast.success(createdtrip.message);
            return router.replace(`/dashboard/trips/${createdtrip.data?.id}`);
        } else {
            let errorMessage = "";
            if (result.issues[0].input) {
                errorMessage = result.issues[0].message;
            } else {
                errorMessage = result.issues[0].path![0].key + " is required";
            }
            toast.error(errorMessage);
        }
    };


    return (
        <>
            <div className="w-5/6 bg-white rounded-md shadow-lg my-6 p-6 mx-auto">
                <h1 className="text-center text-black text-2xl font-semibold">Create Trip</h1>
                <div className="flex flex-col items-center justify-center">

                    {logo != null ? (
                        <div>
                            <Image
                                src={URL.createObjectURL(logo!)}
                                alt="logo"
                                className="w-60 h-60 object-cover object-center rounded-md"
                            />
                        </div>
                    ) : null}

                    <button
                        onClick={() => cLogo.current?.click()}
                        className="text-white font-semibold text-md py-1 my-2 inline-block px-4 rounded-md bg-green-500"
                    >
                        {logo == null ? "Add Logo" : "Change Logo"}
                    </button>
                </div>
                <div className="hidden">

                    <input
                        type="file"
                        ref={cLogo}
                        accept="image/*"
                        onChange={(val) => handleLogoChange(val, setLogo)}
                    />
                </div>

                <div className="flex w-full items-center py-2 mt-6">
                    <div className="flex-1">
                        <h1 className="text-lg font-medium">Trip Name</h1>
                    </div>
                    <div className="flex-1">
                        <input type="text" className="bg-[#eeeeee] fill-none focus:outline-none rounded-md w-full py-1 px-2"
                            placeholder="Enter trip name"
                            ref={name}
                        />
                    </div>
                </div>
                <div className="flex w-full py-2">
                    <div className="flex-1">
                        <h1 className="text-lg font-medium">Trip Description</h1>
                    </div>
                    <div className="flex-1">
                        <textarea
                            ref={description}
                            placeholder="Enter trip description"
                            className="bg-[#eeeeee] fill-none focus:outline-none rounded-md w-full py-1 px-2 resize-none h-24"
                        >
                        </textarea>
                    </div>
                </div>
                <div className="flex w-full items-center py-2">
                    <div className="flex-1">
                        <h1 className="text-lg font-medium">Trip Location</h1>
                    </div>
                    <div className="flex-1">
                        <input type="text" className="bg-[#eeeeee] fill-none focus:outline-none rounded-md w-full py-1 px-2"
                            placeholder="Enter trip location"
                            ref={location}
                        />
                    </div>
                </div>
                <div className="flex w-full py-2">
                    <div className="flex-1">
                        <h1 className="text-lg font-medium">Trip Location Description</h1>
                    </div>
                    <div className="flex-1">
                        <textarea
                            ref={location_description}
                            placeholder="Enter trip location description"
                            className="bg-[#eeeeee] fill-none focus:outline-none rounded-md w-full py-1 px-2 resize-none h-24">
                        </textarea>
                    </div>
                </div>
                <div className="flex w-full items-center py-2">
                    <div className="flex-1">
                        <h1 className="text-lg font-medium">Start Date</h1>
                    </div>
                    <div className="flex-1">
                        <input
                            type="date" onChange={handleStartDateChange} min={new Date().toISOString().split("T")[0]} ref={StartDate} className="bg-[#eeeeee] fill-none focus:outline-none rounded-md w-full py-1 px-2"
                        />
                    </div>
                </div>
                <div className="flex w-full items-center py-2">
                    <div className="flex-1">
                        <h1 className="text-lg font-medium">End Date</h1>
                    </div>
                    <div className="flex-1">
                        <input type="date" onChange={handleEntDateChange} ref={EndDate} className="bg-[#eeeeee] fill-none focus:outline-none rounded-md w-full py-1 px-2"
                        />
                    </div>
                </div>
                <div className="flex w-full items-center py-2">
                    <div className="flex-1">
                        <h1 className="text-lg font-medium">Price</h1>
                    </div>
                    <div className="flex-1">
                        <input type="text" onChange={handlePriceInput} ref={price} className="bg-[#eeeeee] fill-none focus:outline-none rounded-md w-full py-1 px-2"
                            placeholder="Enter trip price"
                        />
                    </div>
                </div>

                <div className="flex w-full items-center py-2">
                    <div className="flex-1">
                        <h1 className="text-lg font-medium">Number of Peoples</h1>
                    </div>
                    <div className="flex-1">
                        <input type="text" onChange={handleNumberOfPeopleInput} ref={number_of_people} className="bg-[#eeeeee] fill-none focus:outline-none rounded-md w-full py-1 px-2"
                            placeholder="Enter Number of peoples"
                        />
                    </div>
                </div>
                <div className="flex w-full items-center py-2">
                    <div className="flex-1">
                        <h1 className="text-lg font-medium">Select Trip Type</h1>
                    </div>
                    <div className="flex-1">
                        <select ref={tripType} defaultValue={"0"} className="bg-[#eeeeee] fill-none focus:outline-none rounded-md w-full py-1 px-2">
                            <option value="0" disabled>Select Trip Type</option>
                            <option value="PRIVATE">PRIVATE</option>
                            <option value="PUBLIC">PUBLIC</option>
                        </select>
                    </div>
                </div>
                <div className="flex w-full items-center py-2">
                    <div className="flex-1">
                        <h1 className="text-lg font-medium">Select Trip Category</h1>
                    </div>
                    <div className="flex-1">
                        <select ref={tripCategory} defaultValue={"0"} className="bg-[#eeeeee] fill-none focus:outline-none rounded-md w-full py-1 px-2">
                            <option value="0" disabled>Select Trip Category</option>
                            <option value="SCHOOL">SCHOOL</option>
                            <option value="COUPLE">COUPLE</option>
                            <option value="FAMILY">FAMILY</option>
                            <option value="OFFICE">OFFICE</option>
                            <option value="FRIENDS">FRIENDS</option>
                        </select>
                    </div>
                </div>
                <button onClick={submit} className="bg-green-500 py-1 px-4 rounded-md text-white text-lg mt-6 font-semibold">CREATE</button>
            </div>
        </>
    );
}
export default CreateTrips;
