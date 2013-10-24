/// <reference path="../JSBus/TransportInterfaces.ts" />
/// <reference path="../jquery.d.ts" />
module JSBus {
    export class SignalRSubscribeTransport implements ISubscribeTransport {
        // Since SignalR is dependent on JQuery, it is ok to use 
        // JQuery callbacks to route calls from server
        private receiveCallbacks: JQueryCallback = $.Callbacks();
        private ackCallbacks: JQueryCallback = $.Callbacks();

        constructor(hub: any) {
            // Extend signalR client side hub with methods that server will call. 
            // Use 'on' instead of directly modifying objects, as 'on' works 
            // also if hub has been started before this code is reached.
            hub.on('ack', id => {
                console.log("Received ack from server", id);
                this.ackCallbacks.fire(id);
            });

            hub.on('onEvent', message => {
                console.log("Received event from server", message);
                this.receiveCallbacks.fire(message);
            });
        }

        receive(handler: (message: IMessage) => void ) {
            // Add handler to list of handlers
            this.receiveCallbacks.add(handler);
        }

        ack(handler: (id: string) => void ) {
            // Add handler to list of handlers
            this.ackCallbacks.add(handler);
        }
    }
}