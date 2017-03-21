import { Mongo } from 'meteor/mongo';

export const Groups = new Mongo.Collection('groups');

Groups.allow({
    insert(userId, group) {
        return userId;
    },
    update(userId, group, fields, modifier) {
        return _.contains(group.userIds, userId);
    },
    remove(userId, broadcast) {
        return _.contains(group.userIds, userId);
    }
});
