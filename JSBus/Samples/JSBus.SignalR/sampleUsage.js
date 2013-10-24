(function () {
    // Proxy for server side hub
    var testHub = $.connection.sample,
        // SignalR send transport
        sendTransport = new JSBus.SignalRSendTransport(testHub),
        subscribeTransport = new JSBus.SignalRSubscribeTransport(testHub),
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
            var idSeed = Date.now(),
                commands = [];

            e.preventDefault();

            // TODO: Disable elements until done
            
            // Create a list of commands to send:
            for (var i = 0; i < form.count.valueAsNumber; i++) {
                commands.push({ id: idSeed + i, name: "test message" });
            }

            // Normal for-loop would take all the cycles --> all demo values not changing. 
            // Therefore chunk the list and use setTimeout to do some other tasks 
            // every now and then.
            timedChunk(
                commands,
                function (item) {
                    bus.send(item);
                    
                    // Change counter value on UI
                    status.notSent.value--;
                    status.outgoingQueue.value++;
                },
                this,
                function () { console.log("All given to bus"); });
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
    
    //Copyright 2009 Nicholas C. Zakas. All rights reserved.
    //MIT Licensed
    function timedChunk(items, process, context, callback) {
        var todo = items.concat();   //create a clone of the original

        setTimeout(function () {

            var start = +new Date();

            do {
                process.call(context, todo.shift());
            } while (todo.length > 0 && (+new Date() - start < 50));

            if (todo.length > 0) {
                setTimeout(arguments.callee, 25);
            } else {
                callback(items);
            }
        }, 25);
    }
}());
