import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EmergencyRequest from './models/EmergencyRequest.js';

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const requests = await EmergencyRequest.find().lean();
  console.log("Total requests:", requests.length);
  if (requests.length > 0) {
    const req = requests[0];
    console.log("Request ID:", req._id);
    console.log("Hospital field type:", typeof req.hospital);
    console.log("Hospital field value:", req.hospital);
    console.log("HospitalModel:", req.hospitalModel);
  }
  process.exit(0);
}

check();
