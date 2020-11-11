var cartApp = angular.module('cartApp', []);

cartApp.controller("cartCtrl", function($scope, $http) {
	
	$scope.initCartId = function(cartId) {
		$scope.cartId = cartId;
		$scope.refreshCart();
	};
	
	$scope.refreshCart = function() {
		$http.get('/eStore/api/cart/' + $scope.cartId).then (
			function successCallback(response) {
				$scope.cart = response.data;
			});
	};
	
	$scope.clearCart = function() {
		
		$scope.setCsrfToken();
		
		$http({
			method : 'DELETE',
			url : '/eStore/api/cart/' + $scope.cartId
		}).then(function successCallback() {
			$scope.refrechCart();
		}, function errorCallback(response) {
			console.log(response.data);
		});
	};
	
	$scope.addToCart = function(productId) {
		
		$scope.setCsrfToken();
		
		$http.put('/eStore/api/cart/add/' + productId).then(
				function successCallback() {
					alert("Product successfully added to the cart!");
				}, function errorCallback() {
					alert("Adding to the cart failed!")
				});
	};
	
	$scope.removeFromCart = function(productId) {
		
		$scope.setCsrfToken();
		$http({
			method : 'DELETE',
			url : '/eStore/api/cart/cartitem/' + productId
		}).then(function successCallback() {
			$scope.refreshCart(); 
		}, function errorCallback(response) {
			console.olg(response.data);
		});
	};
	
	$scope.calGrandTotal = function() {
		var grandTotal = 0;
		
		for(var i = 0; i < $scope.cart.cartItems.length; i++) {
			grandTotal += $scope.cart.cartItems[i].totalPrice;
		}
		
		return grandTotal;
	};
	
	$scope.addQuantityToCart = function(productId) {
		
		$scope.setCsrfToken();
		
		$http.put('/eStore/api/cart/addQuantity/' + productId).then(
				function successCallback() {
					alert("Product successfully added to the cart!");
					$scope.refreshCart();
				}, function errorCallback() {
					alert("sold out!")
				});
	};
	
	$scope.subQuantityFromCart = function(productId) {
		
		$scope.setCsrfToken();
		$http.put('/eStore/api/cart/subQuantity/'+productId).then( 
				function successCallback(){ 
					$scope.refreshCart(); 
				},
				function errorCallback(response){ 
					alert("The cart must contain zero or more products."); 
					$scope.refreshCart(); 
				});
	};
	$scope.setCsrfToken = function() {
		var csrfToken = $("meta[name='_csrf']").attr("content");
		var csrfHeader = $("meta[name='_csrf_header']").attr("content");
		
		$http.defaults.headers.common[csrfHeader] = csrfToken;
	}
	
});
