import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './login.html';

class Login {
    constructor($scope, $reactive, $state) {
        'ngInject';
        $reactive(this).attach($scope);

        this.state = $state;
    }

    login(){
        Meteor.loginWithPassword(this.email, this.password, err => {
            if (!err) {
                this.state.go('campaigns');
            }
        })
    }
}

const name = 'login';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Login
})
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('login', {
            url: '/login',
            template: '<login></login>',
            resolve: {
                currentUser($q) {
                    if (Meteor.userId() !== null) {
                        return $q.reject('AUTH_NOT_REQUIRED');
                    } else {
                        return $q.resolve();
                    }
                }
            }
        });
}
