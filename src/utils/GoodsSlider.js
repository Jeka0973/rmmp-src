import {API_URL} from '../const'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './slider.css'
import arrowLeft from '../img/arrow_left_bw.png'
import arrowRight from '../img/arrow_right_bw.png'

const GoodsSlider = ({imagesUrls}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  }
  // console.log(imagesUrls)

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {Object.keys(imagesUrls).length ? (
          imagesUrls.map(item => (
            <div>
              <img src={`${API_URL}/${item.url}`} alt="img" />
            </div>
          ))
        ) : (
          <div>
            <h2>Изображение отсутствует</h2>
          </div>
        )}
      </Slider>
    </div>
  )
}

const NextArrow = props => {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={{
        ...style,
        backgroundImage: `url(${arrowRight})`,
        // backgroundSize: 'cover',
        opacity: 0.6,
        width: '35px',
        height: '35px',
      }}
      onClick={onClick}
    />
  )
}

const PrevArrow = props => {
  const {className, style, onClick} = props
  return (
    <div
      className={className}
      style={{
        ...style,
        backgroundImage: `url(${arrowLeft})`,
        // backgroundSize: 'cover',
        opacity: 0.6,
        width: '35px',
        height: '35px',
      }}
      onClick={onClick}
    />
  )
}

export default GoodsSlider
