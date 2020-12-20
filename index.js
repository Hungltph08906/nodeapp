const express = require('express');
const bodyParser = require('body-parser')
let hbs = require('express-handlebars');
const app = express();
const port = process.env.PORT || 8080;
const firebase = require("./firebase/firebase_connect");
const ofirebase = require('./firebase/setData')
const oGetData = require('./firebase/getData')
const oUpdateData = require('./firebase/updateData')
const oDeleteData = require('./firebase/deleteData')
const db = firebase.firestore
const alert = require('alert')
let api = require('./api/api');

app.engine('.hbs', hbs({
    extname: 'hbs',
    defaultLayout: '',
    layoutsDir: ''
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', './views');
app.set('view engine', 'pug');
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
    res.render(
        'index'
    )
});
var users = [];
firebase.database().ref('/Users/').once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        users.push(childData)
    });
});
app.get('/users', function (req, res) {
    res.render("users/index", {users: users});
})

app.get('/users/search', (req, res) => {
    var name_search = req.query.name // lấy giá trị của key name trong query parameters gửi lên

    var result = users.filter((user) => {
        // tìm kiếm chuỗi name_search trong user name.
        // Lưu ý: Chuyển tên về cùng in thường hoặc cùng in hoa để không phân biệt hoa, thường khi tìm kiếm
        return user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
    })

    res.render('users/index', {
        users: result // render lại trang users/index với biến users bây giờ chỉ bao gồm các kết quả phù hợp
    });
    console.log('connected'+result.name)
})

app.get('/users/create', (req, res) => {
    res.render('users/create', {viewTitle: 'Thêm mới'})
})
var Uname,UEmail,UPassword,UPhone,UDateOfBirth,UType
app.get('/users/update/:id', (req, res) => {

    var result = users.filter((user) => {

        if (user.uid === req.params.id) {
            Uname = user.name,
            UEmail = user.email,
            UPassword = user.password,
            UPhone = user.phone,
            UDateOfBirth = user.dateOfBirth,
            UType = user.type
        }

    })
    res.render('users/update', {
        viewTitle: 'Sửa thông tin',
        uid: req.params.id,
        name: Uname,
        email: UEmail,
        password: UPassword,
        phone: UPhone,
        dateOfBirth: UDateOfBirth,
        type: UType,
        status: 'disabled'
    })
    console.log('connected')
})

app.listen(port, function (err, data) {
    if (err)
        console.log(err);
    else
        console.log('connected')
})

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true}))

app.post('/users/create', (req, res) => {
    var result = users.filter((user) => {
        if (user.uid === req.body.uid){
            return user.uid.toLowerCase().indexOf(req.body.uid.toLowerCase()) !== -1
        }

    })
    var result2 = users.filter((user) => {
        if (user.email === req.body.email){
            return user.email.toLowerCase().indexOf(req.body.email.toLowerCase()) !== -1
        }
    })
    if (result.length === 1){
        alert("Uid đã được sử dụng với một tài khoản khác")

    } else if (result2.length === 1){
        alert("Email đã được sử dụng với một tài khoản khác")
    } else {
        ofirebase.saveData(req.body, function (err, data) {
            res.send(data);
        })
        var newU = []
        users = newU
        firebase.database().ref('/Users/').once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                users.push(childData)
            });
        });
        res.redirect('/users')

    }
    console.log(result.length)

})

app.post('/users/update/:id', (req, res) => {

    var emailN = req.body.email
    var phoneN = req.body.phone
    var result2 = users.filter((user) => {
        if (user.email !== UEmail) {
            if (user.email === req.body.email){
                return user.email.toLowerCase().indexOf(req.body.email.toLowerCase()) !== -1
            }
        }
    })
    var result3 = users.filter((user) => {
        if (user.phone !== UPhone){
            if (user.phone === req.body.phone){
                return user.phone.toLowerCase().indexOf(req.body.phone.toLowerCase()) !== -1
            }
        }
    })
     if (result2.length === 1){
         alert("Email đã được sử dụng với một tài khoản khác")
    } else if (result3.length === 1){
         alert("SĐT đã được sử dụng với một tài khoản khác")
     } else {
        ofirebase.saveData(req.body, function (err, data) {
            res.send(data);
        })
        var newU = []
        users = newU
        firebase.database().ref('/Users/').once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                users.push(childData)
            });
        });
        res.redirect('/users')
    }
})


app.post("/saveData/", function (req, res) {
    ofirebase.saveData(req.body, function (err, data) {
        res.send(data);
    })
})

app.get("/userData/", function (req, res) {
    oGetData.getData(function (data) {
        res.send(data);
    })
})

app.get('/users/delete/:id', function (req, res) {
    firebase.database().ref('/Users/' + req.params.id).remove()
    var newUsers = []
    users = newUsers
    firebase.database().ref('/Users/').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            users.push(childData)
        });
    });
    console.log('xoa loi' + req.params.id)
    res.redirect('/users')
});

app.post('/login',
    function (req, res) {
        let condition = {
            username: req.body.emailN,
            password: req.body.passW
        };
        var name_search = req.query.name // lấy giá trị của key name trong query parameters gửi lên

        var result = users.filter((user) => {
            // tìm kiếm chuỗi name_search trong user name.
            // Lưu ý: Chuyển tên về cùng in thường hoặc cùng in hoa để không phân biệt hoa, thường khi tìm kiếm
            if (condition.username.toLowerCase().indexOf(user.email.toLowerCase()) !== -1 &&
                user.email.toLowerCase().indexOf(condition.username.toLowerCase()) !== -1 &&
                condition.password.toLowerCase().indexOf(user.password.toLowerCase()) !== -1 &&
                user.password.toLowerCase().indexOf(condition.password.toLowerCase()) !== -1
            ) {
                return condition.password.toLowerCase().indexOf(user.password.toLowerCase()) !== -1
            }

        })


        if (result.length === 1) {
            res.redirect('/users')
        } else {
            res.render('index')
        }


    });
app.get('/signout', (req, res) => {
    res.render('index')
});