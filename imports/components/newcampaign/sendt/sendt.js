import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Images } from '../../../api/images';
import { Trackers } from '../../../api/trackers';

import  './sendt.html';

class Sendt {
    constructor($scope, $reactive, $state, $stateParams, $rootScope) {
        'ngInject';

        $reactive(this).attach($scope);
        this.groupId = $stateParams.groupId;
        this.state = $state;
        this.rs = $rootScope;
        this.showImages = true;

        this.page = 1;
        this.perPage = 12;

        this.locales = [
            //"SAN_FRANCISCO_ADVANCED",
            //"OAKLAND_ADVANCED",
            //"11/7/16 Wisconsin",
            "NYC",
            "Washington_DC",
            "Los Angeles",
            "San Francisco",
            "Los Angeles 747",
            "Dallas 469",
            "Redondo Beach",
            "Florida",
            "Seattle",
            "LA Feb 28",
            "LA_EDH",
            "LA_EDH2",
            "LA_BH"
            /**
            "Maine",
            "11/7/16 Wisconsin",
            "11/7/16 Bakersfield",
            "11/7/16 San Diego",
            "11/7/16 Arizona",
            "11/7/16 Riverside 1",
            "11/7/16 Santa Barbara 1",
            "11/7/16 Los Angeles 1",
            "11/7/16 Santa Barbara 2",
            "11/7/16 Ohio 01",
            "11/7/16 Ohio 02",
            "11/7/16 Oakland",
            "11/7/16 Michigan",
            "11/7/16 San Francisco 01",
            "11/7/16 San Francisco 02",
            "11/7/16 San Francisco 03",
            "11/7/16 San Francisco 04",
            "11/7/16 San Francisco 05",
            "11/7/16 San Francisco 06",
            "11/7/16 San Francisco 07",
            "11/7/16 San Francisco 08",
            "11/7/16 Los Angeles 02",
            "11/7/16 Los Angeles 03",
            "11/7/16 Los Angeles 04",
            "11/7/16 Los Angeles 05",
            "11/7/16 Los Angeles 06",
            "11/7/16 Orange County",
            "11/7/16 Hayward",
            "11/7/16 Oregon City CCC",
            "11/7/16 Vermont",
            "11/7/16 Riverside 2",
            "11/7/16 Colorado",
            "11/7/16 Santa Barbara 3",
            "11/7/16 Santa Barbara 4",
            "11/7/16 Los Angeles 7",
            "11/7/16 Oregon 01",
            "Belgium",
            "Orange County Standard",
            "Nevada"
            */
            /**
            "Montana",
            "Missouri",
            "Miami",
            "Sonoma CCC",
            "Illinois",
            "Arizona",
            "Georgia",
            "Vermont",
            "Massachusetts",
            "Oklahoma",
            "Washington",
            "Wisconsin",
            "Pennsylvania",
            "Oakland",
            "Orange County",
            "Hawaii",
            "Colorado",
            "New Mexico",
            "Michigan",
            "Oregon",
            "Iowa",
            "North Carolina",
            "West Virginia",
            "New Hampshire",
            "Washington D.C.",
            "New York",
            "South Florida",
            "Cincinnati",
            "Ohio",
            "Connecticut",
            "Nevada"
             */
        ];
        
        this.locale = "San Francisco";
        this.subscribe('images', () => {
            return [
                {
                    sort: { createdAt: -1 },
                    limit: parseInt(this.perPage),
                    skip: parseInt((this.getReactively('page') - 1) * this.perPage)
                }
            ]
        }, function(){
            if (this.images.length < 12){
                let numImages = this.images.length;

                for (let i = 0; i < 12 - numImages; i++){
                    this.images.push({
                        mediaUrl: "",
                        thumb_url: "https://s31.postimg.org/rz053ozmj/Screen_Shot_2016_07_25_at_9_35_48_AM.png"
                    })
                }

                this.imagesCount = this.images.length;
            }
        });

        this.helpers({
            currentUser() {
                return Meteor.user();
            },
            
            images(){
                return Images.find()
            },

            imagesCount(){
                return Counts.get('numberOfImages');
            }
        });
    };

    toggleImages(){
        this.toggleAllOff();
        this.showImages = true;
    }

    toggleImageForm(){
        this.toggleAllOff();
        this.showImageForm = true;
    }

    toggleAllOff(){
        this.showImages = false;
        this.showImageForm = false;
    };

    assumeChanged(){
        this.imagePresent = true;
    };

    uploadImage(){
        let formData = new FormData($('#image-upload-form')[0]);
        this.toggleAllOff();
        this.showImages = true;

        formData.append("userId", this.currentUser._id);
        formData.append("token", "winston");

        $.ajax({
            type: 'POST',
            url: 'http://' + Meteor.settings.public.pythonBackendUrl + '/processor/image_upload',
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
            success: function() {},
            error: function(err){
                console.log(err);
                alert("error");
            }
        });
    }

    selectLocale(locale){
        this.locale = locale;
    }

    selectImage(index){
        this.selectedImageIndex = index;
        this.selectedImage = this.images[index];
        console.log(this.selectedImage);
    }

    send(){
        if (this.rs.DISABLE_SEND_BUTTON){
            alert("Please wait 60 seconds before sending another broadcast.");
        } else {
            console.log("Broadcast sent.");

            let mediaUrl = (this.selectedImage) ? this.selectedImage.url : "";
            this.trackerId = Trackers.insert({ createdAt: new Date(), owner: this.currentUser._id, progress: 0 });
            console.log(this.groupId, this.message, this.locale, mediaUrl, this.trackerId, this.currentUser._id);

            // REFERENCE
            let rs = this.rs;
            rs.DISABLE_SEND_BUTTON = true;
            setTimeout(() => { rs.DISABLE_SEND_BUTTON = false; }, 60000);

            Meteor.call("sendBroadcast", this.groupId, this.message, this.locale, mediaUrl, this.trackerId, this.currentUser._id, (err) => {
                console.log(err);
                this.state.go("campaigns")
            });
        }
    }

    pageChanged = function(newPage) {
        this.selectedImage = null;
        this.selectedImageIndex = null;
        this.page = newPage;
    };
}

const name = 'sendt';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    templateUrl: `imports/components/newcampaign/${name}/${name}.html`,
    controllerAs: name,
    controller: Sendt
})
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('sendt', {
            url: '/c/send/:groupId',
            template: '<sendt></sendt>',
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
