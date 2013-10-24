/// <reference path="../JSBus/TransportInterfaces.ts" />
/// <reference path="../jquery.d.ts" />
var JSBus;
(function (JSBus) {
    var SignalRSubscribeTransport = (function () {
        function SignalRSubscribeTransport(hub) {
            var _this = this;
            // Since SignalR is dependent on JQuery, it is ok to use
            // JQuery callbacks to route calls from server
            this.receiveCallbacks = $.Callbacks();
            this.ackCallbacks = $.Callbacks();
            // Extend signalR client side hub with methods that server will call.
            // Use 'on' instead of directly modifying objects, as 'on' works
            // also if hub has been started before this code is reached.
            hub.on('ack', function (id) {
                console.log("Received ack from server", id);
                _this.ackCallbacks.fire(id);
            });

            hub.on('onEvent', function (message) {
                console.log("Received event from server", message);
                _this.receiveCallbacks.fire(message);
            });
        }
        SignalRSubscribeTransport.prototype.receive = function (handler) {
            // Add handler to list of handlers
            this.receiveCallbacks.add(handler);
        };

        SignalRSubscribeTransport.prototype.ack = function (handler) {
            // Add handler to list of handlers
            this.ackCallbacks.add(handler);
        };
        return SignalRSubscribeTransport;
    })();
    JSBus.SignalRSubscribeTransport = SignalRSubscribeTransport;
})(JSBus || (JSBus = {}));
