import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, Share2, ShoppingCart, Truck, Shield, Award, MapPin, Clock, User } from 'lucide-react';
import NavBar from './Navbar';
const ProductPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);
  const sellerCardRef = useRef(null);

  // Sample product data
  const product = {
    title: "Premium Wireless Noise-Cancelling Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviewCount: 2847,
    description: "Experience exceptional sound quality with our premium wireless headphones featuring advanced noise-cancelling technology, 30-hour battery life, and premium materials for ultimate comfort.",
    features: [
      "Advanced Active Noise Cancellation",
      "30-hour battery life with quick charge",
      "Premium leather ear cushions",
      "Bluetooth 5.0 connectivity",
      "Touch controls and voice assistant"
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Silver', 'Rose Gold'],
    inStock: true,
    fastDelivery: true,
    freeReturns: true
  };

  const images = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop"
  ];

  const seller = {
    name: "TechGear Pro",
    rating: 4.8,
    reviewCount: 15420,
    responseTime: "< 1 hour",
    location: "San Francisco, CA",
    establishedYear: 2018,
    description: "Premium electronics retailer specializing in high-quality audio equipment and accessories.",
    badges: ["Top Rated Seller", "Fast Shipping", "Excellent Service"]
  };

  useEffect(() => {
    // GSAP animations would go here
    // For this example, we'll use CSS transitions instead
    const container = containerRef.current;
    const imageSection = imageRef.current;
    const detailsSection = detailsRef.current;
    const sellerCard = sellerCardRef.current;

    if (container && imageSection && detailsSection && sellerCard) {
      // Animate entrance
      setTimeout(() => {
        imageSection.style.opacity = '1';
        imageSection.style.transform = 'translateX(0)';
      }, 100);
      
      setTimeout(() => {
        detailsSection.style.opacity = '1';
        detailsSection.style.transform = 'translateX(0)';
      }, 200);
      
      setTimeout(() => {
        sellerCard.style.opacity = '1';
        sellerCard.style.transform = 'translateY(0)';
      }, 300);
    }
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Added to cart');
  };

  const handleBuyNow = () => {
    // Buy now logic
    console.log('Buy now');
  };

  return (
    <>
        <NavBar/>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div 
            ref={imageRef}
            className="opacity-0 transform -translate-x-8 transition-all duration-700 ease-out"
          >
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
                <img
                  src={images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                
                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentImageIndex === index 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      currentImageIndex === index 
                        ? 'border-blue-500 scale-105' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div 
            ref={detailsRef}
            className="opacity-0 transform translate-x-8 transition-all duration-700 ease-out"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                  <span className="text-yellow-400 font-semibold ml-1">{product.rating}</span>
                </div>
                <span className="text-gray-400">({product.reviewCount.toLocaleString()} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-bold text-green-400">${product.price}</span>
                <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>


              
              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`px-4 py-3 rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                    isWishlisted
                      ? 'border-red-500 bg-red-500/20 text-red-400'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="px-4 py-3 rounded-xl border border-gray-600 hover:border-gray-500 transition-all duration-300 transform hover:scale-105">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Delivery Info */}
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2 text-green-400">
                  <Truck className="w-4 h-4" />
                  <span>Free delivery</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Shield className="w-4 h-4" />
                  <span>Free returns</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <Award className="w-4 h-4" />
                  <span>Warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Card */}
        <div 
          ref={sellerCardRef}
          className="opacity-0 py-3 transform translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Seller Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                    {seller.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{seller.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(seller.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                        <span className="text-yellow-400 font-semibold ml-1">{seller.rating}</span>
                      </div>
                      <span className="text-gray-400">({seller.reviewCount.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{seller.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {seller.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 px-3 py-1 rounded-full text-sm text-green-400"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Located in {seller.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Response time: {seller.responseTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Selling since {seller.establishedYear}</span>
                </div>
                
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductPage;