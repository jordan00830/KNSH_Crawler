


$(function(){
	//KNSH_Crawler.init();
});

//$.post('http://www.knsh.com.tw/_KNSH/Version.asp?go_Sub_Topic=06?go_Sub_Topic=06',{'sel0':'SDA025,人文國中','sel1':'1031b','sel2':'D','sel4':'1','hidsubmited':'Y'},function(data){console.log(data);});


chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
	switch(msg.head){
		case 'getAllSemesterAndCountry': //trigger by backround.js (not trigger??)
			console.log('init trigger by background.js');
			KNSH_Crawler.getAllSemesterAndCountry();
			break;
		case 'getAllSchoolList':
			KNSH_Crawler.getAllSchoolList();
			break;	
		case 'getSchoolList':
			//Test version
			KNSH_Crawler.getSchoolList({'semesterID':'1031b','semesterText':'國小103學年度上學期'}, 'D');
			break;
		case 'getAllBooks':
			//Test version
			KNSH_Crawler.getAllSchoolBook();
			break;	
		case 'getBooks':
			//Test version
			KNSH_Crawler.getSchoolBook({'schoolID': 'SDA002,宜蘭國中' ,'schoolText': '宜蘭國中 - 宜蘭縣宜蘭市樹人路37號','countryID':'D','countryName':'宜蘭縣'}, 
									{'semesterID':'1031b','semesterText':'國小103學年度上學期'}
									, '2');
			break;		
	}

});


/*
@ The class object of searchCut

*/
var KNSH_Crawler = {
	semesterList: [], // [{'semesterID':semesterID,'semesterText':semesterText}, ...]
	countryList: [], // [{'countryID':countryID,'countryName':countryName}, ...]
	schoolList: [], // {'schoolID':schoolID,'schoolText':schoolText,'countryID':country.countryID, 'countryName': country.countryName ,'gradeType':gradeType}
	ResultList: [],
	gradeListObj: {'ele': ['1','2','3','4','5','6'], 'jun': ['1','2','3']}, //ele:國小年級1~6, jun:國中年級1~3
	init: function(){
		//console.log('Initialize: getAllSemesterAndCountry');
		//KNSH_Crawler.getAllSemesterAndCountry();
		//console.log('KNSH crawler init!');
	},
	getAllSemesterAndCountry: function(){
		$.post('/_KNSH/Version.asp?go_Sub_Topic=06?go_Sub_Topic=06',
			function(data){
				var SemesterList = KNSH_Crawler._processSemester(data);
				KNSH_Crawler.semesterList = SemesterList;

				var CountryList = KNSH_Crawler._processCountry(data);
				KNSH_Crawler.countryList = CountryList;
				
				console.log(KNSH_Crawler.semesterList);
				console.log(KNSH_Crawler.countryList);
			});
	},
	_processSemester: function(data){
		var $dropdownListObj = $(data).find('select[name=sel1]').children();
		var returnList = [];

		$dropdownListObj.each(function(index){
			var $currentOption = $(this);
			if($currentOption.val() !== ''){
				var semesterID = $currentOption.val();
				var semesterText = $currentOption.html();
				returnList.push({'semesterID':semesterID,'semesterText':semesterText});
			}
		});
		return returnList;
	},
	_processCountry: function(data){
		var $countryListObj = $(data).find('select[name=sel2]').children();
		var returnCountryList = [];

		$countryListObj.each(function(index){
			var $currentCountry = $(this);
			if($currentCountry.val() !== ''){
				var countryID = $currentCountry.val();
				var countryName = $currentCountry.html();
				returnCountryList.push({'countryID':countryID,'countryName':countryName});
			}
		});
		return returnCountryList;
	},
	getAllSchoolList: function(){
		for(semInx = 0 ; semInx < KNSH_Crawler.semesterList.length ; semInx++){
			for(cntryIdx = 0 ; cntryIdx < KNSH_Crawler.countryList.length ; cntryIdx++){
				var semester = KNSH_Crawler.semesterList[semInx];
				var country = KNSH_Crawler.countryList[cntryIdx];
				KNSH_Crawler.getSchoolList(semester);
			}
		}
	},
	getSchoolList: function(semester,country){
		$.post('/_KNSH/Version.asp?go_Sub_Topic=06?go_Sub_Topic=06',
			{'hidsel1': semester.semesterID,
			 'hidsel2': country.countryID
			}
			,function(data){
				var newSchoolList = KNSH_Crawler._processSchoolList(data,semester,country);
				KNSH_Crawler.schoolList = KNSH_Crawler.schoolList.concat(newSchoolList);
				console.log(KNSH_Crawler.schoolList);
			});
	},
	_processSchoolList: function(data,semester,country){
		var $schoolListObj = $(data).find('select[name=sel0]').children();
		var returnList = [];

		var gradeType = 'ele'; //default : 國小
		if(semester.semesterText.indexOf("國中") > -1)
			gradeType = 'jun';

		$schoolListObj.each(function(index){
			var $currentSchool = $(this);
			if($currentSchool.val() !== ''){
				var schoolID = $currentSchool.val();
				var schoolText = $currentSchool.html();
				returnList.push({'schoolID':schoolID,'schoolText':schoolText,'countryID':country.countryID, 'countryName': country.countryName ,'gradeType':gradeType});
			}
		})
		//console.log(returnList);
		return returnList;
	},

	// Chrome will crash down!
	getAllSchoolBook: function(){
		for(semIdx = 0 ; semIdx < KNSH_Crawler.semesterList.length; semIdx++){
			for(schlIdx = 0 ; schlIdx < KNSH_Crawler.schoolList.length; schlIdx++){
				var currentSemesterID = KNSH_Crawler.semesterList[semIdx].semesterID;
				var currentSchool = KNSH_Crawler.schoolList[schlIdx];
				var gradeType = currentSchool.gradeType;
				var gradeList = KNSH_Crawler.gradeListObj[gradeType];

				console.log()

				for(grdInx = 0 ; grdInx < gradeList.length ; grdInx++){
					KNSH_Crawler.getSchoolBook(currentSchool , currentSemesterID, currentSchool.countryID, gradeList[grdInx]);
				}
			}	
		}
	},
	/*
	@parameters:
		schoolID: 
		countryID: A~Y
		grade: 用 semester.semesterText 來判斷=> 國中: 1~3, 國小: 1~6
	*/
	getSchoolBook: function(school, semester, grade){
		$.post('/_KNSH/Version.asp?go_Sub_Topic=06?go_Sub_Topic=06',
			{'sel0':school.schoolID,
			'sel1': semester.semesterID,
			'sel2': school.countryID,
			'sel4':grade,
			'hidsubmited':'Y'}
			,function(data){
				var processed_data = KNSH_Crawler._processSchoolBook(data,school,semester);
				KNSH_Crawler.ResultList = KNSH_Crawler.ResultList.concat(processed_data);
				console.log(KNSH_Crawler.ResultList);
			});
	},
	_processSchoolBook: function(data,school,semester){
		var $table = $(data).find('#table_1 tr');
		var publisherNameMap = []; // column index => publisher name
		var bookList = [];
		var returnData = {};
		/*
		* Description: Get publisher name list from first table row (skip column 0)
		* Prototype: 科目＼出版社 | 康軒 | 南一	 | 翰林 | 部編
		*/
		$table.eq(0).find('th').each(function(index){
			if(index !== 0){
				publisherNameMap[index] = $(this).html();
			}
		});
		//console.log(publisherNameMap);

		/*
		* Description: Get each course's publisher name 
		* Prototype: 國文 |  | V |  |				
		*/
		$table.each(function(row_index){
			if(row_index !== 0){ //Skip row 0 (processed in the previous step)
				var $currentRow = $(this).find('td');
				var courseName = '';
				var coursePublisherName = '';

				$currentRow.each(function(col_index){
					if(col_index === 0){ //Get course name in column 0
						courseName = $(this).html();
					}
					else{
						if($(this).html() !== ''){
							coursePublisherName = publisherNameMap[col_index];
						}
					}
				});
				bookList.push({'courseName': courseName,'publisherName': coursePublisherName});
				//var courseName = $currentRow.
			}
		});
		returnData = {'bookList':bookList,'schoolText':school.schoolText,'countryName':school.countryName,'semesterText':semester.semesterText};
		//console.log(returnData);
		return returnData;
	}
};