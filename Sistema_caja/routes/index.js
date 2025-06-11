var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Sistema de Caja - Cafetería',
    nombreSistema: 'Sistema de Caja - Cafetería',
    cajero: 'Admin',
    pedidosEntrantes: [],      
    pedidosAceptados: [],      
    pedidosPreparados: [],     
    pedidosEntregados: [],
    pedidosCocina: [],
    paginaActual: 'inicio',
    notificaciones: 0,
    productos: []
  });
});

router.get('/', function(req, res, next) {
  res.render('corte', {
    
  });
});


router.get('/', function(req, res, next) {
  res.render('productos', {

  });
});



module.exports = router;
