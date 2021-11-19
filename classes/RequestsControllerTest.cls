@isTest
public class RequestsControllerTest {
    
    @TestSetup static void setup() {
        List<Request__c> requests = new List<Request__c>();
        Request__c request = new Request__c(Contact__c='Test Contact', Status__c='New');
        requests.add(request);
        insert requests;
    }

    @isTest public static void getAllRequestsTest() {
        Test.startTest();
        List<Request__c> actual = RequestsController.getAllRequests();
        Test.stopTest();

        List<Request__c> expected = [SELECT Contact__c, Status__c FROM Request__c];
        System.assertEquals(expected[0].Contact__c, actual[0].Contact__c, 'Should be Request__c with field Contact__c = "Test Contact"');
    }

    @isTest public static void updateRequestTest() {
        Request__c request = [SELECT Name__c, Contact__c, Status__c FROM Request__c];
        String requestName = request.Name__c;
        String newStatus = 'Closed';

        Test.startTest();
        RequestsController.updateRequest(requestName, newStatus);
        Test.stopTest();

        Request__c actual = [SELECT Status__c FROM Request__c];
        System.assertEquals(actual.Status__c, newStatus, 'status should be changed from "New" to "Closed"');
    }
}
