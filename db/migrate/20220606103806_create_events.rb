class CreateEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :events do |t|
      t.string :address
      t.floats :longitude
      t.floats :latitude
      t.string :category
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
