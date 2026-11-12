const express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const bcrypt = require('bcrypt');

const dbconnect = require('./dbconnect.js');
const PersonModel = require('./person_schema.js');

function uniqueid(min, max) {
return Math.floor(
Math.random() * (max - min + 1) + min
);
}

// REG API
app.post('/reg', async (req, res) => {

try {

console.log("REG API EXECUTED");

const {
  firstname,
  email,
  password,
  mobile
} = req.body || {};

if (!email || !password) {
  return res.status(400).send({
    message: "Email and password are required"
  });
}

// ============================================
// 1. CHECK IF EMAIL ALREADY EXISTS
// ============================================
const existingUser = await PersonModel.findOne({
  student_email: email
});

if (existingUser) {

  return res.status(409).send({
    message: "Email already registered"
  });

}


// ============================================
// 2. HASH PASSWORD
// ============================================
const saltRounds = 10;

const hashedPassword = await bcrypt.hash(
  password,
  saltRounds
);


// ============================================
// 3. CREATE USER
// ============================================
const pobj = new PersonModel({

  Student_id: uniqueid(1000, 9999),

  Student_name: firstname,

  student_email: email,

  student_password: hashedPassword,

  student_mobile: mobile

});


// ============================================
// 4. SAVE USER
// ============================================
await pobj.save();


return res.status(201).send({

  message: "User registered successfully"

});

}

catch (err) {

console.error(err);

return res.status(500).send({

  message: err.message || "Error in User Save"

});

}

});

// START EXPRESS SERVER
app.listen(

5001,

() => console.log(
'EXPRESS Server Started at Port No: 5001'
)

);
