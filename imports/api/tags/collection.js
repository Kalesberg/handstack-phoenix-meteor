import { Mongo } from 'meteor/mongo';

export const Tags = new Mongo.Collection('tags');

Tags.allow({
    insert(userId) {
        return userId;
    },

    remove(userId, tag) {
        return userId && _.contains(tag.userIds, userId);
    }
});
