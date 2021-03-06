import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
    // create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 30,
        userId: '104'
    });

    // save the ticket to database
    await ticket.save()

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate changes to the ticket we fetched
    firstInstance!.set({ price: 40 });
    secondInstance!.set({ price: 50 });

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return done();
    }
    throw new Error('should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 30,
        userId: '104'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
});