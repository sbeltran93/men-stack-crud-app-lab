const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  isRunning: { type: Boolean, required: true }
})

const Car = mongoose.model('Car', carSchema)

module.exports = Car
