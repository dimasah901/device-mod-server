server({url = 'hello.world'}, function (app)
    app.get('*', function (req)
        --local found = false;
        --if Array.indexOf(app.db.openedUrls, req.path) ~= -1 then
        --    found = true;
        --end
        --if not found then
        --    Array.push(app.db.openedUrls, req.path);
        --end
        return 'Hello World! You opened "' .. req.url .. '", "' .. req.path .. '", "' .. req.query .. '"! You ' .. Ternary(found, 'are not', 'are') .. ' the first one to open this path.'
    end)
end)