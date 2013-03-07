(function () {
    // Proxy for server side hub
    var testHub = $.connection.sample,
        // SignalR send transport
        sendTransport = new JSBus.SignalRSendTransport(testHub.server),
        subscribeTransport = new JSBus.SignalRSubscribeTransport(testHub.client),
        form = document.getElementById("sendMessages"),
        bus = new JSBus.Bus("testTopic", sendTransport, subscribeTransport),
        
        // Below variables are needed only for visualizing traffic, 
        // not normally needed in real applications
        graphs = document.getElementById("graphs"),
        status = {
            origin: 0,
            notSent: new DataBar(graphs, "Not sent"),
            outgoingQueue: new DataBar(graphs, "Outgoing queue"),
            sent: new DataBar(graphs, "Sent"),
            atServer: new DataBar(graphs, "Server ack"),
            done: new DataBar(graphs, "Done")
        };


    // Initialize form only after SignalR initialization has taken place
    $.connection.hub.start(function () {
        form.addEventListener("submit", function (e) {
            var idSeed = Date.now();

            e.preventDefault();

            // TODO: Disable elements until done
            // TODO: This takes all the cycles --> demo values not changing
            for (var i = 0; i < form.count.valueAsNumber; i++) {
                bus.send({ id: idSeed + i, name: "test message" });
                
                // Change counter value on UI
                status.notSent.value--;
                status.outgoingQueue.value++;
            }
        }, false);
    });
    
    // Event handlers to change visualized message flow values
    form.addEventListener("input", function () {
        status.origin = status.notSent.value = form.count.valueAsNumber;

        status.outgoingQueue.value = 0;
        status.sent.value = 0;
        status.atServer.value = 0;
        status.done.value = 0;
    });

    // Initial value
    status.origin = status.notSent.value = form.count.valueAsNumber;

    // subscribe to send transport notifications to show status 
    // on UI - this is not normally needed
    sendTransport.notifyWhenSent(function (m) {
        status.outgoingQueue.value--;
        status.sent.value++;
    });

    // Subscribe to transport ack to show demonstration on 
    // UI - this is not normally needed
    subscribeTransport.ack(function (id) {
        status.sent.value--;
        status.atServer.value++;
    });

    // Subscibe to business event to visualize when answer is 
    // returned from server. This is normal usage scenario.
    bus.subscribe(function (m) {
        status.atServer.value--;
        status.done.value++;
    }, "TestEvent");
}());
