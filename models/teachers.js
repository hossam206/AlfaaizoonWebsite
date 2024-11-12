/*
admin data :
userName
password

firstName
middleName
lastName
age 
phone
phone2
classID
birthDay
nationality
address

*/


import { Schema, model } from 'mongoose';

const teacherSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    teacherID: {
        type: String,
        required: true,
        default: function () {
            return this.generateTID();
        }
    },
    classID: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    firstName: { type: String, required: true },
    middleName: String,
    lastName: { type: String },
    age: {
        type: Number,
    },
    phone: { type: String, required: true },
    phone2: String, // Optional second phone number // Assuming classID references a Class collection
    birthDay: { type: Date, required: true },
    nationality: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: {
        type: Date, default: Date.now
    },

});


teacherSchema.methods.generateTID = function () {
    // Generate a 3-digit number (e.g., between 1000 and 9999)
    return Math.floor(Math.random() * 9000) + 100;
};

teacherSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default model('Teacher', teacherSchema);



// add teacher generate class id for the teacher

// delete teacher

// update teacher

// get the number of teachers