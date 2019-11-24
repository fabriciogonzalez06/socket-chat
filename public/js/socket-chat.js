var socket = io();

//obtener parametros por la url
var params = new URLSearchParams(window.location.search);

//preguntar si viene el nombre
if (!params.has('nombre') || !params.has('sala') || params.has('sala') === '' || params.has('sala') === ' ') {
    //redireccionar al index
    window.location = 'index.html'
    throw new Error('El usuario y la sala son  necesarios')
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


//emitir mensaje para entrar al chat
socket.emit('entrarChat', usuario, function(resp) {
    //console.log(resp);
});



// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar mensajes usuarios conectados y desconectados
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//escuchar metodo que devuelve la  lista de las personas
socket.on('listaPersona', function(personas) {

    console.log('Servidor:', personas);

});


//escuchar mensajes privados 
socket.on('mensajePrivado', function(data) {
    console.log(data);
});