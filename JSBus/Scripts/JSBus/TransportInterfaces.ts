interface ISendTransport {
    // return value is a promises/A compatible promise 
    // (e.g.when.js promise, should use when.d.ts file if one exists...)
    send(message: IMessage): any;
}

interface ISubscribeTransport {
    receive(handler: (message: IMessage) => void);
    ack(handler: (id: string) => void);
}

interface IMessage {
    id: string;
    name: string;
}

interface IStore {
    containerName: string;
    add(message: IMessage);

    // Callback must return a promises/A compatible promise.
    // Defined as any here.
    sendAll(sendCallback: (IMessage) => any);

    // Acknowledges that message has arrived target server, should remove 
    // message from outgoing store.
    ack(id: string);
}