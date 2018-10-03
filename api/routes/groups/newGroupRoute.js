import to from '../../helpers/to';
import createNewGroup from '../../controllers/groups/createNewGroup';

const newGroupRoute = async (req, res, next) => {
    try {
        const { user_id: user } = req.params;

        if( user ) {
            const [createErr, createdGroup] = await to(createNewGroup({ user_id: user }))
            if(!createdGroup) throw new Error(createErr)

            const [group, link] = createdGroup

            res.status(200)
                .json({
                    status: 'success',
                    message: group
                })
        }
        else {
            throw new Error('No group data.')
        }

    }
    catch (err) {
        res.status(500)
            .json({
                status: 'failure',
                message: err.message
            })
    }
}

export default newGroupRoute