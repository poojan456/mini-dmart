import { useState, useEffect } from 'react';
import { User, Mail, Shield } from 'lucide-react';

function Profile() {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Decode JWT for basic profile info since we don't have a dedicated /me endpoint
    // In a real app, you'd fetch this from the backend
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserProfile({
          email: payload.sub,
          roles: payload.roles || ['CUSTOMER']
        });
      } catch (e) {
        console.error("Failed to parse token");
      }
    }
  }, []);

  if (!userProfile) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}><h3>Please login to view profile.</h3></div>;
  }

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '15px' }}>
            <User size={50} />
          </div>
          <h2 style={{ margin: 0, color: 'var(--text-dark)' }}>My Profile</h2>
          <span style={{ 
            display: 'inline-block', 
            marginTop: '10px', 
            padding: '5px 15px', 
            backgroundColor: userProfile.roles.includes('ROLE_ADMIN') ? 'var(--secondary-color)' : '#eee',
            color: userProfile.roles.includes('ROLE_ADMIN') ? 'white' : '#666',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            {userProfile.roles.includes('ROLE_ADMIN') ? 'ADMINISTRATOR' : 'CUSTOMER'}
          </span>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#666' }}>
              <Mail size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Email Address</p>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{userProfile.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#666' }}>
              <Shield size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Security Level</p>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                {userProfile.roles.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
