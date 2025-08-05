# Weather App - Modern Weather Forecast Application

## Overview
This Weather App is a modern, responsive web application that provides real-time weather information and forecasts. Built with vanilla JavaScript, HTML5, and CSS3, it offers a clean, intuitive interface for users to search locations and view detailed weather data including temperature, humidity, wind speed, air quality, sunrise/sunset times, and 5-day forecasts.

## Live Demo
Visit the live application: [Weather App](https://weather-app-v1-six.vercel.app/)

## Features
- **Location-based Weather Data**: Search for any city worldwide
- **Real-time Weather Information**: Current conditions with visual indicators
- **Air Quality Index**: Environmental air quality measurements
- **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit
- **5-Day Weather Forecast**: Plan ahead with extended forecasts
- **Voice Search**: Search locations using voice commands
- **Responsive Design**: Optimized for all device sizes
- **Dynamic Weather Icons**: Visual representation of weather conditions
- **Sunrise and Sunset Times**: Daily solar cycle information

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: OpenWeatherMap API for weather data
- **Styling**: Custom CSS with responsive design principles
- **Date/Time Handling**: Moment.js
- **Deployment**: Vercel
- **Version Control**: Git/GitHub

## Project Structure
weather-api-web-infrastructure/
├── index.html              # Main HTML file
├── assets/                 # Static assets directory
│   ├── css/                # CSS stylesheets
│   │   ├── bootstrap.min.css  # Bootstrap framework (minimal)
│   │   └── style.css      # Custom styles
│   ├── js/                 # JavaScript files
│   │   ├── script.js      # Main application logic
│   │   ├── City.js        # City data handling
│   │   └── Capitals.js    # Capital cities data
│   ├── icons/             # Weather and UI icons
│   └── favicon.ico        # Site favicon
├── config/                 # Configuration files
│   ├── config.js          # API configuration
│   └── keyManager.js      # API key management
├── vercel.json            # Vercel deployment configuration
├── encodeKeys.js          # Utility for encoding API keys
└── README.md              # Project documentation


## Setup and Installation

### Prerequisites
- Node.js (for local development)
- Modern web browser
- API keys from OpenWeatherMap

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-api-web-infrastructure.git
   cd weather-api-web-infrastructure
2. Set up the API keys:
   Register at OpenWeatherMap to get API keys
   Use the encode utility to encode your keys
   Copy the encoded keys to keyManager.js
3. Start the live server of index.hmtl

#### Security Features
- API key protection through encoding/decoding mechanism
- Client-side validation for user inputs
- Error handling for API failures

##### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

###### License
This project is open source and available under the MIT License.

Acknowledgements
- OpenWeatherMap for providing the weather data API
- Moment.js for date/time handling
- Font Awesome for icons
- Vercel for hosting the application
- Nina Cyndy BWIZA for creating this project