import { Meteor } from 'meteor/meteor';
import { Broadcasts } from './collection';

if (Meteor.isServer) {
    Meteor.publish('broadcasts', function(options, searchString) {
        if (!searchString || searchString == null) {
            searchString = '';
        }

        const selector = {
            message: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
            userIds: this.userId
        };

        Counts.publish(this, 'numberOfBroadcasts', Broadcasts.find(selector), {noReady: true});
        return Broadcasts.find(selector, options);
    });
}