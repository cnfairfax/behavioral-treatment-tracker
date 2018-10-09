import to from '../../helpers/to';
import PracticeLocation from '../../models/Location';

const createLocation = async (req, res, next) => {
    try {
        const { location_name  } = req.body
        let { actid:account_id, bsid:parent_user_id } = req.cookies
        
        let [err, location] = await to(PracticeLocation({
            location_name,
            account_id,
            parent_user_id
        }));
        if(!location) throw new Error(err);

        let [insertErr, createdLocation] = await to(location.Insert());
        if(!createdLocation) throw new Error(insertErr);

        res.status(200)
            .json({
                status: 'success',
                createdLocation
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

export default createLocation