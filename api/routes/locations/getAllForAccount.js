import to from '../../helpers/to';
import PracticeLocation from '../../models/Location';

const getAllForAccount = async (req, res, next) => {
    try {
        let { actid:account_id } = req.cookies
        
        let [err, location] = await to(PracticeLocation({
            query: true,
            queryType: 'all',
            account_id
        }));
        if(!location) throw new Error(err);

        res.status(200)
            .json({
                status: 'success',
                locations: location.group
            });
    }
    catch (err) {
        res.status(403)
            .json({
              status: 'failure',
              message: err.message
            })
      }
}

export default getAllForAccount