import React from 'react';
import '@blueprintjs/core/dist/blueprint.css';
import AsyncButton from './async-button';

const style = {
  actionGroup: {
    textAlign: 'right',
  },
};

const Groups = ({ groups, onUpdated, onSave, isSaving }) => (
  <div>
    {groups.map(({ tag, phoneNumbers }) => (
      <div key={tag}>
        <label style={{ width: '100%', marginBottom: '10px' }}>{`#${tag}`}
          <textarea
            rows={5}
            placeholder="No one is subscribed to this group"
            className={`pt-input pt-fill group__phoneNumbers-${tag}`}
            onChange={(event) => onUpdated(tag, event.target.value.split(' '))}
            value={phoneNumbers.join(' ')}
          />
        </label>
      </div>
    ))}
    <div style={style.actionGroup}>
      <AsyncButton icon={'pt-icon-tick'} label="Save Groups" onClick={onSave} loading={isSaving} />
    </div>
  </div>
);

Groups.propTypes = {
  groups: React.PropTypes.arrayOf(React.PropTypes.shape({
    tag: React.PropTypes.string.isRequired,
    phoneNumbers: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  })).isRequired,
  onUpdated: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  isSaving: React.PropTypes.bool,
};

export default Groups;
