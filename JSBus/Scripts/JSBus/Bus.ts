/// <reference path="TransportInterfaces.ts" />
/// <reference path="LocalStorageStore.ts" />

interface IBus {
    send(message: any): void;
    subscribe(onMessageArrived: (message: any) => {}, filter: any);
}

module JSBus {

    export class Bus implements IBus {

        store: IStore = new LocalStorageStore();
        pending: IMessage[] = [];
        sendTimer: number = 0;

        constructor(
            name: string,
            public sendTransport: ISendTransport,
            public subscribeTransport: ISubscribeTransport) {

            // To speed up enumeration and allow multiple simultaneous 
            // Busses, use one local storage container per bus. 
            this.store.containerName = name;

            // Subscribe to ack messages (2 phase commit)
            this.subscribeTransport.ack(id => this.store.ack(id));

            // Begin send loop
            this.sendMessages();
        }

        send(message: any) {
            // Validate
            if (!message) {
                return;
            }

            // If ID property is missing generate it.
            if (!message.id) {
                message.id = (new Date()).getTime();
            }

            this.store.add(message);
        }

        subscribe(
            onMessageArrived: (message: any) => {},
            filter: any) {

            if (!Bus.isFunc(onMessageArrived)) {
                throw new Error('Given subscribe callback must be a function');
            }

            // If given filter is just the message type name or nothing,
            // create a new filter function
            if (!Bus.isFunc(filter)) {
                var eventName = filter;
                filter = message => !eventName || message.Name === eventName || message.name === eventName;
            }

            this.subscribeTransport.receive((receivedMessage) => {
                if (filter(receivedMessage)) {
                    // Message passed filter, forward to handler
                    onMessageArrived(receivedMessage);
                }
            });
        }

        sendMessages() {
            // TODO: Do nothing if we are offline
            this.store.sendAll(message => this.sendTransport.send(message));

            // TODO: Without a counter this will try all failing messages in never ending loop
            // TODO: Consider pausing send timer if there are no messages, and then re-starting it when next message is give to bus
            // Consider resetting timer if there are no new messages
            this.sendTimer = setTimeout(this.sendMessages.bind(this), 100);
        }

        static isFunc(f) {
            return typeof (f) === 'function';
        }
    }
}