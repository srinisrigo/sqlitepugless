var express = require('express');
var router = express.Router();

router.get('/:locale', function (req, res, next) {
    if (req.params.locale) {
        res.setLocale(req.params.locale);
        res.locals.locale = req.getLocale();
        res.cookie("lang", req.params.locale);
    }
    
    res.redirect(req.query.pathname||"../..");
});

module.exports = router;