const express = require('express')
const app = express()
const PORT = 4000

data = null
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const axios = require('axios').default;

app.post("/post_data", function(req, res){
    data = req.body
    res.send({"message": "Message sent successfully!"})
})

app.get("/test", function(req, res){
    res.send(data)
})

app.listen(PORT)