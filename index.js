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
const Confirm = require('prompt-confirm');
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
var checkLogin = false
var users = [];
firebase.database().ref('/Users/').once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        users.push(childData)
    });
});
app.get('/users', function (req, res) {
    if (checkLogin === true){
        res.render("users/index", {users: users});
    } else {
        res.redirect('/')
    }
})

app.get('/users/search', (req, res) => {
    if (checkLogin === true){
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
    } else {
        res.redirect('/')
    }
})

app.get('/users/create', (req, res) => {
    if (checkLogin === true){
        res.render('users/create', {viewTitle: 'Thêm mới'})
    } else {
        res.redirect('/')
    }
})
var Uname,UEmail,UPassword,UPhone,UDateOfBirth,UType,UTypeId
app.get('/users/update/:id', (req, res) => {

    if (checkLogin === true){
        users.filter((user) => {

            if (user.uid === req.params.id) {
                Uname = user.name,
                    UEmail = user.email,
                    UPassword = user.password,
                    UPhone = user.phone,
                    UDateOfBirth = user.dateOfBirth,
                    UTypeId = user.type
            }

        })
        if (UTypeId === "3"){
            UType = "Admin"
        }
        if (UTypeId === "2") {
            UType = "Student"
        }
        if (UTypeId === "1") {
            UType = "Teacher"
        }
        if (UTypeId === "0") {
            UType = "Trung tam"
        }
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
        console.log(UType)
    } else {
        res.redirect('/')
    }
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


    console.log(result.length)

})

app.post('/users/update/:id', (req, res) => {

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
    if (checkLogin === true){firebase.database().ref('/Users/' + req.params.id).remove()
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

    } else {
        res.redirect('/')
    }
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
                user.password.toLowerCase().indexOf(condition.password.toLowerCase()) !== -1 &&
                user.type === "3"
            ) {
                return condition.password.toLowerCase().indexOf(user.password.toLowerCase()) !== -1
            }

        })


        if (result.length === 1) {
            checkLogin = true
            res.redirect('/users')
        } else {
            res.redirect('/',{
                loginFail: "Tài khoản hoặc mật khẩu không chính xác"
            })
        }


    });
app.get('/signout', (req, res) => {
    res.redirect('/')
});