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

url = 'https://en.wikipedia.org/wiki/List_of_places_in_Mauritius'

html_file = URI.open(url).read
html_doc = Nokogiri::HTML(html_file)

ar = []
html_doc.search(".new").first(10).each do |element|
  # puts element.text.strip
  ar << element.text.strip
end

puts 'cleaning db'

User.destroy_all
Event.destroy_all

puts 'Creating users...'

arcat = ['crash', 'traffic jam', 'road closed', 'police check', 'speed gun', 'booze truck']
5.times do
  user1 = User.create(
    email: Faker::Internet.email,
    password: '123456'
  )
  event1 = Event.create(
    category: arcat.sample,
    address: "#{ar.sample}, Mauritius",
    user_id: user1.id
  )
end

puts 'creating events'

puts 'finished'
