// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, brand, imageUrl, rating, price} = productDetails

  return (
    <li className="similar-product-item">
      <img src={imageUrl} className="img" alt={`similar product ${title}`} />
      <p className="title">{title}</p>
      <p className="brand">by {brand}</p>
      <div>
        <p className="price">{price}/</p>
        <p className="rating">{rating}</p>
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
          className="star"
        />
      </div>
    </li>
  )
}

export default SimilarProductItem
