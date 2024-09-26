require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// my description
app.get('/aboutme', (req, res) => {
  try{
    const data = {
      paragraphs: [
      'Hello, I am Andrew Jiang. I am currently a junior majoring in Computer Science. My passion from coding comes from its ability to be creative with solutions and algorithms. Additionally, it is a way to help people whether it’s helping them build a website or working with AI. More importantly, I believe that by studying CS I can help improve the world by building software that people need.',
       'For fun, I like to paint, travel and do woodworking. I have been traveling to Europe and Asia for many years but my favorite place to go to is Japan. I really enjoy Japanese culture as well as their fashion. I think that at Shibuya Crossing, I was able to see very unique and interesting outfits and I had never seen before.' 
    ],
    image: 'https://media.licdn.com/dms/image/v2/D5603AQGMOmKYmw2ZmQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1725464218376?e=2147483647&v=beta&t=PSGnbAA2SYorJ85sSLd4s0Q2xewHUI1EuYXGATutR9I',
    }
    res.json(data)
  }
  catch (err) {
    console.error(err)
  }
});


app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})





// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
