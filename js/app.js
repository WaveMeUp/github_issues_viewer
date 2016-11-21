angular.module('github_app', ['github_app.main', 'github_app.issue', 'github_app.services', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state("list", {
		url: '/list?:name',
		templateUrl: "templates/main.html",
		controller: 'MainCtrl',
		cache: false
	})
	.state("issue", {
		url: '/issue',
		templateUrl: "templates/issue.html",
		controller: 'IssueCtrl'
	});

	$urlRouterProvider.otherwise('/list')
})