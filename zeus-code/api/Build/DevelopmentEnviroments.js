var rs = require('http/v3/rs');
var uuid = require('utils/v3/uuid');
var dao = require('zeus-code/data/dao/Build/Code');
var Manager = require('zeus-deployer/utils/Manager');
var Credentials = require('zeus-deployer/utils/Credentials');

rs.service()
	.resource('')
		.get(function(ctx, request, response) {
            var entities = dao.list();
            response.println(JSON.stringify(entities));
		})
	.resource('')
		.post(function(ctx, request, response) {
			var credentials = Credentials.getDefaultCredentials();

			var name = generateName();
			var deployment = getDeployment(name);
//			var statefulSet = getStatefulSet(name);
			var service = getService(name);
			var ingress = getIngress(name);

			Manager.createDeployment(credentials, deployment);
//			Manager.createStatefulSet(credentials, statefulSet);
			Manager.createService(credentials, service);
			Manager.createIngress(credentials, ingress);

			var entity = {};
			entity.Id = dao.create({
				'Name': name,
				'URL': 'http://' + ingress.host
			});
            response.println(JSON.stringify(entity));
		})
	.resource('{id}')
		.delete(function(ctx, request, response) {
			var id = ctx.pathParameters.id;
			var entity = dao.get(id);
			if (entity) {
				var credentials = Credentials.getDefaultCredentials();
				Manager.deleteDeployment(credentials, entity.Name);
//				Manager.deleteStatefulSet(credentials, entity.Name);
				Manager.deleteService(credentials, entity.Name + '-http');
				Manager.deleteIngress(credentials, entity.Name);

				dao.delete(id);
				response.println('');
			} else {
				response.println('Development Environment not found');
			}
		})
.execute();

function generateName() {
	return 'ide-' + uuid.random().substring(0, 13);
}

function getDeployment(name) {
	return {
        'name': name,
        'namespace': 'zeus',
        'application': name,
        'replicas': 1,
        'containers': [{
            'name': 'dirigible',
            'image': 'dirigiblelabs/dirigible-tomcat:latest',
            'port': 8080,
            'env': [{
            	'name': 'DIRIGIBLE_THEME_DEFAULT',
            	'value': 'fiori'
            }]
        }]
    };
}

//function getStatefulSet(name) {
//	return {
//        'name': name,
//        'namespace': 'zeus',
//        'application': name,
//        'replicas': 1,
//        'storage': '1Gi',
//        'serviceName': name + '-http',
//        'containers': [{
//            'name': 'dirigible',
//            'image': 'dirigiblelabs/dirigible-tomcat:latest',
//            'port': 8080,
//            'mountPath': '/usr/local/tomcat/dirigible',
//            'env': []
//        }]
//    };
//}

function getService(name) {
	return {
        'name': name + '-http',
        'namespace': 'zeus',
        'application': name,
        'type': 'NodePort',
        'port': 8080
    };
}

function getIngress(name) {
	return {
        'name': name,
        'namespace': 'zeus',
        'application': name,
        'host': name + '.ingress.pro.promart.shoot.canary.k8s-hana.ondemand.com',
        'serviceName': name + '-http',
        'servicePort': 8080
    };
}