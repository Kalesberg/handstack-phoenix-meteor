import { Meteor } from 'meteor/meteor';
import { Features } from './collection';

if (Meteor.isServer) {
    Meteor.publish('features', function() {
        Counts.publish(this, 'numberOfFeatures', Features.find(), {noReady: true});
        return Features.find();
    });
}