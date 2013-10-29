/// <reference path="TransportInterfaces.ts" />
/// <reference path="LocalStorageQueue.ts" />
var JSBus;
(function (JSBus) {
    // TODO: Create fail counter to avoid trying infinitely
    // TODO: Consider using separate delayPolicy class to specify times, like new IncreasingDelay(5, 200)
    var LocalStorageStore = (function () {
        function LocalStorageStore() {
            this.containerName = 'default';
        }
        LocalStorageStore.prototype.initQueues = function () {
            if (!this._outgoing) {
                this._outgoing = new JSBus.LocalStorageQueue(this.containerName + "." + "outgoing");
                this._sent = new JSBus.LocalStorageQueue(this.containerName + "." + "sent");
                this._retry = new JSBus.LocalStorageQueue(this.containerName + "." + "retry");

                // Also init timers to transfer stuff from queue to queue
                // Retry failed sendings when message is older than 30 s. Check every 10 s.
                setInterval(this.moveBackToOutgoing.bind(this, this.retry, 30000), 10000);

                // Move sent back to outgoing if there is no ack from server after 60 s. Check every 10 s
                setInterval(this.moveBackToOutgoing.bind(this, this.sent, 60000), 10000);
            }
        };

        Object.defineProperty(LocalStorageStore.prototype, "outgoing", {
            get: function () {
                this.initQueues();
                return this._outgoing;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(LocalStorageStore.prototype, "sent", {
            get: function () {
                this.initQueues();
                return this._sent;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(LocalStorageStore.prototype, "retry", {
            get: function () {
                this.initQueues();
                return this._retry;
            },
            enumerable: true,
            configurable: true
        });

        LocalStorageStore.prototype.add = function (message) {
            // Convert message id to string to prevent comparison
            // problems later on (the format on the wire is string)
            this.outgoing.add(message.id.toString(), message);
        };

        LocalStorageStore.prototype.ack = function (id) {
            // Consider adding this message to an audit log
            this.sent.remove(id);
        };

        LocalStorageStore.prototype.sendAll = function (sendCallback) {
            var _this = this;
            var msgs = this.outgoing.all();

            msgs.forEach(function (m) {
                // Callback returns a promise with message id as value
                sendCallback(m).then(_this.markSent, function (err) {
                    console.log("Error sending message, delaying:", m, err);
                    _this.delay(m.id);
                });
            });
        };

        LocalStorageStore.prototype.markSent = function (id) {
            this.moveMessageFromOutgoingTo(this.sent, id);
        };

        LocalStorageStore.prototype.delay = function (id) {
            this.moveMessageFromOutgoingTo(this.retry, id);
        };

        LocalStorageStore.prototype.moveMessageFromOutgoingTo = function (queue, id) {
            var m = this.outgoing.remove(id);

            if (m) {
                // Add operation date for automatic queue to queue moves
                queue.add(m.id, m, new Date());
            }
        };

        LocalStorageStore.prototype.moveBackToOutgoing = function (queue, cutOffMS) {
            var move = queue.removeWhereLastOperationOlderThan(cutOffMS);

            for (var i = move.length - 1; i >= 0; i--) {
                console.log("Moving message %s %s --> %s", move[i].id, queue.name, this.outgoing.name);
                this.outgoing.add(move[i].id, move[i]);
            }
        };
        return LocalStorageStore;
    })();
    JSBus.LocalStorageStore = LocalStorageStore;
})(JSBus || (JSBus = {}));
