import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

const spinner = (
  <div className="pt-icon-standard pt-spinner pt-intent-primary" style={{ width: '16px', height: '16px' }}>
    <div className="pt-spinner-svg-container" style={{ width: '16px', height: '16px' }}>
      <svg viewBox="0 0 100 100">
        <path
          className="pt-spinner-track"
          d="M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89"
        >
        </path>
        <path className="pt-spinner-head" d="M 94.5 50 A 44.5 44.5 0 0 0 50 5.5">
        </path>
      </svg>
    </div>
  </div>
);

const AsyncButton = ({ label, icon, loading, onClick }) => (
  <Button onClick={onClick} className="pt-minimal" intent={Intent.PRIMARY}>
    {loading ? spinner : <span className={`pt-icon-standard ${icon}`}> </span> }
    {label}
  </Button>
);


AsyncButton.propTypes = {
  label: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool,
};

export default AsyncButton;
