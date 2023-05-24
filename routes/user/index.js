var express = require('express');
var router = express.Router();
var md5 = require('md5')
var db = require("../database");

/* GET users listing. */
router.get('/', function (req, res, next) {
  var sql = "select id, name, email from user where name like ? and email like ?"
  var params = [`%${req.query.fname || ''}%`, `%${req.query.femail || ''}%`]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    // console.log(JSON.stringify(rows))
    // rows.map((user)=> {return user.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) });
    res.render('user/index', {
      title: 'Users',
      users: rows.length ? rows : [],
      fname: req.query.fname || '',
      femail: req.query.femail || ''
    });
  });
});

router.get('/:id', function (req, res, next) {
  var sql = "select id, name, email from user where id = ?"
  var params = [req.params.id]
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.render('user/register', {
      title: 'Users', user: row.length ? row[0] : {
        id: '',
        name: '',
        email: '',
        password: md5('password')
      }
    });
  });
});

router.post('/', function (req, res, next) {
  var errors = []
  if (!req.body.password) {
    errors.push("No password specified");
  }
  if (!req.body.email) {
    errors.push("No email specified");
  }
  if (errors.length) {
    res.status(400).json({ "error": errors.join(",") });
    return;
  }
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password)
  }
  var sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
  var params = [data.name, data.email, data.password]
  db.all(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.render('user/index', { title: 'Users', id: this.lastID });
  });
});

router.patch('/:id', function (req, res, next) {
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password ? md5(req.body.password) : undefined
  }
  db.run(
    `UPDATE user set 
         name = coalesce(?,name), 
         email = COALESCE(?,email), 
         password = coalesce(?,password) 
         WHERE id = ?`,
    [data.name, data.email, data.password, req.params.id],
    (err, result) => {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.render('user/index', { title: 'Users', data: data });
    });
});

router.delete('/:id', function userDelete(req, res, next) {
  db.run(
    'DELETE FROM user WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.render('user/index', { title: 'Users', rows: this.changes });
    });
});

router.post('/update/:id', function (req, res, next) {
  db.run(
    `UPDATE user set 
        name = COALESCE(?,name), 
        email = COALESCE(?,email)
        WHERE id = ?`,
    [req.body.name, req.body.email, req.params.id],
    (err, result) => {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.redirect("/users");
    });
});

router.get('/delete/:id', function (req, res, next) {
  db.run(
    'DELETE FROM user WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.redirect("/users");
    });
});

router.get('/register', function (req, res, next) {
  res.render('user/register', {
    title: 'Users', user: {
      id: '',
      name: '',
      email: '',
      password: md5('password')
    }
  });
});

module.exports = router;
