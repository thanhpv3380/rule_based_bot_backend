const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
const logSchema = new mongoose.Schema(
    {
        sessionId: ObjectId,
        userId: ObjectId,

        messages: [
            {
                type: String,
                message: {
                    text: String,
                    attachment: {
                        type: String,
                        payload: {
                            url: String,
                            elements: [
                                {
                                    label: String,
                                    value: String
                                }
                            ]
                        }
                    }
                }
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

module.exports = mongoose.model('Logs', logSchema);