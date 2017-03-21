import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Replies } from '../../api/replies';
import { Tags } from '../../api/tags';
import { name as BroadcastMessageFilter } from '../../filters/broadcast';

import './campaign.html';

class Campaign {
    constructor($state, $scope, $rootScope, $reactive, $stateParams) {
        'ngInject';
        
        $reactive(this).attach($scope);
        this.state = $state;
        this.bulkReplyRecipients = [];
        this.replyRecipients = new Set();
        
        // pagination
        this.page = 1;
        this.perPage = 30;

        this.broadcastId = $stateParams.broadcastId;
        this.nestedId = $stateParams.nestedId;
        $rootScope.broadcastId = this.broadcastId;
        this.repliesSort = { createdAt: -1 };
        this.setShowAllReplies();
        this.toggleSearch();
        
        this.needsReply = true;
        this.showIgnored = false;
        
        this.subscribe('tags', () => {
            return [
                {
                    limit: 12,
                    skip: 0
                }
            ]
        });

        this.subscribe('replies', () => {
            return [
                this.getReactively('broadcastId'),
                this.getReactively('startTime'),
                {
                    sort: this.getReactively('repliesSort'),
                    limit: parseInt(this.perPage),
                    skip: parseInt((this.getReactively('page') - 1) * this.perPage)
                },
                this.getReactively('searchText'),
                this.getReactively('needsReply'),
                this.getReactively('nestedId'),
                this.getReactively('showIgnored')
            ]
        });

        this.helpers({
            currentUser() {
                return Meteor.user();
            },
            
            tags(){
                return Tags.find();
            },

            replies(){
                return Replies.find({}, { sort: this.getReactively('broadcastSort')})
            },
            
            repliesCount(){
                return Counts.get('numberOfReplies');
            },
            
            numberOfRepliesIgnored(){
                Counts.get('numberOfRepliesIgnored')
            },

            numberOfRepliesTrue(){
                return Counts.get('numberOfRepliesTrue')
            },

            numberOfRepliesFalse(){
                return Counts.get('numberOfRepliesFalse')
            }
        });
    }
    
    toggleSearch(){
        this.showSearch = !this.showSearch;
    }

    setShowAllReplies(){
        let tenYearsAgo = new Date();
        tenYearsAgo.setTime(tenYearsAgo.valueOf() - 10 * 365 * 24 * 60 * 60 * 1000);
        this.startTime = tenYearsAgo;
    }

    setShowRecentReplies(){
        let yesterday = new Date();
        yesterday.setTime(yesterday.valueOf() - 24 * 60 * 60 * 1000);
        this.startTime = yesterday;
    }

    appendReply(reply){
        // don't allow multiple replies to the same number
        if (this.replyRecipients.has(reply.From)){
            return;
        }

        this.replyRecipients.add(reply.From);
        this.bulkReplyRecipients.push({ phone: reply.From, sid: reply.MessagingServiceSid, _id: reply._id });
    }
    
    selectAll(){
        this.replies.forEach(reply => {
            if (this.replyRecipients.has(reply.From)){
                return;
            }

            this.replyRecipients.add(reply.From);
            this.bulkReplyRecipients.push({ phone: reply.From, sid: reply.MessagingServiceSid, _id: reply._id });
        })
    }
    
    ignoreReply(reply){
        Replies.update({ _id: reply._id }, { $set: { ignored: true }})
    }

    removeReply(reply){
        this.bulkReplyRecipients = this.bulkReplyRecipients.filter(r => (r.phone !== reply.From));
        this.replyRecipients.delete(reply.From);
    }

    toggleShowIgnored(){
        this.showIgnored = !this.showIgnored;
        console.log(this.showIgnored);
    }
    
    setNeedsReplyTrue(){
        this.needsReply = true;
    }

    setNeedsReplyFalse(){
        this.needsReply = false;
    }

    exportBroadcast(){
        let data = { "token": "winston", "broadcastId": this.broadcastId };
        HTTP.post('http://' + Meteor.settings.public.pythonBackendUrl + '/processor/get_replies', { data: data }, function(err, response){
            let csvContent = "data:text/csv;charset=utf-8,";
            let replies = JSON.parse(response.content);
            let header_t = {
                "first_name": ["firstName", function(rec) {
                    if (rec["contact_name"]) {
                        let zz = rec["contact_name"].split(" ").filter(function(n) { return n;});
                        return zz[0];
                    } else return "";
                }],
                "last_name": ["lastName", function(rec) {
                    if (rec["contact_name"]) {
                        let zz = rec["contact_name"].split(" ").filter(function(n) { return n;});
                        return zz.slice(1).join(" ");
                    } else return "";
                }],
                "From": "phone",
                "vanid": "vanid",
                "email": "email",
                "tags": "tags",
                "Body": "message"
            };
            let get_title = function(name) {
                let zz = header_t[name];
                if (Array.isArray(zz))
                    return zz[0];
                else return zz;
            };
            let get_value = function(rec, name) {
                let zz = header_t[name];
                let res = "";
                if (Array.isArray(zz))
                    res = zz[1](rec);
                else res = rec[name];
                if (!res)
                    res = "";
                res = String(res);
                res = res.replace(/,/g, " ");
                return res;
            };

            let columns = Object.keys(header_t);
            let header_titles = [];
            for (let i = 0; i < columns.length; i++) 
                header_titles.push(get_title(columns[i]))
            csvContent += header_titles.join(",") + "\n";

            replies.forEach(function(record){
                let s = "";
                console.log(record);
                for (let i = 0; i < columns.length; i++){
                    let value = get_value(record, columns[i]);
                    if (i < columns.length - 1){
                        if (Array.isArray(value)){
                            s += value.join(" ") + ",";
                        } else {
                            s += value + ",";
                        }

                    } else {
                        s += value + "\n";
                    }
                }
                csvContent += s;
            });

            var encodedUri = encodeURI(csvContent);
            window.open(encodedUri);

            console.log(JSON.parse(response.content));
        });
    }
    
    prepareReply(){
        let self = this;

        let data = {
            groupName: `REPLY_${this.broadcastId}`,
            contacts: this.bulkReplyRecipients,
            userId: this.currentUser._id ,
            token: "winston",
            broadcastId: this.broadcastId
        };

        HTTP.post('http://' + Meteor.settings.public.pythonBackendUrl + '/processor/prepare_bulk_reply', { data: data }, function(err, response){
            self.bulkReplyRecipients.forEach(function(reply){
               Replies.update({ _id: reply._id }, { $set: { needsReply: false }})
            });

            self.state.go('sendt', { groupId: response.data.groupId });
        });
    }

    pushTag(tag){
        delete tag["$$hashKey"];
        this.bulkReplyRecipients.forEach(reply => {
            Replies.update(reply._id, { $addToSet: { tags: tag.name }})
        });
    }

    removeTag(reply, tag){
        Replies.update(reply._id, { $pull: { "tags.name": "tag.name" }});
        alert(`Removed ${tag.name}.`);
    }

    pageChanged(newPage) {
        this.page = newPage;
    }
}

const name = 'campaign';

// create a module
export default angular.module(name, [
    angularMeteor,
    BroadcastMessageFilter,
    uiRouter
]).component(name, {
    templateUrl: `imports/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Campaign
})
    .config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('campaigns.campaign', {
            url: '/:broadcastId',
            template: '<campaign></campaign>',
            params: { nestedId: null },
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
