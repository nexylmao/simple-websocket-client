const WebSocketClient = require('ws');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const HOST = 'HOST';
const TOKEN = 'TOKEN';

const ws = new WebSocketClient(HOST, {
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