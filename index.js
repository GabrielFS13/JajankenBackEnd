const express = require("express")
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require("cors")
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
            const venceu = `${p1.id} venceu!` 
            const venceu2 = `${p2.id} venceu!` 
            const empate = "Empate!"

            if(p1.item === p2.item){
                return {
                    status: empate,
                    p1: {
                            id: p1.id,
                            item: p1.item
                        },
                    p2: {
                        id: p2.id,
                        item: p2.item
                    }
                    
                }
            }
            else if(p1.item === 'papel.png' && p2.item === 'pedra.png'){ 
                return {
                    status: venceu,
                    p1: {
                            id: p1.id,
                            item: p1.item
                        },
                    p2: {
                        id: p2.id,
                        item: p2.item
                    }
                    
                }
            }
            else if(p1.item === 'pedra.png' && p2.item === 'tesoura.png'){
                return {
                    status: venceu,
                    p1: {
                            id: p1.id,
                            item: p1.item
                        },
                    p2: {
                        id: p2.id,
                        item: p2.item
                    }
                    
                }
            }
            else if(p1.item === 'tesoura.png' && p2.item === 'papel.png'){
                return {
                    status: venceu,
                    p1: {
                            id: p1.id,
                            item: p1.item
                        },
                    p2: {
                        id: p2.id,
                        item: p2.item
                    }
                    
                }
            }else{
                return {
                    status: venceu2,
                    p1: {
                            id: p1.id,
                            item: p1.item
                        },
                    p2: {
                        id: p2.id,
                        item: p2.item
                    }
                    
                }
            }
        }



var list_jogadas = []

io.on('connect', (socket) =>{

    socket.on('jogada', (res) =>{
        console.log(res)
        jogadas(res)
    })

    socket.on('jogadores', (res) =>{
        console.log(res)
        socket.broadcast.emit("logado", res)
    })

    
    function jogadas(jogada){
        if(list_jogadas.length === 0){
            list_jogadas.push(jogada)
        }

        list_jogadas.map(jog => {
            if(list_jogadas.length <= 2 ){
                if(jog.id !== jogada.id){
                    list_jogadas.push(jogada)
                    io.emit("jogadas",  verificaVencedor(list_jogadas[0], list_jogadas[1]))
                    console.log(verificaVencedor(list_jogadas[0], list_jogadas[1]))
                    list_jogadas = []
                }else{
                    socket.emit("jogadas", {status: "Esperando Oponente..."})
                }
            }else{
                list_jogadas = []
            }
            
        })
    }
})


app.get("/", (req, res) =>{
    res.send("Server ON")
})



server.listen(3001, () =>{
    console.log("Server on!")
})