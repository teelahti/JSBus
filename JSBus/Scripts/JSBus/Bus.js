/// <reference path="TransportInterfaces.ts" />
/// <reference path="LocalStorageStore.ts" />
var JSBus;
(function (JSBus) {
    var Bus = (function () {
        function Bus(name, sendTransport, subscribeTransport) {
            var _this = this;
            this.sendTransport = sendTransport;
            this.subscribeTransport = subscribeTransport;
            this.store = new JSBus.LocalStorageStore();
            this.pending = [];
            this.sendTimer = 0;
            // To speed up enumeration and allow multiple simultaneous
            // Busses, use one local storage container per bus.
            this.store.containerName = name;

            // Subscribe to ack messages (2 phase commit)
            this.subscribeTransport.ack(function (id) {
                return _this.store.ack(id);
            });

            // Begin send loop
            this.sendMessages();
        }
        Bus.prototype.send = function (message) {
            if (!message) {
                return;
            }

            if (!message.id) {
                message.id = (new Date()).getTime();
            }

            this.store.add(message);
        };

        Bus.prototype.subscribe = function (onMessageArrived, filter) {
            if (!Bus.isFunc(onMessageArrived)) {
                throw new Error('Given subscribe callback must be a function');
            }

            if (!Bus.isFunc(filter)) {
                var eventName = filter;
                filter = function (message) {
                    return !eventName || message.Name === eventName || message.name === eventName;
                };
            }

            this.subscribeTransport.receive(function (receivedMessage) {
                if (filter(receivedMessage)) {
                    // Message passed filter, forward to handler
                    onMessageArrived(receivedMessage);
                }
            });
        };

        Bus.prototype.sendMessages = function () {
            var _this = this;
            // TODO: Do nothing if we are offline
            this.store.sendAll(function (message) {
                return _this.sendTransport.send(message);
            });

            // TODO: Without a counter this will try all failing messages in never ending loop
            // TODO: Consider pausing send timer if there are no messages, and then re-starting it when next message is give to bus
            // Consider resetting timer if there are no new messages
            this.sendTimer = setTimeout(this.sendMessages.bind(this), 100);
        };

        Bus.isFunc = function (f) {
            return typeof (f) === 'function';
        };
        return Bus;
    })();
    JSBus.Bus = Bus;
})(JSBus || (JSBus = {}));
