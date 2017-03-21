import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Counts } from 'meteor/tmeasday:publish-counts';
import ScrollGlue from 'angularjs-scroll-glue';
import utilsPagination from 'angular-utils-pagination';
import { Convos } from '../../api/conversations';
import { name as MessageTitleFilter } from '../../filters/message';


import './conversations.html';

class Conversations {
    constructor($scope, $reactive, $state) {
        'ngInject';

        $reactive(this).attach($scope);
        this.state = $state;

        this.searchString = '';
        this.page = 1;
        this.perPage = 10;

        this.conversationsQuery = {};
        
        this.subscribe('conversations', () => {
            return [
                this.getReactively('conversationsQuery'),
                {
                    limit: parseInt(this.perPage),
                    skip: parseInt((this.getReactively('page') - 1) * this.perPage)
                },
                this.getReactively('searchString')
            ]
        });

        this.helpers({
            conversations(){
                return Convos.find(this.getReactively('conversationsQuery'))
            },

            conversationsCount() {
                return Counts.get('numberOfConversations');
            }
        })
    }

    setQueryActive(){
        this.conversationsQuery = {$where:"this.messages.length % 2 != 1"};
    }

    setQueryInactive(){
        this.conversationsQuery = {$where:"this.messages.length % 2 != 0"};
    }

    setQueryAll(){
        this.conversationsQuery = {};
    }

    setConversation(conversation){
        this.conversation = conversation;
    }
    
    send(){
        Meteor.call("converse", this.messageText, this.conversation.key, err => {
            if (err){ alert(err); }
        })
    }

    pageChanged = function (newPage) {
        this.page = newPage;
    }
}

const name = 'conversations';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    MessageTitleFilter,
    utilsPagination,
    "luegg.directives"
    //"angularUtils.directives.dirPagination"
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Conversations
})
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('conversations', {
            url: '/conversations',
            template: '<conversations></conversations>',
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
