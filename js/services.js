angular.module('github_app.services', [])

.factory('api', function() {
	return {
		url: 'https://api.github.com/'
	}
})

.factory('methods', function(api, data, helpers, $http) {
	return {
		load_issues: function(repo_name, page, callback) {
			var url = data.per_page ? api.url + 'repos/' + repo_name + '/issues?page=' + page + '&per_page=' + data.per_page : api.url + 'repos/' + repo_name + '/issues';
			$http({
				method: 'GET',
				url: url
			}).then(function successCallback(response) {
				var links = response.headers('Link');
				if (data.per_page && response.data.length != 0 && links) helpers.parse_link_header(links)
				callback (response);
				return response;
			}, function errorCallback(response) {
				callback (response, true);
			})
		},

		load_user_repos: function(username, callback) {
			$http({
				method: 'GET',
				url: api.url + 'users/' + username + '/repos'
			}).then(function successCallback(response) {
				callback (response);
				return response;
			}, function errorCallback(response) {
				callback (response, true);
			})
		}
	}
})

.factory('helpers', function(api, data) {
	return {
		parse_link_header: function(string) { // получаем ссылки на страницы из загаловка 'link', сейчас не пригодилось
			var str = string.split(',');
			var data_ = {};
			for (var i=0; i<str.length; i++) {
				var type = str[i].split(';')[1].trim();
				var link = str[i].split(';')[0].substring(1, str[i].split(';')[0].length - 1);
				type = type.substring(type.indexOf('"') + 1, type.length - 1)
				data_[type] = link;
			}
			if (!data.pages) {
				data.pages = data_.last.split('?')[1].split('&')[0].split("=")[1];
			}
			return data_;
		},
		range: function(n) {
			if (!n) return false;
    		return new Array(parseInt(n));
		},
		parseDate: function(dt) {
			dt = new Date(dt)
			return dt.getDate() + '.' + (dt.getMonth() + 1) + '.' + dt.getFullYear()
		}
	}
})

.factory('data', function() {
	return {
		logger: false,
		issues: null,
		selected_issue: null,
		per_page: '5',
		pages: null,
		current_page: 1,
		username: 'macropin',
		repo_name: null,
		log: function(msg, obj) {
			if (!this.logger) return false;
			obj ? console.info('Log: ', msg, obj) : console.info('Log: ', msg);
		},
		error: function(obj) {
			if (!this.logger) return false;
			console.error(obj);
		}
	}
})

.directive('ngBlurDelay',['$timeout',function($timeout){
	return {
	    scope:{
	        ngBlurDelay:'&'
	    },
	    link:function(scope, element, attr){
	    element.bind('blur',function(){
	       $timeout(scope.ngBlurDelay,200);
	    });
	    }
	};
}])
