const express= require('express')
const mongoose=require('mongoose')
const path=require('path')
const Shorturl=require('./models/shorturl')

const app = express()
const port= 3000

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})
app.use(express.urlencoded({extended:false}))
app.set('views',path.join(__dirname,'/views'))
app.set("view engine","ejs")

app.get('/',async (req,res)=>{
    const shortUrls= await Shorturl.find() 
    res.render('index',{shortUrls : shortUrls})
})

app.post('/shortUrls',async (req,res)=>{
    await Shorturl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shorturl',async (req,res)=>{
    Shorturl.findOne({short : req.params.shorturl})
    .then((short=>{
        if(!short){
            res.status(404).json({message: 'site does not exist'})
        }else{
            short.clicks++
            res.redirect(short.full)
        }
    }))
    .catch(err=>console.log('error in loading'))
})

app.listen(port,()=>{
    console.log(`the server is running in the port ${port}`)
})