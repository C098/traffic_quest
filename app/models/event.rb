class Event < ApplicationRecord
  belongs_to :user
  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?

  def event_selection
    case category
    when "Accident"
      return "accident.png"
    when "Car on Fire"
      return "fire.png"
    when "Flood"
      return "flood.png"
    when "Road Closed"
      return "closed.png"
    when "Road Works"
      return "roadwork.png"
    when "Slippery Road"
      return "slippery.png"
    when "Traffic Jam"
      return "jam.png"
    else
      return "pin.png"
    end
  end
end
