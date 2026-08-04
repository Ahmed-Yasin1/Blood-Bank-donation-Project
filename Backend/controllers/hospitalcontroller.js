import Hospital from "../models/Hospital.js";



export const createHospital = async (req, res) => {
  try {

    const hospital = await Hospital.create(req.body);

    res.status(201).json({
      message: "Hospital created successfully",
      hospital
    });

  } catch (error) {

    res.status(500).json({
      message:error.message
    });

  }
};



export const getHospitals = async (req,res)=>{

try{

const hospitals = await Hospital.find();

res.json(hospitals);


}catch(error){

res.status(500).json({
message:error.message
});

}

};



export const getHospitalById = async(req,res)=>{

try{

const hospital = await Hospital.findById(req.params.id);


if(!hospital){

return res.status(404).json({
message:"Hospital not found"
});

}


res.json(hospital);


}catch(error){

res.status(500).json({
message:error.message
});

}

};




export const updateHospital = async(req,res)=>{

try{

const hospital = await Hospital.findByIdAndUpdate(
req.params.id,
req.body,
{
new:true
}
);


res.json({
message:"Hospital updated",
hospital
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};




export const deleteHospital = async(req,res)=>{

try{

await Hospital.findByIdAndDelete(req.params.id);


res.json({
message:"Hospital deleted"
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};