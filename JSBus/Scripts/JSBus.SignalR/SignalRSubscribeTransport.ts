/// <reference path="../JSBus/TransportInterfaces.ts" />
/// <reference path="../jquery.d.ts" />
module JSBus {
    export class SignalRSubscribeTransport implements ISubscribeTransport {
        // Since SignalR is dependent on JQuery, it is ok to use 
        // JQuery callbacks to route calls from server
        private receiveCallbacks: JQueryCallback = $.Callbacks();
        private ackCallbacks: JQueryCallback = $.Callbacks();

        constructor(client: any) {
            // Extend signalR client side hub with methods that server will call
            $.extend(client, {
                ack: id => {
                    console.log("Received ack from server", id);
                    this.ackCallbacks.fire(id);
                },
                onEvent: message => {
                    console.log("Received event from server", message);
                    this.receiveCallbacks.fire(message);
                }
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