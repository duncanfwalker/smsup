import React, { Component } from 'react';
import { connect } from 'react-redux';
import { groupUpdated, startDelete, endRestore } from './reducer';
import rest from '../api';
import Groups from './components/groups';
import './style.css';

class Admin extends Component {
  componentWillMount() {
    this.props.onLoad();
  }
  render() {
    const { groups, deleted, onUpdated, onSave, onDelete, onRestore, isSaving } = this.props;
    return (
      <div style={{ padding: '10px', width: '80%', margin: 'auto' }}>
        <h1>Groups</h1>
        <p>Manage the mobile numbers subscribed to each group</p>
        <Groups
          groups={groups}
          deleted={deleted}
          onUpdated={onUpdated}
          onRestore={onRestore}
          onSave={() => onSave(groups)}
          onDelete={onDelete}
          isSaving={isSaving }
        />
      </div>
    );
  }
}

const groupType = React.PropTypes.shape({
  tag: React.PropTypes.string.isRequired,
  phoneNumbers: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
});

Admin.propTypes = {
  groups: React.PropTypes.arrayOf(groupType).isRequired,
  deleted: React.PropTypes.arrayOf(groupType),
  onUpdated: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  onRestore: React.PropTypes.func.isRequired,
  onLoad: React.PropTypes.func.isRequired,
  isSaving: React.PropTypes.bool,
};


const alphabeticallyOn = (fieldName) => {
  return (a, b) => {
    if (a[fieldName] > b[fieldName]) return 1;
    else if (a[fieldName] < b[fieldName]) return -1;
    return 0;
  };
};

const mapStateToProps = (state) => {
  const groupWithBackups = [
    ...state.groups.data,
    ...(state.groups.backup || []).map(g => ({ ...g, isDeleted: true })),
  ];
  return {
    groups: groupWithBackups.sort(alphabeticallyOn('tag')),
    isSaving: state.groups.loading,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    onSave(groups) {
      dispatch(rest.actions.groups.put({}, { body: JSON.stringify(groups) }));
    },
    onDelete(groupName) {
      dispatch(startDelete(groupName));
      dispatch(rest.actions.groups.delete({ id: `${groupName}` }, () => {
        dispatch(rest.actions.groups.get());
      }));
    },
    onRestore(groupName) {
      return dispatch((unused, getState) => {
        const backup = getState().groups.backup.find(group => group.tag === groupName);
        const { tag, phoneNumbers } = backup;
        dispatch(rest.actions.groups.post({}, { body: JSON.stringify({ tag, phoneNumbers }) }, () => {
          dispatch(endRestore(groupName));
          dispatch(rest.actions.groups.get());
        }));
      });
    },
    onUpdated(tag, phoneNumbers) {
      dispatch(groupUpdated({ tag, phoneNumbers }));
    },
    onLoad() {
      dispatch(rest.actions.groups.sync());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
