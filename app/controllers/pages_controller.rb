class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home]

  def home
    @events = Event.all

    # the `geocoded` scope filters only flats with coordinates (latitude & longitude)
    @markers = @events.geocoded.map do |event|
      {
        lat: event.latitude,
        lng: event.longitude,
        info_window: render_to_string(partial: "info_window", locals: { event: event }),
        image_url: helpers.asset_url(event_selection(event))
      }
    end
  end

  def event_selection(event)
    case event.category
    when "fire"
      return "fire.webp"
    when "traffic jam"
      return "jam.webp"
    when "road closed"
      return "closed.jpeg"
    when "police check"
      return "check.png"
    when "speed gun"
      return "speedgun.jpeg"
    when "accident"
      return "crash.png"
    when "road works"
      return "work.png"
    else
      return "pin.jpeg"
    end
  end
end
