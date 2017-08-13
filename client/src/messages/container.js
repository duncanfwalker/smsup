import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import rest from '../api';
import './style.css';
import { requestPage } from './reducer';
import AsyncButton from './../async-button';

class Messages extends Component {
  componentWillMount() {
    this.props.onLoadMore();
  }

  render() {
    const { messages = [], loading } =  this.props;
    return (
      <div>
        <table className="su-messages pt-table pt-bordered">
          <thead>
          <tr>
            <th>Content</th>
            <th className="su-messages--gateway">Gateway</th>
            <th className="su-messages--gateway">Gateway Id</th>
            <th>Sender</th>
            <th>Received</th>
          </tr>
          </thead>
          <tbody>
          {messages.map(m => (
            <tr key={`${m.gateway}${m.gatewayId}`}>
              <td>{m.text}</td>
              <td className="su-messages--gateway">{m.gateway}</td>
              <td className="su-messages--gateway">{m.gatewayId}</td>
              <td>{m.sender}</td>
              <td alt={m.sent}>
                <relative-time title={m.sent}>
                  {moment(m.sent).fromNow()}
                </relative-time>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'right' }}>
          <AsyncButton label="Load more" onClick={this.props.onLoadMore} icon="pt-icon-chevron-down" loading={loading}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages.all,
    loading: state.messages.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLoadMore: () => dispatch(requestPage(rest.actions.messages.get)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Messages);
