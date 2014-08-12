/// <reference path="../JSBus/TransportInterfaces.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
module JSBus {
    export class SignalRSendTransport implements ISendTransport {
        // Since SignalR is dependent on JQuery, it is ok to use 
        // JQuery callbacks here. 
        private notifySentCallbacks: JQueryCallback = $.Callbacks();

        constructor(public hub: any) {
        }

        send(message: IMessage): JQueryPromise<any> {
            console.log("Sending via SignalR", message);

            // Consider using a separate web worker for data pump

            // Use own deferred instead of SignalR provided promise as 
            // we need to supply the id to the caller for .then
            var deferred = $.Deferred();

            if (this.hub === undefined) {
                console.log("Hub is undefined");
                deferred.fail();
                return deferred.promise();
            }

            this.hub.server.execute(message)
                .then(deferred.resolve(message.id))
                .then(this.notifySentCallbacks.fire(message))
                .fail(deferred.fail);

            return deferred.promise();
        }

        notifyWhenSent(callback: (message: IMessage) => void ) {
            this.notifySentCallbacks.add(callback);
        }
    }
}
