const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing admin login...');
    console.log('Email: admin@example.co.in');
    console.log('Password: password');
    console.log('');

    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.co.in',
      password: 'password'
    });

    console.log('✅ LOGIN SUCCESSFUL!');
    console.log('');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('');
    console.log('Token:', response.data.data.token);
    console.log('User Role:', response.data.data.user.role);
  } catch (error) {
    console.log('❌ LOGIN FAILED!');
    console.log('');
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Message:', error.response.data.message);
      console.log('Full Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
      console.log('');
      console.log('Is the backend server running on port 5000?');
      console.log('Run: npm run dev');
    }
  }
};

testLogin();
