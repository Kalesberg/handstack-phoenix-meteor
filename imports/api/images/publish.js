import { Meteor } from 'meteor/meteor';
import { Images } from './collection';

if (Meteor.isServer) {
    Meteor.publish('images', function(options) {
        const selector = {
            userIds: this.userId
        };

        Counts.publish(this, 'numberOfImages', Images.find(selector), {noReady: true});
        return Images.find(selector, options);
    });
}