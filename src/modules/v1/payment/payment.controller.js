"use strict"

const userModel = require('../users/user.model')
const planModel = require('../plans/plan.model')
const paymentModel = require('./payment.model')

const {isValidObjectId} = require("mongoose");
const response = require("../../../helpers/response.helper");

const zarinpalService = require('../../../services/zarinpal.service')

module.exports.paymentPlan = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params

        if (!isValidObjectId(id)) return response(res, 422, "Panel id is not correct")

        const plan = await planModel.findById(id).lean()

        if (!plan) return response(res, 404, "Plan not found")

        const paymentResult = await zarinpalService.payment(plan.price, `پرداخت پلن ${plan.plan} به مدت ${plan.members} ماه`)

        if (paymentResult.status !== 200) return response(res, paymentResult.status, paymentResult.error)

        await paymentModel.create({
            user: user._id,
            plan: id,
            verify: false,
            authority: paymentResult.authority,
            price: plan.price
        })

        return response(res, 200, null, paymentResult)
    }
    catch (error) {
        next(error)
    }
}

module.exports.paymentVerified = async (req, res, next) => {
    try {
        const { Status, Authority } = req.query

        if (Status === "NOK") {
            await paymentModel.findOneAndDelete({authority: Authority}).lean()
            return response(res, 402, "Payment failed")
        }

        const payment = await paymentModel.findOne({
            authority: Authority
        }).sort({ createdAt: -1 }).lean()

        if (!payment) return response(res, 404, "Payment not found")

        const verify = await zarinpalService.verified(payment.price, Authority)

        if (verify.status !== 200) response(res, 400, "Problem in payment")

        if (!payment.verify) {
            const updatePayment = await paymentModel.findByIdAndUpdate(payment._id, { verify: true }).lean()

            const plan = await planModel.findById(updatePayment.plan).lean()

            const startPlan = new Date()
            const end = new Date()
            const endPlan = end.setMonth(end.getMonth() + plan.members)

            const user = await userModel.findByIdAndUpdate(updatePayment.user, {
                $push: {
                    plan: {
                        plan: updatePayment.plan,
                        status: 'ACTIVE',
                        price: updatePayment.price,
                        startPlan,
                        endPlan
                    }
                }
            }, { new: true }).lean()

            if (!user) return response(res, 404, "user not found")
        }


        return response(res, 200, "Payment successfully")
    }
    catch (error) {
        next(error)
    }
}