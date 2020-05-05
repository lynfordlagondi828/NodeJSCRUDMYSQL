const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

//create connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_crud'
})


//connection
connection.connect((err) => {
    if (!err)
        console.log('DB connected')
    else
        console.log(err)
})


app.set('views', path.join(__dirname, 'views'));
//set views file
app.set('view engine', 'ejs');
app.use(bodyParser.json());



app.use(bodyParser.urlencoded({ extended: false }));

//get all person todo list
app.get('/', (req, res) => {

    let SQL = "SELECT * FROM users";
    connection.query(SQL, (err, rows) => {
        if (!err)
            res.render('user_index', {
                title: 'TODO App using nodeJS',
                users: rows
            })
    })
})

//render to add ui
app.get('/add', (req, res) => {
    res.render('user_add', {
        title: 'Todo list application'
    })
})

//add todo app list
app.post('/save', (req, res) => {

    let form_data = req.body;

    let name = form_data.name;
    let email = form_data.email;
    let phone_no = form_data.phone_no;

    const SQL = "INSERT INTO users(name,email,phone_no)VALUES(?,?,?)";
    connection.query(SQL, [name, email, phone_no], (err, rows) => {
        if (!err)
            res.redirect('/')
        else
            console.log(err)
    })
})

//get single user
app.get('/edit/:userId', (req, res) => {

    let userId = req.params.userId;
    let SQL = "SELECT * FROM users";
    connection.query(SQL, [userId], (err, rows) => {
        if (!err)
            res.render('user_edit', {
                title: 'EDIT Todo list app',
                user: rows[0]
            })
    })
})


app.post('/update', (req, res) => {

    let POST = req.body;

    let id = POST.id;
    let name = POST.name;
    let email = POST.email;
    let phone_no = POST.phone_no;

    let SQL = "UPDATE users SET name = ?, email = ?, phone_no = ? WHERE id = ?";
    connection.query(SQL, [name, email, phone_no, id], (err, rows) => {
        if (!err)
            res.redirect('/')
    })
})

app.get('/delete/:userId', (req, res) => {

    let userId = req.params.userId;
    let SQL = "DELETE FROM users WHERE id = ?";
    connection.query(SQL, [userId], (err, rows) => {
        if (!err)
            res.redirect('/')
    })
})


//listen to port
const port = 3000;
app.listen(port, () => {
    console.log('Server running at port: ' + port)
});