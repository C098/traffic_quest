# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'
require "open-uri"
require "nokogiri"

# url = 'https://en.wikipedia.org/wiki/List_of_places_in_Mauritius'

# html_file = URI.open(url).read
# html_doc = Nokogiri::HTML(html_file)

# ar = []
# html_doc.search(".new").first(10).each do |element|
#   # puts element.text.strip
#   ar << element.text.strip
# end

puts 'cleaning db'

User.destroy_all
Event.destroy_all

puts 'Creating users...'

arcat = ['traffic jam', 'road closed', 'car on fire', 'flood', 'accident', 'road works', 'slippery road', 'flood']
arrdress = ['Port-Louis, Mauritius', 'Grand Baie, Mauritius', 'Centre de Flacq, Flacq, Mauritius',
            'Curepipe, Plaines Wilhems, Mauritius', 'Vacoas-Phoenix, Plaines Wilhems, Mauritius', 'Grand Bois,
            Savanne, Mauritius', 'Chamarel, Rivière Noire, Mauritius', 'Les Salines, Rivière Noire, Mauritius',
            'Grand Gaube, Rivière du Rempart, Mauritius', 'Mahébourg, Grand Port, Mauritius',
            'Grand Sable, Grand Port, Mauritius', 'Quartier Militaire, Moka, Mauritius', 'Camp Thorel, Moka, Mauritius']

5.times do
  user1 = User.create(
    email: Faker::Internet.email,
    password: '123456'
  )
end

arrdress.each do |ad|
  Event.create(category: arcat.sample, address: ad, user: User.all.sample)
end

puts 'creating events'

puts 'finished'
