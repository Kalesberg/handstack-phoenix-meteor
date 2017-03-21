import { Meteor } from 'meteor/meteor';
import { Convos } from './collection';

if (Meteor.isServer) {
    Meteor.publish('conversations', function(selector, options, searchString) {
        selector.userIds = this.userId;

        if (typeof searchString === 'string' && searchString.length) {
            selector.key = {
                $regex: `.*${searchString}.*`,
                $options : 'i'
            };
        }

        Counts.publish(this, 'numberOfConversations', Convos.find(selector), {noReady: true});
        return Convos.find(selector, options);
    });
}