let openapi = {
    openapi: '3.0.1',
    info: { version: '1.0.0', title: 'Phone Dictionary', description: 'Phone Dictionary',
       termsOfService:'http://api_url/terms/',
        contact: {email: 'eugenealimake@gmail.com'},
        license: {name: 'Apache 2.0', url: 'http://www.apache.org/licenses/LICENSE-2.0.html'}
    },
    servers: [{url: "http://localhost:3000",
            variables: { port: { default: 3000}}
        }
    ],
    paths: {'/TS': {
            get: {tags: ['CRUD operations'], description: 'Get phone', operationId: 'getPhone',
                responses: {
                    '200': {
                        description: 'Dictionary list',
                        content: {'application/json': {
                                schema: { type: 'object'},
                                example:
                                [   {"id": "1", "name": "user", "number":"+37533834114"},
                                    {"id": "2", "name": "user1", "number":"+37533834114"},]
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['CRUD operations'], description: 'Post phone ', operationId: 'postPhone',
                requestBody: {
                    content: {
                        'application/json': {
                            name: 'Dictionary line',
                            schema: { type: 'object'},
                            required: true,
                            description: 'Post data for phone dictionary',
                            example: {"id": "1", "name": "user", "number":"+37533834114"},
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': {
                                schema: { type: 'object'},
                                example: {
                                    message: 'Posted'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Error',
                        content: {
                            'application/json': {
                                schema: { type: 'object'},
                                example: {
                                    message: 'Missing parameters'
                                }
                            }
                        }
                    }
                }
            },
            put: {
                tags: ['CRUD operations'], description: 'Put phone dictionary', operationId: 'putPhone',
                requestBody: {
                    content: {
                        'application/json': {
                            name: 'Dictionary line',
                            schema: { type: 'object'},
                            required: true,
                            description: 'Put data for dictionary',
                            example:
                                {"id": "1", "name": "user", "number":"+37533834114"}
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': {
                                schema: { type: 'object'},
                                example: {
                                    message: 'Updated'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Error',
                        content: {
                            'application/json': {
                                schema: { type: 'object'},
                                example: {
                                    message: 'Missing parameters'
                                }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['CRUD operations'], description: 'Delete phone dictionary', operationId: 'delTS',
                parameters: [
                    {
                        name: 'id',
                        in: 'query',
                        schema: {type: 'int'},
                        required: true,
                        description: 'Id number for delete'
                    }
                ],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': {
                                schema: { type: 'object'},
                                example: {
                                    message: 'Deleted'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Error',
                        content: {
                            'application/json': {
                                schema: { type: 'object'},
                                example: {
                                    message: 'Missing parameters'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};


module.exports = openapi;
