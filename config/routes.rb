Rails.application.routes.draw do
  root to: 'products#index'
  resources :products
  get 'sample', to: 'products#sample'
end
