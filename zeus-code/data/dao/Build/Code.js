var query = require('db/v3/query');
var daoApi = require('db/v3/dao');
var dao = daoApi.create({
	'table': 'ZEUS_CODE',
	'properties': [
		{
			'name': 'Id',
			'column': 'CODE_ID',
			'type': 'INTEGER',
			'id': true,
			'required': true
		}, {
			'name': 'Name',
			'column': 'CODE_NAME',
			'type': 'VARCHAR',
			'required': true
		}, {
			'name': 'URL',
			'column': 'CODE_URL',
			'type': 'VARCHAR',
			'required': true
		}]
});
exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	return dao.insert(entity);
};

exports.update = function(entity) {
	return dao.update(entity);
};

exports.delete = function(id) {
	dao.remove(id);
};

exports.count = function() {
	return dao.count();
};