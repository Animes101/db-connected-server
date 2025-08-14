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
    name:String,
    age:Number,
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
        const products=await studentsModel.find({age:{$eq:22}})

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
        // const products=await studentsModel.findOne({_id:id}).select({name:1})


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


app.listen(PORT, async ()=>{

    console.log(`server is running http://localhost:${PORT}`)
    await dbConnected();

})