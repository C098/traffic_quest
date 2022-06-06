# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
puts 'cleaning db'
Event.destroy_all
puts 'creating events'

Event.create(address: "Port-Louis, Mauritius", category: 'crash')
Event.create(address: "Grand Baie, Mauritius", category: 'crash')

puts 'finished'
