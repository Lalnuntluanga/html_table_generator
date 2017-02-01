var app = angular.module("app",[]);

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
	
	
	//GENERATE TEXT STRING REPRESENTING HTML TAGS
	$scope.generate = function(e){
		var cell_color,
			headData = $scope.data[0],
			bodyData = $scope.data.slice(),
			headCells = '',
			bodyCells = '';
			
		bodyData.splice(0,1);
		
		headData.forEach(function(key){
			headCells += "\n\t\t\t<td style='padding:3px 10px; border:1px solid #444'>"+key.item+"</td>";
		});
			
		$scope.output = "<table cellpadding='0' cellspacing='0' style='margin:0px auto; min-width:700px; font-family:arial; border-collapse:collapse'>\n\t<thead>"+
			"\n\t\t<tr style='background-color:#FF6600'>"+headCells+
			"\n\t\t</tr>"+
			"\n\t</thead>\n\t<tbody>";
		
		bodyData.forEach(function(key,index){
			
			if(index % 2 == 0)
				cell_color = "#FDE9D9";
			else
				cell_color = "#FCD5B4";
			
			bodyCells = ''
			key.forEach(function(cells){
				bodyCells += "\n\t\t\t<td style='padding:5px 10px; border:1px solid #444'>"+cells.item+"</td>";
			});
			
			//console.log(bodyCells);
			
			$scope.output += "\n\t\t<tr style='background-color:"+cell_color+"'>"+bodyCells+"\n\t\t</tr>";
		});
		
		
		
		$scope.output += "\n\t</tbody>\n</table>";		
		$scope.open_output = true;
	}
	
	
});