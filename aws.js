var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: [AWS_KEY],
    secretAccessKey: [AWS_SECRET_KEY]
  });

var params = {
  Bucket: 'comma-ai'
};

var s3 = new AWS.S3();
let fileNames=[];
s3.listObjects(params, function(err, data) {
  if (err) console.log(err, err.stack);
  else{
    allJson = new Array(data.Contents.length);
    for (var i = 0; i < allJson.length; i++) {
      allJson[i] = {"segments": [], "speed": []};
    };
    for (let i = 0; i < data.Contents.length; i++) {
      fileNames.push(data.Contents[i].Key);
    };
  }
});

setTimeout(function afterFiveSeconds() {
  var file = [];
  for (var i = 0; i < fileNames.length; i++){
    var params1 = {Bucket: 'comma-ai', Key: fileNames[i]};
    s3.getObject(params1, function(err, data) {
      if (err) console.log(err, err.stack);
      else {
        console.log('chegou');
        file.push([data.Body.toString('utf-8')]);
      };
    });

  };

  setTimeout(function afterFiveSeconds() {
    for (i=0;i<file.length;i++){
      var obj;
      obj = JSON.parse(file[i]);
      obj.coords.forEach(x => {
      allJson[i].segments.push([x.lng, x.lat, x.dist]);
      allJson[i].speed.push([x.speed]);
    });
  };

  setTimeout(function afterTwoSeconds() {
    var fs = require('fs');
    var json = JSON.stringify(allJson);
    fs.writeFile('myjsonfile5.json', json, function(err) {
      if (err) throw err;
      console.log('---complete---');
    });
  }, 4000)

}, 75000);

}, 5000);
