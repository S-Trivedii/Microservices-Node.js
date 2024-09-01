This is the second half of microservice project.
In this section, I have created another service - moderation service

This moderation service check weather a comment is moderated or not. Based on that it will categorise the comment in three category - approved | pending | rejected

Also the second half also solve the problem of missing event. I have created a temporary storage for the events created/emitted by event-bus/broker. If somehow a service missed all those events, it can visit to this
temporary database.
