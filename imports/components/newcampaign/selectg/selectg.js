import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import chart from "angular-chart.js";
import ngFileUpload from "ng-file-upload";
import { Groups } from '../../../api/groups';
import { Trackers } from '../../../api/trackers';

import  './selectg.html';

class Selectg {
    constructor($scope, $reactive, $state) {
        'ngInject';

        $reactive(this).attach($scope);
        this.state = $state;
        this.scope = $scope;
        this.selectedGroup = {};

        this.creatingCsvGroup = false;
        this.creatingCopyPasteGroup = false;
        this.creatingManualGroup = false;
        this.showingGroup = false;
        this.showGroupNameManual = false;
        this.showContactFormManual = false;

        this.contacts = [];
        this.groupName = "";

        this.labels = ["Percent complete:", "Percent complete:"];
        this.colors = ["#d92900", "#5cb85c"];
        
        this.page = 1;
        this.perPage = 100;

        this.subscribe('groups', () => {
            return [
                {
                    sort: { createdAt: -1 },
                    limit: parseInt(this.perPage),
                    skip: parseInt((this.getReactively('page') - 1) * this.perPage)
                }
            ]
        });
        
        this.subscribe('tracker', () => {
            return [ this.getReactively('trackerId')]
        });

        this.helpers({
            currentUser() {
                return Meteor.user();
            },

            groups(){
                return Groups.find()
            },
            
            groupsCount(){
                return Counts.get('numberOfGroups');
            },

            tracker(){
                return Trackers.find()
            }
        });
    }

    selectGroup = (group) => {
        this.selectedGroup = group;
        this.toggleAllOff();
        this.showingGroup = true;
    };

    showCsvForm(){
        this.toggleAllOff();
        this.creatingCsvGroup = true;
    }

    goToScanCSV(){
        this.toggleAllOff();
        let fileReader = new FileReader();
        var self = this;

        fileReader.onload = (event) => {
            let csvString = event.currentTarget.result;
            let lines = csvString.split(/\r\n|\n/);

            this.peopleScanned = lines.length - 1;
            self.peopleScanned = lines.length - 1;

            self.scope.$apply(($scope) => {
                this.peopleScanned = lines.length - 1;
                $scope.peopleScanned = lines.length - 1;
            });
        };

        fileReader.readAsText(this.file);
        this.showScanCSV = true;
    }

    goToSetName(){
        this.toggleAllOff();
        this.showSetName = true;
    }

    saveGroup(){
        this.formData.append('groupName', this.groupName || "");
        for (let key of this.formData.keys()){ console.log(key); }
        for (let value of this.formData.values()){ console.log(value); }
        let self = this;
        $.ajax({
            type: 'POST',
            url: 'http://' + Meteor.settings.public.pythonBackendUrl + '/processor/upload_file',
            data: self.formData,
            contentType: false,
            cache: false,
            processData: false,
            success: function() {
                self.formData = null;
                self.groupName = "";
                self.file = {};
                self.fileName = "";
                self.toggleAllOff();
            },
            error: function(err){
                console.log(err);
                alert("error");
            }
        });
    }

    showManualForm(){
        this.toggleAllOff();
        this.groupName = "";
        this.showGroupNameManual = true;
    }

    goToContactFormManual(){
        this.toggleAllOff();
        this.showContactFormManual = true;
    }

    appendManualAndContinue(){
        this.contacts.push({name: this.contactName, number: this.contactPhone, email: this.contactEmail});
        this.contactName = "";
        this.contactPhone = "";
        this.contactEmail = "";
        this.goToContactFormManual();
    }

    saveGroupManual(){
        this.contacts.push({name: this.contactName, number: this.contactPhone, email: this.contactEmail});
        console.log(this.groupName, this.contacts);

        let self = this;

        let data = {
            name: self.groupName || "",
            contacts: self.contacts || [],
            userId: self.currentUser._id
        };

        self.contacts = [];
        self.contactName = "";
        self.contactNumber = "";
        self.contactEmail = "";
        self.toggleAllOff();

        HTTP.post('http://' + Meteor.settings.public.pythonBackendUrl + '/api/groups', { data: data }, function(err, response){
            if (err){
                alert("An error has occurred.");
                console.log(err);
            }

            console.log(response);
        });
    }

    fileUploaded(files){
        this.file = files[0];
        this.fileName = this.file.name;
        this.formData = new FormData();
        this.formData.append('file', files[0]);
        this.formData.append("userId", this.currentUser._id);
        this.formData.append("token", "winston");
        this.formData.append("trackerId", this.trackerId || "");
    }

    toggleAllOff = function(){
        this.creatingCsvGroup = false;
        this.creatingCopyPasteGroup = false;
        this.creatingManualGroup = false;
        this.showingGroup = false;
        this.showProgress = false;
        this.showScanCSV = false;
        this.showSetName = false;
        this.showGroupNameManual = false;
        this.showContactFormManual = false;
    };

    pageChanged = function (newPage) {
        this.page = newPage;
    };

    nextStep = () => {
        console.log(this.selectedGroup);
        if (this.selectedGroup._id){
            this.state.go('sendt', { groupId: this.selectedGroup.groupId });
        } else {
            alert("You must select a group first!");
        }
    }
}

const name = 'selectg';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    "chart.js",
    'ngFileUpload'
]).component(name, {
    templateUrl: `imports/components/newcampaign/${name}/${name}.html`,
    controllerAs: name,
    controller: Selectg
})
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('selectg', {
            url: '/c/send',
            template: '<selectg></selectg>',
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
