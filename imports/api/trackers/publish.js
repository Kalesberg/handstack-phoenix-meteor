import { Meteor } from 'meteor/meteor';
import { Trackers } from './collection';

if (Meteor.isServer) {
    Meteor.publish('tracker', function(trackerId) {
        return Trackers.find(trackerId);
    });
}