import React, { Component } from 'react';
import './admin.css';
import Groups from './groups';

class Admin extends Component {
  render() {
    return (
      <div style={{ padding: '10px', width: '80%', margin: 'auto' }}>
        <h1>Groups</h1>
        <p>Manage the mobile numbers subscribed to each group</p>
        <Groups
          groups={[]}
          onUpdated={() => {}}
          onSave={() => {}}
          isSaving={false}
        />
      </div>
    );
  }
}

export default Admin;
