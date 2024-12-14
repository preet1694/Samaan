# Samaan: Peer-to-Peer Package Delivery Platform

## Overview
Samaan is a platform that connects people who need to send packages with travelers willing to carry them. By utilizing the unused baggage space of travelers, Samaan enables cost-effective, reliable, and eco-friendly delivery of packages.

## Features
- **Package Requests:** Users can post details of their package, including size, weight, destination, and deadline.
- **Traveler Listings:** Travelers can list their trips, specifying their destination, baggage space available, and travel date.
- **Secure Communication:** In-app messaging allows senders and travelers to discuss package details securely.
- **Payment System:** Secure payment integration ensures fair compensation for the traveler.
- **User Ratings:** Both senders and travelers can rate each other to maintain trust within the community.
- **Real-Time Tracking:** Track the progress of your package with updates from the traveler.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Spring Boot

## Installation

### Prerequisites
- Node.js (version 14 or above)
- Git

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/preet1694/SamaanPooling.git
   ```
2. Navigate to the project directory:
   ```bash
   cd SamaanPooling
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     DATABASE_URL=your_database_url
     PORT=your_port_number
     JWT_SECRET=your_jwt_secret
     ```
5. Start the application:
   ```bash
   npm start
   ```
6. Access the application in your browser at `http://localhost:<PORT>`.

## Usage
1. **Sign Up:** Create an account as a sender or traveler.
2. **Post a Request/Listing:**
   - Senders: Provide package details and destination.
   - Travelers: Specify travel plans and available baggage space.
3. **Match & Connect:** Search for compatible senders or travelers and initiate communication.
4. **Confirm & Pay:** Finalize the agreement and process the payment through the app.
5. **Track & Deliver:** Monitor the package's journey until it reaches the destination.

## Contributing
Contributions are welcome! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push your changes:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
For queries or support, reach out to us:
- **GitHub:** [github.com/preet1694/SamaanPooling](https://github.com/preet1694/SamaanPooling/)

