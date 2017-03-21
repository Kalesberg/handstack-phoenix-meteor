import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './comingsoon.html';

class ComingSoon {
    constructor($scope, $reactive, $state) {
        'ngInject';

        $reactive(this).attach($scope);
        this.state = $state;
    }
}

const name = 'comingsoon';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: ComingSoon
})
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('comingsoon', {
            url: '/future',
            template: '<comingsoon></comingsoon>',
            resolve: {
                currentUser($q) {
                    if (Meteor.userId() === null) {
                        return $q.reject('AUTH_REQUIRED');
                    } else {
                        return $q.resolve();
                    }
                }
            }
        });
}
