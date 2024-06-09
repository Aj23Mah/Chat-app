const getUserDetailFromToken = require("../helpers/getUserDetailFromToken");

const userDetails = async(req, res) => {
    try {
        const token = req.cookies.token || ""
        const user = await getUserDetailFromToken(token)
        return res.status(200).json({
            message: "user details",
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
          });
    }
}
module.exports = userDetails
