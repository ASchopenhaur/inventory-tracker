class ProductsController < ApplicationController

  def index
    respond_to do |format|
      format.html
      format.json{ render json: Product.all }
    end
  end

  def destroy
    Product.destroy(params[:id])
    # puts "id passed : #{params[:id]}"
    render json: {success: true}
  end

  def create
    product = Product.create(product_params)
    render json: product
  end

  def update
    product = Product.find(params[:id])
    product.update!(product_params)
    render json: product, status: :ok
  end

  def sample
    product = Product.find(25)
    respond_to do |format|
      format.html{ render html: "<h1>Success: true</h1>".html_safe }
      format.json{ render json: {success: true} }
    end
  end

  private

    def product_params
      params.require(:product).permit(:name, :image_url, :cost, :country, :quantity, :notes)
    end

end
