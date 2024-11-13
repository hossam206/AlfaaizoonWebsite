/*
student data :

firstName
middleName
lastName
age
whatsapp
phone
classID
birthDay
nationality
address

*/
import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import Teacher from "./teachers.js";

// create schema
const studentSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: String,
  lastName: { type: String },
  age: {
    type: Number,
  },
  whatsapp: { type: String, required: true }, // Assuming WhatsApp numbers are unique
  phone: { type: String, required: true }, // Assuming phone numbers are unique
  ClassNum: { type: Number, required: true },
  TeacherName: { type: String, required: true },
  // Assuming classID references a Class collection
  birthDay: { type: Date },
  nationality: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

studentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default model("Student", studentSchema);
