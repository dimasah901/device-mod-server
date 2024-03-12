(async () => {
    
    const express = require('express');
    const app = express();
    const { LuaFactory } = require('wasmoon');
    const fs = require('fs/promises');
    const wcmatch = require('wildcard-match');
    const factory = new LuaFactory();
    //const lua = await factory.createEngine();
    const luaEngines = [];

    let servers = {};
    let servers_ = [];

    const serverConstructor = (options, callback) => {
        if (servers_.indexOf(options.url) == -1) {
            let server = [];
            servers[options.url] = server;
            servers_.push(options.url);
            callback({
                url: options.url,
                get: (path, callback) => { server.push([path, callback]) },
                db: {}
            });
        }
    }
    const cachedAppLua = await fs.readFile(`./sumneko.lua/app.lua`, { encoding: 'utf-8' });

    let static_websites = await fs.readdir('static');
    console.log(static_websites)

    let servers_dir = await fs.readdir('servers');
    for (let i = 0; i < servers_dir.length; i++) {
        let engine = await factory.createEngine();
        await engine.doString(cachedAppLua);
        engine.global.set('server', serverConstructor);
        await engine.doString(await fs.readFile(`./servers/${servers_dir[i]}`, { encoding: 'utf-8' }));
        luaEngines.push(engine);
    }
    console.log(servers)

    app.get('*', async (req, res) => {
        if (!req.url.includes('favicon.ico')) {
            let match = req.url.match(/\/([^\/]+)(\/[^?]*){0,1}(\?.*){0,1}/);
            let url = { url: match[1] || '', path: ((match[2][match[2].length - 1] == '/' && match[2] != '/') ? match[2].slice(0, -1) : match[2]) || '', query: match[3] || '' };
            if (servers_.indexOf(url.url) == -1) {
		    	if (static_websites.indexOf(url.url) == -1) {
		    		res.send('404 Not Found')
                } else {
                    res.send(await fs.readFile(`./static/${url.url}${url.path}/index`))
                }
            } else {
                let found = false;
                for (let i = 0; i < servers[url.url].length && !found; i++) {
                    if (wcmatch(servers[url.url][i][0].replace('*', '**'))(url.path)) {
                        res.send(servers[url.url][i][1](url));
                        found = true;
                    }
                }
                if (!found) {
                    res.send('404 Not Found');
                }
            }
            console.log(url)
        }
    })

    app.listen(8000);
    console.log(`
Start time: ${new Date()}
Engine count: ${luaEngines.length}
Lua websites count: ${servers_.length}
Static websites count: ${static_websites.length}`);
    if (process.argv[3] == 'test') { setTimeout(() => {
        app.close();
    }, 1000); }

})();