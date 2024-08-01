require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
const PORT = 3000
// const Car = require('/')
const logger = require('morgan')
const methodOverride = require('method-override')
const Car = require('./models/cars')

app.use(express.json()) // we are able to parse the body and accept json data from requestors
app.use(express.urlencoded({ extended: true }))
app.use(logger('tiny'))
app.use(methodOverride('_method'))

mongoose.connect(MONGO_URI)

mongoose.connection.once('open', () => {
    console.log('MongoDB is good!')
})

mongoose.connection.on('error', () => {
    console.error('MongoDB is trash')
})


app.get('/test', (req, res) => {
    res.render('test.ejs')
})


// New/Create

app.post('/cars', async (req, res) => {
    req.body.isRunning === 'on' || req.body.isRead === true? 
    req.body.isRunning = true :
    req.body.isRunning = false
    req.body.year = parseInt (req.body.year)
    console.log(typeof req.body.year)
        try {
        const createdCar = await Car.create(req.body)
        res.redirect(`/cars/${createdCar._id}`)
   } catch (error) {
    res.status(400).json({ msg: error.message })
   }
})

app.get('/cars/new', (req, res) => {
    res.render('new.ejs')
})

// Find

app.get('/cars', async (req, res) => {
    try {
        const foundCars = await Car.find({})
        res.render('index.ejs', {
            cars: foundCars
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

// FindOne

app.get('/cars/:id', async (req, res) => {
    try {
        const foundCar = await Car.findOne({ _id: req.params.id })
        res.render('show.ejs', {
            car: foundCar
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

app.get('/cars/:id/edit', async (req, res) => {
    try {
        const editCar = await Car.findOne({ _id: req.params.id })
        res.render('edit.ejs', {
            car: editCar
    })   
    }   catch (error) {
        res.status(400).json({ msg: error.message })
    }
})
// Update

app.get('/cars/:id/edit', async (req, res) => {
    try{
        const foundCar = await Car.findOne({ _id: req.params.id }, req.body, { new: true})
        res.render('edit.ejs', {
            car: foundCar
        })
    } catch(error){
        res.status(400).json({ msg: error.message })
    }
});
app.put('/cars/:id', async (req, res) => {
    try {
        const updatedCar = await Car.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.redirect(`/cars/${updatedCar._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})



// Delete

app.delete('/cars/:id', async (req, res) => {
    try {
        await Car.findOneAndDelete({ _id: req.params.id })
        .then((car) => {
            res.sendStatus(204)
        })
    }  catch (error){
        res.status(400).json({ msg: error.message })
    }
})



app.listen(PORT, () => {
    console.log('Lets do this lab!' + ` Running on PORT ${PORT}`)
})