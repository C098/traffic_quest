Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  resources :events, only: %i[create new update edit show index destroy]
end
