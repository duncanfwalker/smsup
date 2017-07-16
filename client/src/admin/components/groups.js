import React from 'react';
import '@blueprintjs/core/dist/blueprint.css';
import classnames from 'classnames';
import AsyncButton from './async-button';

const style = {
  actionGroup: {
    textAlign: 'right',
  },
};

const Groups = ({ groups, onUpdated, onSave, onDelete, onRestore, isSaving }) => (
  <div>
    {groups.map(({ tag, phoneNumbers, isDeleted }) => (
      <div className="group" key={tag}>
        <label className={classnames('group__header', { 'group__header--deleted': isDeleted })}>
          {tag}
          {!isDeleted &&
          <AsyncButton icon={'pt-icon-delete'} label="delete" onClick={() => onDelete(tag)} loading={isSaving}/>
          }
          {!isDeleted &&
          <textarea
            rows={5}
            placeholder="No one is subscribed to this group"
            className={`pt-input pt-fill pt-intent-primary group__phoneNumbers`}
            onChange={event => onUpdated(tag, event.target.value.split(' '))}
            value={(phoneNumbers || []).join(' ')}
          />
          }
        </label>
        {isDeleted &&
        <AsyncButton icon={'pt-icon-undo'} label="restore" onClick={() => onRestore(tag)} loading={isSaving}/>
        }
      </div>
    ))}
    <div style={style.actionGroup}>
      <AsyncButton icon={'pt-icon-tick'} label="save subscriptions" onClick={onSave} loading={isSaving}/>
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
  onDelete: React.PropTypes.func.isRequired,
  onRestore: React.PropTypes.func.isRequired,
  isSaving: React.PropTypes.bool,
};

Groups.defaultProps = {
  isSaving: false,
};

export default Groups;
