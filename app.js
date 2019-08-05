const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const redis = require('redis');

const app = express();

// create redis client
const client = redis.createClient();

client.on('connect', () => {
   console.log('Redis Server Connected');
});

// view engine setup -- specifically ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json()); // takes care data from post requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // static folder for stylesheets etc.

app.get('/', (req, res) => {
    const title = 'Title List';

    client.lrange('tasks', 0, -1, (err, reply) => {
        client.hgetall('call', (err, call) => {
            res.render('index', {
                title: title, 
                tasks: reply, 
                call: call
                }
            );
        });      
    });
})

app.post('/task/delete', (req, res) => {
   const tasksToDelete = req.body.tasks;

    client.lrange('tasks', 0, -1, (err, tasks) => {
        for (var i = 0; i < tasks.length; i++) {
           if (tasksToDelete.indexOf(tasks[i]) > -1) {
               client.lrem('tasks', 0, tasks[i], () => {
                  if (err) {
                     console.log(err);
                  } 
               })
           } 
        }
        res.redirect('/');
    });
});

app.post('/call/add', (req, res) => {
    const newCall = {};

    newCall.name = req.body.name;
    newCall.company = req.body.company;
    newCall.phone = req.body.phone;
    newCall.time = req.body.time;

    client.hmset('call', ['name', newCall.name, 'company', newCall.company, 'phone', newCall.phone, 'time', newCall.time], (err, reply) => {
       if (err) {
          console.log(err);
       }
       console.log(reply);
       res.redirect('/');
    })
});

app.post('/task/add', (req, res) => {
   const task = req.body.task;

   client.rpush('tasks', task, (err, reply) => {
       if (err) {
          console.log(err);
       }
       console.log('Task Added...');
       res.redirect('/');
   })
});

app.listen(3000);
console.log('Server Started on Port 3000...');

module.exports = app;
