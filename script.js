const WebSocketClient = require('ws');
const axios = require('axios');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const HOST = '*host*';

axios.post('http://' + HOST + '*path*', {
    identification: '*username*',
    password: '*password*'
}, {
    headers: {
        'content-type': 'application/json'
    }
})
    .then(response => {
        const TOKEN = response.data.token;
        const ws = new WebSocketClient('ws://' + HOST, {
            headers: {
                token: TOKEN
            }
        });

        ws.on('open', () => {
            console.log('connected!');

            ws.on('message', message => {
                console.log('\nMESSAGE > ');
                console.log(message);
                console.log('\n');
            });

            ws.on('error', error => {
                console.log('\nERROR > ');
                console.error(error);
                console.log('\n');
            });

            ws.on('close', () => {
                console.log('connection closed.');
            });

            const ask = () => {
                if (ws.readyState === ws.OPEN) {
                    rl.question('Enter message to send > ', json => {
                        ws.send(json);
                        ask();
                    });
                }
            };
            ask();
        });
    })
    .catch(err => {
        console.error(err.response.data.message);
    });
