const express = require('express')

const app = express()
const PORT = 3000


app.get("/get_data", function(req, res){
    res.send({
        "message" : "Greetings from provider..."
    })
})

app.listen(PORT)