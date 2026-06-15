import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export const Brand1 = () => {
  const categories = [
    {
      id: 1,
      image:
        "https://images-static.nykaa.com/uploads/99888ea4-315d-4a06-b57b-a4e3f02202e1.jpg?tr=cm-pad_resize,w-200",
    },
    {
      id: 2,
      image:
        "https://images-static.nykaa.com/uploads/26f7a7ee-6611-4a95-a7ab-718ce5c8d545.jpg?tr=cm-pad_resize,w-200",
    },
    {
      id: 3,
      image:
        "https://images-static.nykaa.com/uploads/a4e15880-1c7e-49f6-bd26-47e287056680.jpg?tr=cm-pad_resize,w-200",
    },
    {
      id: 4,
      image:
        "https://images-static.nykaa.com/uploads/63893df1-9c9b-4b2b-b881-b4fe1240d324.jpg?tr=cm-pad_resize,w-200",
    },
    {
      id: 5,
      image:
        "https://images-static.nykaa.com/uploads/367d0623-e037-4391-b927-12da97798440.jpg?tr=cm-pad_resize,w-200",
    },
    {
      id: 6,
      image:
        "https://images-static.nykaa.com/uploads/99888ea4-315d-4a06-b57b-a4e3f02202e1.jpg?tr=cm-pad0_resize,w-200",
    },
    {
      id: 7,
      image:
        "https://images-static.nykaa.com/uploads/a4e15880-1c7e-49f6-bd26-47e287056680.jpg?tr=cm-pad_resize,w-200",
    },
    {
      id: 8,
      image:
        "https://images-static.nykaa.com/uploads/d0c0fb93-8e0c-4094-9eb7-1268d69e80d7.jpg?tr=cm-pad_resize,w-200",
    },
    {
      id: 9,
      image:
        "https://images-static.nykaa.com/uploads/26f7a7ee-6611-4a95-a7ab-718ce5c8d545.jpg?tr=cm-pad_resize,w-200",
    },
    {
      id: 10,
      image:
        "https://images-static.nykaa.com/uploads/517eff23-3305-49b7-a4b8-3e4f53ca643f.jpg?tr=cm-pad_resize,w-200",
    },
    {
      id: 11,
      image:
        "https://images-static.nykaa.com/uploads/21c0e10f-cf69-4467-8a4e-fe16ded59cb7.jpg?tr=cm-pad_resize,w-200",
    },
    {
      id: 12,
      image:
        "https://images-static.nykaa.com/uploads/a4e15880-1c7e-49f6-bd26-47e287056680.jpg?tr=cm-pad_resize,w-200",
    },
    {
      id: 13,
      image:
        "https://images-static.nykaa.com/uploads/1abeccda-e5d8-4ce0-927d-6abb44977587.jpg?tr=cm-pad_resize,w-200",
    },
  ];

  return (
    <div
      className="grid gap-1 relative p-4"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1831234/pexels-photo-1831234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="grid text-center">
        <h2 className="text-fuchsia-600 italic">Our Popular Brands</h2>
        <h5 className="text-zinc-500 font-serif">The Best Of Grobiz</h5>
      </div>

      <div className="container flex gap-1">
        <Swiper
          slidesPerView={7}
          spaceBetween={2}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <img
                src={category.image}
                alt="Not Found"
                className="rounded-lg object-cover h-16 w-48"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div classname="absolute justify-center items-center mt-10">
        <div className="swiper-button-prev swiper-button-prev-1  p-2 mt-24 ">
          <IoIosArrowBack size={16} className="text-xl" />
        </div>
        <div className="swiper-button-next swiper-button-next-1 p-2">
          <IoIosArrowForward size={16} className="text-xl" />
        </div>
      </div>
    </div>
  );
};
