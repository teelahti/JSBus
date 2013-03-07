# JSBus

JSBus is a small library that helps in creating fault tolerant messaging (i.e. commands & events) 
between browser and server. The library is available in source format, or via NuGet package management.

## Store & Forward from browser to server

When sending messages out from browser to server, JSBus stores the message (command) 
to browser local storage, and then in the background forwars message to the server 
until server acknowledges the transfer. In case ack is not received in predefined 
time window, sending is automatically retried. 

## Pub/sub from server to browser

Client can subscribe to server sent events. See below for more detailed usage.

## Usage

### Including JSBus library in your project

If you use NuGet package management, install one of the three packages 
via Install-Package command or NuGet GUI: 

- [JSBus](http://nuget.org/packages/JSBus/): Core library without any client-server transport implementation. 
After package installation remember to include scripts in your page (package 
creates JavaScript bundle ~/bundles/JSBus for your convenience).
- [JSBus.SignalR](http://nuget.org/packages/JSBus.SignalR/): Core library + SignalR send and subscribe transports
After package installation remember to include scripts in your page (package 
creates JavaScript bundle ~/bundles/JSBusSignalR for your convenience).
- [JSBus.SignalR.Sample](http://nuget.org/packages/JSBus.SignalR.Sample/): Sample usage; this package adds a folder 
Samples/JSBus.SignalR into your project. Open index.html from this folder 
in your browser, test functionality, and view the source.

If you don't have nuget available, just copy the JS files from 
folders Scripts/JSBus (and Scripts/JSBus.SignalR if needed). 

### Creating a bus instance

Create a new bus instance with some topic name; this name is used as 
local storage identifier for local storage queues. Give send and 
receive transports to the bus (see later for transport implementations).

    bus = new JSBus.Bus("mytopic", sendTransport, subscribeTransport),

### Sending messages

Sending is easy: just give any object that has a property _id_ to bus.send:

    bus.send({ id: 'abcd1', name: 'ApproveTask' });

### Subscribing to server events

Client can subscribe to server sent events, e.g.:

    bus.subscribe(function (message) {
		// Do something with message
		
    }, "TestEvent");

...or with more powerful event filter function:

    bus.subscribe(function (message) {
        status.atServer.value--;
        status.done.value++;
    }, function(received) { return received.id === 'abcd1'; } );

## Transports

JSBus can be used with different transport mechanisms. On ASP.NET the most viable 
option is to use [SignalR](http://signalr.net) for server to client communication, 
and SignalR or [ASP.NET Web API](http://www.asp.net/web-api) for client to server 
communication. JSBus is not limited to these options, you can write your own transports 
by implementing the following two "interfaces" found from 
[TransportInterfaces.ts](https://github.com/teelahti/JSBus/blob/master/JSBus/Scripts/JSBus/TransportInterfaces.ts): 

    interface ISendTransport {
        // return value "any" must be a promises/A compatible promise 
        send(message: IMessage): any;
    }

    interface ISubscribeTransport {
        receive(handler: (message: IMessage) => void);
        ack(handler: (id: string) => void);
    }

These can be naturally implemented in either TypeScript or vanilla JavaScript (or 
whatever variant suits you).

SignalR transport is provided (see folder 
[Scripts/JSBus.SignalR](https://github.com/teelahti/JSBus/tree/master/JSBus/Scripts/JSBus.SignalR) 
or use NuGet package JSBus.SignalR). 

Transports are given to JSBus constructor during initialization:

    bus = new JSBus.Bus("mytopic", sendTransport, subscribeTransport),

## Development & testing

JSBus is developed in [Typescript](http://www.typescriptlang.org), but distributed 
as TypeScript-generated JavaScript. 

To run the testbed, open JSBus solution in Visual Studio, and hit F5 to run. When viewing test 
page, use development console to see additional console.log() messages about message flow.
