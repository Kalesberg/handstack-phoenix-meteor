import { Mongo } from 'meteor/mongo';

export const Replies = new Mongo.Collection('replies');

Replies.allow({
    insert(userId, reply) {
        return userId && reply.owner === userId;
    },
    update(userId, reply, fields, modifier) {
        return true;
    },
    remove(userId, reply) {
        return userId && reply.owner === userId;
    }
});
