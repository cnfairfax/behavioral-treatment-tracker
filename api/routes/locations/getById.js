import to from '../../helpers/to';
import PracticeLocation from '../../models/Location';

const getById = async (req, res, next) => {
    try {
        const { location_id_param:id  } = req.params
        let { actid:account_id } = req.cookies
        
        let [err, location] = await to(PracticeLocation({
            query: true,
            queryType: 'id',
            id,
            account_id
        }));
        if(!location) throw new Error(err);

        res.status(200)
            .json({
                status: 'success',
                location
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

export default getById