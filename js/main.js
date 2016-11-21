angular.module('github_app.main', [])

.controller('MainCtrl', function($scope, $state, $timeout, data, api, helpers, methods) {

	$scope.func = {
		loadData: function() {
			if (!$scope.username || !$scope.repo_name) {
				data.log('data is not valid');
				return false;
			}
			data.repo_name = $scope.repo_name;
			data.username = $scope.username;
			show_loader(true);
			data.per_page = $scope.per_page;
			data.current_page = $scope.current_page;
			data.log('current page ', $scope.current_page);
			methods.load_issues($scope.username + '/' + $scope.repo_name, $scope.current_page, function(response, error) {
				if (error) { // если пришла ошибка
					got_error(response);
					$scope.response = response;
					return false;
				}
				show_loader(false);
				$scope.response = response;
				data.issues = $scope.response;
				data.log('response ', $scope.response)
				data.log('pages in response: ', data.pages);
				$scope.pages = data.pages;
			});
		},
		loadUserRepos: function() {
			show_loader(true);
			data.log('loading user repos')
			methods.load_user_repos($scope.username, function(response, error) {
				if (error) {
					got_error(response)
					return false;
				}
				show_loader(false);
				$scope.user_repos = response.data;
				//$scope.$apply();
				data.log('loaded user repos ', $scope.user_repos);
			})
		}
	}

	var got_error = function(response) {
		show_loader(false);
		data.error(response);
	}

	$scope.nav = {
		next: function() {
			if ($scope.current_page != $scope.pages) {
				$scope.current_page+=1;
				$scope.func.loadData();
			}
		},
		back: function() {
			if ($scope.current_page != 1) {
				$scope.current_page-=1;
				$scope.func.loadData();
			}
		},
		change: function(page) {
			$scope.current_page = page;
			$scope.func.loadData();
		}
	}

	function init() {
		$scope.username = data.username;
		$scope.repo_name = data.repo_name;
		//$scope.repo_name = "django-registration";
		$scope.per_page = data.per_page;
		$scope.current_page = data.current_page;
		$scope.pages = data.pages;
		$scope.loading = false;
		$scope.response = data.issues;
		// $scope.user_repos = [{name: 'kek'},{name: 'kek2'}];
		if ($scope.response) $timeout(function() {
			$scope.$apply();
		}, 0);
	}

	$scope.changePerPage = function() {
		data.pages = null;
		$scope.current_page = 1;
		$scope.func.loadData();
	}

	$scope.openIssue = function(issue) {
		data.selected_issue = issue;
		$state.go('issue')
	}

	var show_loader = function(status) {
		$scope.loading = status;
	}

	$scope.parseDate = helpers.parseDate;
	$scope.range = helpers.range;

	init()

})