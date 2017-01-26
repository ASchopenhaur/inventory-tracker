class AddDetailsToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :quantity, :integer
    add_column :products, :notes, :text
  end
end
