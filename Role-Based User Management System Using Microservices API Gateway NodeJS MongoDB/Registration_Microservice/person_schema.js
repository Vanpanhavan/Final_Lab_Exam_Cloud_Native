const schema_mongoose = require('mongoose');

const PersonSchema = schema_mongoose.Schema(
    {
       Student_id: {type: Number},
       Student_name: { type: String },
       student_email: { type: String },
       student_password: { type: String },
       student_mobile: { type: Number },
    }, 
    {
       timestamps: true
    }
    );

module.exports = schema_mongoose.model('person_collections', PersonSchema);