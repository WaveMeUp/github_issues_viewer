angular.module('github_app.issue', [])

.controller('IssueCtrl', function($scope, $state, api, data, methods, helpers) {
	if (data.selected_issue) {
		$scope.issue = data.selected_issue;
		data.log('selected issue: ', $scope.issue)
	} else {
		$state.go('list');
	}

	$scope.parseDate = helpers.parseDate;
	$scope.goBack = function() {
		$state.go('list', {}, {reload: true});
	}
})