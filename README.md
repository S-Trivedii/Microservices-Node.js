This is the first half of Mini-Microservice app.
Till first of this project, three services are created:
  1. Post service - For creating the post
  2. Comment service - For creating comment associated with that post
  3. Query service

React app is making a GET request for every post and comment being created which is not efficient. To solve this problem, async communication is being used. An event bus is created which listen for every event 
emitted by Post service and Comment service. This event contains information like data, id etc. Event bus will send this event (information) back to the other service (post service, comment service, query service).

Query service will use this information to create a database and React app will send a GET request to this DB. This will reduce the React app GET request.


NOTE: Every time a new post and comment is created, a new event will emit which will listen by event bus/broker.
     
