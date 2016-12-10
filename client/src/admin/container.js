import React, { Component } from 'react';
import Groups from './components/groups';
import { groupUpdated } from './actions';
import { connect } from 'react-redux';
import rest from '../api'; //our redux-rest object

class Admin extends Component {
  componentWillMount() {
    this.props.onLoad();
  }
  render() {
    const { groups, onUpdated, onSave, isSaving } = this.props;
    return (
      <div style={{ padding: '10px', width: '80%', margin: 'auto' }}>
        <h1>Groups</h1>
        <p>Manage the mobile numbers subscribed to each group</p>
        <Groups groups={groups} onUpdated={onUpdated} onSave={() => onSave(groups)} isSaving={isSaving}
        />
      </div>
    );
  }
}


Admin.propTypes = {
  groups: React.PropTypes.arrayOf(React.PropTypes.shape({
    tag: React.PropTypes.string.isRequired,
    phoneNumbers: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  })).isRequired,
  onUpdated: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  isSaving: React.PropTypes.bool,
};


const mapStateToProps = (state) => {
  return {
    groups: state.groups.data,
    isSaving: state.groups.loading ,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    onSave(groups) {
      dispatch(rest.actions.groups.put({},{body: JSON.stringify(groups)}));
    },
    onUpdated(tag, phoneNumbers) {
      dispatch(groupUpdated({ tag, phoneNumbers }));
    },
    onLoad() {
      dispatch(rest.actions.groups.sync());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
