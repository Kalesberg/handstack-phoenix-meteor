import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './phoenix.html';

import { name as Navbar } from '../navbar/navbar';
import { name as Login } from '../login/login';
import { name as Register } from '../register/register';
import { name as Campaigns } from '../campaigns/campaigns';
import { name as Campaign } from '../campaign/campaign';
import { name as Conversations } from '../conversations/conversations';
import { name as Selectg } from '../newcampaign/selectg/selectg';
import { name as Sendt } from '../newcampaign/sendt/sendt';
import { name as Insights } from '../insights/insights';
import { name as Footer } from '../footer/footer';
import { name as Actions } from '../actions/actions';
import { name as ComingSoon } from '../comingsoon/comingsoon';
import { name as FeatureRequests } from '../featurerequests/featurerequests';
import { name as Tags } from '../tags/tags';

class Phoenix {
    constructor($scope, $reactive, $rootScope){
        'ngInject';

        $rootScope.DISABLE_SEND_BUTTON = false;

        $reactive(this).attach($scope);
        this.helpers({
            currentUser() {
                return Meteor.user();
            }
        });
    }
}

const name = 'phoenix';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    Navbar,
    Login,
    Register,
    Tags,
    Campaigns,
    Conversations,
    Selectg, // this needs to be above Campaign, has to do with the routing (/c/new needs to be above c/:broadcastId)
    Sendt, // this needs to be above Campaign, ^^^
    Campaign,
    Insights,
    Footer,
    ComingSoon,
    FeatureRequests,
    Actions
    
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Phoenix
})
    .config(config)
    .run(run);

function config($locationProvider, $urlRouterProvider) {
    'ngInject';

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/login');
}

function run($rootScope, $state) {
    'ngInject';

    $rootScope.$on('$stateChangeError',
        (event, toState, toParams, fromState, fromParams, error) => {
            if (error === 'AUTH_REQUIRED') {
                $state.go('login');
            }
            
            if (error === 'AUTH_NOT_REQUIRED'){
                $state.go('campaigns');
            }
        }
    );
}
