exports.index = function (req, res) {
    db.collection('shows', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.show = function (req, res) {
    var id = req.params.show;
    console.log('Retrieving show: ' + id);
    db.collection('shows', function (err, collection) {
        collection.findOne({ '_id': new BSON.ObjectID(id) }, function (err, item) {
            res.send(item);
        });
    });
};

exports.create = function (req, res) {
    var show = req.body;
    console.log('Adding show: ' + JSON.stringify(show));
    db.collection('shows', function (err, collection) {
        collection.insert(show, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                socket.broadcast.emit('shows:create', result[0]);
                socket.emit('shows:create', result[0]);
                res.send(result[0]);
            }
        });
    });
}

exports.update = function (req, res) {
    var id = req.params.show;
    var show = req.body;
    delete show._id;
    console.log('Updating show: ' + id);
    console.log(JSON.stringify(show));
    db.collection('shows', function (err, collection) {
        collection.update({ '_id': new BSON.ObjectID(id) }, show, { safe: true }, function (err, result) {
            if (err) {
                console.log('Error updating show: ' + err);
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('' + result + ' document(s) updated');
                show._id = id;
                socket.broadcast.emit('update', show);
                socket.emit('update', show);
                res.send(show);
            }
        });
    });
}

exports.destroy = function (req, res) {
    var id = req.params.show;
    console.log('Deleting show: ' + id);

    db.collection('shows', function (err, collection) {
        collection.remove({ '_id': new BSON.ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                console.log('' + result + ' Show document(s) deleted');
            }
        });
    });
    db.collection('episodes', function (err, episodecollection) {
        episodecollection.remove({ 'showId': id }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                console.log('' + result + ' Episode document(s) deleted');
                socket.broadcast.emit('delete', { _id: id });
                socket.emit('delete', { _id: id });
                res.send(req.body);
            }
        });
    });
}