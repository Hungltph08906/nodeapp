const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 8080;
const firebase = require("./firebase/firebase_connect");
const ofirebase = require('./firebase/setData')
const oGetData = require('./firebase/getData')
const oDeleteData = require('./firebase/deleteData')
const db = firebase.firestore
let api = require('./api/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', './views');
app.set('view engine', 'pug');

var users = [];
firebase.database().ref('/Users/').once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        users.push(childData)
    });
});
app.get('/', function(req, res){
    res.render("users/index",{users: users });
})
app.get('/users', function(req, res){
    res.render("users/index",{users: users });
})

app.get('/users/search', (req,res) => {
    var name_search = req.query.name // lấy giá trị của key name trong query parameters gửi lên

    var result = users.filter( (user) => {
        // tìm kiếm chuỗi name_search trong user name.
        // Lưu ý: Chuyển tên về cùng in thường hoặc cùng in hoa để không phân biệt hoa, thường khi tìm kiếm
        return user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
    })

    res.render('users/index', {
        users: result // render lại trang users/index với biến users bây giờ chỉ bao gồm các kết quả phù hợp
    });
})

app.get('/users/create', (req, res) => {
    res.render('users/create')
})

app.get('/users/update', (req, res) => {
    res.render('users/update')
})

app.listen(port, function(err,data){
    if (err)
        console.log(err);
    else
        console.log('connected')
})

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

app.post('/users/create', (req, res) => {
    ofirebase.saveData(req.body,function (err,data) {
        res.send(data);
    })
    users.push(req.body);
    res.redirect('/users')
})

app.post('/users/update', (req, res) => {
    ofirebase.saveData(req.body,function (err,data) {
        res.send(data);
    })
    users.push(req.body);
    res.redirect('/users')
})

app.get('/users/:id', (req, res) => {
    // Tìm user phù hợp với params id
    var user = users.find( (user) => {
        return user.uid == parseInt(req.params.uid);
    });

    // Render trang show, với một biến user được định nghĩa là user vừa tìm được
    res.render('users/show', {
        user: user
    })
})

app.post("/saveData/",function (req,res) {
    ofirebase.saveData(req.body,function (err,data) {
        res.send(data);
    })
})

app.get("/userData/",function (req,res) {
    oGetData.getData(function (data) {
        res.send(data);
    })
})

app.get('/users/delete/:id',function (req, res) {
    firebase.database().ref('/Users/'+ req.params.id).remove()
    console.log('xoa loi'+ req.params.id)
    res.redirect('/users')
});