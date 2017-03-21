import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './insights.html';

class Insights {
    constructor($scope, $reactive, $state){
        'ngInject';
        $reactive(this).attach($scope);

        this.helpers({
            currentUser() {
                return Meteor.user();
            }
        });
    }
}

const name = 'insights';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Insights
})
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('insights', {
            url: '/i',
            template: '<insights></insights>',
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
