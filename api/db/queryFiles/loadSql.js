import path from 'path';
import pgp from 'pg-promise';
import fs from 'fs';

// Helper for linking to external query files:
function sql(file, dir) {
    const fullPath = path.join(dir, file);
    const qf = new pgp.QueryFile(fullPath, {minify: true});
    if(qf.error) {
        console.log(qf.error);
        throw new Error(qf.error);
    }

    return qf;
}

// Create a QueryFile globally, once per file:
const loadQueries = (dir) => {
    
    const dirStr = fs.readdirSync(dir)
    
    var queries = ((directory) => {
        let queryObj = {}
        for(var i=0; i<directory.length; i++) {
            var item = directory[i];
            if(item.substring(item.length-4, item.length) === ".sql") {
                var itemName = item.substring(0, item.length-4);
                queryObj[itemName] = sql(item, dir);
            }
        }

        return queryObj;
    })(dirStr);

    return queries;
}

export default loadQueries;
