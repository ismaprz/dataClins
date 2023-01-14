create database DataClins;

use DataClins;

create table formClientes(
idFormClientes int unsigned not null auto_increment,
nombre varchar(120) not null,
apellido varchar(120) not null,
dni int unsigned not null,
sexo varchar(20) not null,
FeDeNaci date not null,
edad int unsigned not null,
numContacto int unsigned not null,
email varchar(120) not null,
domicilio varchar(120) not null,
primary key(idFormClientes)
  );
  
  create table turnos(
  idTurnos int unsigned not null auto_increment,
  fecha date not null,
  hora time not null,
  nombre varchar(120) not null,
  apellido varchar(120) not null,
  numContacto int unsigned not null,
  email varchar(120) not null,
  primary key(idTurnos)
  );