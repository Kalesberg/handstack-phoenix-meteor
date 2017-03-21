import { Meteor } from 'meteor/meteor';

import { Groups } from './collection';

if (Meteor.isServer) {
    Meteor.publish('groups', function(options) {
        const selector = {
            userIds: this.userId,
            reuse: false
        };

        Counts.publish(this, 'numberOfGroups', Groups.find(selector), {noReady: true});
        return Groups.find(selector, options);
    });
}