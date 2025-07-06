import React, { useEffect, useRef,useState } from 'react';
import { BookOpen, Search, Wand2, Save, AlertCircle, CheckCircle, Hash, User, FileText, Package, DollarSign, Upload, X, Image } from 'lucide-react';
import Navbar from '../components/navbar';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Footer1 from '../ui/footer';
const BookSellPage = () => {
  const [inputMode, setInputMode] = useState('auto'); // 'auto' or 'manual'
  const [loading, setLoading] = useState({
    bookDetails: false,
    description: false,
    submit: false,
    imageUpload: false
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    isbn: '',
    bookName: '',
    authorName: '',
    pageCount: '',
    description: '',
    token: '',
    condition: 'Good',
    images: []
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [fieldsLocked, setFieldsLocked] = useState({
    bookName: false,
    authorName: false,
    pageCount: false,
    description: false
  });


   const textRef = useRef(null);
  const subtextRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // GSAP-style animation for main text
    if (textRef.current) {
      textRef.current.style.opacity = '0';
      textRef.current.style.transform = 'translateX(-100px)';
      
      const animateText = () => {
        let opacity = 0;
        let translateX = -100;
        
        const step = () => {
          opacity += 0.05;
          translateX += 5;
          
          if (opacity >= 1) {
            opacity = 1;
            translateX = 0;
          }
          
          textRef.current.style.opacity = opacity;
          textRef.current.style.transform = `translateX(${translateX}px)`;
          
          if (opacity < 1) {
            requestAnimationFrame(step);
          }
        };
        
        requestAnimationFrame(step);
      };
      
      setTimeout(animateText, 200);
    }

    // Animate subtext
    if (subtextRef.current) {
      subtextRef.current.style.opacity = '0';
      subtextRef.current.style.transform = 'translateX(-50px)';
      
      const animateSubtext = () => {
        let opacity = 0;
        let translateX = -50;
        
        const step = () => {
          opacity += 0.03;
          translateX += 2.5;
          
          if (opacity >= 1) {
            opacity = 1;
            translateX = 0;
          }
          
          subtextRef.current.style.opacity = opacity;
          subtextRef.current.style.transform = `translateX(${translateX}px)`;
          
          if (opacity < 1) {
            requestAnimationFrame(step);
          }
        };
        
        requestAnimationFrame(step);
      };
      
      setTimeout(animateSubtext, 600);
    }

    // Animate image placeholder
    if (imageRef.current) {
      imageRef.current.style.opacity = '0';
      imageRef.current.style.transform = 'translateX(50px)';
      
      const animateImage = () => {
        let opacity = 0;
        let translateX = 50;
        
        const step = () => {
          opacity += 0.04;
          translateX -= 2;
          
          if (opacity >= 1) {
            opacity = 1;
            translateX = 0;
          }
          
          imageRef.current.style.opacity = opacity;
          imageRef.current.style.transform = `translateX(${translateX}px)`;
          
          if (opacity < 1) {
            requestAnimationFrame(step);
          }
        };
        
        requestAnimationFrame(step);
      };
      
      setTimeout(animateImage, 800);
    }
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = selectedImages.length + files.length;
    
    if (totalImages > 3) {
      setMessage({ text: 'You can only upload up to 3 images total', type: 'error' });
      return;
    }

    // Add new files to existing ones
    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);
    
    // Create preview URLs for new files and add to existing previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    const allPreviews = [...imagePreviews, ...newPreviews];
    setImagePreviews(allPreviews);
    
    // Clear the input so same file can be selected again if needed
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
    
    // Clean up object URL
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const uploadImagesToCloudinary = async () => {
    if (selectedImages.length === 0) return [];

    setLoading(prev => ({ ...prev, imageUpload: true }));
    
    try {
      const formData = new FormData();
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch('http://localhost:3000/api/sell/uploadimages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Don't set Content-Type for FormData
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload images');
      }
      
      const data = await response.json();
      return data.imageUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, imageUpload: false }));
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModeChange = (mode) => {
    setInputMode(mode);
    if (mode === 'manual') {
      setFieldsLocked({
        bookName: false,
        authorName: false,
        pageCount: false,
        description: false
      });
    }
    setMessage({ text: '', type: '' });
  };

  const fetchBookDetails = async () => {
    if (!formData.isbn) {
      setMessage({ text: 'Please enter an ISBN first', type: 'error' });
      return;
    }

    setLoading(prev => ({ ...prev, bookDetails: true }));
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:3000/api/sell/getbookdetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isbn: formData.isbn })
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          bookName: data.data.bookName,
          authorName: data.data.authorName,
          pageCount: data.data.pageCount.toString()
        }));
        
        setFieldsLocked(prev => ({
          ...prev,
          bookName: true,
          authorName: true,
          pageCount: true
        }));

        setMessage({ 
          text: 'Book details fetched successfully!', 
          type: 'success' 
        });
      } else {
        setMessage({ 
          text: data.message || 'Failed to fetch book details', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      setMessage({ 
        text: 'Network error. Please check your connection and try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(prev => ({ ...prev, bookDetails: false }));
    }
  };

  const fetchDescription = async () => {
    if (!formData.bookName || !formData.authorName) {
      setMessage({ 
        text: 'Please fill in book name and author first', 
        type: 'error' 
      });
      return;
    }

    setLoading(prev => ({ ...prev, description: true }));
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:3000/api/sell/getdescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          title: formData.bookName, 
          author: formData.authorName 
        })
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          description: data.description
        }));
        
        setFieldsLocked(prev => ({
          ...prev,
          description: true
        }));

        setMessage({ 
          text: 'Description generated successfully!', 
          type: 'success' 
        });
      } else {
        setMessage({ 
          text: data.message || 'Failed to generate description', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching description:', error);
      setMessage({ 
        text: 'Network error. Please check your connection and try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(prev => ({ ...prev, description: false }));
    }
  };

  const handleSubmit = async () => {
    // Validation
    const requiredFields = ['isbn', 'bookName', 'authorName', 'pageCount', 'description', 'token', 'condition'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setMessage({ 
        text: `Please fill in all fields: ${missingFields.join(', ')}`, 
        type: 'error' 
      });
      return;
    }

    setLoading(prev => ({ ...prev, submit: true }));
    setMessage({ text: '', type: '' });

    try {
      // Upload images to Cloudinary first
      let imageUrls = [];
      if (selectedImages.length > 0) {
        setMessage({ text: 'Uploading images...', type: 'info' });
        imageUrls = await uploadImagesToCloudinary();
      }

      const submitData = {
        ...formData,
        pageCount: parseInt(formData.pageCount),
        token: parseInt(formData.token),
        images: imageUrls
      };

      setMessage({ text: 'Adding book to marketplace...', type: 'info' });

      const response = await fetch('http://localhost:3000/api/sell/addsell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          text: `${data.message} - Book ID: ${data.book._id}`, 
          type: 'success' 
        });
        
        // Reset form
        setFormData({
          isbn: '',
          bookName: '',
          authorName: '',
          pageCount: '',
          description: '',
          token: '',
          condition: 'Good',
          images: []
        });
        
        setFieldsLocked({
          bookName: false,
          authorName: false,
          pageCount: false,
          description: false
        });

        // Clean up image previews
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setSelectedImages([]);
        setImagePreviews([]);
      } else {
        setMessage({ 
          text: data.message || 'Failed to add book', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error adding book:', error);
      setMessage({ 
        text: 'Network error. Please check your connection and try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
        <div className="max-w-7xl ml-7 sm:px-6">
        <div className="mb-3 py-8">
      <div className="mx-auto sm:px-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-700 rounded-2xl shadow-2xl">
          
          
          <div className="relative px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left side - Text content */}
              <div className="space-y-6">
                <h2 
                  ref={textRef}
                  className="font2 text-9xl md:text-5xl lg:text-6xl font-bold text-amber-900 leading-tight"
                >
                  Sell Your Book
                </h2>
                
                <div ref={subtextRef} className=" space-y-4 text-amber-900">
                  <p className=" font3 tracking-wider text-xl md:text-2xl font-semibold">
                    Transform Your Story Into Success
                  </p>
                  <p className="font font-semibold text-amber-700 text-lg leading-relaxed">
                    Join thousands of authors who've turned their passion into profit. 
                    Our platform helps you reach readers worldwide, maximize your royalties, 
                    and build a sustainable writing career.
                  </p>
                  
                </div>
              </div>
              
              {/* Right side - Image placeholder */}
              <div 
                ref={imageRef}
                className="relative"
              >
                <div>
                  <div className="w-full h-1/3 flex items-center justify-center">
                    
                      
                      <DotLottieReact
      src="https://lottie.host/b2268625-9c87-499e-81df-aa61ef2cd252/DS3stw17rb.lottie"
      loop
      autoplay
    />
                    
                  </div>
                </div>
                
                
              </div>
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
          {/* Mode Selection */}
          <div className="font bg-white rounded-2xl shadow-lg p-6 mb-8 border max-w-7xl border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How would you like to add your book?</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleModeChange('auto')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                  inputMode === 'auto'
                    ? 'border-amber-700 bg-amber-100 text-amber-600'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Wand2 className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Auto-Generate</div>
                <div className="text-sm opacity-75">Use ISBN to fetch details automatically</div>
              </button>
              
              <button
                onClick={() => handleModeChange('manual')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                  inputMode === 'manual'
                    ? 'border-amber-700 bg-amber-100 text-amber-600'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Manual Entry</div>
                <div className="text-sm opacity-75">Enter all details manually</div>
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm ${
              message.type === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-700'
                : 'bg-red-500/20 border border-red-500/30 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Main Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* ISBN Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Hash className="w-4 h-4 mr-2" />
                      ISBN
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter ISBN (e.g., 9780735211308)"
                      />
                      {inputMode === 'auto' && (
                        <button
                          onClick={fetchBookDetails}
                          disabled={loading.bookDetails || !formData.isbn}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {loading.bookDetails ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                          Fetch
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Book Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Book Name
                    </label>
                    <input
                      type="text"
                      name="bookName"
                      value={formData.bookName}
                      onChange={handleInputChange}
                      disabled={fieldsLocked.bookName && inputMode === 'auto'}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        fieldsLocked.bookName && inputMode === 'auto' ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder="Enter book name"
                    />
                  </div>

                  {/* Author Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Author Name
                    </label>
                    <input
                      type="text"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleInputChange}
                      disabled={fieldsLocked.authorName && inputMode === 'auto'}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        fieldsLocked.authorName && inputMode === 'auto' ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder="Enter author name"
                    />
                  </div>

                  {/* Page Count */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Page Count
                    </label>
                    <input
                      type="number"
                      name="pageCount"
                      value={formData.pageCount}
                      onChange={handleInputChange}
                      disabled={fieldsLocked.pageCount && inputMode === 'auto'}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        fieldsLocked.pageCount && inputMode === 'auto' ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder="Enter page count"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Description
                      </span>
                      {inputMode === 'auto' && (
                        <button
                          onClick={fetchDescription}
                          disabled={loading.description || !formData.bookName || !formData.authorName}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                        >
                          {loading.description ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Wand2 className="w-4 h-4" />
                          )}
                          Generate
                        </button>
                      )}
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={fieldsLocked.description && inputMode === 'auto'}
                      rows={6}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                        fieldsLocked.description && inputMode === 'auto' ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder="Enter book description..."
                    />
                  </div>

                  {/* Token Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <img
                  src="/fire.png"
                  alt="BookHive"
                  className="w-5 h-5 rounded-xl shadow-sm"
                />
                      Token Price
                    </label>
                    <input
                      type="number"
                      name="token"
                      value={formData.token}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter token price"
                      min="1"
                    />
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                    {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
                      <span className="flex items-center">
                        <Image className="w-4 h-4 mr-2" />
                        Book Images (Up to 3)
                      </span>
                      <span className="text-xs text-gray-500">
                        {selectedImages.length}/3 selected
                      </span>
                    </label>
                    
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        max="3"
                        disabled={selectedImages.length >= 3}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`cursor-pointer flex flex-col items-center ${
                          selectedImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {selectedImages.length === 0 
                            ? 'Click to upload images or drag and drop' 
                            : selectedImages.length >= 3
                            ? 'Maximum 3 images reached'
                            : `Add more images (${selectedImages.length}/3 selected)`
                          }
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF up to 10MB each
                        </span>
                      </label>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="font2  font-light mt-8 text-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading.submit || loading.imageUpload}
                  className="bg-gradient-to-r from-amber-500 to-amber-800 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-amber-900transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mx-auto min-w-[200px]"
                >
                  {loading.submit || loading.imageUpload ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {loading.imageUpload ? 'Uploading Images...' : 'Adding Book...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Add Book to Marketplace
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-orange-200 rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                Auto-Generate Tips
              </h3>
              <p className="text-gray-600 text-sm">
                Enter a valid ISBN and click "Fetch" to automatically populate book details. 
                Then use "Generate" to create an AI-powered description.
              </p>
            </div>
            
            <div className="bg-orange-200 rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <img
                  src="/fire.png"
                  alt="BookHive"
                  className="w-5 h-5 rounded-xl shadow-sm"
                />
                Token Pricing
              </h3>
              <p className="text-gray-600 text-sm">
                Set a competitive token price for your book. Consider the book's condition, 
                rarity, and demand when setting the price.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer1/>
    </>
  );
};

export default BookSellPage;