import { Meteor } from 'meteor/meteor';

export function sendBroadcast(groupId, message, locale, mediaUrl, trackerId, userId){
    if (Meteor.isServer) {
        let data = {
            groupId: groupId,
            message: message,
            locale: locale,
            mediaUrl: mediaUrl || "",
            userId: userId,
            trackerId: trackerId,
            token: "winston"
        };

        HTTP.post("http://" + Meteor.settings.public.pythonBackendUrl + "/processor/celery_broadcast", {
            data: data
        });
    }
}

Meteor.methods({
    sendBroadcast
});
