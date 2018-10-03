import updateEntry from '../../controllers/entries/updateEntry';
import to from '../../helpers/to';

const updateCurrentEntry = async (req, res, next) => {
    try {
        const [ entryUpdateErr, entry ] = await to(updateEntry(user_id, entry_id, req.body));
        if(!entry) throw new Error(entryUpdateErr);
            
        res.status(200)
            .json({
                status: 'success',
                message: entry
            })
    }
    catch (err) {
        res.status(500)
            .json({
                status: 'failure',
                message: err
            })
    }
}

export default updateCurrentEntry