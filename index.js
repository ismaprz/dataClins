const express = require('express');
const app = express();
const mysql = require('mysql2');
//motor de plantilla
const hbs = require('hbs');
//encontrar archivos
const path = require('path');
//para enviar mails
const nodemailer = require('nodemailer');
//variables de entorno
require('dotenv').config();

//configuramos el puerto
const PORT = process.env.PORT || 9000;

//middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//configuramos el motor de plantilla de hbs
app.set('view engine', 'hbs');
//configuramos la ubicacion de las plantillas
app.set('views', path.join(__dirname, 'views' ));
//configuramos los parciales de los motores de plantilla
hbs.registerPartials(path.join(__dirname, 'views/partials'))

//conexion a la base de datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DBPORT
})


conexion.connect((err) =>{
    if(err) throw err;
    console.log(`conectado a la base de database ${process.env.DATABASE}`);
})

//rutas de la aplicacion
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/formClientes', (req, res) => {
    res.render('formClientes', {
        titulo: 'formulario para clientes'
    })
})


app.get('/turnos', (req, res) => {
    let sql = "SELECT * FROM turnos";
    conexion.query(sql, function(err, result) {
        if (err) throw err;
        console.log(result);
        
        res.render('turnos', {
            titulo: 'Clientes',
            datos : result
        })
    })
})

app.post('/formClientes', (req, res) => {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const dni = req.body.dni;
    const sexo = req.body.sexo;
    const FeDeNaci = req.body.FeDeNaci;
    const edad = req.body.edad;
    const numContacto = req.body.numContacto;
    const email = req.body.email;
    const domicilio = req.body.domicilio;
    
    let datos = {
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        sexo: sexo, 
        FeDeNaci: FeDeNaci, 
        edad: edad, 
        numContacto: numContacto, 
        email: email, 
        domicilio: domicilio,  
    }

    let sql = "INSERT INTO formClientes set ?";
    conexion.query(sql,datos,function(err){
        if(err) throw err;
        console.log('1 Registro insertado');
        res.render('formClientes')
    })
    console.log(nombre,apellido,dni,sexo,FeDeNaci,edad,numContacto,email,domicilio);
 })


 app.post('/turnos', (req, res) => {
    const fecha = req.body.fecha;
    const hora = req.body.hora;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const numContacto = req.body.numContacto;
    const email = req.body.email;

    
    
   
    
    let datos = {
        fecha: fecha,
        hora:  hora,
        nombre: nombre,
        apellido: apellido,
        numContacto: numContacto,
        email: email
            
    }

    let sql = "INSERT INTO turnos set ?";
    conexion.query(sql,datos,function(err){
        if(err) throw err;
        console.log('1 Registro insertado');
        res.render('turnos')
    })
    console.log(fecha,hora,nombre,apellido,numContacto,email);

    
    
 })


 app.post('/envioMails', (req, res) => {
    let nombre = req.body.nombre;
    let email = req.body.email;

    //creamos una funcion para enviar Emails a los clientes
    async function enviarMail() {
        //configuramos la cuenta del envio
       let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,

        auth:{
            user: process.env.EMAIL,
            pass: process.env.EMAILPASSWORD
        }
        }); 
       //envio del 
       let info = await transporter.sendMail({
        from: process.env.EMAIL,
        to:`${email}`,
        subject: "¡Gracias por visitar  nuestra App!",
        html: 'Gracias por visitar nuestra sitio web<br> recibiras nuestras promociones a esta direccion de correo' 
        
       })  
    }

    let datos = {
        nombre: nombre,
        email: email,
    }
    
    let sql = "INSERT INTO envioMails set ?";
    conexion.query(sql,datos,function(err){
        if(err) throw err;
        console.log('1 Registro insertado');
        //Email
        enviarMail()
        res.render('index')
    })
    console.log(`los datos ingresados son: ${nombre} - ${email}`);
})


app.post('/delete', (req, res)=>{
   let sql = "DELETE FROM turnos where idTurnos idFormClientes= " + req.body.idTurnos + + req.body.idFormClientes +  "" ; conexion.query(sql,function(err, result){ if(err) throw err;
    console.log('Dato eliminado : ' + result.affectedRows);
    res.render('turnos')
   })
   
   
})


app.post('/delete', (req, res)=>{
   let sql = "DELETE FROM turnos where idTurnos idFormClientes= " + req.body.idTurnos + + req.body.idFormClientes +  "" ; conexion.query(sql,function(err, result){ if(err) throw err;
    console.log('Dato eliminado : ' + result.affectedRows);
    res.render('turnos')
   })
   
   
})


app.post('/update', (req, res)=>{
    const fecha = req.body.fecha;
    const hora = req.body.hora;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const numContacto = req.body.numContacto;
    const email = req.body.email;
    const idTurnos = req.body.idTurnos;
    let sql = "UPDATE turnos SET fecha ='"
    + fecha 
    +"', hora = '" 
    + hora  
    + "',  nombre = '" 
    + nombre
    +"', apellido = '" 
    + apellido
    +"', numContacto = '" 
    + numContacto
    +"', email = '" 
    + email            
    + "' WHERE idTurnos= " 
    + idTurnos;
    console.log(sql);
   res.send(sql)
   conexion.query(sql,function(err, result){ if(err) throw err;
    console.log('Dato actualizado : ' + result.affectedRows);
    res.render('turnos')
       }) 
    
})



app.post('/update', (req, res)=>{
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const dni = req.body.dni;
    const sexo = req.body.sexo;
    const FeDeNaci = req.body.FeDeNaci;
    const edad = req.body.edad;
    const numContacto = req.body.numContacto;
    const email = req.body.email;
    const domicilio = req.body.domicilio;
    const idFormClientes = req.body.idFormClientes;
    let sql = "UPDATE formClientes SET nombre ='"
    + nombre 
    +"', apellido = '" 
    + apellido  
    + "',  dni = '" 
    + dni
    +"', sexo = '" 
    + sexo
    +"', FeDeNaci = '" 
    + FeDeNaci
    +"', edad = '" 
    + edad
    +"', numContacto = '" 
    + numContacto
    +"', email = '" 
    + email
    +"', domicilio = '" 
    + domicilio              
    + "' WHERE idFormClientes= " 
    + idFormClientes;
    console.log(sql);
   res.send(sql)
   conexion.query(sql,function(err, result){ if(err) throw err;
    console.log('Dato actualizado : ' + result.affectedRows);
    res.render('turnos')
       }) 
    
})

//servidor a la escucha de las peticiones 
app.listen(PORT, () =>{
    console.log(`servidor trabajando en el puerto: ${PORT}`);
})
