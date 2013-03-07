var JSBus;
(function (JSBus) {
    var Bus = (function () {
        function Bus(name, sendTransport, subscribeTransport) {
            this.sendTransport = sendTransport;
            this.subscribeTransport = subscribeTransport;
            var _this = this;
            this.store = new JSBus.LocalStorageStore();
            this.pending = [];
            this.sendTimer = 0;
            this.store.containerName = name;
            this.subscribeTransport.ack(function (id) {
                return _this.store.ack(id);
            });
        }
        Bus.prototype.send = function (message) {
            this.store.add(message);
            if(!this.sendTimer) {
                this.sendMessages();
            }
        };
        Bus.prototype.subscribe = function (onMessageArrived, filter) {
            if(!Bus.isFunc(onMessageArrived)) {
                throw new Error('Given subscribe callback must be a function');
            }
            if(!Bus.isFunc(filter)) {
                var eventName = filter;
                filter = function (message) {
                    return !filter || message.Name === eventName || message.name === eventName;
                };
            }
            this.subscribeTransport.receive(function (receivedMessage) {
                if(filter(receivedMessage)) {
                    onMessageArrived(receivedMessage);
                }
            });
        };
        Bus.prototype.sendMessages = function () {
            var _this = this;
            this.store.sendAll(function (message) {
                return _this.sendTransport.send(message);
            });
            this.sendTimer = setTimeout(this.sendMessages.bind(this), 100);
        };
        Bus.isFunc = function isFunc(f) {
            return typeof (f) === 'function';
        };
        return Bus;
    })();
    JSBus.Bus = Bus;    
})(JSBus || (JSBus = {}));
//@ sourceMappingURL=Bus.js.map
