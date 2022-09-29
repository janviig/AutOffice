var app = require('express')();

const cors = require('cors');

const server = require('http').Server(app);

const io = require('connect.io')
  (server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  });

const port = process.env.PORT || 5000;
const sectionBlinds = 10;
const blinds = 20;
const nodes = 10;
var blindAction = undefined;

app.use(cors());

function emit(io, namespace, section, data)
{
  io.of('/' + namespace).emit(section, JSON.stringify(data));
}

function initBlinds()
{
  blindAction = {};

  for (var section = 0; section < sectionBlinds; section++)
  {
    blindAction[`B${section + 1}`] = [];
    for(var node = 0; node < blinds * nodes; node++)
    {
      blindAction[`B${section + 1}`].push("unsuccessful");
    }
  }
}

app.get('/', function (req, res) {
  return res.send(blindAction || {});
});

app.get('/refresh', function (req, res) {
  initBlinds();
  return res.send(blindAction || {});
});

io.on("serverState",  function(connect)
{
  if(blindAction == undefined)
  {
    initBlinds();
  }
  connect.on("serverStatus", function(data)
  {
    connect.emit("serverStatus");
  });
  connect.on("blindStatus", function(data)
  {
    if(data.nodeSec != "*"
    && data.type == "STATE"
    && data.blindAct.start("*"))
    {
      blindAction[data.headRoom][data.nodeRoom] = data.blindAct.split[1];
    }
    io.emit("blindStatus", data);
  });
});

server.listen(port);