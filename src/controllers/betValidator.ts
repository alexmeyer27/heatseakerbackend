import Joi from 'joi';

export const betSchema = Joi.object({
  bets: Joi.array().items(
    Joi.object({
      trackCode: Joi.string().required(),
      raceNumber: Joi.number().integer().required(),
      betType: Joi.string().valid('WIN', 'PLACE', 'SHOW', 'EXACTA', /* other bet types */).required(),
      betCombination: Joi.when('betType', {
        is: 'EXACTA',
        then: Joi.string().pattern(/^(\d+(-\d+)+)$/).required(), // Must be "X-Y" format for Exacta
        otherwise: Joi.optional(),
      }),
      dollarAmount: Joi.number().precision(2).required(),
      comboType: Joi.when('betType', {
        is: 'EXACTA',
        then: Joi.string().valid('WHEEL', 'KEY', 'BOX', 'KEY-BOX', 'POWER-BOX').required(),
        otherwise: Joi.optional(),
      }),
    })
  ).required(),
  betType: Joi.string().required(),
});
