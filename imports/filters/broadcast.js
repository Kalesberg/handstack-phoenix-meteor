import angular from 'angular';

const name = "broadcastMessageFilter";

/**
 * @return {string}
 */
function BroadcastMessageFilter(message){
    if (message.length <= 100) { return message; }
    return message.substring(0, 100) + "... ";
}

// create a module
export default angular.module(name, [])
    .filter(name, () => {
        return BroadcastMessageFilter;
    });