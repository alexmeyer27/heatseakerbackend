import Joi from "joi";

export const betSchema = Joi.object({
  bets: Joi.array()
    .items(
      Joi.object({
        trackCode: Joi.string().required(),
        raceNumber: Joi.number().integer().positive().required(),
        horseNumber: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
        betAmount: Joi.number().positive().optional(),
        placeBetAmount: Joi.number().positive().optional(),
        exactaBetAmount: Joi.number().positive().optional(),
        exactaHorseNumber: Joi.number().positive().optional(),
        type: Joi.string().valid("WIN", "PLACE", "EXACTA").required(),
      })
    )
    .min(1)
    .required(),
  betType: Joi.string().valid("bBet", "cBet", "dBet", "eBet", "fBet", "gBet").required(),
});