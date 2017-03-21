export function converse(message, key, contactName){
    let obj = JSON.parse(key);
    let body = JSON.parse(`{"to":"${obj.to}","sid":"${obj.sid}","body":"${message}","contactName":"you"}`);

    // if you add a callback to HTTP.post it will send duplicate post requests for some bizarre reason, don't do it
    HTTP.post(
        '"body":', {
            data: body
        });
}

Meteor.methods({
    converse
});