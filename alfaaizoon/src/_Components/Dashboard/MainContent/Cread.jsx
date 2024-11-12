import cread from "/images/cread/allah1.png";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { addNewItem, getItem } from "../../../Services/TutorialService";
import PopUpMassage from "../../PopUpMassage";
import { CiSearch } from "react-icons/ci"; // Import the search icon
import PopUp from "../../PopUp";
import { useDispatch } from "react-redux";
import { updateData } from "../../../Rtk/slices/updataDataSlice";
import AddItemLoader from "../../AddItemLoader";
export default function Cread() {
  const dispatch = useDispatch();
  const [popUpmsg, setpopUpmsg] = useState(true);
  const [actionmsg, setactionmsg] = useState("");
  const [serchForm, setSearchForm] = useState(false);
  const [selectedAkedanumber, setselectedAkedanumber] = useState(null);
  const [isEdit, setisEdit] = useState(false);
  const [existingAudioFilename, setExistingAudioFilename] = useState("");
  const [addItemOverlay, showaddItemtOverlay] = useState(false);

  // Toggle show serchForm
  const ShowSearchForm = () => {
    setSearchForm((prev) => !prev);
  };

  // add new Hadith
  const addAkida = async (Item, path) => {
    try {
      showaddItemtOverlay(true);
      const response = await addNewItem(Item, path);
      setactionmsg("تم إضافة سؤال جديد");
      setpopUpmsg(true);
      setTimeout(() => setpopUpmsg(false), 3000);
    } catch (error) {
      // Set the error state if an error occurs
      setactionmsg("ادخل رقم مختلف للسؤال");
      setpopUpmsg(true);
      setTimeout(() => setpopUpmsg(false), 3000);
    } finally {
      setTimeout(() => {
        showaddItemtOverlay(false);
      }, 1000);
    }
  };
  // edit hadith
  const getSelectedItemId = (itemId, Item) => {
    setselectedAkedanumber(itemId);
    setisEdit(true);
    formik.voice = Item.voice;
    formik.setValues(Item);
  };
  // get Akida voice while click update
  useEffect(() => {
    const getVoice = async () => {
      if (isEdit && selectedAkedanumber) {
        try {
          const fetchedItem = await getItem("aqidahs", selectedAkedanumber);

          if (fetchedItem.voice.path) {
            const audioUrl = `${fetchedItem.voice.path
              ?.split("\\")
              .slice(2)
              ?.join("")
              .replace(/\\/g, "/")}`;
            setExistingAudioFilename(audioUrl);
          }
        } catch (error) {
          console.log("error here", error);
        }
      }
    };
    getVoice();
  }, [isEdit, selectedAkedanumber]);
  // Akida Form
  const formik = useFormik({
    initialValues: {
      aID: "",
      english: "",
      englishA: "",
      arabic: "",
      arabicA: "",
      voice: null,
    },
    validationSchema: Yup.object({
      aID: Yup.number()
        .min(0, "Akeeda can't be less than 0")
        .required("Number of Akeeda is required"),
      english: Yup.string().required("question in English is required"),
      englishA: Yup.string().required("question Answer in English is required"),
      arabic: Yup.string().required("question in Arabic is required"),
      arabicA: Yup.string().required("question Answer in Arabic is required"),
      voice: isEdit
        ? Yup.mixed()
        : Yup.mixed().required("An audio file is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("number", values.aID);
      formData.append("english", values.english);
      formData.append("englishA", values.englishA);
      formData.append("arabic", values.arabic);
      formData.append("arabicA", values.arabicA);
      formData.append("voice", values.voice);
      if (isEdit) {
        dispatch(
          updateData({
            path: "aqidahs",
            itemId: selectedAkedanumber,
            updatedItem: formData,
          })
        );
        setpopUpmsg(true);
        setactionmsg(" تم تعديل السؤال بنجاح");
        setisEdit(false);
        setselectedAkedanumber(null);
        setExistingAudioFilename("");
        setTimeout(() => {
          setpopUpmsg(false);
        }, 1000);
      } else {
        addAkida(formData, "aqidahs");
      }
      resetForm();
      if (fileAudiotRef.current) {
        fileAudiotRef.current.value = null; // Clear the file input manually
      }
    },
  });

  // Use `useRef` to reference the file input
  const fileAudiotRef = useRef(null);
  return (
    <div className="container py-10">
      {addItemOverlay && <AddItemLoader />}
      {serchForm && (
        <PopUp
          toggleshowPopup={ShowSearchForm}
          path={"aqidahs"}
          getSelectedItemId={getSelectedItemId}
        />
      )}
      {popUpmsg && actionmsg.length > 0 ? (
        <PopUpMassage children={actionmsg} />
      ) : (
        ""
      )}

      <div className="flex lg:flex-row flex-col lg:items-start items-center justify-between bg-[rgb(235,240,255)] bg-[linear-gradient(90deg,_rgba(235,240,255,0.9976365546218487)_12%,_rgba(249,251,255,1)_69%)] px-6 overflow-numberden h-fit rounded-lg">
        <div className="lg:pt-6 py-2 flex flex-row items-center">
          <h2 className="text-[#202936] font-semibold font-sans lg:text-2xl text-xl">
            Akida
          </h2>
          <button
            className="ml-4 text-[15px] text-[#94a3b8] bg-[#fefeffe1]  text-left   border border-solid border-[#e5e7eb] flex flex-row justify-start lg:pr-20 px-6  lg:pl-3 gap-2 py-1 tracking-wide outline-none   rounded-md hover:border-[#bebebe] transition-all duration-300 ease-in-out items-center "
            onClick={ShowSearchForm}
          >
            <CiSearch size={24} /> Quick search...
          </button>
        </div>
        <div className="lg:h-20 lg:w-40 w-40 h-30 overflow-hidden   ">
          <img src={cread} alt="cread" className="w-full h-full" />
        </div>
      </div>

      {/* Hadith Form */}
      <div className="mt-6 rounded-md border border-solid border-neutral-200">
        <div className="text-xl font-serif py-4 px-4 text-[#202936] border-b border-solid border-[#dfe5efcc] bg-[#ebf0ff48]">
          <h3>{isEdit ? "Update Akida" : "Add New Akida"}</h3>
        </div>
        <form
          className="mt-8 grid grid-cols-12 gap-6 px-4 pb-4"
          onSubmit={formik.handleSubmit}
        >
          {/* Hadith Number */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="number">
              Akida Number
            </label>
            <input
              type="number"
              name="aID"
              placeholder="Akida Number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.aID}
              className="Dashboardinput"
            />
            {formik.touched.aID && formik.errors.aID && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.aID}
              </div>
            )}
          </div>

          {/* Upload Sound */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="voice">
              Upload Sound
            </label>
            <input
              ref={fileAudiotRef}
              type="file"
              name="voice"
              // accept="audio/*"
              onChange={(event) => {
                formik.setFieldValue("voice", event.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}
              id="voice"
              className="block w-full text-md text-gray-800 border border-gray-300 rounded-md cursor-pointer bg-gray-50"
            />
            {existingAudioFilename && (
              <p className="text-gray-800 my-2 over">
                Current audio: {existingAudioFilename}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              mp3, wav, (MAX. 5MB limit).
            </p>
            {formik.touched.voice && formik.errors.voice && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.voice}
              </div>
            )}
          </div>

          {/* Hadith In Arabic */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="arabic">
              qusestion Arabic
            </label>
            <textarea
              id="arabic"
              name="arabic"
              placeholder="أدخل السؤال هنا باللغه العربية"
              dir="rtl"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.arabic}
              className="Dashboardinput resize-none"
              style={{ width: "100%", height: "100px" }}
            />
            {formik.touched.arabic && formik.errors.arabic && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.arabic}
              </div>
            )}
          </div>

          {/* Hadith In English */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="english">
              Answer Arabic
            </label>
            <textarea
              id="arabicA"
              name="arabicA"
              placeholder="أدخل الإجابه هنا باللغه العربية"
              dir="rtl"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.arabicA}
              className="Dashboardinput resize-none"
              style={{ width: "100%", height: "100px" }}
            />
            {formik.touched.arabicA && formik.errors.arabicA && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.arabicA}
              </div>
            )}
          </div>

          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="arabic">
              qusestion English
            </label>
            <textarea
              id="english"
              name="english"
              placeholder="أدخل السؤال هنا باللغه الانجليزية"
              dir="rtl"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.english}
              className="Dashboardinput resize-none"
              style={{ width: "100%", height: "100px" }}
            />
            {formik.touched.english && formik.errors.english && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.english}
              </div>
            )}
          </div>
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="english">
              Answer English
            </label>
            <textarea
              id="englishA"
              name="englishA"
              placeholder="أدخل الاجابه هنا باللغه الانجليزية"
              dir="rtl"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.englishA}
              className="Dashboardinput resize-none"
              style={{ width: "100%", height: "100px" }}
            />
            {formik.touched.englishA && formik.errors.englishA && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.englishA}
              </div>
            )}
          </div>
          {/* Submit Button */}
          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button
              type="submit"
              className={`inline-block rounded-md lg:px-12 px-6 py-3 text-md lg:text-sm font-medium transition focus:outline-none focus:ring ${
                !formik.isValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {isEdit ? "Update Akida" : "Add Akida"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
