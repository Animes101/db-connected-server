const express=require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app=express()
const PORT=3000;




// JSON ডাটা পার্স করার জন্য
app.use(bodyParser.json());

// form-urlencoded ডাটা পার্স করার জন্য
app.use(bodyParser.urlencoded({ extended: true }));



// MongoDB তে কানেক্ট

const  dbConnected=async()=>{

    try{
        await mongoose.connect('mongodb://localhost:27017/studentsDB')

        console.log('db is connected')

    }catch(err){

        console.log(err.message);
        process.exit(1)

    }

}




  const studentsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'name is required'],
        minLength:[4, 'name is 4 checter'],
        trim:true,
        enum:['litop', 'subornao']
    },
    
    age:{
        type:Number,
        required:[true,'age is must be required'],
        lowercase:true,
    },
  })

  const studentsModel=mongoose.model('students', studentsSchema);


app.get('/', (req,res)=>{


    res.send('server is running')
})



// create 

app.post('/students', async (req,res)=>{

    try{

         const {name,age}=req.body

         const newStudents=new studentsModel({
            name,
            age
         })


        const studentsSave=  await newStudents.save();


        if(studentsSave){

            res.status(200).send({
                message:'save successfull',
                data:studentsSave

            })  
        
        }else{

            res.status(400).send({
                message:'faild to save'
            })
        }

    }catch(err){

        res.status(400).send({message:err.message})
    }

})


// get red

app.get('/students', async(req,res)=>{


    try{

        // const products=await studentsModel.find().limit(3);
        // const products=await studentsModel.find().sort({age:1});

        const products=await studentsModel.find().sort({age:1}).select({name:1,_id:0})    ;
    //    const products = await studentsModel.find({age:{$eq:22}}).countDocuments();


        if(products){

            res.status(200).send(products);

        }else{

            res.status(404).send({
                message:'student not found'
            })
        }



    }catch(err){

        res.status(200).send(err.message);
    }



})


app.get('/students/:id', async(req,res)=>{

    try{

        const {id}=req.params;

        // const products=await studentsModel.find().limit(3);
        const products=await studentsModel.findOne({_id:id}).select({name:1}).countDocuments()


        if(products){

            res.status(200).send(products);

        }else{

            res.status(404).send({
                message:'student not found'
            })
        }



    }catch(err){

        res.status(200).send(err.message);
    }



})

//delete students

app.delete('/students/:id', async(req,res)=>{

   try{
     const {id}=req.params;

    const studentDelete = await studentsModel.deleteOne({_id:id})

    if(studentDelete){
        res.status(200).send({
            success:true,
            message:'delete success fully',
            data:studentDelete
        })
    }else{

        res.status(4000).send({
            success:false,
            mesage:'delete faild try again',
        })
    }

}catch(err){

res.status(200).send(err.message);

}

})

//update students 

app.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const studentUpdate = await studentsModel.updateOne(
      { _id: id },
      { $set: { age: 500 } }
    );

    if (studentUpdate.matchedCount > 0) {
      res.status(200).send({
        success: true,
        message: 'Update successful',
        data: studentUpdate
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'Student not found or update failed'
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message
    });
  }
});



app.listen(PORT, async ()=>{

    console.log(`server is running http://localhost:${PORT}`)
    await dbConnected();

})