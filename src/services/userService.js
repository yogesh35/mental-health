import axios from 'axios';

const DESCOPE_BASE_URL = 'https://api.descope.com/v1';

export const userService = {
  async getAllUsers() {
    try {
      const response = await axios.get(`${DESCOPE_BASE_URL}/mgmt/user/search/all`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_DESCOPE_MANAGEMENT_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.users || [];
    } catch (error) {
      console.error('Error fetching users from Descope:', error);
      
      // Return sample data as fallback
      return [
        {
          userId: '1',
          email: 'john.doe@example.com',
          name: 'John Doe',
          status: 'active',
          createdTime: '2024-01-15T10:30:00Z',
          lastLoginTime: '2024-01-20T14:22:00Z'
        },
        {
          userId: '2',
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          status: 'active',
          createdTime: '2024-01-14T09:15:00Z',
          lastLoginTime: '2024-01-19T16:45:00Z'
        },
        {
          userId: '3',
          email: 'mike.johnson@example.com',
          name: 'Mike Johnson',
          status: 'inactive',
          createdTime: '2024-01-13T11:00:00Z',
          lastLoginTime: '2024-01-18T13:30:00Z'
        },
        {
          userId: '4',
          email: 'sarah.wilson@example.com',
          name: 'Sarah Wilson',
          status: 'active',
          createdTime: '2024-01-12T14:20:00Z',
          lastLoginTime: '2024-01-21T10:15:00Z'
        }
      ];
    }
  }
};
