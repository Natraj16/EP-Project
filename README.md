# Manpower Services Platform - Frontend

A comprehensive React-based web application for managing manpower service requests across security, labor, technical, and medical staffing needs.

## Features

### Client Features
- **User Authentication**: Secure registration and login system
- **Service Exploration**: Browse and explore different manpower service categories
- **Request Submission**: Multi-step form for submitting service requests
- **Request Tracking**: Real-time dashboard to track request status
- **Communication**: In-app messaging with admin team
- **Document Upload**: Attach relevant documents to requests

### Admin Features
- **Dashboard**: Overview of all requests with key metrics
- **Request Management**: Review, approve, and assign staff to requests
- **Analytics**: Comprehensive reports on service demand and performance
- **Client Communication**: Direct messaging with clients
- **Status Updates**: Update request status and maintain activity logs

### General Features
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Role-Based Access**: Separate interfaces for clients and admins
- **Static Pages**: About, Contact, FAQ sections
- **Real-time Notifications**: Toast notifications for user actions

## Technology Stack

- **React 18.2**: Modern React with hooks
- **React Router 6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Formik & Yup**: Form handling and validation
- **React Toastify**: Toast notifications
- **Lucide React**: Modern icon library

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.js      # Route protection component
│   └── layout/
│       ├── Layout.js               # Main layout wrapper
│       ├── Navbar.js               # Navigation bar
│       └── Footer.js               # Footer component
├── context/
│   └── AuthContext.js              # Authentication context
├── pages/
│   ├── auth/
│   │   ├── Login.js                # Login page
│   │   └── Register.js             # Registration page
│   ├── client/
│   │   ├── ClientDashboard.js      # Client dashboard
│   │   ├── NewRequest.js           # New request form
│   │   └── RequestDetail.js        # Request detail view
│   ├── admin/
│   │   ├── AdminDashboard.js       # Admin dashboard
│   │   ├── AdminRequests.js        # All requests list
│   │   ├── AdminRequestDetail.js   # Admin request detail
│   │   └── Analytics.js            # Analytics & reports
│   ├── Home.js                     # Landing page
│   ├── Services.js                 # Services overview
│   ├── ServiceDetail.js            # Individual service detail
│   ├── About.js                    # About page
│   ├── Contact.js                  # Contact page
│   └── FAQ.js                      # FAQ page
├── App.js                          # Main app component
├── index.js                        # Entry point
└── index.css                       # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

**Client Account:**
- Email: client@example.com
- Password: password

**Admin Account:**
- Email: admin@example.com
- Password: password

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (one-way operation)

## Key Pages & Routes

### Public Routes
- `/` - Home page
- `/services` - All services
- `/services/:category` - Individual service details
- `/about` - About page
- `/contact` - Contact form
- `/faq` - Frequently asked questions
- `/login` - Login page
- `/register` - Registration page

### Client Protected Routes
- `/client/dashboard` - Client dashboard
- `/client/new-request` - Submit new request
- `/client/requests/:id` - View request details

### Admin Protected Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/requests` - All requests management
- `/admin/requests/:id` - Admin request detail view
- `/admin/analytics` - Analytics and reports

## Service Categories

1. **Security Services**
   - Armed Security
   - Unarmed Security
   - Event Security
   - VIP Protection
   - Mobile Patrol

2. **Labor Services**
   - Construction Workers
   - Warehouse Staff
   - Manufacturing Personnel
   - Loading Teams
   - Maintenance Crew

3. **Technical Staff**
   - IT Support
   - Software Developers
   - Network Engineers
   - Electricians
   - Project Managers

4. **Medical Professionals**
   - Registered Nurses
   - Licensed Practical Nurses
   - Medical Assistants
   - Paramedics
   - Healthcare Support

## Customization

### Styling
The application uses Tailwind CSS with custom utility classes defined in `src/index.css`. You can customize:
- Color scheme in `tailwind.config.js`
- Global styles in `src/index.css`
- Component-specific styles inline

### Adding New Services
1. Update service data in relevant pages (`Services.js`, `ServiceDetail.js`)
2. Add new categories to the `NewRequest.js` form
3. Update routing if needed

## Backend Integration

Currently, the application uses mock data. To integrate with a backend:

1. Create an API service layer (`src/services/api.js`)
2. Replace mock data calls in components with actual API calls
3. Update authentication flow in `AuthContext.js`
4. Implement proper error handling
5. Add loading states

Example API structure needed:
```javascript
// Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout

// Requests (Client)
GET /api/client/requests
POST /api/client/requests
GET /api/client/requests/:id

// Requests (Admin)
GET /api/admin/requests
GET /api/admin/requests/:id
PUT /api/admin/requests/:id
GET /api/admin/analytics

// Communication
POST /api/messages
GET /api/messages/:requestId
```

## Security Considerations

When deploying to production:

1. **Environment Variables**: Store API URLs and keys in `.env` files
2. **HTTPS**: Always use HTTPS in production
3. **Authentication**: Implement JWT or session-based auth
4. **Input Validation**: Server-side validation is crucial
5. **CORS**: Configure proper CORS policies
6. **Rate Limiting**: Implement rate limiting on API calls

## Future Enhancements

- [ ] Real-time notifications using WebSockets
- [ ] Advanced search and filtering
- [ ] Calendar integration for scheduling
- [ ] Payment processing integration
- [ ] Document management system
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Email templates and automation
- [ ] Advanced analytics with charts
- [ ] Video call integration for consultations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@pjinfra.com or visit our contact page.
