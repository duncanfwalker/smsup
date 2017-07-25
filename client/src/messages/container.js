import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import rest from '../api';
import './style.css';

class Messages extends Component {
  componentWillMount() {
    this.props.onLoad();
  }

  render() {
    const { messages = [] } =  this.props;
    return (
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
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages.data.messages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLoad: () => {
      dispatch(rest.actions.messages.sync());
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Messages);
