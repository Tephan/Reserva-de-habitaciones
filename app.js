const express = require('express');
const app = express();
const path = require('path');
const http = require("http");
const cheerio = require('cheerio');
const $ = cheerio.load('<html>...</html>'); // Puedes pasar tu código HTML como argumento a cheerio.load()
const $ = require('jquery');
require('datatables.net');
require('datatables.net-bs5');

// Seteamos urlencoded
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Configurar el directorio de archivos estáticos
app.use('/public/', express.static(path.join(__dirname, '/public/'), { extensions: ['html', 'css', 'js'] }));

// dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname + '/public'));
console.log(__dirname);

// EJS
app.set('view engine','ejs');

// Bycryptjs
const bcryptjs = require('bcryptjs');

//Var. de session
const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Invocar BD
const connection = require('./database/bd');
const pool = require('./database/bd');
const { name } = require('ejs');
const { error } = require('console');

//Ruta login
app.get('/login', (req, res) => {
  res.render('login');
});

//Ruta registro
app.get('/registro', (req,res)=>{
  res.render('registro')
});

//Registro
app.post('/registro', async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const pass = req.body.pass;
  let passwordHash = await bcryptjs.hash(pass, 8);

  try {
    await pool.connect(); // Conectarse a la base de datos

    // Consulta INSERT
    const query = 'INSERT INTO usuarios (correo, nombre, contrasena, reservar, verReservas) VALUES ($1, $2, $3, $4, $5)';
    const values = [user, name, passwordHash, true, false]; // Valores a insertar

    // Ejecutar la consulta
    const result = await pool.query(query, values);

    console.log('Filas afectadas:', result.rowCount);

    res.render('registro',{
      alert: true,
      alertTitle: "Registration",
      alertMessage: "!Successful Registration!",
      alertIcon: 'success',
      showConfirmButton: false,
      timer: 1500,
      ruta:''
    })

  } catch (error) {
    console.error('Error al insertar datos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    //await pool.end(); // Cerrar la conexión a la base de datos
  }
});

//Logear
app.post('/auth', async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHash = await bcryptjs.hash(pass, 8);

  if (user && pass) {
    try {
      const query = 'SELECT * FROM usuarios WHERE correo = $1';
      const params = [user];
      const result = await pool.query(query, params);

      if (result.rows.length === 0 || !(await bcryptjs.compare(pass, result.rows[0].contrasena))) {
        res.render('login',{
          alert:true,
          alertTitle: "Error",
          alertMessage: "Usuario y/o contraseña incorectos",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: 'login'
        });
      } else {
        req.session.loggedin = true;
        req.session.name = result.rows[0].nombre;
        req.session.admin = result.rows[0].verreservas;
        res.render('login',{
          alert:true,
          alertTitle: "Conexión exitosa",
          alertMessage: "¡LOGIN CORRECTO!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: ''
        });
      }
    } catch (error) {
      console.error('Error en la consulta:', error);
      res.status(500).send('Error en el servidor');
    }
  } else {
    res.render('login',{
      alert:true,
      alertTitle: "Advertencia",
      alertMessage: "¡Por favor ingrese un usuario y/o contraseña!",
      alertIcon: "warning",
      showConfirmButton: true,
      timer: false,
      ruta: 'login'
    });
  }
});

//Autenticar
app.get('/', (req,res)=>{
  if(req.session.loggedin){
    res.render('index',{
      login: true,
      name: req.session.name
    })
  }else{
    res.render('index',{
      login: false,
      name: 'Debe iniciar sesión'
    })
  }

})

//Logout
app.get('/logout', (req, res)=>{
  req.session.destroy(()=>{
    res.redirect('/')
  })
})

//Mostrar datos en tabla habitaciones


 
// Iniciar el servidor
app.listen(3000, (req,res)=>{
  console.log('SERVER RUNNING IN http://localhost:3000/');
});


//Tabla
let tipo_habitacion, precio, vista_a;
let url = 'http://localhost:3000/api/habitaciones/';
let opcion = null;

let tablaHabitaciones = $('#tablaHabitaciones').DataTable({            
  "ajax":{
      "url": url,
      "dataSrc":""
  },
  "columns":[
      {"data":"tipo_habitacion"},
      {"data":"precio"},
      {"data":"vista_a"},
      {"defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Reservar</button></div></div>"}
  ],
  "columnDefs":[{
      "targets":[2],
      render(v){
          return Number(v).toFixed(2)
      }
  }]
});
