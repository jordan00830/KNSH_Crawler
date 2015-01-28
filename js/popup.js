$(function(){
    $('#getAllSemesterAndCountry').on('click',function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {head: 'getAllSemesterAndCountry'}, function(response) {
              console.log('Click getSemester');
            });
        });
    });

    $('#getSchoolList').on('click',function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {head: 'getSchoolList'}, function(response) {
              console.log('Click getSchoolList');
            });
        });
    });

    $('#getAllSchoolList').on('click',function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {head: 'getAllSchoolList'}, function(response) {
              console.log('Click getAllSchoolList');
            });
        });
    });

    $('#getBooks').on('click',function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {head: 'getBooks'}, function(response) {
              console.log('Click getBooks');
            });
        });
    });

    $('#getAllBooks').on('click',function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {head: 'getAllBooks'}, function(response) {
              console.log('Click getAllBooks');
            });
        });
    });
});