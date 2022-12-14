const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.bookclubValidationSchema = Joi.object({
    club: Joi.object({
        name: Joi.string().required().escapeHTML(),
        // admin: Joi.string().required(), 
        description: Joi.string().required().escapeHTML(),
    }).required()
});

module.exports.commentValidationSchema = Joi.object({
    comment: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required().escapeHTML(),
    }).required()
});

module.exports.replyValidationSchema = Joi.object({
    reply: Joi.object({
        body: Joi.string().required().escapeHTML(),
        comment: Joi.string().required().escapeHTML()
    }).required()
});