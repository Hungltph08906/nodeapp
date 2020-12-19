const firebase = require("../firebase/firebase_connect");
const ofirebase = require('../firebase/setData')
var users = [
];
firebase.database().ref('/Users/').once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        users.push(childData)
    });
});
module.exports = {
    index:  function(req, res) {
        res.render("users/index",{users: users });
    },
    search: function(req, res) {
        var name_search = req.query.name // lấy giá trị của key name trong query parameters gửi lên
        var age_search = req.query.age // lấy giá trị của key age trong query parameters gửi lên
        var result = users.filter( (user) => {
            // tìm kiếm chuỗi name_search trong user name.
            // Lưu ý: Chuyển tên về cùng in thường hoặc cùng in hoa để không phân biệt hoa, thường khi tìm kiếm
            return user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1 && user.age === parseInt(age_search)
        })

        res.render('users/index', {
            users: result // render lại trang users/index với biến users bây giờ chỉ bao gồm các kết quả phù hợp
        });
    },
    get_create: function(req, res) {
        res.render('users/create');
    },

    post_create: function(req, res) {
        users.push(req.body);
        res.redirect('/users')
    },
    show: function(req, res) {
        var user = users.find( (user) => {
            return user.uid == parseInt(req.params.uid);
        });
        res.render('users/show', {
            user: user
        })
    }
};