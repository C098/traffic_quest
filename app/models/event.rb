class Event < ApplicationRecord
  belongs_to :user
  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?

  def event_selection
    case category
    when "accident"
      return "accident.png"
    when "car on fire"
      return "fire.png"
    when "flood"
      return "flood.png"
    when "road closed"
      return "closed.png"
    when "road works"
      return "roadwork.png"
    when "slippery road"
      return "slippery.png"
    when "traffic jam"
      return "jam.png"
    else
      return "pin.png"
    end
  end
end
