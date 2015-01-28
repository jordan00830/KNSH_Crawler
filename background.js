/*
chrome.browserAction.onClicked.addListener(function(){
	console.log('Click browse btn!');
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {head: 'getData'}, function(response) {
		  console.log('Click browse btn!');
		});
	});
})*/

chrome.webNavigation.onDOMContentLoaded.addListener(function(e){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

			//Show pageAction btn only in 'www.knsh.com.tw' hostname
			chrome.pageAction.show(tabs[0].id);
		});
    }, 
    {url: [{hostSuffix: 'www.knsh.com.tw'}]}
);

//Bind clicked action to pageAction btn
chrome.pageAction.onClicked.addListener(function(tab){
	console.log('Click pageAction btn!');
	/*
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {head: 'getAllSemesterAndCountry'}, function(response) {
		  console.log('initialize by backgroun.js');
		});
	});*/
});
