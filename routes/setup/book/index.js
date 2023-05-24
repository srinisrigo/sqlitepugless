var express = require('express');
var router = express.Router();
books = [
  { name: 'book1', author: 'author1', price: 150.00 },
  { name: 'book2', author: 'author2', price: 151.00 },
  { name: 'book3', author: 'author3', price: 152.00 },
  { name: 'book4', author: 'author4', price: 153.00 },
  { name: 'book5', author: 'author5', price: 154.00 },
  { name: 'book6', author: 'author6', price: 155.00 }
];

/* GET books listing. */
router.get('/', function (req, res, next) {
  res.render('setup/book/index', {
    books: books
  });
});

/* GET books edit. */
router.get('/edit/:bookindex', function (req, res, next) {
  res.render('setup/book/edit', {
    book: books[req.params.bookindex] || { name: '', author: '', price: '0.00' },
    bookindex: req.params.bookindex
  });
});

/* POST books insert or update. */
router.post('/update/:bookindex', function (req, res, next) {
  if (req.body.update) {
    var book = books[req.params.bookindex];
    if (book) {
      book.name = req.body.name;
      book.author = req.body.author;
      book.price = req.body.price;
      console.log(book.name + ':' + book.author);
    }
    else books.push({
      name: req.body.name,
      author: req.body.author,
      price: req.body.price
    });
  }

  res.redirect("/setup/book");
});

/* POST books insert or update. */
router.get('/delete/:bookindex', function (req, res, next) {
  if (books[req.params.bookindex]) {
    books.splice(req.params.bookindex, 1);
  }

  res.redirect("/setup/book");
});

module.exports = router;