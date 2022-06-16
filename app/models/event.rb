class Event < ApplicationRecord
  belongs_to :user
  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?

  def event_selection
    case category
    when "Accident"
      return "accident.png"
    when "Car on fire"
      return "fire.png"
    when "Flood"
      return "flood.png"
    when "Road closed"
      return "closed.png"
    when "Road works"
      return "roadwork.png"
    when "Slippery road"
      return "slippery.png"
    when "Traffic jam"
      return "jam.png"
    else
      return "pin.png"
    end
  end
end
