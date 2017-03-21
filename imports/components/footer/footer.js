import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Features } from '../../api/features';

import './footer.html';

const name = 'handstackfooter';

class Footer {
    constructor($scope, $reactive, $state){
        'ngInject';
        $reactive(this).attach($scope);

        this.helpers({
            currentUser() {
                return Meteor.user();
            }
        });
    }

    addFeature(){
        Features.insert({ text: this.featureText, userId: this.currentUser._id });
        this.featureText = "";
    }
}

// create a module
export default angular.module(name, [
    angularMeteor
]).component(name, {
    templateUrl: `imports/components/footer/footer.html`,
    controllerAs: name,
    controller: Footer
});
