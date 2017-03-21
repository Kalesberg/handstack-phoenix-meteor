import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './register.html';

class Register {
    constructor($scope, $reactive, $state) {
        'ngInject';
        $reactive(this).attach($scope);

        this.state = $state;
    }

    register(){
        Accounts.createUser({ email: this.email, password: this.password }, err => {
            if (!err) {
                this.state.go('campaigns');
            }
        })
    }
}

const name = 'register';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Register
})
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('register', {
            url: '/register',
            template: '<register></register>',
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
