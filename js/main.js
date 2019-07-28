window.app = window.app || angular.module("app",[]);

app.controller("generator",function($scope, $timeout){
	
	$scope.data = [];
	$scope.inputString = '';
	$scope.output = '';
	$scope.open_output = false;
	$scope.showCopied = false;
	$scope.stopPropagation = function(e){e.stopPropagation();}
	
	
	$scope.remField = function(index){
		console.log(index);
		$scope.data.splice(index,1);
	}
	
	//COPY VALUE OF INPUT FIELD BY CLICK ON COPY BUTTON
	$scope.copyValue = function(id)
	{
		var copyTextarea = document.getElementById(id);
		if(copyTextarea.value == ''){
			console.log("URL box is blank","warning");
			return;
		}
		copyTextarea.select();
		try	{
			var successful = document.execCommand('copy');
			if(successful == true){
				$scope.showCopied = true;
				$timeout(function(){
					$scope.showCopied = false;
				}, 2000);
			} else if(successful == false) {
				console.log("Failed","error");
			}
		} catch (err)	{
			console.log('Oops, unable to copy','error');
		}
	}
	
	$scope.preview = function(){
		var data = "<!DOCTYPE html>\n<html>\n<body>\n\n"+$scope.output +"\n\n</body>\n</html>";
		var myWindow = window.open('_blank');
		myWindow.document.write(data);
		myWindow.focus();
		myWindow.document.close();
	}
	


	$scope.parseTable = function(){
		var inputString = $scope.inputString,
			row = '';
		row = inputString.split("\n");
		row.forEach(function(key, index){
			row[index] = key.split("\t");
			row[index].forEach(function(keyY, indexY){
				row[index][indexY] = {item : keyY};
			});
		});
		$scope.data = row;
	}

	

	$scope.generateJson = function(e){
		console.log("$scope.data")
		console.log($scope.data)
		var userHash = findMissingPersons(createHash($scope.data));
		$scope.output  = JSON.stringify(userHash);		
		$scope.open_output = true;
	}

	function createHash(users) {
		var userHash = {};
		users.forEach(function (userRow) {
			if (!userHash[userRow[0].item]) {
				userHash[userRow[0].item] = {
					presents: [],
					absents: [],
				}
			}
			userHash[userRow[0].item].presents.push(userRow[1].item);
		});
		return userHash;
	}



	function feedPersonsAutoFill(){
		$scope.personString = app.persons.join("\n");
	}
	feedPersonsAutoFill();

	$scope.parsePersonsTable = function (){
		app.persons = $scope.personString.split("\n");
		console.log("app.persons");
		console.log(app.persons);
	}


	function findMissingPersons(userHash) {
		var tempPresents;
		var tempFoundFlag;
		for (company in userHash) {
			for (var i = 0; i < app.persons.length; i++) {
				tempFoundFlag = false;
				tempPresents = JSON.parse(JSON.stringify(userHash[company]["presents"]));
				for (var j = 0; j < tempPresents.length; j++) {
					if (app.persons[i] == tempPresents[j]) {
						tempFoundFlag = true;
						j--;
						tempPresents.splice(j, 1);
						break;
					}
				}
				if(tempFoundFlag == false) {
					userHash[company]["absents"].push(app.persons[i]);
				}
			}
		}
	
		return userHash;
	}

	
});