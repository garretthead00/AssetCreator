angular.module('assetServices', [])

.factory('Asset', function($http){

    var assetFactory = {};

	assetFactory.getAssets = function () {
		console.log('/assets/getAssets()');
        return $http.get('/assets/getAssets');
    };

    assetFactory.getAssetWith = function (id) {
        return $http.get('/assets/getAssetWith/' + id);
    };

    assetFactory.createAsset = function (data) {
        return $http.post('/assets/newAsset', data);
    };

    assetFactory.removeAssetWith = function (id) {
        return $http.delete('/assets/removeAssetWith/' + id);
    };

    assetFactory.updateAssetWith = function (data) {
        return $http.put('/assets/updateAssetWith');
    };
	assetFactory.getPiTags = function () {
		return $http.get('/assets/piTags');
	};

    return assetFactory;
    });