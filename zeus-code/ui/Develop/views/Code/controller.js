angular.module('page', ['ngAnimate', 'ui.bootstrap']);
angular.module('page')
.controller('PageController', function ($scope, $http) {

	var api = '/services/v3/js/zeus-code/api/Build/DevelopmentEnviroments.js';

	$scope.loadDevelopmentEnvironments = function() {
		$http.get(api)
		.success(function(data) {
			$scope.developmentEnvironments = data;
		});
	};
	$scope.loadDevelopmentEnvironments();

	$scope.createDevelopmentEnvironment = function() {
		$http.post(api, JSON.stringify({}))
		.success($scope.loadDevelopmentEnvironments);
	};

	$scope.deleteDevelopmentEnvironment = function() {
		$http.delete(api + '/' + $scope.developmentEnvironmentId)
		.success(function(data) {
			$scope.loadDevelopmentEnvironments();
			toggleModal();
		});
	};

	$scope.openDeleteDialog = function() {
		toggleModal();
	};

	function toggleModal() {
		$('#deleteDevelopmentEnvironmentModal').modal('toggle');
	}
});
