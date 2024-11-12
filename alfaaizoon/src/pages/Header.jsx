import React, { useEffect, useState } from "react";
// import images
import creadImg from "/images/Overview/cread.webp";
import DuasImg from "/images/Overview/duas.webp";
import HadithImg from "/images/Overview/hadith.webp";
import AzkarImg from "/images/Overview/Azkar.jpg";
import NawawiImg from "/images/Overview/40Nawiwai.webp";
// import component
import NewNavbar from "../_Components/NewNavbar";
import { getCount } from "../Services/TutorialService";
import Footer from "../_Components/footer";
import { Link } from "react-router-dom";

export default function Header() {
  const [categories, setCategories] = useState([]);
  // get categories of the website
  const categoryNames = [
    {
      name: "hadeeth",
      endPoint: "hadiths",
      img: HadithImg,
      path: "Tutorials/hadiths",
    },
    {
      name: "athkaar",
      endPoint: "azkars",
      img: AzkarImg,
      path: "Tutorials/azkars",
    },
    { name: "duas", endPoint: "douas", img: DuasImg, path: "Tutorials/douas" },
    {
      name: "Forty Hadith al-Nawawi",
      endPoint: "arboonNawwis",
      img: NawawiImg,
      path: "Tutorials/arboonNawwis",
    },
    {
      name: "Aqeedah (Creed)",
      endPoint: "aqidahs",
      img: creadImg,
      path: "Tutorials/aqidahs",
    },
  ];
  // -----Fetch Data Of categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await Promise.all(
          categoryNames?.map(async (category) => {
            const count = await getCount(category.endPoint);
            return {
              name: category.name,
              count,
              img: category.img,
              path: category.path,
            };
          })
        );
        setCategories(categoryData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div>
        <NewNavbar ButtonStatius={true} />
        <div className=" bg-bgColor py-4 md:py-16 h-screen">
          <div className="container ">
            <div className="grid md:grid-cols-2 grid-cols-1 ">
              <div
                className="relative flex items-center justify-start  text-black md:p-8 before:absolute before:-left-[200px]   before:lg:top-[20px] before:-top-[10px] before:w-[468px] before:h-[336px] before:bg-[url('/images/bgBefore.png')] before:bg-cover before:bg-center
           "
              >
                <div className="z-30 py-20 flex flex-col items-start justify-start">
                  <div className="py-1 px-6 rounded-full bg-white text-[#088998] mb-5">
                    Let’s Know Islam
                  </div>
                  <h1 className="md:text-6xl   text-3xl text-textColor  font-serif">
                    Read! In the Name your Lord, Who has created
                  </h1>
                  <p className="text-gray-700 font-medium text-[19px] mt-2 ">
                    We are the best Educational Organization.Let’s know about
                    Islam And the holy Quran!
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center relative">
                <div
                  className=" md:flex w-[500px]
              overflow-hidden "
                >
                  <img
                    src="/images/img-3.44bb17a6.png"
                    className="w-full h-full "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container  lg:py-10 py-4">
          <div className="w-full flex justify-center py-4">
            <div className="text-center">
              <h2 className="text-textColor font-sans lg:text-3xl font-semibold text-xl py-2">
                Alfaaizoon School
              </h2>
              <p className="mx-auto flex flex-row items-center  text-center md:w-[60%] w-full text-[#757575] font-medium text-[16px] leading-relaxed">
                Al-faaizoon School for teaching the Quran, matters of creed,
                jurisprudence, biography, ethics, interpretation, hadith,
                morals, and remembrances, suitable especially for children and
                for all ages, including new Muslims.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category, index) => (
              <Link
                to={category.path}
                key={index}
                className="relative w-full h-[200px] bg-cover bg-center cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl "
                style={{ backgroundImage: `url(${category.img})` }}
              >
                {/* Lighter Overlay with Dark Background */}
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>

                {/* Content with Better Font Style and Colors */}
                <div className="relative z-10 flex flex-col justify-center h-full p-6">
                  <h2 className="text-2xl capitalize  text-white font-sans font-semibold">
                    {category.name}
                  </h2>
                  <span className="text-lg font-normal text-slate-100">
                    {category?.count?.count || 0} entries
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
