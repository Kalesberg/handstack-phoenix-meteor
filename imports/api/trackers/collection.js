import { Mongo } from 'meteor/mongo';

export const Trackers = new Mongo.Collection('trackers');

Trackers.allow({
    insert(userId, tracker) {
        return userId && tracker.owner === userId;
    }
});
