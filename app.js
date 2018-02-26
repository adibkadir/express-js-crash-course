const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const nunjucks = require('nunjucks')
const {
  check,
  validationResult
} = require('express-validator/check');
const {
  matchedData,
  sanitize
} = require('express-validator/filter');
var users = require('./fakeData.js')


const app = express()
app.listen(3000, (port) => console.log('Server started on port 3000...'));

/*
const logger = function(req, res, next) {
  console.log('Logging...')
  next()
}
app.use(logger)
*/

// View Engine
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {

  res.render('index.nunjucks', {
    title: 'Customers',
    users: users
  })

})


app.post('/users/add', [
    check('name').isLength({ min: 1 }).withMessage('field is required'),
    check('username').isLength({ min: 1 }).withMessage('field is required')
  ],
  (req, res, next) => {

    try {
      validationResult(req).throw();

      let newUser = {
        'name': req.body.name,
        'username': req.body.username
      }
      users.push(newUser)


    } catch (errors) {

      res.render('index.nunjucks', {
        title: 'Customers',
        users: users,
        errors: errors.mapped()
      })

    }

  })
