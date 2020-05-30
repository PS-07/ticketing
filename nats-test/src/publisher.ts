import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

// 2nd arg is ClientId, stored in NATS SS
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

// after stan (client) successfully connects to the NATS streaming server,
// it is going to emit a 'connect' event, so we listen for it
stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: '107',
            title: 'standup',
            price: 20
        });
    } catch (err) {
        console.error(err);
    }
});