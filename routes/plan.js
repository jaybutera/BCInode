var express = require('express');
var router = express.Router();

router.get('/:plan_id', function(req, res, next) {
    res.render('plan', { plan_id : req.params.plan_id });
});

module.exports = router;
