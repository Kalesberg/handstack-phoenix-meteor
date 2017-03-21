import { Meteor } from 'meteor/meteor';
import { Replies } from './collection';

if (Meteor.isServer) {
    Meteor.publish('replies', function(broadcastId, startTime, options, searchString, needsReply, nestedId, showIgnored) {
        if (!searchString || searchString == null) {
            searchString = '';
        }

        const selector = {
            needsReply: needsReply,
            broadcastId: broadcastId,
            Body: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
            createdAt: {
                $gte: startTime
            },
            ignored: {
                $ne: !showIgnored
            }
        };

        Counts.publish(this, 'numberOfReplies', Replies.find(selector), {noReady: true});

        let trueSelector = {
            needsReply: true,
            broadcastId: broadcastId,
            Body: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
            createdAt: {
                $gte: startTime
            }
        };
        
        let falseSelector = {
            needsReply: false,
            broadcastId: broadcastId,
            Body: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
            createdAt: {
                $gte: startTime
            }
        };

        if (nestedId){
            selector.trackerId = nestedId;
            trueSelector.trackerId = nestedId;
            falseSelector.trackerId = nestedId;
        } else {
            selector.trackerId = "";
            trueSelector.trackerId = "";
            falseSelector.trackerId = "";
        }
        
        Counts.publish(this, 'numberOfRepliesTrue', Replies.find(trueSelector), {noReady: true});
        Counts.publish(this, 'numberOfRepliesFalse', Replies.find(falseSelector), {noReady: true});
        return Replies.find(selector, options);
    });
}