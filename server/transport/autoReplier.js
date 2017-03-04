function autoReplier(router, send) {
  return function moResponder(mo) {
    return router(mo)
      .then((autoReply) => {
        if (autoReply !== undefined) send(mo.sender, autoReply);
        return autoReply;
      })
      .catch((error) => {
        if (error.name === 'InvalidCommandError') {
          send(mo.sender, error.message);
        }
      });
  };
}

module.exports = autoReplier;
