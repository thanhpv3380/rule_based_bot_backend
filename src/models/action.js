const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
const intentSchema = new mongoose.Schema(
    {
        name: String,
        nodes: [
            {
                nodeId: ObjectId,
                actions: [
                    {
                        type: String,
                        text: [String],
                        email: {
                            to: String,
                            title: String,
                            body: String,
                        },
                        media: {
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
                        },
                        api: {
                            method: String,
                            url: String,
                            headers: [
                                {
                                    name: String,
                                    value: String
                                }
                            ],
                            body: [
                                {
                                    name: String,
                                    value: String
                                }
                            ]
                        },
                        loop: {
                            intentId: [ObjectId],
                            actionAskAgain: ObjectId,
                            numberOfLoop: Number,
                            actionFail: ObjectId,
                            parameter: [{
                                name: String,
                                intentId: ObjectId
                            }]
                        }
                    }


                ],
            }
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

module.exports = mongoose.model('Workflow', intentSchema);