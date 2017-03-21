import { Mongo } from 'meteor/mongo';

export const Broadcasts = new Mongo.Collection('broadcasts');

Broadcasts.allow({
    insert(userId, broadcast) {
        return userId && broadcast.owner === userId;
    },
    update(userId, broadcast, fields, modifier) {
        return userId && broadcast.owner === userId;
    },
    remove(userId, broadcast) {
        return userId && broadcast.owner === userId;
    }
});
