const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');

const { crearMensaje } = require('../utilidades/utilidad');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', (data, callback) => {
        //console.log(usuario);

        if (!data.nombre || !data.sala) {
            return callback({
                ok: false,
                message: 'El nombre/sala es requerido'
            });
        }

        //ingresar cliente a una sala 
        client.join(data.sala);


        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersona', usuarios.personasPorSala(data.sala));
        //callback(personas);
    });

    //eliminar el cliente desconectado
    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);
        console.log("persona borrada", personaBorrada);

        //emitir un evento a todos 
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.personasPorSala(personaBorrada.sala));
    });


    //=======================================================================
    // Escuchar evento crearMensaje que emite el cliente                                                                      
    //=======================================================================


    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);


        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    //=======================================================================
    // Mensaje privado                                                                       
    //=======================================================================
    client.on('mensajePrivado', (data) => {
        //obtener quien manda el mensaje 
        let persona = usuarios.getPersona(client.id);
        //enviar mensaje a todos 
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});