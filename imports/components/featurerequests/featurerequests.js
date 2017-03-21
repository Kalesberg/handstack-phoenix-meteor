import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Features } from '../../api/features';
import { Counts } from 'meteor/tmeasday:publish-counts';

import './featurerequests.html';

class FeatureRequests {
    constructor($scope, $reactive, $state) {
        'ngInject';

        $reactive(this).attach($scope);
        this.state = $state;
        
        this.subscribe("features");

        this.helpers({
            features(){
                return Features.find()
            },
            
            featureCount(){
                return Counts.get('numberOfFeatures');
            }
        });
    }
}

const name = 'featurerequests';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: FeatureRequests
})
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('featurerequests', {
            url: '/features',
            template: '<featurerequests></featurerequests>',
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
