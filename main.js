const express = require('express')
const heartbeats = require('heartbeats')
const app = express()
const hostname = '0.0.0.0'
const port = 80;
const cron = require('node-cron') // for scheduled task (https://www.npmjs.com/package/node-cron)
const server = require('http').Server(app)
const io = require('socket.io')(server) // for socket programming (https://socket.io/)

var users = []
var playing_users = []
var status = 2

const PLAYING = 1
const WAITING = 2

const NO_COUNTDOWN = -3
var countdown = NO_COUNTDOWN
var t = 0;



var countTask = cron.schedule('* * * * * *', () => {
    if (status == PLAYING)
        return
    if (countdown != NO_COUNTDOWN) {
        console.log('카운트 다운 ' + countdown + '초')
        countdown--
        io.emit('chatroom', `<b>${countdown}초 후 게임이 시작됩니다.<b> <br>`)
        if (users.filter(x => x.ready).length < 2) {
            console.log('조건 만족 못해서 카운트 다운 취소')
            io.emit('chatroom', `<b>준비중인 인원이 적어 게임이 취소되었습니다.<b> <br>`)
            countdown = NO_COUNTDOWN
        }
    }
    if (countdown == 0) {
        console.log('게임 시작!')
        status = PLAYING
        playing_users = []
        users.forEach(x => {
            if (x.ready) {
                playing_users.push({
                    id: x.id,
                    nick: x.nick,
                    alive: true,
                    max_score: 0,
                    score: 0
                })
                x.ready = false
            }
        })
        console.log(`현재 ${playing_users.length}명 접속중`)
        var seed = "seed" + Math.floor(Math.random() * 20)
        io.emit('game_start', users, seed)
        console.log('Seed :' + seed);
        countdown = NO_COUNTDOWN
    }
})

app.use(express.static('static'))

server.listen(port, hostname, () => {
    console.log('server open!')
})