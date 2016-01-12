'use strict';

var _ = require('lodash');

function BaseRepoFactory($http, $log) {
	var BaseRepo = function(urlPrefix, Model) {
		this.urlPrefix = urlPrefix;
		this.Model = Model;
	};

	BaseRepo.prototype.find = function(options) {
		var that = this,
			url = 'api/' + that.urlPrefix;

		if (options) {
			var keys = _.keys(options);
			var q = _.map(keys, function(key) {
				return key + '=' + encodeURIComponent(options[key]);
			}).join('&');
			url = url + '?' + q;
		}

		return $http.get(url)
			.then(function(response) {
				$log.debug(that.urlPrefix + '.find=' + response.status, response.data);
				var items = _.map(response.data.items, function(i) {
					return (that.Model ? new that.Model(i) : i);
				});
				return {
					count: response.data.count,
					items: items
				};
			}).catch(function(response) {
				$log.error(that.urlPrefix + '.find=' + response.status, response.data);
				throw response;
			});
	};

	BaseRepo.prototype.findOne = function(id) {
		var that = this,
			url = 'api/' + that.urlPrefix + '/' + id;
		return $http.get(url)
			.then(function(response) {
				$log.debug(that.urlPrefix + '.findOne=' + response.status, response.data);
				return (that.Model ? new that.Model(response.data) : response.data);
			}).catch(function(response) {
				$log.error(that.urlPrefix + '.findOne=' + response.status, response.data);
				throw response;
			});
	};

	BaseRepo.prototype.create = function(entity) {
		var that = this,
			url = 'api/' + that.urlPrefix;
		return $http.post(url, entity)
			.then(function(response) {
				$log.debug(that.urlPrefix + '.create=' + response.status, response.data);
				return (that.Model ? new that.Model(response.data) : response.data);
			}).catch(function(response) {
				$log.error(that.urlPrefix + '.create=' + response.status, response.data);
				throw response;
			});
	};

	BaseRepo.prototype.update = function(id, entity) {
		var that = this,
			url = 'api/' + that.urlPrefix + '/' + id;
		return $http.put(url, entity)
			.then(function(response) {
				$log.debug(that.urlPrefix + '.update=' + response.status, response.data);
				return (that.Model ? new that.Model(response.data) : response.data);
			}).catch(function(response) {
				$log.error(that.urlPrefix + '.update=' + response.status, response.data);
				return response;
			});
	};

	BaseRepo.prototype.remove = function(id) {
		var that = this,
			url = 'api/' + that.urlPrefix + '/' + id;
		return $http.delete(url)
			.then(function(response) {
				$log.debug(that.urlPrefix + '.remove=' + response.status, response.data);
				return response.data;
			}).catch(function(response) {
				$log.error(that.urlPrefix + '.remove=' + response.status, response.data);
				throw response;
			});
	};

	return BaseRepo;
}

module.exports = BaseRepoFactory;
