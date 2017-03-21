import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './navbar.html';

const name = 'navbar';

class Navbar {
    constructor($scope, $reactive, $state){
        'ngInject';
        $reactive(this).attach($scope);

        this.state = $state;
        this.helpers({
            currentUser() {
                return Meteor.user();
            }
        });
    }

    logout(){
        Meteor.logout(err => {
            if (!err) { this.state.go('login') }
        })
    }
}

// create a module
export default angular.module(name, [
    angularMeteor
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Navbar
});
