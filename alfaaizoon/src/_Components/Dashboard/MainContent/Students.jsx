import studentImg from "/images/students/student.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useFormik } from "formik";
import swal from "sweetalert2";
import * as Yup from "yup";
import {
  addStudent,
  getStudents,
  editStudent,
  deleteStudent,
} from "../../../Services/StudentService";
import { useEffect, useState } from "react";
import PopUpMassage from "../../PopUpMassage";
export default function Students() {
  const [Students, setStudents] = useState([]);
  const [selectedStudentID, setSelectedStudent] = useState(null);
  const [isEdit, setisEdit] = useState(false);
  const [popUpmsg, setpopUpmsg] = useState(false);
  const [actionmsg, setactionmsg] = useState("");

  // Load ALL Students
  const getAllStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.log("failed adding Students");
    }
  };
  // Add new Student Func
  const AddStudent = async (item) => {
    try {
      const response = await addStudent(item);
      if (response.status === 201) {
        setpopUpmsg(true);
        setactionmsg("Add New Student Success");
        setTimeout(() => setpopUpmsg(false), 3000);
      }
    } catch (error) {
      console.log("error adding Student");
      setactionmsg("Add New Student Fail");
      setpopUpmsg(true);
      setTimeout(() => setpopUpmsg(false), 3000);
    }
    getAllStudents();
  };
  // Update Student Func
  //-------------- get selected Student id
  const getSelectedStudentId = (StudentID, StudentData) => {
    window.scrollTo(0, 0);
    setSelectedStudent(StudentID);
    setisEdit(true);
    formik.setValues(StudentData);
  };
  const updateStudent = async (StudentID, newStudentData) => {
    try {
      const response = await editStudent(StudentID, newStudentData);
      if (response.status == 200) {
        setpopUpmsg(true);
        setactionmsg("Update Student Success");
      }
    } catch (error) {
      setactionmsg("Update Student Fails");
      setpopUpmsg(true);
    }
    getAllStudents();
    setSelectedStudent(null);
    setisEdit(false);
  };
  // Delete Student
  const DeleteStudent = async (StudentId) => {
    try {
      swal
        .fire({
          title: "Are you sure you want to delete?",
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await deleteStudent(StudentId); // Await the delete action
              setactionmsg("Delete Student Sucess");
              setpopUpmsg(true);
              setTimeout(() => setpopUpmsg(false), 1000);
              getAllStudents();
            } catch (error) {
              console.error("Error deleting student:", error);
              setactionmsg("Delete Student fail");
              setpopUpmsg(true);
            }
          }
        });
    } catch (error) {
      console.log("error delete Student");
    }
    getAllStudents();
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      age: "",
      birthDay: "",
      address: "",
      nationality: "",
      ClassNum: "",
      phone: "",
      TeacherName: "",
      whatsapp: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Name is required"),
      middleName: Yup.string().required("Second Name is required"),
      birthDay: Yup.date().required("Date of Join is required"),
      age: Yup.number().min(0, "Age cant be 0"),
      TeacherName: Yup.string().required("TeacherName is required"),
      whatsapp: Yup.string().required("WhatsApp number is required"),
      ClassNum: Yup.number().required("class Number is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (isEdit) {
        updateStudent(selectedStudentID, values);
      } else {
        AddStudent(values);
      }
      resetForm();
    },
  });

  // get all Student always
  useEffect(() => {
    getAllStudents();
  }, []);

  return (
    <>
      <div className="container py-10">
        {popUpmsg && actionmsg.length > 0 ? (
          <PopUpMassage children={actionmsg} />
        ) : (
          ""
        )}
        {/* start title secton */}
        <div className="flex flex-row items-start justify-between bg-[rgb(235,240,255)] bg-[linear-gradient(90deg,_rgba(235,240,255,0.9976365546218487)_12%,_rgba(249,251,255,1)_69%)] lg:px-6 px-2 overflow-hidden h-fit rounded-lg ">
          <div className="pt-6">
            <h2 className="text-[#202936] font-semibold font-sans text-2xl">
              Our Students
            </h2>
            <p className="text-sm mt-1 text-gray-800">
              <span className="text-gray-400">Dashboard</span>
              <strong> . </strong>Our Students
            </p>
          </div>

          <div className="h-30 w-40 overflow-hidden">
            <img src={studentImg} alt="studentImg" className="w-full h-full" />
          </div>
        </div>
        {/* start Student form */}
        <div className="mt-6 rounded-md  pb-4   border border-solid border-neutral-200  ">
          <div className="text-xl fonr-medium py-4 px-4 text-[#202936] border-b border-solid border-[#dfe5efcc] font-medium bg-[#ebf0ff48]">
            <h3>{isEdit ? "Update Student" : "Add New Student"}</h3>
          </div>
          <form
            className="mt-8 grid grid-cols-12 gap-6 px-4"
            onSubmit={formik.handleSubmit}
          >
            {/* Name Input */}
            <div className="md:col-span-4 col-span-12">
              <label className="block text-md font-semibold text-slate-600 font-sans">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.firstName}
                </div>
              )}
            </div>
            <div className="md:col-span-4 col-span-12">
              <label className="block text-md font-semibold text-slate-600 font-sans">
                Second name
              </label>
              <input
                type="text"
                name="middleName"
                placeholder="Second name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.middleName}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.middleName && formik.errors.middleName && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.middleName}
                </div>
              )}
            </div>
            <div className="md:col-span-4 col-span-12">
              <label className="block text-md font-semibold text-slate-600 font-sans">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.lastName}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label className="block text-md font-semibold text-slate-600 font-sans">
                Age
              </label>
              <input
                type="number"
                min={0}
                name="age"
                placeholder="Age"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.age}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.age && formik.errors.age && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.age}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label className="block text-md font-semibold text-slate-600 font-sans">
                Date of Join
              </label>
              <input
                type="date"
                name="birthDay"
                placeholder="Date of Join"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={
                  formik.values.birthDay ? (
                    new Date(formik.values.birthDay).toISOString().split("T")[0]
                  ) : (
                    <span>N/A</span>
                  )
                }
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.birthDay && formik.errors.birthDay && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.birthDay}
                </div>
              )}
            </div>

            <div className="md:col-span-3 col-span-12">
              <label className="block text-md font-semibold text-slate-600  font-sans">
                class Number
              </label>
              <input
                type="number"
                min={0}
                name="ClassNum"
                placeholder="Teaching class number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ClassNum || ""} // Ensure it's always a string or number
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />

              {formik.touched.ClassNum && formik.errors.ClassNum && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.ClassNum}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label className="block text-md font-semibold text-slate-600  font-sans">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                placeholder="Nationality"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nationality}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.nationality && formik.errors.nationality && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.nationality}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label className="block text-md font-semibold text-slate-600  font-sans">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.address && formik.errors.address && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.address}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label className="block text-md font-semibold text-slate-600  font-sans">
                Whatsapp num
              </label>
              <PhoneInput
                containerClass="flex items-center border-none rounded-lg"
                inputClass="w-full bg-transparent focus:outline-none py-2 !h-auto"
                buttonClass="border-r border-gray-100"
                className="w-full"
                placeholder="WhatsApp Number"
                country={"eg"}
                min={0}
                name="whatsapp"
                value={formik.values.whatsapp}
                onChange={(value) => formik.setFieldValue("whatsapp", value)}
              />
              {formik.touched.whatsapp && formik.errors.whatsapp && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.whatsapp}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label className="block text-md font-semibold text-slate-600  font-sans">
                Mobile
              </label>
              <input
                type="number"
                min={0}
                name="phone"
                placeholder="Mobile"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.phone}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label className="block text-md font-semibold text-slate-600  font-sans">
                Teacher name
              </label>
              <input
                type="text"
                min={0}
                name="TeacherName"
                placeholder="Teacher Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.TeacherName}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.TeacherName && formik.errors.TeacherName && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.TeacherName}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
              <button
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
                className={`inline-block rounded-md lg:px-12 px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring 
                      ${
                        !formik.isValid
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
              >
                {isEdit ? "Update Student" : "Add Student"}
              </button>
            </div>
          </form>
        </div>
        {/* start display Students */}

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-14   h-[500px]">
          {Students?.length > 0 ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
              <thead className="text-[13px] text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                <tr>
                  <th scope="col" className="px-2 py-3 font-sans">
                    student Name
                  </th>

                  <th scope="col" className="px-2 py-3  font-sans">
                    <div className="flex items-center justify-center">
                      class Number
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <div className="flex items-center justify-center">
                      Teacher
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3  font-sans">
                    <div className="flex items-center justify-center ">Age</div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <div className="flex items-center justify-center">
                      Date of Join
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <div className="flex items-center justify-center">
                      Nationality
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <div className="flex items-center justify-center">
                      Parent Num
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <div className="flex items-center justify-center">
                      whatsapp num
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <span className="sr-only">Edit</span>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Students?.map((Student) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-md "
                    key={Student._id}
                  >
                    <th
                      scope="row"
                      className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {Student.firstName} {Student.middleName}{" "}
                      {Student.lastName}
                    </th>
                    <td className="px-2 py-4 text-center">
                      {" "}
                      {Student.ClassNum}
                    </td>
                    <td className="px-2 py-4 text-center">
                      {" "}
                      {Student.TeacherName}
                    </td>
                    <td className="px-2 py-4 text-center"> {Student.age}</td>

                    <td className="px-2 py-4 text-center">
                      {" "}
                      {Student.birthDay
                        ? new Date(Student.birthDay).toISOString().split("T")[0]
                        : "N/A"}
                    </td>

                    <td className="px-2 py-4 text-center">
                      {" "}
                      {Student.nationality}
                    </td>
                    <td className="px-2 py-4 text-center"> {Student.phone}</td>
                    <td className="px-2 py-4 text-center">
                      {" "}
                      {Student.whatsapp}
                    </td>
                    <td className="px-2 py-4 text-right ">
                      <span
                        onClick={() =>
                          getSelectedStudentId(Student._id, Student)
                        }
                        className="font-semibold text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      >
                        Edit
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right ">
                      <span
                        className="font-semibold text-red-600 dark:text-blue-500 hover:underline cursor-pointer"
                        onClick={() => DeleteStudent(Student._id)}
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading Data...</p>
          )}
        </div>
      </div>
    </>
  );
}
