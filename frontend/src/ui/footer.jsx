import React from 'react'

function Footer1(){
  return (
    <div>
      <footer className=" font border-t border-gray-200 bg-[url('/footer.jpg')] bg-cover bg-center min-h-screen
             relative   ">
        <div className="max-w-7xl mx-auto px-6 py-16 ">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white  mb-6">
                JOIN THE
                <br />
                BOOKHIVE
                <br />
                COMMUNITY
              </h2>

              <div className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="EMAIL"
                    className="flex-1 px-4 py-3 border-2 text-white border-gray-300 focus:border-blue-500 focus:outline-none font-medium"
                  />
                  <button className="px-6 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">
                    OK
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900  mb-6">
                HELP
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-700  hover:text-blue-600 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700  hover:text-blue-600 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900  mb-6">
                  LEGAL INFO
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-700  hover:text-blue-600 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-700  hover:text-blue-600 transition-colors"
                    >
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-700  hover:text-blue-600 transition-colors"
                    >
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-700  hover:text-blue-600 transition-colors"
                    >
                      Gift Card
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  FOLLOW US
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-700  hover:text-green-600 transition-colors"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-700  hover:text-green-600 transition-colors"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-700  hover:text-green-600 transition-colors"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-700  hover:text-green-600 transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="font2 font-bold bg-gradient-to-r from-amber-400 to-amber-800 py-12 overflow-hidden">
          <div className="relative">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mx-8">
                BOOKHIVE
              </span>
              <span className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mx-8">
                BOOKHIVE
              </span>
              <span className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mx-8">
                BOOKHIVE
              </span>
              <span className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mx-8">
                BOOKHIVE
              </span>
              <span className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mx-8">
                BOOKHIVE
              </span>
            </div>
          </div>
          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-marquee {
              animation: marquee 15s linear infinite;
              display: inline-block;
            }
          `}</style>
        </div>
        <div className="bg-amber-950 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                    <span className="text-black text-xs font-bold">B</span>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">
                  SHARE • REPEAT • EXPLORE
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <span className="text-gray-400 text-sm">
                  © 2025 BookHive - All Rights Reserved
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer1;
