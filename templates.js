module.exports.PUT_push = e =>
`<b>NEW IMAGE</b>: ${e.events[0].target.repository}
<b>Tag</b>: ${e.events[0].target.tag}
<b>Host</b>: ${e.events[0].request.host}
<b>Source</b>: ${e.events[0].request.addr}`;
