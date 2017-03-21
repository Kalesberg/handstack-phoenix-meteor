import angular from 'angular';

const name = "messageTitleFilter";

function MessageTitleFilter(key){
    let obj = JSON.parse(key);
    return obj.to;
}

// create a module
export default angular.module(name, [])
    .filter(name, () => {
        return MessageTitleFilter;
    });