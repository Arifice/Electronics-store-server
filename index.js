const  express = require('express');
const cors = require('cors');
const app=express();
const port=process.env.PORT || 5000;

// middlewire
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Electronics store server is runmning');
})
app.listen(port, ()=>{
    console.log(`Electronics store server is running on port ${port}`);
})