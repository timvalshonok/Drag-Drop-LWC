public with sharing class RequestsController {
    
    @AuraEnabled
    public static List<Request__c> getAllRequests() {
        return [SELECT Name__c, Account__c, Contact__c, Phone__c, 
            Priority__c, Status__c, Expiration_Date__c, Description__c
        FROM Request__c
        ORDER BY Priority__c
        LIMIT 100];
    }

    @AuraEnabled
    public static void updateRequest(String requestName, String newStatus) {
        Request__c updateRequest = [SELECT Name__c, Status__c FROM Request__c WHERE Name__c = :requestName];
        updateRequest.Status__c = newStatus;
        update(updateRequest);
    }
}
