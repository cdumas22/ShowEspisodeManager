exports.index = function (req, res) {
    var showId = req.params.show;
    db.collection('episodes', function (err, collection) {
        collection.find({ showId: showId }).toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.show = function (req, res) {
    var id = req.params.episode;
    console.log('Retrieving episode: ' + id);
    db.collection('episodes', function (err, collection) {
        collection.findOne({ '_id': new BSON.ObjectID(id) }, function (err, item) {
            res.send(item);
        });
    });
};

exports.create = function (req, res) {
    var episode = req.body;
    episode.showId = episode.show._id;
    delete episode.show;
    console.log('Adding episode: ' + JSON.stringify(episode));
    db.collection('episodes', function (err, collection) {
        collection.insert(episode, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                socket.broadcast.emit('episodes:create', result[0]);
                socket.emit('episodes:create', result[0]);
                res.send(result[0]);
            }
        });
    });
}

exports.update = function (req, res) {
    var id = req.params.episode;
    var episode = req.body;
    episode.showId = episode.show ? episode.show._id : episode.showId;
    delete episode.show;
    delete episode._id;
    console.log('Updating episode: ' + id);
    console.log(JSON.stringify(episode));
    db.collection('episodes', function (err, collection) {
        collection.update({ '_id': new BSON.ObjectID(id) }, episode, { safe: true }, function (err, result) {
            if (err) {
                console.log('Error updating episode: ' + err);
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('' + result + ' document(s) updated');
                episode._id = id;
                socket.broadcast.emit('update', episode);
                socket.emit('update', episode);
                res.send(episode);
            }
        });
    });
}

exports.destroy = function (req, res) {
    var id = req.params.episode;
    console.log('Deleting episode: ' + id);
    db.collection('episodes', function (err, collection) {
        collection.remove({ '_id': new BSON.ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                console.log('' + result + ' document(s) deleted');
                socket.broadcast.emit('delete', { _id: id});
                socket.emit('delete', { _id: id});
                res.send(req.body);
            }
        });
    });
}