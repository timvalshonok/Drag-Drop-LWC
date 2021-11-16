import { LightningElement } from 'lwc';
import getAllRequests from '@salesforce/apex/RequestsController.getAllRequests';
import updateRequest from '@salesforce/apex/RequestsController.updateRequest';

export default class RequestsList extends LightningElement {
    requestsNewList = [];
    requestsInProgressList = [];
    requestsWaitingList = [];
    requestsClosedList = [];
    dropRequestId;

    connectedCallback() {
        this.getRequestsData();
    }

    getRequestsData() {
        getAllRequests()
        .then(result => {
            let requestsNewData = [];
            let requestsInProgressData = [];
            let requestsWaitingData = [];
            let requestsClosedData = [];
            result.forEach((item) => {
                let request = {};
                request.Name = item.Name__c;
                request.Account = item.Account__c;
                request.Contact = item.Contact__c;
                request.Phone = item.Phone__c;
                request.Priority = item.Priority__c;
                request.Status = item.Status__c;
                request.Expiration_Date = item.Expiration_Date__c;
                request.Description = item.Description__c;
                if (request.Status === 'New') {
                    requestsNewData.push(request);
                } else if (request.Status === 'In progress') {
                    requestsInProgressData.push(request);
                } else if (request.Status === 'Waiting') {
                    requestsWaitingData.push(request);
                } else if (request.Status === 'Closed') {
                    requestsClosedData.push(request);
                }
            })
            this.requestsNewList = requestsNewData;
            this.requestsInProgressList = requestsInProgressData;
            this.requestsWaitingList = requestsWaitingData;
            this.requestsClosedList = requestsClosedData;
        }).catch(error => {
            console.log(error);
        })
    }

    dragStart(event) {
        const requestId = event.target.id.substr(0,7);
        this.dropRequestId = requestId;
        let draggableElement = this.template.querySelector('[data-id="' + requestId + '"]');
        draggableElement.classList.add('drag');
    }

    handleDragOver(event){
        this.cancel(event);
    }

    handleDrop(event){
        this.cancel(event);
        const columnUsed = event.currentTarget.id;
        let requestNewStatus;
        if (columnUsed.includes('new')){
            requestNewStatus = 'New';
        } else if (columnUsed.includes('inProgress')){
            requestNewStatus = 'In progress';
        } else if (columnUsed.includes('waiting')){
            requestNewStatus = 'Waiting';
        } else if (columnUsed.includes('closed')){
            requestNewStatus = 'Closed';
        }
        this.updateRequestStatus(this.dropRequestId, requestNewStatus);
    }

    dragEnd(event) {
        const requestId = event.target.id.substr(0,7);
        let draggableElement = this.template.querySelector('[data-id="' + requestId + '"]');
        draggableElement.classList.remove('drag');
    }

    updateRequestStatus(dropRequestId, requestNewStatus) {
        updateRequest({requestName: dropRequestId, newStatus: requestNewStatus})
        .then(() => {
            this.getRequestsData();
        })
        .catch(error => {
            console.log(JSON.stringify(error));
        })
    }

    cancel(event) {
        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        return false;
    }
}
