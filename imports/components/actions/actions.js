import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import chart from "angular-chart.js"
import { Trackers } from '../../api/trackers';

import './actions.html';

class Actions {
    constructor($scope, $reactive, $state, $stateParams) {
        'ngInject';

        $reactive(this).attach($scope);
        this.state = $state;
        this.actionId = $stateParams.actionId;

        this.labels = ["Percent complete:", "Percent complete:"];
        this.colors = ["#d92900", "#5cb85c"];

        this.subscribe('tracker', () => {
            return [ this.getReactively('actionId')]
        });

        this.helpers({
            currentUser() {
                return Meteor.user();
            },
            
            tracker(){
                return Trackers.find()
            }
        });
    }
}

const name = 'actions';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Actions
})
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('actions', {
            url: '/actions/:actionId',
            template: '<actions></actions>',
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
