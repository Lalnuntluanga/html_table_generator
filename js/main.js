window.app = window.app || angular.module("app", []);

app.controller("generator", function ($scope, $timeout) {

	$scope.data = [];
	$scope.inputString = '';
	$scope.output = '';
	$scope.open_output = false;
	$scope.showCopied = false;
	$scope.stopPropagation = function (e) { e.stopPropagation(); }


	$scope.remField = function (index) {
		console.log(index);
		$scope.data.splice(index, 1);
	}

	//COPY VALUE OF INPUT FIELD BY CLICK ON COPY BUTTON
	$scope.copyValue = function (id) {
		var copyTextarea = document.getElementById(id);
		if (copyTextarea.value == '') {
			console.log("URL box is blank", "warning");
			return;
		}
		copyTextarea.select();
		try {
			var successful = document.execCommand('copy');
			if (successful == true) {
				$scope.showCopied = true;
				$timeout(function () {
					$scope.showCopied = false;
				}, 2000);
			} else if (successful == false) {
				console.log("Failed", "error");
			}
		} catch (err) {
			console.log('Oops, unable to copy', 'error');
		}
	}



	$scope.preview = function () {
		var data = $scope.output;
		var myWindow = window.open('_blank');
		myWindow.document.write(data);
		myWindow.focus();
		myWindow.document.close();
	}


	function feedPersonsAutoFill() {
		$scope.personString = app.persons.join("\n");
	}
	feedPersonsAutoFill();

	$scope.parsePersonsTable = function () {
		app.persons = $scope.personString.split("\n");
		console.log("app.persons");
		console.log(app.persons);
	}


	$scope.parseUsersTable = function () {
		var inputString = $scope.inputString,
			row = '';
		row = inputString.split("\n");
		row.forEach(function (key, index) {
			row[index] = key.split("\t");
			row[index].forEach(function (keyY, indexY) {
				row[index][indexY] = { item: keyY };
			});
		});
		$scope.data = row;
	}



	$scope.generateJson = function (e) {
		var userHash = findMissingPersons(createHash($scope.data));
		$scope.output = JSON.stringify(userHash);
		$scope.open_output = true;
	}






	/*
		CREATE HASH OF ARRAY OF COMPANIES IN TO ONE HASH
		EG.
		From
			[
				'amp' : 'plutorasupport1@plutora.com',
				'amp' : 'plutorasupport2@plutora.com',
				'amp' : 'plutorasupport3@plutora.com',
			]
	
		Into 
		{
			amp : {
				presents : [
					'plutorasupport1@plutora.com',
					'plutorasupport2@plutora.com',
					'plutorasupport3@plutora.com'
				],
				absents : []
			}
		}
			
	*/
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


	/*
		Fill the missing support personels.
		eg.
		From 
		{
			amp : {
				presents : [
					'plutorasupport1@plutora.com',
					'plutorasupport2@plutora.com',
					'plutorasupport3@plutora.com'
				],
				absents : []
			}
		}
	
		to 
		{
			amp : {
				presents : [
					'plutorasupport1@plutora.com',
					'plutorasupport2@plutora.com',
					'plutorasupport3@plutora.com'
				],
				absents : [
					'plutorasupport4@plutora.com',
					'plutorasupport5@plutora.com',
					'plutorasupport6@plutora.com'
					'plutorasupport7@plutora.com'
					'plutorasupport8@plutora.com'
				]
			}
		}
	
	*/
	function findMissingPersons(userHash) {
		//LOOP THROUGH ALL COMPANIES
		for (company in userHash) {
			//LOOP THROUGH ALL EXPECTED PERSONS
			for (var i = 0; i < app.persons.length; i++) {
				//IF PERSON[I] ABSENTS IN THE PERSENTS LIST, PUSH IT INTO ABSENTEES ARRAY.
				if (userHash[company]["presents"].indexOf(app.persons[i]) == -1) {
					userHash[company]["absents"].push(app.persons[i]);
				}
			}
		}

		return userHash;
	}


});