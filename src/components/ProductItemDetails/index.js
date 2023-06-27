// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, option)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data)
      const updatedSimilarProductData = data.similar_products.map(each =>
        this.getFormattedData(each),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prev => ({quantity: prev.quantity - 1}))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prev => ({quantity: prev.quantity + 1}))
  }

  renderProductDetailsView = () => {
    const {productData, quantity, similarProductsData} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    return (
      <div>
        <div>
          <img src={imageUrl} alt="product" />
          <div>
            <h1>{title}</h1>
            <p>RS {price}</p>
            <div>
              <div>
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p>{totalReviews}</p>
            </div>
            <p>{description}</p>
            <div>
              <p>Available:</p>
              <p>{availability}</p>
            </div>
            <div>
              <p>Brand</p>
              <p>{brand}</p>
            </div>
            <hr />
            <div>
              <button
                type="button"
                onClick={this.onDecrementQuantity}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p>{quantity}</p>
              <button
                type="button"
                onClick={this.onIncrementQuantity}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button">ADD TO CART</button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <ul>
          {similarProductsData.map(each => (
            <SimilarProductItem productDetails={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderProductDetails()}</div>
      </>
    )
  }
}

export default ProductItemDetails
