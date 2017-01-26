class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :image_url
      t.decimal :cost
      t.string :name
      t.string :url
      t.string :country

      t.timestamps
    end
  end
end
