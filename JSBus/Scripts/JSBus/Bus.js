/// <reference path="TransportInterfaces.ts" />
/// <reference path="LocalStorageStore.ts" />

var JSBus;
(function (JSBus) {
    var Bus = (function () {
        function Bus(name, sendTransport, subscribeTransport) {
            this.sendTransport = sendTransport;
            this.subscribeTransport = subscribeTransport;
            this.store = new JSBus.LocalStorageStore();
            this.pending = [];
            this.sendTimer = 0;
            // To speed up enumeration and allow multiple simultaneous
            // Busses, use one local storage container per bus.
            this.store.containerName = name;

            // Subscribe to ack messages (2 phase commit)
            this.subscribeTransport.ack(this.store.ack.bind(this.store));

            // Begin send loop
            this.sendMessages();

            // Start message sending when browser is back online
            window.addEventListener("online", this.sendMessages.bind(this));
        }
        Bus.prototype.send = function (message) {
            // Validate
            if (!message) {
                return;
            }

            // If ID property is missing generate it.
            if (!message.id) {
                message.id = (new Date()).getTime();
            }

            this.store.add(message);

            // If send loop is not ongoing, start it
            this.sendMessages();
        };

        Bus.prototype.subscribe = function (onMessageArrived, filter) {
            if (!Bus.isFunc(onMessageArrived)) {
                throw new Error('Given subscribe callback must be a function');
            }

            // If given filter is just the message type name or nothing,
            // create a new filter function
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
            // Do nothing if timer is running or if we are offline
            if (this.sendTimer || (typeof navigator.onLine !== "undefined" && !navigator.onLine)) {
                return;
            }

            this.sendMessagesCore();
        };

        Bus.prototype.sendMessagesCore = function () {
            this.store.sendAll(this.sendTransport.send.bind(this.sendTransport));

            // Consider pausing timer if there are no new messages
            this.sendTimer = setTimeout(this.sendMessagesCore.bind(this), 100);
        };

        Bus.isFunc = function (f) {
            return typeof (f) === 'function';
        };
        return Bus;
    })();
    JSBus.Bus = Bus;
})(JSBus || (JSBus = {}));
