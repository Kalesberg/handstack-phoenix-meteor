import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Tags } from '../../api/tags';

import './tags.html';

class TagsController {
    constructor($scope, $reactive, $state){
        'ngInject';
        $reactive(this).attach($scope);
        this.state = $state;
        this.page = 1;
        this.perPage = 12;
        
        this.subscribe('tags', () => {
           return [
               {
                   limit: parseInt(this.perPage),
                   skip: parseInt((this.getReactively('page') - 1) * this.perPage)
               }
           ] 
        });
        
        this.helpers({
            currentUser() {
                return Meteor.user();
            },

            tags(){
                return Tags.find();
            },

            tagsCount(){
                return Counts.get('numberOfTags');
            }
        })
    }

    createTag(){
        Tags.insert({ name: this.tagName, userIds: [this.currentUser._id]})
        this.tagName = "";
    }

    removeTag(tagId){
        Tags.remove(tagId);
    }

    pageChanged = function(newPage) {
        this.selectedImage = null;
        this.selectedImageIndex = null;
        this.page = newPage;
    };
}

const name = 'tags';

export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: TagsController
})
    .config(config)

function config($stateProvider){
    'ngInject';
    $stateProvider
        .state('tags', {
            url: '/c/tags',
            template: '<tags></tags>',
            resolve: {
                currentUser($q){
                    if (Meteor.userId() === null){
                        return $q.reject('AUTH_REQUIRED')
                    } else {
                        return $q.resolve();
                    }
                }
            }
        })
}