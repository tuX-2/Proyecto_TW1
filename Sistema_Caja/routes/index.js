var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET productos page. */
router.get('/productos', function(req, res, next) {
  res.render('productos'); // Esto buscará productos.jade
  
});

router.get('/pedidos', function(req, res, next) {
  res.render('pedidos'); // Esto buscará productos.jade
});

router.get('/corte', function(req, res, next) {
  res.render('corte'); // Esto buscará productos.jade
});

module.exports = router;
