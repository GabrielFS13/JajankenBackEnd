require('dotenv').config()

const express = require("express")
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require("cors")
const path = require('path');
const PORT = process.env.PORT || 2000
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*'
    },
    secure: false
})

//verifica o vencedor

function verificaVencedor(p1, p2){
            const venceu = ` venceu!` 
            const empate = "Empate!"
            console.log("jogada: ", p1)

            if(p1.item === p2.item){
                return {
                    status: empate,
                    p1: {
                            id: p1.id,
                            item: p1.item,
                            skin: p1.skin
                        },
                    p2: {
                        id: p2.id,
                        item: p2.item,
                        skin: p2.skin
                    }
                    
                }
            }
            else if(p1.item === 'papel.png' && p2.item === 'pedra.png'){ 
                return {
                    status: venceu,
                    p1: {
                            id: p1.id,
                            item: p1.item,
                            skin: p1.skin
                        },
                    p2: {
                        id: p2.id,
                        item: p2.item,
                        skin: p2.skin
                    }
                    
                }
            }
            else if(p1.item === 'pedra.png' && p2.item === 'tesoura.png'){
                return {
                    status: venceu,
                    p1: {
                            id: p1.id,
                            item: p1.item,
                            skin: p1.skin
                        },
                    p2: {
                        id: p2.id,
                        item: p2.item,
                        skin: p2.skin
                    }
                    
                }
            }
            else if(p1.item === 'tesoura.png' && p2.item === 'papel.png'){
                return {
                    status: venceu,
                    p1: {
                            id: p1.id,
                            item: p1.item,
                            skin: p1.skin
                        }
                        ,
                    p2: {
                        id: p2.id,
                        item: p2.item,
                        skin: p2.skin
                    }
                    
                    
                }
            }else{
                return {
                    status: venceu,
                    p1: {
                            id: p2.id,
                            item: p2.item,
                            skin: p2.skin
                        },
                    p2: {
                        id: p1.id,
                        item: p1.item,
                        skin: p1.skin
                    }
                    
                }
            }
        }



var list_jogadas = []
var msg_list = []

io.on('connect', (socket) =>{
    const code = Math.floor(Math.random() * 500) 
    console.log(code)
    socket.join(code)

    socket.emit("RoomCode", code)

    socket.on('jogada', (res) =>{
        console.log(res)
        jogadas(res)
    })


    socket.on('codigo_sala', (infos) =>{
        console.log(infos)
        socket.join(infos.codigo)
        io.to(infos.codigo).emit("novo_jogador", infos.id)
    })

    socket.on("chat", (res) =>{
        msg_list.push(res)
        console.log(msg_list)
        if(res.msg == '/clear'){
            msg_list = []
        }
        io.emit("revice_msg", msg_list)
    })

    
    function jogadas(jogada){
        if(list_jogadas.length === 0){
            list_jogadas.push(jogada)
        }

        list_jogadas.map(jog => {
            if(list_jogadas.length <= 2 ){
                if(jog.id !== jogada.id){
                    list_jogadas.push(jogada)
                    io.to(jogada.sala_code).emit("jogadas",  verificaVencedor(list_jogadas[0], list_jogadas[1]))
                    console.log(verificaVencedor(list_jogadas[0], list_jogadas[1]))
                    list_jogadas = []
                }else{
                    io.to(jogada.sala_code).emit("jogadas", {status: "Esperando oponente...", item: '', id: jogada.id})
                }
            }else{
                list_jogadas = []
            }
            
        })
    }
})


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

server.listen(PORT, () =>{
    console.log("Server on!")
    console.log(PORT)
})