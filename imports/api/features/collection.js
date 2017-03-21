import { Mongo } from 'meteor/mongo';

export const Features = new Mongo.Collection('features');

Features.allow({
    insert(userId, feature) {
        return userId && feature.userId === userId;
    }
});
