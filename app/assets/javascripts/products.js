//=require angular
//=require angular-resource

"use strict";

(function(){
  angular
    .module("inventory", ["ngResource"])
    .controller("inventory_controller", ["$resource",InventoryController]);

    function InventoryController($resource){
      var vm = this;
      var Product = $resource("/products/:id.json", {id: '@id'}, {
        update: {method: "PUT"},
        delete: {method: "DELETE"}
      });

      // vm.data = Product.query();
      Product.query().$promise.then(function(result){
        result.forEach(function(p){
          p.cost = parseFloat(p.cost).toFixed(2);
          p.edit = false;  // add extra(non-db) property for editing all db-property values including name, url's, country, cost
          p.old_quantity = p.quantity; // these two extra(non-db) mirror properties used only for changing quantity or notes values
          p.old_notes = p.notes;
        });
        if (!vm.sort_on) { vm.sort_data_by('id') } //default sort
        vm.data = result;
        // Defining total_value here to avoid console error message due to asynchronous query call
        vm.total_value = function(){
          if (!vm.editing){
            var total = 0;
            vm.data.forEach(function(product){
              if (product.quantity){
                total += product.quantity * product.cost;
              }
            });
            return total.toFixed(2);
          }
        }
      });

      vm.sort_data_by = function(name){
        vm.sort_on = name;
      }
      // Deleting a product
      vm.destroy = function(product_id){
        var product_index = vm.data.findIndex(function(p){  //Note that array index value is different from product id value
          return p.id === product_id;
        });
        var product = new Product({id: product_id}); // Product is an angular $resource object
        product.$delete(function(response){
          if (response.success === true){
            vm.data.splice(product_index, 1);
          }
        });
      }

      // vm.new_product used to temporarily hold product data while editing or creating a new product
      vm.new_product = {};
      vm.currently_editing = {};
      vm.editing = false;

      // function to enter editing mode; edit mode hides "new product" row at bottom and delete buttons on right
      vm.edit = function(product){
        if (!vm.editing){ // if not already editing another product
          product.edit_mode = true;
          vm.editing = true;
          vm.new_product = angular.copy(product);
          vm.new_product.cost = parseFloat(vm.new_product.cost);// convert from string to float; fixedTo(2) converted value to string
        }
      }

      // cancels edit
      vm.edit_cancel = function(product){
        if (vm.editing) {
          product.edit_mode = false;
          vm.editing = false;
          vm.new_product = {};
        }
      }

      // creates new product
      vm.create = function(){
        var newProduct = new Product(vm.new_product);
        newProduct.$save(vm.newProduct, function(product){
          product.edit = false;
          product.old_quantity = product.quantity;
          product.old_notes = product.notes;
          product.cost = parseFloat(product.cost).toFixed(2);
          vm.data.push(angular.copy(product));
        });
        vm.new_product = {};
      }

      // this function triggered on blurring quantity or notes textbox; calls update function
      vm.single_field_update = function(product){
        var change = false; // blurring sometimes triggered without db needed to be changed
        if (product.quantity !== product.old_quantity ) {
          product.old_quantity = product.quantity;
          change = true;
        }
        if (product.notes !== product.old_notes) {
          product.old_notes = product.notes;
          change = true;
        }
        if (change) { vm.update(product); }
      }

      vm.all_fields_update = function(product){
        vm.update(vm.new_product);
        Object.assign(product, vm.new_product);
        product.old_quantity = product.quantity;// update old values to preserve single field update functionality
        product.old_notes = product.notes;
        product.cost = parseFloat(product.cost).toFixed(2);
        vm.edit_cancel(product);
      }

      // updates a product
      vm.update = function(product){
        Product.update({id: product.id}, product, function(response){
          console.log("Product updated!");
        });
      }

    }
})();
