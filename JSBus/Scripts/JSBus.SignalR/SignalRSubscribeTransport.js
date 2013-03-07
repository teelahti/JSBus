var JSBus;
(function (JSBus) {
    var SignalRSubscribeTransport = (function () {
        function SignalRSubscribeTransport(client) {
            var _this = this;
            this.receiveCallbacks = $.Callbacks();
            this.ackCallbacks = $.Callbacks();
            $.extend(client, {
                ack: function (id) {
                    console.log("Received ack from server", id);
                    _this.ackCallbacks.fire(id);
                },
                onEvent: function (message) {
                    console.log("Received event from server", message);
                    _this.receiveCallbacks.fire(message);
                }
            });
        }
        SignalRSubscribeTransport.prototype.receive = function (handler) {
            this.receiveCallbacks.add(handler);
        };
        SignalRSubscribeTransport.prototype.ack = function (handler) {
            this.ackCallbacks.add(handler);
        };
        return SignalRSubscribeTransport;
    })();
    JSBus.SignalRSubscribeTransport = SignalRSubscribeTransport;    
})(JSBus || (JSBus = {}));
//@ sourceMappingURL=SignalRSubscribeTransport.js.map
