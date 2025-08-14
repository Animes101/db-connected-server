const express=require('express');
const mongoose = require('mongoose');
const app=express()
const PORT=3000;




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



app.listen(PORT, async ()=>{

    console.log(`server is running http://localhost:${PORT}`)
    await dbConnected();


})