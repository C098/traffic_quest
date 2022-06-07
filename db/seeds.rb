# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
puts 'cleaning db'
User.destroy_all
Event.destroy_all

puts 'Creating users...'

user1 = User.create(email: 'sam@gmail.com', password: "1234567")

puts 'creating events'

Event.create!(user: user1, address: "Port-Louis, Mauritius", category: 'crash')
Event.create!(user: user1, address: "Grand Baie, Mauritius", category: 'crash')

puts 'finished'
