const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = 'mongodb+srv://netninja:gutek123@cluster0.jmspb.mongodb.net/node-tuts';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  // .then(result => console.log('connected to db'))
  .then( result => {
    app.listen(3000);
    console.log('connected to db');
  })
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(morgan('dev'));


// mongoose & mongo tests 
app.get('/add-blog', (req, res) => {

  const blog = new Blog({
    title: 'new blog 2',
    snippet: 'about my new blog 2',
    body: 'more about my new blog'
  });

  blog.save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
})

app.get('/all-blogs', (req, res) => {
  Blog.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});


app.get('/single-blog', (req, res) => {
  Blog.findById('6262b01c486135947d319881')
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});


// routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});


// blog routes
app.get('/blogs', (req, res) => {
  Blog.find().sort( { createdAt: -1})
    .then(result => {
      res.render('index', { title: 'All Blogs', blogs: result })
    })
    .catch(err => {
      console.log(err);
    });
});


// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});