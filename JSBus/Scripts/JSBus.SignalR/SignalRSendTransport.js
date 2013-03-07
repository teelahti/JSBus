var JSBus;
(function (JSBus) {
    var SignalRSendTransport = (function () {
        function SignalRSendTransport(server) {
            this.server = server;
            this.notifySentCallbacks = $.Callbacks();
        }
        SignalRSendTransport.prototype.send = function (message) {
            console.log("Sending via SignalR", message);
            var deferred = $.Deferred();
            this.server.execute(message).then(deferred.resolve(message.id)).then(this.notifySentCallbacks.fire(message)).fail(deferred.fail);
            return deferred.promise();
        };
        SignalRSendTransport.prototype.notifyWhenSent = function (callback) {
            this.notifySentCallbacks.add(callback);
        };
        return SignalRSendTransport;
    })();
    JSBus.SignalRSendTransport = SignalRSendTransport;    
})(JSBus || (JSBus = {}));
//@ sourceMappingURL=SignalRSendTransport.js.map
