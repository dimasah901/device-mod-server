(async () => {

    
    const express = require('express');
    const app = express();
    const { LuaFactory } = require('wasmoon');

    const factory = new LuaFactory();
    const lua = await factory.createEngine();

    let servers = {};
    let servers_ = [];

    lua.global.set('server', (options, callback) => {
        if (servers_.indexOf(options.url) == -1) {
    	    let server = {}
    	    servers[options.url] = server
            servers_.push(options.url)

    	    callback({
    	        url: options.url,
    	        get: (path, callback) => { server[path] = callback },
    	        db: {}
    	    });
    	}
    });

    let static_websites = [];


    app.get('*', async (req, res) => {
        if (servers_.indexOf(req.url) == -1) {
			if (static_websites.indexOf(req.url) == -1) {
				res.send('404 Not Found')
            } else {
                res.send('a static website')
            }
        } else {
            res.send(servers[req.url][req.url]);
        }

    })

    app.listen(8000);
    if (process.argv0 == 'test') { setTimeout(() => {
        app.close();
    }, 1000); }

})();