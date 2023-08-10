const express = require('express');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //Middlewares
        this.middlewares();

        //rutas de mi aplicación
        this.routes();
    }

    middlewares(){
        //Directorio Público
        this.app.use( express.static('public') );
    }

    routes(){
        this.app.get('/api', (req, res) => {
            res.json({
                msg:"get API"
            });
        });
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);    
        });
    }

}



module.exports = Server;