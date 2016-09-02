'use strict';

const _ = require('lodash');

function RepoFactory($http, $log) {
	const BaseRepo = (urlPrefix, Model, isPostSearch) => {
		this.urlPrefix = urlPrefix;
		this.Model = Model;
		this.isPostSearch = isPostSearch;
	};

	BaseRepo.prototype.find = (options) => {
		let url = `api/${this.urlPrefix}`;
		if (options && !this.isPostSearch) {
			const keys = _.keys(options);
			const q = _.map(keys, (key) => {
				return `${key}=${encodeURIComponent(options[key])}`;
			}).join('&');
			url = `${url}?${q}`;
		}

		const request = (this.isPostSearch) ? $http.post(`${url}/search`, options) : $http.get(url);
		return request
			.then((response) => {
				$log.debug(`${this.urlPrefix}.find=${response.status}`, response.data);
				const items = _.map(response.data.items, (i) => {
					return (this.Model ? new this.Model(i) : i);
				});
				return {
					count: response.data.count,
					items: items,
				};
			}).catch((response) => {
				$log.error(`${this.urlPrefix}.find=${response.status}`, response.data);
				throw response;
			});
	};

	BaseRepo.prototype.findOne = (id) => {
		const url = `api/${this.urlPrefix}/${id}`;
		return $http.get(url)
			.then((response) => {
				$log.debug(`${this.urlPrefix}.findOne=${response.status}`, response.data);
				return (this.Model ? new this.Model(response.data) : response.data);
			}).catch((response) => {
				$log.error(`${this.urlPrefix}.findOne=${response.status}`, response.data);
				throw response;
			});
	};

	BaseRepo.prototype.create = (entity) => {
		const url = `api/${this.urlPrefix}`;
		return $http.post(url, entity)
			.then((response) => {
				$log.debug(`${this.urlPrefix}.create=${response.status}`, response.data);
				return (this.Model ? new this.Model(response.data) : response.data);
			}).catch((response) => {
				$log.error(`${this.urlPrefix}.create=${response.status}`, response.data);
				throw response;
			});
	};

	BaseRepo.prototype.update = (id, entity) => {
		const url = `api/${this.urlPrefix}/${id}`;
		return $http.put(url, entity)
			.then((response) => {
				$log.debug(`${this.urlPrefix}.update=${response.status}`, response.data);
				return (this.Model ? new this.Model(response.data) : response.data);
			}).catch((response) => {
				$log.error(`${this.urlPrefix}.update=${response.status}`, response.data);
				return response;
			});
	};

	BaseRepo.prototype.remove = (id) => {
		const url = `api/${this.urlPrefix}/${id}`;
		return $http.delete(url)
			.then((response) => {
				$log.debug(`${this.urlPrefix}.remove=${response.status}`, response.data);
				return response.data;
			}).catch((response) => {
				$log.error(`${this.urlPrefix}.remove=${response.status}`, response.data);
				throw response;
			});
	};

	return BaseRepo;
}

module.exports = RepoFactory;
