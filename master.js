var cluster = require('cluster');
var fs = require('fs');
var crypto = require('crypto');

function getSHA1 () {
  return crypto.createHash('sha1')
                   .update(fs.readFileSync(__filename))
                   .digest('hex');
}

var version = getSHA1();

console.log('Starting master process with pid ' + process.pid);

//fork the first process
cluster.fork();

function reload () {
  if (version !== getSHA1()) {
    console.log('master server changed, exiting');
    return process.exit(1);
  }

  console.log('reloading...');
  var new_worker = cluster.fork();
  new_worker.once('listening', function () {
    //stop all other workers
    for(var id in cluster.workers) {
      if (id === new_worker.id.toString()) {
        continue;
      }
      cluster.workers[id].process.kill('SIGTERM');
    }
  });
}

process.on('SIGHUP', function () {
  reload();
}).on('SIGTERM', function () {
  for(var id in cluster.workers) {
    cluster.workers[id].process.kill('SIGTERM');
  }
});

if (process.env.NODE_ENV !== 'production') {
  // var watch = require('watch');
  // var path = require('path');
  // var fs = require('fs');
  var watchr = require('watchr');

  watchr.watch({
    path: __dirname,
    listeners: {
      change: function(changeType, filePath){
        console.log(changeType, filePath.substr(__dirname.length));
        reload();
      }
    }
  });
}