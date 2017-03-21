import { Meteor } from 'meteor/meteor';
import { Tags } from './collection';

if (Meteor.isServer) {
    Meteor.publish('tags', function(options) {
        const selector = {
            userIds: this.userId
        };

        Counts.publish(this, 'numberOfTags', Tags.find(selector), {noReady: true});
        return Tags.find(selector, options);
    });
}