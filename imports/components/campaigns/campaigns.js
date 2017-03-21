import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Broadcasts } from '../../api/broadcasts';
import { name as BroadcastMessageFilter } from '../../filters/broadcast';

import './campaigns.html';

class Campaigns {
    constructor($scope, $reactive, $state, $rootScope) {
        'ngInject';

        $reactive(this).attach($scope);
        this.state = $state;
        this.broadcastSort = { createdAt: -1 };
        this.broadcastId = "";
        this.trackerId = "";

        this.subscribe('broadcasts', () => {
            return [
                this.getReactively('broadcastSort'),
                this.getReactively('searchText')
            ]
        });

        this.helpers({
            broadcasts(){
                return Broadcasts.find({}, { sort: this.getReactively('broadcastSort')})
            }
        });
    }
    
    selectCampaign(broadcastId, trackerId){
        console.log(broadcastId, trackerId);
        this.broadcastId = broadcastId;
        this.nestedId = trackerId;
        this.state.go("campaigns.campaign", {broadcastId: this.broadcastId, nestedId: this.nestedId});
    }
    
    toggleBroadcastsSort(){
        // getReactively only works if we reassign the value of this.broadcastSort, not if we modify its contents
        let flag = this.broadcastSort.createdAt;
        this.broadcastSort = { createdAt: flag * -1 };
    }
}

const name = 'campaigns';

// create a module
export default angular.module(name, [
    angularMeteor,
    BroadcastMessageFilter,
    uiRouter,
    'angularMoment'
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Campaigns
})
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('campaigns', {
            url: '/c',
            template: '<campaigns></campaigns>',
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
