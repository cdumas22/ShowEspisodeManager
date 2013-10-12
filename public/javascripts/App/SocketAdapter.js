define(['radio', 'socket'], function(Radio, io) {
	var socket = io.connect();

    socket.on('shows:create', function(data){
        Radio('shows:create').broadcast(data);
    });

    socket.on('episodes:create', function(data){
        Radio('episodes/' + data.showId + ':create').broadcast(data);
    });

    socket.on('update', function(data) {
        Radio(data._id + ':update').broadcast(data);
    });
    socket.on('delete', function(data) {
        Radio(data._id + ':delete').broadcast(data);
        Radio('delete').broadcast(data);
    });

    return socket;
});