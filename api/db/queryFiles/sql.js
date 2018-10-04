import path from 'path';
import pgp from 'pg-promise';
import fs from 'fs';

var queries = {}
// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

// Create a QueryFile globally, once per file:
fs.readdir(__dirname, (err, items) => {
    for(var i=0; i<items.length; i++) {
        var item = items[i];
        if(item.substring(item.length-4, item.length) === ".sql") {
            var itemName = item.substring(0, item.length-4);
            queries[itemName] = sql(item);
        }
    }
});

export default queries;
