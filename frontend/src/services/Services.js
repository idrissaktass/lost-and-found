const BASE_URL = 'https://lost-and-found-backend-red.vercel.app/api'; // Adjusted base URL

export const loginService = async (email, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const data = await response.json();
  console.log("data", data);
  
  if (!response.ok) throw new Error(data.message);
  
  // Store token, email, and username in localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('email', email);
  console.log("data",data)
  localStorage.setItem('username', data.username); // Assuming `data.username` contains the username
  
  return {
    token: data.token,
    user: { id: data.userId, username: data.username }, // Return user data including username
  };
};



export const signupService = async (username, email, password) => {
  console.log("datasignup")

  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
    credentials: 'include' // Add this line if necessary

  });

  const data = await response.json();
  console.log("datasignup",data)
  if (!response.ok) throw new Error(data.message);

  // Save the token to localStorage or manage it as required
  localStorage.setItem('token', data.token);
  localStorage.setItem('email', email); // Save other user info as needed
  localStorage.setItem('username', username); // Save other user info as needed

  return data.token;
};

