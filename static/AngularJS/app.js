	var app = angular.module('myApp', ['ngMaterial', 'chart.js'])
		.controller('MyController', ['$scope', '$http', function ($scope, $http) {
			$scope.years = ["2014","2015","2016","2017","2018"];
			$scope.year = 2017;
			$scope.jsonValues = {};
			$scope.chartLabels = [];
			$scope.chartData = [];
			$scope.chartData2 = [];
			$scope.chartSeries = ["Current Value","Maximum Value"];
			$scope.chartOptions = { scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] } };
			$scope.colors = [{backgroundColor: "rgba(255, 99, 132, 1)" },{backgroundColor: "rgba(54, 162, 235, 1)"}];
			$scope.chartHeight = "250px";
			$scope.chartWidth = "auto";
			$http.get('http://localhost:8000/api?year=2017').
			then(function(response) {
				if (Object.keys(response.data).length !== 0) {
					response.data.Circle1.value = response.data.Circle1.value.replace("%", "");
					response.data.Circle2.avgvalue = parseFloat(response.data.Circle2.value * 100 / response.data.Circle2.maxValue).toFixed();
					$scope.chartLabels = response.data.Categories.map(function (obj) { return obj.Title; });
					$scope.chartLabels = response.data.Categories.map(function (obj) { return obj.Title; });
					$scope.chartData = response.data.Categories.map(function (obj) { return obj.value; });
					$scope.chartData2 = response.data.Categories.map(function (obj) { return obj.maxValue; });
				}
				$scope.jsonValues = response.data;
			}, function myError(response) {
				$scope.jsonValues = {};
			});
			$scope.updateAPI = function(yearPassed = $scope.year) {
				$http.get('http://localhost:8000/api?year=' + yearPassed).
				then(function(response) {
					if (Object.keys(response.data).length !== 0) {
						response.data.year = parseFloat(response.data.year);
						response.data.Circle1.value = response.data.Circle1.value.replace("%", "");
						response.data.Circle2.avgvalue = parseFloat(response.data.Circle2.value * 100 / response.data.Circle2.maxValue).toFixed();						
						$scope.year = response.data.year;
						$scope.chartLabels = response.data.Categories.map(function (obj) { return obj.Title; });
						$scope.chartLabels = response.data.Categories.map(function (obj) { return obj.Title; });
						$scope.chartData = response.data.Categories.map(function (obj) { return obj.value; });
						$scope.chartData2 = response.data.Categories.map(function (obj) { return obj.maxValue; });
					}
					$scope.jsonValues = response.data;
					
				}, function myError(response) {
					$scope.jsonValues = {};
				});
			}
		}

	]);
app.directive('pctComplete', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
		value: '='
		},
		template: ' <div class="c100 p{{value}} big blue">\
					<span>{{value}}%</span>\
					<div class="slice">\
					<div class="bar"></div>\
					<div class="fill"></div>\
					</div>\
					</div>'
	};
});
app.directive('maxComplete', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
		minvalue: '=',
		maxvalue: '=', 
		avgvalue: '='
		},
		template: ' <div class="c100 p{{avgvalue}} big blue">\
					<span>{{minvalue}}/{{maxvalue}}</span>\
					<div class="slice">\
					<div class="bar"></div>\
					<div class="fill"></div>\
					</div>\
					</div>'
	};
});

